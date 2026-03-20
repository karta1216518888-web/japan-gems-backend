import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 建立地域
  const kansai = await prisma.region.create({
    data: { name: '關西地方', nameJa: '関西地方', nameEn: 'Kansai' }
  });

  // 建立都道府縣
  const osaka = await prisma.prefecture.create({
    data: { name: '大阪府', nameJa: '大阪府', nameEn: 'Osaka', regionId: kansai.id }
  });
  const kyoto = await prisma.prefecture.create({
    data: { name: '京都府', nameJa: '京都府', nameEn: 'Kyoto', regionId: kansai.id }
  });

  // 建立城市
  const osakaCity = await prisma.city.create({
    data: { name: '大阪市', nameJa: '大阪市', nameEn: 'Osaka City', prefectureId: osaka.id }
  });
  const kyotoCity = await prisma.city.create({
    data: { name: '京都市', nameJa: '京都市', nameEn: 'Kyoto City', prefectureId: kyoto.id }
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
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  const catMap: Record<string, string> = {};
  const cats = await prisma.category.findMany();
  cats.forEach(c => catMap[c.name] = c.id);

  // 建立範例景點
  const spots = [
    { name: '箕面大滝', nameJa: '箕面大滝', nameEn: 'Minoo Waterfall', description: '位於箕面公園內的知名瀑布，是大阪近郊的自然秘境。', latitude: 34.8431, longitude: 135.4694, address: '大阪府箕面市箕面公園', languageBarrier: 4, paymentMethods: '["cash","suica"]', cityId: osakaCity.id, prefectureId: osaka.id, regionId: kansai.id, categories: ['自然景觀', '秘境'] },
    { name: '伊根の舟屋', nameJa: '伊根の舟屋', nameEn: 'Ine Funaya', description: '京都北部伊根町的傳統舟屋群，面朝日本海。', latitude: 35.6818, longitude: 135.3107, address: '京都府与謝郡伊根町', languageBarrier: 3, paymentMethods: '["cash"]', cityId: kyotoCity.id, prefectureId: kyoto.id, regionId: kansai.id, categories: ['文化體驗', '秘境'] },
    { name: '天王寺', nameJa: '天王寺', nameEn: 'Tennoji', description: '大阪南部的重要商業區域，擁有天王寺動物園等景點。', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 3, paymentMethods: '["cash","suica"]', cityId: osakaCity.id, prefectureId: osaka.id, regionId: kansai.id, categories: ['購物', '文化體驗'], wheelchairAccess: true },
    { name: '新世界', nameJa: '新世界', nameEn: 'Shinsekai', description: '復古風情的繁華街區，以通天閣和串炸聞名。', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 3, paymentMethods: '["cash"]', cityId: osakaCity.id, prefectureId: osaka.id, regionId: kansai.id, categories: ['美食', '拍照景點'] },
    { name: '臨空城', nameJa: '臨空城', nameEn: 'Rinku Town', description: '關西機場附近的大型outlet購物中心。', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市臨空城', languageBarrier: 2, paymentMethods: '["cash","visa","suica"]', prefectureId: osaka.id, regionId: kansai.id, categories: ['購物'], wheelchairAccess: true },
    { name: '銀閣寺', nameJa: '銀閣寺', nameEn: 'Ginkaku-ji', description: '世界遺產，以枯山水庭院聞名的禪寺。', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 3, paymentMethods: '["cash"]', businessHours: '9:00-17:00', cityId: kyotoCity.id, prefectureId: kyoto.id, regionId: kansai.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '哲學之道', nameJa: '哲学の道', nameEn: "Philosopher's Path", description: '連接銀閣寺與南禪寺的運河步道，春季櫻花隧道聞名。', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 3, paymentMethods: '["cash"]', cityId: kyotoCity.id, prefectureId: kyoto.id, regionId: kansai.id, categories: ['自然景觀', '拍照景點'] },
    { name: '伏見稻荷大社', nameJa: '伏見稲荷大社', nameEn: 'Fushimi Inari', description: '以千本鳥居聞名的神社，是京都代表性的景點。', latitude: 34.9671, longitude: 135.7727, address: '京都府京都市伏見區', languageBarrier: 2, paymentMethods: '["cash"]', prefectureId: kyoto.id, regionId: kansai.id, categories: ['歷史古蹟', '秘境'] },
  ];

  for (const spotData of spots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    const spot = await prisma.spot.create({ data: spotInfo });
    for (const catName of spotCategories) {
      if (catMap[catName]) {
        await prisma.spotCategory.create({ data: { spotId: spot.id, categoryId: catMap[catName] } });
      }
    }
    await prisma.reference.create({
      data: { spotId: spot.id, type: 'blog', title: `${spot.name} - 介紹`, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 75, quality: 'primary' }
    });
    console.log(`✅ ${spot.name}`);
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
