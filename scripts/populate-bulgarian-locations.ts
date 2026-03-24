import { PrismaClient, LocationType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    shapeName: string;
    shapeISO: string;
    shapeID: string;
    shapeGroup: string;
    shapeType: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

async function createSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function populateBulgarianLocations() {
  try {
    console.log('🇧🇬 Starting Bulgarian locations population...');

    // Step 1: Create Bulgaria as the root country
    console.log('📍 Creating Bulgaria as root country...');
    const bulgaria = await prisma.location.upsert({
      where: { slug: 'bulgaria' },
      update: {},
      create: {
        name: {
          en: 'Bulgaria',
          bg: 'България',
          ru: 'Болгария'
        },
        slug: 'bulgaria',
        type: LocationType.COUNTRY,
        isActive: true,
        sortOrder: 0
      }
    });
    console.log(`✅ Bulgaria created with ID: ${bulgaria.id}`);

    // Step 2: Load and process ADM1 data (Regions/Oblasts)
    console.log('📍 Processing Bulgarian regions (ADM1)...');
    const adm1Path = path.join(process.cwd(), 'public', 'geo', 'Bulgaria_ADM1.geojson');
    const adm1Data: GeoJSONData = JSON.parse(fs.readFileSync(adm1Path, 'utf-8'));

    const regions: { [key: string]: any } = {};
    
    for (const feature of adm1Data.features) {
      const regionName = feature.properties.shapeName;
      const regionSlug = await createSlug(regionName);
      
      console.log(`  📍 Creating region: ${regionName}`);
      
      const region = await prisma.location.upsert({
        where: { slug: regionSlug },
        update: {},
        create: {
          name: {
            en: regionName,
            bg: regionName, // You might want to add proper Bulgarian translations
            ru: regionName  // You might want to add proper Russian translations
          },
          slug: regionSlug,
          type: LocationType.REGION,
          parentId: bulgaria.id,
          isActive: true,
          sortOrder: 0
        }
      });
      
      regions[regionName] = region;
    }
    
    console.log(`✅ Created ${Object.keys(regions).length} regions`);

    // Step 3: Load and process ADM2 data (Municipalities)
    console.log('📍 Processing Bulgarian municipalities (ADM2)...');
    const adm2Path = path.join(process.cwd(), 'public', 'geo', 'Bulgaria_ADM2.geojson');
    const adm2Data: GeoJSONData = JSON.parse(fs.readFileSync(adm2Path, 'utf-8'));

    let municipalityCount = 0;
    
    for (const feature of adm2Data.features) {
      const municipalityName = feature.properties.shapeName;
      const municipalitySlug = await createSlug(municipalityName);
      
      // For now, we'll assign municipalities to the first region as we don't have mapping
      // In a real scenario, you'd need to determine which region each municipality belongs to
      // This could be done through geographical intersection or a mapping table
      const defaultRegion = Object.values(regions)[0]; // Temporary assignment
      
      console.log(`  📍 Creating municipality: ${municipalityName}`);
      
      await prisma.location.upsert({
        where: { slug: municipalitySlug },
        update: {},
        create: {
          name: {
            en: municipalityName,
            bg: municipalityName, // You might want to add proper Bulgarian translations
            ru: municipalityName  // You might want to add proper Russian translations
          },
          slug: municipalitySlug,
          type: LocationType.MUNICIPALITY,
          parentId: defaultRegion.id, // This needs proper mapping
          isActive: true,
          sortOrder: 0
        }
      });
      
      municipalityCount++;
    }
    
    console.log(`✅ Created ${municipalityCount} municipalities`);

    // Summary
    console.log('\n🎉 Bulgarian locations population completed!');
    console.log(`📊 Summary:`);
    console.log(`   • 1 Country (Bulgaria)`);
    console.log(`   • ${Object.keys(regions).length} Regions`);
    console.log(`   • ${municipalityCount} Municipalities`);
    
  } catch (error) {
    console.error('❌ Error populating Bulgarian locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  populateBulgarianLocations()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { populateBulgarianLocations };
