import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 建立地域
  const kansai = await prisma.region.create({
    data: {
      name: '關西地方',
      nameJa: '関西地方',
      nameEn: 'Kansai'
    }
  });

  // 建立都道府縣
  const osaka = await prisma.prefecture.create({
    data: {
      name: '大阪府',
      nameJa: '大阪府',
      nameEn: 'Osaka',
      regionId: kansai.id
    }
  });

  const kyoto = await prisma.prefecture.create({
    data: {
      name: '京都府',
      nameJa: '京都府',
      nameEn: 'Kyoto',
      regionId: kansai.id
    }
  });

  // 建立城市
  const osakaCity = await prisma.city.create({
    data: {
      name: '大阪市',
      nameJa: '大阪市',
      nameEn: 'Osaka City',
      prefectureId: osaka.id
    }
  });

  const kyotoCity = await prisma.city.create({
    data: {
      name: '京都市',
      nameJa: '京都市',
      nameEn: 'Kyoto City',
      prefectureId: kyoto.id
    }
  });

  // 建立分類
  const categories = [
    { name: '自然景觀', nameJa: '自然景観', nameEn: 'Nature' },
    { name: '文化體驗', nameJa: '文化体験', nameEn: 'Culture' },
    { name: '歷史古蹟', nameJa: '歴史古迹', nameEn: 'History' },
    { name: '秘境', nameJa: '穴場', nameEn: 'Hidden Gem' },
    { name: '拍照景點', nameJa: 'フォトスポット', nameEn: 'Photo Spot' },
    { name: '購物', nameJa: 'ショッピング', nameEn: 'Shopping' },
    { name: '溫泉', nameJa: '温泉', nameEn: 'Onsen' },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.name] = created;
  }

  // 建立範例景點
  const spots = [
    {
      name: '箕面大滝',
      nameJa: '箕面大滝',
      nameEn: 'Minoo Waterfall',
      nameZh: '箕面瀑布',
      description: '位於箕面公園內的知名瀑布，是大阪近郊的自然秘境。秋天紅葉景色優美，是在地人喜愛的健行景點。',
      localTip: '建議清晨前往，可以避開人潮。公園內有溫泉設施，可以泡腳休息。',
      latitude: 34.8431,
      longitude: 135.4694,
      address: '大阪府箕面市箕面公園',
      languageBarrier: 4,
      paymentAccept: JSON.stringify(['cash', 'suica']),
      cityId: osakaCity.id,
      prefectureId: osaka.id,
      regionId: kansai.id,
      categories: ['自然景觀', '秘境']
    },
    {
      name: '伊根の舟屋',
      nameJa: '伊根の舟屋',
      nameEn: 'Ine Funaya',
      nameZh: '伊根舟屋',
      description: '京都北部伊根町的傳統舟屋群，面朝日本海，保存傳統的生活方式。重要傳統建造物群保存地區。',
      localTip: '建議住在舟屋一晚，清晨和傍晚的景色最美。品嚐當地的海鮮料理。',
      latitude: 35.6818,
      longitude: 135.3107,
      address: '京都府与謝郡伊根町字伊根',
      languageBarrier: 3,
      paymentAccept: JSON.stringify(['cash']),
      cityId: kyotoCity.id,
      prefectureId: kyoto.id,
      regionId: kansai.id,
      categories: ['文化體驗', '秘境']
    }
  ];

  for (const spotData of spots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    const spot = await prisma.spot.create({ data: spotInfo });

    // 關聯分類
    for (const catName of spotCategories) {
      await prisma.spotCategory.create({
        data: {
          spotId: spot.id,
          categoryId: createdCategories[catName].id
        }
      });
    }

    // 建立範例參考資料
    await prisma.reference.create({
      data: {
        spotId: spot.id,
        type: 'blog',
        title: `${spot.name} - 在地人推薦`,
        url: `https://example.com/${encodeURIComponent(spot.name)}`,
        source: 'Japan Hidden Gems 資料庫',
        language: '中文',
        reliabilityScore: 85,
        quality: 'primary'
      }
    });
  }

  console.log('✅ Seeding complete!');
  console.log(`📍 Created: 1 region, 2 prefectures, 2 cities, ${categories.length} categories, ${spots.length} spots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
