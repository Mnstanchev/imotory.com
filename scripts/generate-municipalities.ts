/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';

type Position = [number, number]; // [lng, lat]

type Polygon = Position[];
type MultiPolygon = Position[][]; // array of linear rings (outer ring first)

type GeoJSONGeometry =
  | { type: 'Polygon'; coordinates: Position[][] }
  | { type: 'MultiPolygon'; coordinates: Position[][][] };

type GeoJSONFeature = {
  type: 'Feature';
  properties: {
    shapeName: string;
    shapeISO?: string;
    shapeID?: string;
    shapeGroup?: string;
    shapeType?: string; // ADM1 or ADM2
  };
  geometry: GeoJSONGeometry;
};

type GeoJSON = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pointInRing(point: Position, ring: Polygon): boolean {
  // Ray casting algorithm for point in polygon
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point: Position, polygon: Position[][]): boolean {
  // First ring is outer; subsequent rings may be holes. We consider inside if in outer and not in any hole
  if (!polygon.length) return false;
  const outer = polygon[0];
  if (!pointInRing(point, outer)) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(point, polygon[i])) return false; // inside a hole
  }
  return true;
}

function polygonCentroid(rings: Position[][]): Position {
  // Compute centroid of outer ring using area-weighted method (Shoelace)
  const ring = rings[0];
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-12) {
    // Fallback to simple average
    let sx = 0, sy = 0;
    for (const [x, y] of ring) { sx += x; sy += y; }
    return [sx / ring.length, sy / ring.length];
  }
  cx /= 6 * area;
  cy /= 6 * area;
  return [cx, cy];
}

function geometryCentroid(geom: GeoJSONGeometry): Position {
  if (geom.type === 'Polygon') {
    return polygonCentroid(geom.coordinates);
  }
  // MultiPolygon: choose the largest ring by area
  let best: { centroid: Position; area: number } | null = null;
  for (const poly of geom.coordinates) {
    const ring = poly[0];
    let area = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x0, y0] = ring[j];
      const [x1, y1] = ring[i];
      area += x0 * y1 - x1 * y0;
    }
    area = Math.abs(area) * 0.5;
    const centroid = polygonCentroid(poly);
    if (!best || area > best.area) best = { centroid, area };
  }
  return best ? best.centroid : [0, 0];
}

function containsPoint(geom: GeoJSONGeometry, p: Position): boolean {
  if (geom.type === 'Polygon') {
    return pointInPolygon(p, geom.coordinates);
  }
  for (const poly of geom.coordinates) {
    if (pointInPolygon(p, poly)) return true;
  }
  return false;
}

function main() {
  const adm1Path = path.join(__dirname, '../public/geo/Bulgaria_ADM1.geojson');
  const adm2Path = path.join(__dirname, '../public/geo/Bulgaria_ADM2.geojson');
  const outPath = path.join(__dirname, '../data/municipalities.json');

  console.log('Reading ADM1 and ADM2 GeoJSON...');
  const adm1 = JSON.parse(fs.readFileSync(adm1Path, 'utf-8')) as GeoJSON;
  const adm2 = JSON.parse(fs.readFileSync(adm2Path, 'utf-8')) as GeoJSON;

  // Build region list from ADM1
  const regions = adm1.features.map((f) => ({
    name: { en: f.properties.shapeName, bg: f.properties.shapeName, ru: f.properties.shapeName },
    slug: slugify(f.properties.shapeName),
    feature: f,
  }));

  const municipalities: any[] = [];
  let unmatched = 0;

  for (const f of adm2.features) {
    const munName = f.properties.shapeName;
    const centroid = geometryCentroid(f.geometry);
    // find region containing centroid
    let region = regions.find((r) => containsPoint(r.feature.geometry, centroid));
    if (!region) {
      // fallback: pick nearest by simple bbox center distance
      unmatched++;
      let best: { r: typeof regions[number]; d: number } | null = null;
      for (const r of regions) {
        const c = geometryCentroid(r.feature.geometry);
        const dx = c[0] - centroid[0];
        const dy = c[1] - centroid[1];
        const d = dx * dx + dy * dy;
        if (!best || d < best.d) best = { r, d };
      }
      region = best?.r;
    }
    const munSlugBase = slugify(munName);
    const munSlug = `${munSlugBase}-${region?.slug || 'unknown'}`; // ensure uniqueness across regions
    municipalities.push({
      name: { en: munName, bg: munName, ru: munName },
      slug: munSlug,
      region: region ? { name: region.name, slug: region.slug } : null,
    });
  }

  const payload = {
    country: { name: { en: 'Bulgaria', bg: 'България', ru: 'Болгария' }, slug: 'bulgaria' },
    regions: regions.map((r) => ({ name: r.name, slug: r.slug })),
    municipalities,
    meta: { unmatchedAssignedByNearest: unmatched },
  };

  // Ensure output directory exists
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`Wrote ${municipalities.length} municipalities to ${outPath}`);
}

if (require.main === module) {
  try {
    main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export {};


