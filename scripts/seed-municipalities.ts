/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, LocationType } from '@prisma/client';

const prisma = new PrismaClient();

type Localized = { en: string; bg: string; ru: string };

type MunicipalityRecord = {
  name: Localized;
  slug: string;
  region: { name: Localized; slug: string } | null;
};

type Dataset = {
  country: { name: Localized; slug: string };
  regions: { name: Localized; slug: string }[];
  municipalities: MunicipalityRecord[];
  meta?: any;
};

async function upsertLocation(slug: string, name: Localized, type: LocationType, parentId?: string, sortOrder = 0) {
  return prisma.location.upsert({
    where: { slug },
    update: {},
    create: { slug, name: name as any, type, parentId, sortOrder, isActive: true },
  });
}

async function main() {
  const dataPath = path.join(__dirname, '../data/municipalities.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Missing dataset at ${dataPath}. Run: ts-node backend/scripts/generate-municipalities.ts`);
  }
  const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Dataset;

  console.log('Seeding country...');
  const country = await upsertLocation(dataset.country.slug, dataset.country.name, LocationType.COUNTRY, undefined, 0);

  console.log('Seeding regions...');
  const regionIdBySlug: Record<string, string> = {};
  let order = 0;
  for (const r of dataset.regions) {
    const region = await upsertLocation(r.slug, r.name, LocationType.REGION, country.id, order++);
    regionIdBySlug[r.slug] = region.id;
  }

  console.log('Seeding municipalities...');
  let mOrderByRegion: Record<string, number> = {};
  for (const m of dataset.municipalities) {
    const regionSlug = m.region?.slug;
    const parentId = regionSlug ? regionIdBySlug[regionSlug] : undefined;
    const cur = mOrderByRegion[regionSlug || 'none'] || 0;
    await upsertLocation(m.slug, m.name, LocationType.MUNICIPALITY, parentId, cur);
    mOrderByRegion[regionSlug || 'none'] = cur + 1;
  }

  console.log('Done seeding municipalities.');
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(async (e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export {};


