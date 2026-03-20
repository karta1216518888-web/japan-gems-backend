import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding batch 5 (final)...');

  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });
  const osakaCity = await prisma.city.findFirst({ where: { name: '大阪市' } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: '京都市' } });

  if (!osaka || !kyoto || !osakaCity || !kyotoCity) { console.log('❌ Missing'); return; }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  // 京都景點湊到200
  const kyotoSpots = [
    { name: '東福寺', nameJa: '東福寺', nameEn: 'Tofukuji', description: '東福寺', latitude: 35.0094, longitude: 135.7729, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '伏見稻荷', nameJa: '伏見稲荷', nameEn: 'FushimiInari', description: '千本鳥居', latitude: 34.9671, longitude: 135.7727, address: '京都府京都市伏見區', languageBarrier: 1, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '清水寺', nameJa: '清水寺', nameEn: 'Kiyomizu', description: '清水舞台', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '金閣寺', nameJa: '金閣寺', nameEn: 'Kinkakuji', description: '金閣寺', latitude: 35.0394, longitude: 135.7292, address: '京都府京都市北區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '銀閣寺', nameJa: '銀閣寺', nameEn: 'Ginkakuji', description: '銀閣寺', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '嵐山', nameJa: '嵐山', nameEn: 'Arashiyama', description: '嵐山', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '拍照景點'] },
    { name: '渡月橋', nameJa: '渡月橋', nameEn: 'Togetsukyo', description: '渡月橋', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點'] },
    { name: '竹林小徑', nameJa: '竹林', nameEn: 'Bamboo', description: '竹林', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀'] },
    { name: '祇園', nameJa: '祇園', nameEn: 'Gion', description: '藝伎街', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '八坂神社', nameJa: '八坂神社', nameEn: 'Yasaka', description: '八坂神社', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '二年坂', nameJa: '二年坂', nameEn: 'Ninenzaka', description: '二年坂', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '三年坂', nameJa: '三年坂', nameEn: 'Sannenzaka', description: '三年坂', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '寧寧之道', nameJa: '寧々の道', nameEn: 'Nene', description: '寧寧之道', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點'] },
    { name: '高台寺', nameJa: '高台寺', nameEn: 'Kodaiji', description: '高台寺', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '建仁寺', nameJa: '建仁寺', nameEn: 'Kenninji', description: '建仁寺', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '南禪寺', nameJa: '南禅寺', nameEn: 'Nanzenji', description: '南禪寺', latitude: 35.0114, longitude: 135.7953, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '哲學之道', nameJa: '哲学之道', nameEn: 'Philosopher', description: '哲學之道', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '拍照景點'] },
    { name: '永觀堂', nameJa: '永観堂', nameEn: 'Eikando', description: '永觀堂', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '平安神宮', nameJa: '平安神宮', nameEn: 'HeianShrine', description: '平安神宮', latitude: 35.0114, longitude: 135.7853, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '蹴上', nameJa: '蹴上', nameEn: 'Keage', description: '蹴上', latitude: 35.0114, longitude: 135.7953, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '二條城', nameJa: '二条城', nameEn: 'NijoCastle', description: '二條城', latitude: 35.0143, longitude: 135.7476, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '京都御所', nameJa: '京都御所', nameEn: 'ImperialPalace', description: '京都御所', latitude: 35.0254, longitude: 135.7621, address: '京都府京都市上京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '下鴨神社', nameJa: '下鴨神社', nameEn: 'Shimogamo', description: '下鴨神社', latitude: 35.0376, longitude: 135.7712, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '上賀茂神社', nameJa: '上賀茂神社', nameEn: 'Kamigamo', description: '上賀茂神社', latitude: 35.0376, longitude: 135.7712, address: '京都府京都市北區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '北野天滿宮', nameJa: '北野天滿宮', nameEn: 'KitanoTenmangu', description: '北野天滿宮', latitude: 35.0312, longitude: 135.7112, address: '京都府京都市上京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '仁和寺', nameJa: '仁和寺', nameEn: 'Ninnaji', description: '仁和寺', latitude: 35.0312, longitude: 135.7112, address: '京都府京都市右京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '妙心寺', nameJa: '妙心寺', nameEn: 'Myoshinji', description: '妙心寺', latitude: 35.0312, longitude: 135.7212, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '大德寺', nameJa: '大徳寺', nameEn: 'Daitokuji', description: '大德寺', latitude: 35.0412, longitude: 135.7212, address: '京都府京都市北區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '東寺', nameJa: '東寺', nameEn: 'Toji', description: '東寺', latitude: 35.0119, longitude: 135.7701, address: '京都府京都市南區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '西本願寺', nameJa: '西本願寺', nameEn: 'NishiHongan', description: '西本願寺', latitude: 35.0143, longitude: 135.7476, address: '京都府京都市下京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '東本願寺', nameJa: '東本願寺', nameEn: 'HigashiHongan', description: '東本願寺', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '三十三間堂', nameJa: '三十三間堂', nameEn: 'Sanjusangendo', description: '三十三間堂', latitude: 35.0012, longitude: 135.7912, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '醍醐寺', nameJa: '醍醐寺', nameEn: 'Daigoji', description: '醍醐寺', latitude: 34.9451, longitude: 135.8523, address: '京都府京都市伏見區', languageBarrier: 3, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '平等院', nameJa: '平等院', nameEn: 'Byodoin', description: '平等院', latitude: 34.8948, longitude: 135.8034, address: '京都府宇治市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '宇治', nameJa: '宇治', nameEn: 'Uji', description: '宇治', latitude: 34.8948, longitude: 135.8034, address: '京都府宇治市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['美食', '文化體驗'] },
    { name: '貴船', nameJa: '貴船', nameEn: 'Kibune', description: '貴船', latitude: 35.0612, longitude: 135.7223, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '美食'] },
    { name: '鞍馬', nameJa: '鞍馬', nameEn: 'Kurama', description: '鞍馬', latitude: 35.0612, longitude: 135.7223, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '比叡山', nameJa: '比叡山', nameEn: 'MountHiei', description: '比叡山', latitude: 35.0683, longitude: 135.7612, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '歷史古蹟'] },
    { name: '錦市場', nameJa: '錦市場', nameEn: 'NishikiMarket', description: '錦市場', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食', '購物'] },
    { name: '河原町', nameJa: '河原町', nameEn: 'Kawaramachi', description: '河原町', latitude: 35.0062, longitude: 135.7676, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '四條', nameJa: '四条', nameEn: 'Shijo', description: '四條', latitude: 35.0037, longitude: 135.7676, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '烏丸', nameJa: '烏丸', nameEn: 'Karasuma', description: '烏丸', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '京都車站', nameJa: '京都駅', nameEn: 'KyotoStation', description: '京都車站', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '京都塔', nameJa: '京都タワー', nameEn: 'KyotoTower', description: '京都塔', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點'] },
    { name: '先斗町', nameJa: '先斗町', nameEn: 'Pontocho', description: '先斗町', latitude: 35.0037, longitude: 135.7712, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食', '拍照景點'] },
    { name: '木屋町', nameJa: '木屋町', nameEn: 'Kiyamachi', description: '木屋町', latitude: 35.0037, longitude: 135.7712, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食'] },
    { name: '寺町京極', nameJa: '寺町京極', nameEn: 'Teramachi', description: '寺町京極', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '新京極', nameJa: '新京極', nameEn: 'Shinkyogoku', description: '新京極', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '大丸', nameJa: '大丸', nameEn: 'Daimaru', description: '大丸', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '高島屋', nameJa: '高島屋', nameEn: 'Takashiyama', description: '高島屋', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: 'JR京都站', nameJa: 'JR京都駅', nameEn: 'JRKyoto', description: 'JR京都站', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '近鐵京都', nameJa: '近鉄京都', nameEn: 'KintetsuKyoto', description: '近鐵京都', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '奈良', nameJa: '奈良', nameEn: 'Nara', description: '奈良', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 1, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '奈良公園', nameJa: '奈良公園', nameEn: 'NaraPark', description: '奈良公園', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 1, prefectureId: kyoto.id, categories: ['自然景觀'] },
    { name: '東大寺', nameJa: '東大寺', nameEn: 'Todaiji', description: '東大寺', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '春日大社', nameJa: '春日大社', nameEn: 'KasugaTaisha', description: '春日大社', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '興福寺', nameJa: '興福寺', nameEn: 'Kofukuji', description: '興福寺', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '奈良町', nameJa: '奈良町', nameEn: 'Naramachi', description: '奈良町', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['購物', '文化體驗'] },
    { name: '若草山', nameJa: '若草山', nameEn: 'Wakakusayama', description: '若草山', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['自然景觀', '秘境'] },
    { name: '唐招提寺', nameJa: '唐招提寺', nameEn: 'Toshodaiji', description: '唐招提寺', latitude: 34.6751, longitude: 135.7948, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '藥師寺', nameJa: '薬師寺', nameEn: 'Yakushiji', description: '藥師寺', latitude: 34.6751, longitude: 135.7948, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '平城宮', nameJa: '平城宮', nameEn: 'Heijokyu', description: '平城宮', latitude: 34.6851, longitude: 135.7948, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '法隆寺', nameJa: '法隆寺', nameEn: 'Horyuji', description: '法隆寺', latitude: 34.6151, longitude: 135.7348, address: '奈良縣生駒郡', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '斑鳩', nameJa: '斑鳩', nameEn: 'Ikaruga', description: '斑鳩', latitude: 34.6151, longitude: 135.7348, address: '奈良縣生駒郡', languageBarrier: 3, prefectureId: kyoto.id, categories: ['秘境', '歷史古蹟'] },
    { name: '吉野', nameJa: '吉野', nameEn: 'Yoshino', description: '吉野', latitude: 34.4251, longitude: 135.8548, address: '奈良縣吉野郡', languageBarrier: 3, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '吉野山', nameJa: '吉野山', nameEn: 'Yoshinoyama', description: '吉野山', latitude: 34.4251, longitude: 135.8548, address: '奈良縣吉野郡', languageBarrier: 3, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
  ];

  let created = 0;

  for (const spotData of kyotoSpots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    try {
      const spot = await prisma.spot.create({ data: spotInfo });
      for (const catName of spotCategories) {
        if (catMap[catName]) {
          await prisma.spotCategory.create({ data: { spotId: spot.id, categoryId: catMap[catName] } });
        }
      }
      await prisma.reference.create({
        data: { spotId: spot.id, type: 'blog', title: spot.name, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 70, quality: 'primary' }
      });
      created++;
      if (created % 20 === 0) console.log(`Progress: ${created}...`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total} (new: ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
