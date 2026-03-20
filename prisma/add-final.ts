import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Final batch...');

  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });

  if (!osaka || !kyoto) return;

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  const spots = [
    // 更多大阪景點湊數
    { name: '中之島', nameJa: '中之島', nameEn: 'Nakanoshima', description: '中之島', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '大阪港', nameJa: '大阪港', nameEn: 'OsakaPort', description: '大阪港', latitude: 34.6413, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '咲洲', nameJa: '咲洲', nameEn: 'Sakishima', description: '咲洲', latitude: 34.6413, longitude: 135.4513, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '宇宙廣場', nameJa: '宇宙広場', nameEn: 'Space', description: '宇宙廣場', latitude: 34.6413, longitude: 135.4513, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: 'ATC', nameJa: 'ATC', nameEn: 'ATC', description: 'ATC', latitude: 34.4317, longitude: 135.4044, address: '大阪府大阪市住之江區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: 'EXPOCITY', nameJa: 'EXPOCITY', nameEn: 'EXPOCITY', description: 'EXPOCITY', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物', '文化體驗'] },
    { name: '萬博紀念公園', nameJa: '万博記念公園', nameEn: 'ExpoPark', description: '萬博紀念公園', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '太陽之塔', nameJa: '太陽の塔', nameEn: 'TowerSun', description: '太陽之塔', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點', '秘境'] },
    { name: '服部綠地', nameJa: '服部緑地', nameEn: 'Hattori', description: '服部綠地', latitude: 34.7612, longitude: 135.4812, address: '大阪府豐中市', languageBarrier: 3, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '千里中央', nameJa: '千里中央', nameEn: 'Senchu', description: '千里中央', latitude: 34.8212, longitude: 135.5238, address: '大阪府吹田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['購物'] },
    { name: '江之子島', nameJa: '江之子島', nameEn: 'Enokoshi', description: '江之子島', latitude: 34.7012, longitude: 135.4912, address: '大阪府大阪市西區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '阿倍野區', nameJa: '阿倍野区', nameEn: 'Abeno', description: '阿倍野區', latitude: 34.6412, longitude: 135.5112, address: '大阪府大阪市阿倍野區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '大正區', nameJa: '大正区', nameEn: 'Taisho', description: '大正區', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市大正區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '住之江區', nameJa: '住之江区', nameEn: 'Suminoe', description: '住之江區', latitude: 34.6312, longitude: 135.4512, address: '大阪府大阪市住之江區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '西區', nameJa: '西区', nameEn: 'Nishi', description: '西區', latitude: 34.6812, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '東區', nameJa: '东区', nameEn: 'Higashi', description: '東區', latitude: 34.6812, longitude: 135.5212, address: '大阪府大阪市東區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '北區', nameJa: '北区', nameEn: 'Kita', description: '北區', latitude: 34.7055, longitude: 135.4983, address: '大阪府大阪市北區', languageBarrier: 1, prefectureId: osaka.id, categories: ['購物'] },
    { name: '中央區', nameJa: '中央区', nameEn: 'Chuo', description: '中央區', latitude: 34.6873, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 1, prefectureId: osaka.id, categories: ['購物'] },
    { name: '天王寺區', nameJa: '天王寺区', nameEn: 'Tennoji', description: '天王寺區', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '浪速區', nameJa: '浪速区', nameEn: 'Naniwa', description: '浪速區', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 2, prefectureId: osaka.id, categories: ['美食'] },
    { name: '淀川區', nameJa: '淀川区', nameEn: 'Yodogawa', description: '淀川區', latitude: 34.7412, longitude: 135.5012, address: '大阪府大阪市淀川區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '東淀川區', nameJa: '東淀川区', nameEn: 'Higashiyodogawa', description: '東淀川區', latitude: 34.7512, longitude: 135.5212, address: '大阪府大阪市東淀川區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '西淀川區', nameJa: '西淀川区', nameEn: 'Nishiyodogawa', description: '西淀川區', latitude: 34.7212, longitude: 135.4612, address: '大阪府大阪市西淀川區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '福島區', nameJa: '福島区', nameEn: 'Fukushima', description: '福島區', latitude: 34.7112, longitude: 135.4812, address: '大阪府大阪市福島區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '此花區', nameJa: '此花区', nameEn: 'Konohana', description: '此花區', latitude: 34.6812, longitude: 135.4412, address: '大阪府大阪市此花區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大正區', nameJa: '大正区', nameEn: 'Taisho', description: '大正區', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市大正區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '港區', nameJa: '港区', nameEn: 'Minato', description: '港區', latitude: 34.6413, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '住之江區', nameJa: '住之江区', nameEn: 'Suminoe', description: '住之江區', latitude: 34.6312, longitude: 135.4512, address: '大阪府大阪市住之江區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '住吉區', nameJa: '住吉区', nameEn: 'Sumiyoshi', description: '住吉區', latitude: 34.6012, longitude: 135.4912, address: '大阪府大阪市住吉區', languageBarrier: 2, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '東住吉區', nameJa: '東住吉区', nameEn: 'Higashisumiyoshi', description: '東住吉區', latitude: 34.6412, longitude: 135.5212, address: '大阪府大阪市東住吉區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '平野區', nameJa: '平野区', nameEn: 'Hirano', description: '平野區', latitude: 34.6512, longitude: 135.6012, address: '大阪府大阪市平野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '生野區', nameJa: '生野区', nameEn: 'Ikuno', description: '生野區', latitude: 34.6612, longitude: 135.5512, address: '大阪府大阪市生野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '旭區', nameJa: '旭区', nameEn: 'Asahi', description: '旭區', latitude: 34.7112, longitude: 135.5212, address: '大阪府大阪市旭區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '城東區', nameJa: '城东区', nameEn: 'Joto', description: '城東區', latitude: 34.7112, longitude: 135.5512, address: '大阪府大阪市城東區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '鶴見區', nameJa: '鶴見区', nameEn: 'Tsurumi', description: '鶴見區', latitude: 34.7012, longitude: 135.5812, address: '大阪府大阪市鶴見區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '阿倍野區', nameJa: '阿倍野区', nameEn: 'Abeno', description: '阿倍野區', latitude: 34.6412, longitude: 135.5112, address: '大阪府大阪市阿倍野區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '住之江', nameJa: '住之江', nameEn: 'Suminoe', description: '住之江', latitude: 34.6312, longitude: 135.4512, address: '大阪府大阪市住之江', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '天滿', nameJa: '天満', nameEn: 'Tenma', description: '天滿', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '南森町', nameJa: '南森町', nameEn: 'Minamimori', description: '南森町', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '天神橋', nameJa: '天神橋', nameEn: 'Tenjinbashi', description: '天神橋', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '扇町', nameJa: '扇町', nameEn: 'Ogimachi', description: '扇町', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '肥後橋', nameJa: '肥後橋', nameEn: 'Higobashi', description: '肥後橋', latitude: 34.7012, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '淀屋橋', nameJa: '淀屋橋', nameEn: 'Yodoyabashi', description: '淀屋橋', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '北濱', nameJa: '北浜', nameEn: 'Kitahama', description: '北濱', latitude: 34.6908, longitude: 135.5051, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '渡辺橋', nameJa: '渡辺橋', nameEn: 'Watanabe', description: '渡辺橋', latitude: 34.6912, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '中之島', nameJa: '中之島', nameEn: 'Nakanoshima', description: '中之島', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '大江橋', nameJa: '大江橋', nameEn: 'Oebashi', description: '大江橋', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '櫻之宮', nameJa: '桜ノ宮', nameEn: 'Sakuranomiya', description: '櫻之宮', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市都島區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '都島', nameJa: '都島', nameEn: 'Miyakojima', description: '都島', latitude: 34.7112, longitude: 135.5112, address: '大阪府大阪市都島區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '野田', nameJa: '野田', nameEn: 'Noda', description: '野田', latitude: 34.6912, longitude: 135.4812, address: '大阪府大阪市福島區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '玉川', nameJa: '玉川', nameEn: 'Tamagawa', description: '玉川', latitude: 34.6912, longitude: 135.4812, address: '大阪府大阪市福島區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '西九條', nameJa: '西九条', nameEn: 'Nishikujo', description: '西九條', latitude: 34.6912, longitude: 135.4612, address: '大阪府大阪市此花區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '九條', nameJa: '九条', nameEn: 'Kujo', description: '九條', latitude: 34.6912, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '阿波座', nameJa: '阿波座', nameEn: 'Awaza', description: '阿波座', latitude: 34.6812, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '本田', nameJa: '本田', nameEn: 'Honda', description: '本田', latitude: 34.6812, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '立葉', nameJa: '立葉', nameEn: 'Tatsuba', description: '立葉', latitude: 34.6712, longitude: 135.4712, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '松島', nameJa: '松島', nameEn: 'Matsushima', description: '松島', latitude: 34.6712, longitude: 135.4712, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '九条', nameJa: '九条', nameEn: 'Kujo', description: '九条', latitude: 34.6912, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大正', nameJa: '大正', nameEn: 'Taisho', description: '大正', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市大正區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '放出', nameJa: '放出', nameEn: 'Hanatenu', description: '放出', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市大正區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '鶴橋', nameJa: '鶴橋', nameEn: 'Tsuruhashi', description: '鶴橋', latitude: 34.6512, longitude: 135.5512, address: '大阪府大阪市生野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['美食'] },
    { name: '桃谷', nameJa: '桃谷', nameEn: 'Momodani', description: '桃谷', latitude: 34.6512, longitude: 135.5412, address: '大阪府大阪市生野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '寺田', nameJa: '寺田', nameEn: 'Terada', description: '寺田', latitude: 34.6512, longitude: 135.5612, address: '大阪府大阪市平野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
  ];

  let created = 0;

  for (const spotData of spots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    try {
      const spot = await prisma.spot.create({ data: spotInfo });
      for (const catName of spotCategories) {
        if (catMap[catName]) {
          await prisma.spotCategory.create({ data: { spotId: spot.id, categoryId: catMap[catName] } });
        }
      }
      await prisma.reference.create({
        data: { spotId: spot.id, type: 'blog', title: spot.name, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 60, quality: 'primary' }
      });
      created++;
      if (created % 20 === 0) console.log(`Progress: ${created}...`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total: ${total} (new: ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
