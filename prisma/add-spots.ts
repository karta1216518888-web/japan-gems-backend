import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding more spots...');

  // 獲取現有資料
  const kansai = await prisma.region.findFirst({ where: { name: '關西地方' } });
  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });
  
  const osakaCity = await prisma.city.findFirst({ where: { name: '大阪市' } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: '京都市' } });

  if (!kansai || !osaka || !kyoto || !osakaCity || !kyotoCity) {
    console.log('❌ Missing region/prefecture data');
    return;
  }

  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

  // 新增景點資料
  const newSpots = [
    // 大阪景點
    {
      name: '天王寺',
      nameJa: '天王寺',
      nameEn: 'Tennoji',
      description: '大阪南部的重要商業區域，擁有天王寺動物園，阿倍野Harukas等景點。',
      latitude: 34.6466,
      longitude: 135.5139,
      address: '大阪府大阪市天王寺區',
      languageBarrier: 3,
      paymentMethods: JSON.stringify(['cash', 'suica']),
      prefectureId: osaka.id,
      cityId: osakaCity.id,
      regionId: kansai.id,
      categories: ['購物', '文化體驗'],
      wheelchairAccess: true,
      bestSeason: JSON.stringify(['spring', 'autumn']),
    },
    {
      name: '新世界',
      nameJa: '新世界',
      nameEn: 'Shinsekai',
      description: '復古風情的繁華街區，以通天閣和串炸聞名。',
      latitude: 34.6526,
      longitude: 135.5063,
      address: '大阪府大阪市浪速區',
      languageBarrier: 3,
      paymentMethods: JSON.stringify(['cash']),
      prefectureId: osaka.id,
      cityId: osakaCity.id,
      regionId: kansai.id,
      categories: ['美食', '拍照景點'],
      bestSeason: JSON.stringify(['any']),
    },
    {
      name: '臨空城',
      nameJa: '臨空城',
      nameEn: 'Rinku Town',
      description: '關西機場附近的大型outlet購物中心。',
      latitude: 34.4317,
      longitude: 135.3144,
      address: '大阪府泉佐野市臨空城',
      languageBarrier: 2,
      paymentMethods: JSON.stringify(['cash', 'visa', 'suica']),
      prefectureId: osaka.id,
      regionId: kansai.id,
      categories: ['購物'],
      wheelchairAccess: true,
      bestSeason: JSON.stringify(['any']),
    },
    // 京都景點
    {
      name: '銀閣寺',
      nameJa: '銀閣寺',
      nameEn: 'Ginkaku-ji',
      description: '世界遺產，以枯山水庭院聞名的禪寺。',
      latitude: 35.0264,
      longitude: 135.7957,
      address: '京都府京都市左京區',
      languageBarrier: 3,
      paymentMethods: JSON.stringify(['cash']),
      businessHours: '9:00-17:00',
      prefectureId: kyoto.id,
      cityId: kyotoCity.id,
      regionId: kansai.id,
      categories: ['歷史古蹟', '自然景觀'],
      bestSeason: JSON.stringify(['spring', 'autumn']),
    },
    {
      name: '哲學之道',
      nameJa: '哲学の道',
      nameEn: "Philosopher's Path",
      description: '連接銀閣寺與南禪寺的運河步道，春季櫻花隧道聞名。',
      latitude: 35.0264,
      longitude: 135.7957,
      address: '京都府京都市左京區',
      languageBarrier: 3,
      paymentMethods: JSON.stringify(['cash']),
      prefectureId: kyoto.id,
      cityId: kyotoCity.id,
      regionId: kansai.id,
      categories: ['自然景觀', '拍照景點'],
      bestSeason: JSON.stringify(['spring']),
    },
    {
      name: '伏見稻荷大社',
      nameJa: '伏見稲荷大社',
      nameEn: 'Fushimi Inari Taisha',
      description: '以千本�的著名的神社，是京都代表性的景點。',
      latitude: 34.9671,
      longitude: 135.7727,
      address: '京都府京都市伏見區',
      languageBarrier: 2,
      paymentMethods: JSON.stringify(['cash']),
      prefectureId: kyoto.id,
      regionId: kansai.id,
      categories: ['歷史古蹟', '秘境'],
      wheelchairAccess: false,
      bestSeason: JSON.stringify(['any']),
    },
  ];

  for (const spotData of newSpots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    
    try {
      const spot = await prisma.spot.create({
        data: spotInfo
      });

      // 關聯分類
      for (const catName of spotCategories) {
        if (catMap[catName]) {
          await prisma.spotCategory.create({
            data: { spotId: spot.id, categoryId: catMap[catName] }
          });
        }
      }

      // 建立參考資料
      await prisma.reference.create({
        data: {
          spotId: spot.id,
          type: 'blog',
          title: `${spot.name} - 景點介紹`,
          url: `https://example.com/${encodeURIComponent(spot.name)}`,
          source: 'Japan Gems 資料庫',
          language: '中文',
          reliabilityScore: 75,
          quality: 'primary'
        }
      });

      console.log(`✅ Created: ${spot.name}`);
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.log(`⚠️ Already exists: ${spotData.name}`);
      } else {
        console.log(`❌ Error: ${spotData.name}`, e.message);
      }
    }
  }

  // 統計
  const totalSpots = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${totalSpots}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
