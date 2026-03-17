import { PrismaClient } from '@prisma/client';
import { regions } from './seed-data/regions.js';
import { fertilizers } from './seed-data/fertilizers.js';
import { treatments } from './seed-data/treatments.js';
import { categories, species } from './seed-data/plants.js';
import { diseases } from './seed-data/diseases.js';
import { pests } from './seed-data/pests.js';
import { careTemplates } from './seed-data/care-templates.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Climate Regions
  console.log('  Регионы...');
  const regionMap = new Map<string, string>();
  for (const region of regions) {
    const created = await prisma.climateRegion.upsert({
      where: { code: region.code },
      update: region,
      create: region,
    });
    regionMap.set(created.code, created.id);
  }
  console.log(`  ✓ ${regions.length} регионов`);

  // 2. Fertilizers
  console.log('  Удобрения...');
  const fertilizerMap = new Map<string, string>();
  for (const fert of fertilizers) {
    const created = await prisma.fertilizer.upsert({
      where: { name: fert.name },
      update: fert,
      create: fert,
    });
    fertilizerMap.set(created.name, created.id);
  }
  console.log(`  ✓ ${fertilizers.length} удобрений`);

  // 3. Treatments
  console.log('  Препараты...');
  const treatmentMap = new Map<string, string>();
  for (const treat of treatments) {
    const created = await prisma.treatment.upsert({
      where: { name: treat.name },
      update: treat,
      create: treat,
    });
    treatmentMap.set(created.name, created.id);
  }
  console.log(`  ✓ ${treatments.length} препаратов`);

  // 4. Plant Categories
  console.log('  Категории растений...');
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await prisma.plantCategory.upsert({
      where: { nameEn: cat.nameEn },
      update: cat,
      create: cat,
    });
    categoryMap.set(created.nameEn, created.id);
  }
  console.log(`  ✓ ${categories.length} категорий`);

  // 5. Plant Species + Varieties
  console.log('  Виды растений и сорта...');
  const speciesMap = new Map<string, string>();
  let varietyCount = 0;
  for (const sp of species) {
    const categoryId = categoryMap.get(sp.categoryNameEn);
    if (!categoryId) {
      console.warn(`  ⚠ Категория "${sp.categoryNameEn}" не найдена для "${sp.name}"`);
      continue;
    }

    const created = await prisma.plantSpecies.upsert({
      where: {
        id: `species-${sp.name}`,
      },
      update: {
        name: sp.name,
        nameScientific: sp.nameScientific,
        categoryId,
        wateringIntervalDays: sp.wateringIntervalDays,
        wateringNormLiters: sp.wateringNormLiters,
        sunRequirement: sp.sunRequirement,
        soilType: sp.soilType,
        description: sp.description,
      },
      create: {
        id: `species-${sp.name}`,
        name: sp.name,
        nameScientific: sp.nameScientific,
        categoryId,
        wateringIntervalDays: sp.wateringIntervalDays,
        wateringNormLiters: sp.wateringNormLiters,
        sunRequirement: sp.sunRequirement,
        soilType: sp.soilType,
        description: sp.description,
      },
    });
    speciesMap.set(sp.name, created.id);

    // Create varieties
    for (const variety of sp.varieties) {
      await prisma.plantVariety.upsert({
        where: {
          id: `variety-${sp.name}-${variety.name}`,
        },
        update: {
          name: variety.name,
          speciesId: created.id,
          maturityDays: variety.maturityDays,
          frostResistance: variety.frostResistance,
          yieldDescription: variety.yieldDescription,
        },
        create: {
          id: `variety-${sp.name}-${variety.name}`,
          name: variety.name,
          speciesId: created.id,
          maturityDays: variety.maturityDays,
          frostResistance: variety.frostResistance,
          yieldDescription: variety.yieldDescription,
        },
      });
      varietyCount++;
    }
  }
  console.log(`  ✓ ${species.length} видов, ${varietyCount} сортов`);

  // 6. Diseases + PlantDisease relations
  console.log('  Болезни...');
  let plantDiseaseCount = 0;
  for (const disease of diseases) {
    const { affectedSpecies, ...diseaseData } = disease;
    const created = await prisma.disease.upsert({
      where: { name: diseaseData.name },
      update: diseaseData,
      create: diseaseData,
    });

    if (affectedSpecies) {
      for (const affected of affectedSpecies) {
        const speciesId = speciesMap.get(affected.speciesName);
        if (!speciesId) continue;

        await prisma.plantDisease.upsert({
          where: {
            speciesId_diseaseId: { speciesId, diseaseId: created.id },
          },
          update: {
            severity: affected.severity,
            seasonStart: affected.seasonStart,
            seasonEnd: affected.seasonEnd,
          },
          create: {
            speciesId,
            diseaseId: created.id,
            severity: affected.severity,
            seasonStart: affected.seasonStart,
            seasonEnd: affected.seasonEnd,
          },
        });
        plantDiseaseCount++;
      }
    }
  }
  console.log(`  ✓ ${diseases.length} болезней, ${plantDiseaseCount} связей`);

  // 7. Pests + PlantPest relations
  console.log('  Вредители...');
  let plantPestCount = 0;
  for (const pest of pests) {
    const { affectedSpecies, ...pestData } = pest;
    const created = await prisma.pest.upsert({
      where: { name: pestData.name },
      update: pestData,
      create: pestData,
    });

    if (affectedSpecies) {
      for (const affected of affectedSpecies) {
        const speciesId = speciesMap.get(affected.speciesName);
        if (!speciesId) continue;

        await prisma.plantPest.upsert({
          where: {
            speciesId_pestId: { speciesId, pestId: created.id },
          },
          update: {
            severity: affected.severity,
            seasonStart: affected.seasonStart,
            seasonEnd: affected.seasonEnd,
          },
          create: {
            speciesId,
            pestId: created.id,
            severity: affected.severity,
            seasonStart: affected.seasonStart,
            seasonEnd: affected.seasonEnd,
          },
        });
        plantPestCount++;
      }
    }
  }
  console.log(`  ✓ ${pests.length} вредителей, ${plantPestCount} связей`);

  // 8. Care Templates
  console.log('  Шаблоны ухода...');
  let templateCount = 0;
  for (const template of careTemplates) {
    const speciesId = speciesMap.get(template.speciesName);
    if (!speciesId) {
      console.warn(`  ⚠ Вид "${template.speciesName}" не найден для шаблона "${template.title}"`);
      continue;
    }

    const fertilizerId = template.fertilizerName
      ? fertilizerMap.get(template.fertilizerName) ?? null
      : null;
    const treatmentId = template.treatmentName
      ? treatmentMap.get(template.treatmentName) ?? null
      : null;

    await prisma.careTemplate.create({
      data: {
        speciesId,
        careType: template.careType,
        title: template.title,
        rrule: template.rrule,
        monthStart: template.monthStart,
        monthEnd: template.monthEnd,
        fertilizerId,
        treatmentId,
        priority: template.priority,
      },
    });
    templateCount++;
  }
  console.log(`  ✓ ${templateCount} шаблонов ухода`);

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
