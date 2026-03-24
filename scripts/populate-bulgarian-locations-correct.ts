import { PrismaClient, LocationType } from '@prisma/client';

const prisma = new PrismaClient();

// Bulgarian administrative structure with proper region-municipality mapping
const BULGARIAN_STRUCTURE = {
  "Sofia Province": {
    "province_en": "Sofia Province",
    "province_bg": "Софийска область", 
    "province_ru": "Софийская область",
    "municipalities": [
      { "en": "Anton", "bg": "Антон", "ru": "Антон" },
      { "en": "Botevgrad", "bg": "Ботевград", "ru": "Ботевград" },
      { "en": "Bozhurishte", "bg": "Божурище", "ru": "Божурише" },
      { "en": "Chavdar", "bg": "Чавдар", "ru": "Чавдар" },
      { "en": "Chelopech", "bg": "Челопеч", "ru": "Челопеч" },
      { "en": "Dolna Banya", "bg": "Долна баня", "ru": "Долна Баня" },
      { "en": "Dragoman", "bg": "Драгоман", "ru": "Драгоман" },
      { "en": "Elin Pelin", "bg": "Елин Пелин", "ru": "Елин Пелин" },
      { "en": "Etropole", "bg": "Етрополе", "ru": "Етрополе" },
      { "en": "Godech", "bg": "Годеч", "ru": "Годеч" },
      { "en": "Gorna Malina", "bg": "Горна Малина", "ru": "Горна Малина" },
      { "en": "Ihtiman", "bg": "Ихтиман", "ru": "Ихтиман" },
      { "en": "Koprivshtitsa", "bg": "Копривщица", "ru": "Копривщица" },
      { "en": "Kostenets", "bg": "Костенец", "ru": "Костенец" },
      { "en": "Kostinbrod", "bg": "Костинброд", "ru": "Костинброд" },
      { "en": "Mirkovo", "bg": "Мирково", "ru": "Мирково" },
      { "en": "Pirdop", "bg": "Пирдоп", "ru": "Пирдоп" },
      { "en": "Pravets", "bg": "Правец", "ru": "Правец" },
      { "en": "Samokov", "bg": "Самоков", "ru": "Самоков" },
      { "en": "Slivnitsa", "bg": "Сливница", "ru": "Сливница" },
      { "en": "Svoge", "bg": "Своге", "ru": "Своге" },
      { "en": "Zlatitsa", "bg": "Златица", "ru": "Златица" }
    ]
  },
  "Sofia City Province": {
    "province_en": "Sofia City Province",
    "province_bg": "Столична область",
    "province_ru": "Столичная область",
    "municipality": {
      "en": "Stolichna Municipality",
      "bg": "Столична община",
      "ru": "Столичная община",
      "settlements": {
        "cities": [
          { "en": "Sofia", "bg": "София", "ru": "София" },
          { "en": "Bankya", "bg": "Банкя", "ru": "Банкя" },
          { "en": "Buhovo", "bg": "Бухово", "ru": "Бухово" },
          { "en": "Novi Iskar", "bg": "Нови Искър", "ru": "Нови Искър" }
        ],
        "villages": [
          { "en": "Balsha", "bg": "Балша", "ru": "Балша" },
          { "en": "Bistritsa", "bg": "Бистрица", "ru": "Бистрица" },
          { "en": "Busmantsi", "bg": "Бусманци", "ru": "Бусманци" },
          { "en": "Chepintsi", "bg": "Чепинци", "ru": "Чепинци" },
          { "en": "Dobroslavtsi", "bg": "Доброславци", "ru": "Доброславци" },
          { "en": "Dolni Bogrov", "bg": "Долни Богров", "ru": "Долни Богров" },
          { "en": "Dolni Pasarel", "bg": "Долни Пасарел", "ru": "Долни Пасарел" },
          { "en": "German", "bg": "Герман", "ru": "Герман" },
          { "en": "Gorni Bogrov", "bg": "Горни Богров", "ru": "Горни Богров" },
          { "en": "Ivanyane", "bg": "Ивняне", "ru": "Ивняне" },
          { "en": "Jeleznitsa", "bg": "Железница", "ru": "Железница" },
          { "en": "Jelyava", "bg": "Желява", "ru": "Желява" },
          { "en": "Zhiten", "bg": "Житен", "ru": "Житен" },
          { "en": "Kazichene", "bg": "Казичене", "ru": "Казичене" },
          { "en": "Klisura", "bg": "Клисура", "ru": "Клисура" },
          { "en": "Kokalyane", "bg": "Кокаляне", "ru": "Кокаляне" },
          { "en": "Krivina", "bg": "Кривина", "ru": "Кривина" },
          { "en": "Kubratovo", "bg": "Кубратово", "ru": "Кубратово" },
          { "en": "Katina", "bg": "Катино", "ru": "Катино" },
          { "en": "Lokorsko", "bg": "Локорско", "ru": "Локорско" },
          { "en": "Lozen", "bg": "Лозен", "ru": "Лозен" },
          { "en": "Malo Buchino", "bg": "Мало Бучино", "ru": "Мало Бучино" },
          { "en": "Marchaevo", "bg": "Мърчаево", "ru": "Мърчаево" },
          { "en": "Mirovyane", "bg": "Мировяне", "ru": "Мировяне" },
          { "en": "Mramor", "bg": "Мрамор", "ru": "Мрамор" },
          { "en": "Negovan", "bg": "Негован", "ru": "Негован" },
          { "en": "Pancharevo", "bg": "Панчарево", "ru": "Панчарево" },
          { "en": "Plana", "bg": "Плана", "ru": "Плана" },
          { "en": "Podgumer", "bg": "Подгумер", "ru": "Подгумер" },
          { "en": "Svetovrachene", "bg": "Световрачене", "ru": "Световрачене" },
          { "en": "Vladaya", "bg": "Владая", "ru": "Владая" },
          { "en": "Voluyak", "bg": "Волуяк", "ru": "Волуяк" },
          { "en": "Voynegovtsi", "bg": "Войнеговци", "ru": "Войнеговци" },
          { "en": "Yana", "bg": "Яна", "ru": "Яна" }
        ]
      }
    }
  }
  // TODO: Add all other Bulgarian provinces with their municipalities
  // This is just a template - we need the complete data structure
};

async function createSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function populateBulgarianLocationsCorrect() {
  try {
    console.log('🇧🇬 Starting correct Bulgarian locations population...');

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

    let totalRegions = 0;
    let totalMunicipalities = 0;

    // Step 2: Process each province and its municipalities
    for (const [provinceKey, provinceData] of Object.entries(BULGARIAN_STRUCTURE)) {
      console.log(`📍 Creating province: ${provinceData.province_en}`);
      
      const provinceSlug = await createSlug(provinceData.province_en);
      
      // Create the province/region
      const province = await prisma.location.upsert({
        where: { slug: provinceSlug },
        update: {},
        create: {
          name: {
            en: provinceData.province_en,
            bg: provinceData.province_bg,
            ru: provinceData.province_ru
          },
          slug: provinceSlug,
          type: LocationType.REGION,
          parentId: bulgaria.id,
          isActive: true,
          sortOrder: totalRegions
        }
      });
      
      totalRegions++;
      console.log(`  ✅ Province created: ${provinceData.province_en}`);

      // Handle different province structures
      if ('municipalities' in provinceData) {
        // Multiple municipalities structure (like Sofia Province)
        let municipalityOrder = 0;
        for (const municipality of provinceData.municipalities) {
          const municipalitySlug = await createSlug(municipality.en);
          
          console.log(`    📍 Creating municipality: ${municipality.en}`);
          
          await prisma.location.upsert({
            where: { slug: municipalitySlug },
            update: {},
            create: {
              name: {
                en: municipality.en,
                bg: municipality.bg,
                ru: municipality.ru
              },
              slug: municipalitySlug,
              type: LocationType.MUNICIPALITY,
              parentId: province.id,
              isActive: true,
              sortOrder: municipalityOrder
            }
          });
          
          municipalityOrder++;
          totalMunicipalities++;
        }
        
        console.log(`  ✅ Created ${provinceData.municipalities.length} municipalities for ${provinceData.province_en}`);
      
      } else if ('municipality' in provinceData) {
        // Single municipality with settlements structure (like Sofia City Province)
        const municipalityData = provinceData.municipality;
        const municipalitySlug = await createSlug(municipalityData.en);
        
        console.log(`    📍 Creating municipality: ${municipalityData.en}`);
        
        const municipality = await prisma.location.upsert({
          where: { slug: municipalitySlug },
          update: {},
          create: {
            name: {
              en: municipalityData.en,
              bg: municipalityData.bg,
              ru: municipalityData.ru
            },
            slug: municipalitySlug,
            type: LocationType.MUNICIPALITY,
            parentId: province.id,
            isActive: true,
            sortOrder: 0
          }
        });
        
        totalMunicipalities++;

        // Create cities within the municipality
        let cityOrder = 0;
        for (const city of municipalityData.settlements.cities) {
          const citySlug = await createSlug(city.en);
          
          console.log(`      📍 Creating city: ${city.en}`);
          
          await prisma.location.upsert({
            where: { slug: citySlug },
            update: {},
            create: {
              name: {
                en: city.en,
                bg: city.bg,
                ru: city.ru
              },
              slug: citySlug,
              type: LocationType.CITY,
              parentId: municipality.id,
              isActive: true,
              sortOrder: cityOrder
            }
          });
          
          cityOrder++;
        }

        // Create villages within the municipality (using NEIGHBORHOOD type)
        let villageOrder = 0;
        for (const village of municipalityData.settlements.villages) {
          const villageSlug = await createSlug(village.en);
          
          console.log(`      📍 Creating village: ${village.en}`);
          
          await prisma.location.upsert({
            where: { slug: villageSlug },
            update: {},
            create: {
              name: {
                en: village.en,
                bg: village.bg,
                ru: village.ru
              },
              slug: villageSlug,
              type: LocationType.NEIGHBORHOOD,
              parentId: municipality.id,
              isActive: true,
              sortOrder: villageOrder + 1000 // Offset to keep villages after cities
            }
          });
          
          villageOrder++;
        }

        console.log(`  ✅ Created 1 municipality with ${municipalityData.settlements.cities.length} cities and ${municipalityData.settlements.villages.length} villages for ${provinceData.province_en}`);
      }
    }

    // Summary
    console.log('\n🎉 Bulgarian locations population completed!');
    console.log(`📊 Summary:`);
    console.log(`   • 1 Country (Bulgaria)`);
    console.log(`   • ${totalRegions} Regions`);
    console.log(`   • ${totalMunicipalities} Municipalities`);
    
    console.log('\n⚠️  NOTE: This script currently only includes Sofia Province.');
    console.log('   You need to add all other Bulgarian provinces with their municipalities.');
    
  } catch (error) {
    console.error('❌ Error populating Bulgarian locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  populateBulgarianLocationsCorrect()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { populateBulgarianLocationsCorrect };
