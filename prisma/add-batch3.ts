import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding batch 3...');

  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });
  const osakaCity = await prisma.city.findFirst({ where: { name: '大阪市' } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: '京都市' } });

  if (!osaka || !kyoto || !osakaCity || !kyotoCity) { console.log('❌ Missing data'); return; }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  const spots = [
    { name: '新大阪', nameJa: '新大阪', nameEn: 'ShinOsaka', description: 'JR新大阪站', latitude: 34.7308, longitude: 135.5003, address: '大阪府大阪市淀川区', languageBarrier: 1, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '東三国', nameJa: '東三国', nameEn: 'Higashimikuni', description: '住宅区', latitude: 34.7412, longitude: 135.5112, address: '大阪府大阪市淀川区', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '上新莊', nameJa: '上新庄', nameEn: 'Kamishinjo', description: '新城', latitude: 34.7512, longitude: 135.5612, address: '大阪府大阪市東淀川区', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '十三', nameJa: '十三', nameEn: 'Juso', description: '商業区', latitude: 34.7812, longitude: 135.4812, address: '大阪府大阪市淀川区', languageBarrier: 3, prefectureId: osaka.id, categories: ['ショッピング'] },
    { name: '塚本', nameJa: '塚本', nameEn: 'Tsukamoto', description: '住宅区', latitude: 34.7412, longitude: 135.4712, address: '大阪府大阪市淀川区', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '尼崎', nameJa: '尼崎', nameEn: 'Amagasaki', description: '阪神工業都市', latitude: 34.7312, longitude: 135.3612, address: '兵庫県尼崎市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '蘆屋', nameJa: '芦屋', nameEn: 'Ashiya', description: '高級住宅区', latitude: 34.7212, longitude: 135.3012, address: '兵庫県芦屋市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境', 'フォトスポット'] },
    { name: '西宮', nameJa: '西宮', nameEn: 'Nishinomiya', description: '関西学園都市', latitude: 34.7412, longitude: 135.3412, address: '兵庫県西宮市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '甲子園', nameJa: '甲子園', nameEn: 'Koshien', description: '野球場', latitude: 34.7312, longitude: 135.3612, address: '兵庫県西宮市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '寶塚', nameJa: '宝塚', nameEn: 'Takarazuka', description: '宝塚歌劇団', latitude: 34.8012, longitude: 135.3412, address: '兵庫県宝塚市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '伊丹', nameJa: '伊丹', nameEn: 'Itami', description: '伊丹空港', latitude: 34.7812, longitude: 135.4012, address: '兵庫県伊丹市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '川西', nameJa: '川西', nameEn: 'Kawanishi', description: '住宅区', latitude: 34.8212, longitude: 135.4212, address: '兵庫県川西市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '茨木', nameJa: '茨木', nameEn: 'Ibaraki', description: '科研都市', latitude: 34.8112, longitude: 135.5712, address: '大阪府茨木市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '攝津', nameJa: '摂津', nameEn: 'Settsu', description: '住宅区', latitude: 34.7812, longitude: 135.5612, address: '大阪府摂津市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '守口', nameJa: '守口', nameEn: 'Moriguchi', description: '住宅区', latitude: 34.7612, longitude: 135.6412, address: '大阪府守口市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '門真', nameJa: '門真', nameEn: 'Kadoma', description: '工業区', latitude: 34.7512, longitude: 135.6312, address: '大阪府門真市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大東', nameJa: '大東', nameEn: 'Daito', description: '住宅区', latitude: 34.6712, longitude: 135.6212, address: '大阪府大東市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '四條畷', nameJa: '四条畷', nameEn: 'Shijonawate', description: '住宅区', latitude: 34.7312, longitude: 135.6512, address: '大阪府四条畷市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '交野', nameJa: '交野', nameEn: 'Katano', description: '郊外', latitude: 34.7812, longitude: 135.6712, address: '大阪府交野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '枚方', nameJa: '枚方', nameEn: 'Hirakata', description: '枚方公園', latitude: 34.8135, longitude: 135.6503, address: '大阪府枚方市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化体験'] },
    { name: '樟葉', nameJa: '樟葉', nameEn: 'Kuzuha', description: 'ショッピングセンター', latitude: 34.8212, longitude: 135.6812, address: '大阪府枚方市', languageBarrier: 2, prefectureId: osaka.id, categories: ['ショッピング'] },
    { name: '津田', nameJa: '津田', nameEn: 'Tsuda', description: '学園都市', latitude: 34.8312, longitude: 135.7212, address: '大阪府枚方市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '星田', nameJa: '星田', nameEn: 'Hoshida', description: '住宅区', latitude: 34.8412, longitude: 135.6912, address: '大阪府交野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '同志社', nameJa: '同志社', nameEn: 'Doshisha', description: '大学校区', latitude: 35.0312, longitude: 135.7312, address: '京都府京都市上京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化体験'] },
    { name: '立命館', nameJa: '立命館', nameEn: 'Ritsumeikan', description: '大学校区', latitude: 35.0412, longitude: 135.7512, address: '京都府京都市北区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化体験'] },
    { name: '京都大学', nameJa: '京都大学', nameEn: 'KyotoU', description: '日本著名大学', latitude: 35.0264, longitude: 135.7812, address: '京都府京都市左京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化体験'] },
    { name: '百萬遍', nameJa: '百万遍', nameEn: 'Hyakumanben', description: '学生街', latitude: 35.0264, longitude: 135.7812, address: '京都府京都市左京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食'] },
    { name: '出町柳', nameJa: '出町柳', nameEn: 'Demachiyanagi', description: '交差点', latitude: 35.0264, longitude: 135.7712, address: '京都府京都市上京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '北大路', nameJa: '北大路', nameEn: 'Kitaoji', description: '北大路駅', latitude: 35.0412, longitude: 135.7512, address: '京都府京都市北区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '大宮', nameJa: '大宮', nameEn: 'Omiya', description: '四条大宮', latitude: 35.0042, longitude: 135.7512, address: '京都府京都市下京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '二條', nameJa: '二条', nameEn: 'Nijo', description: '二条駅', latitude: 35.0142, longitude: 135.7412, address: '京都府京都市中京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '御池', nameJa: '御池', nameEn: 'Oike', description: '御池通', latitude: 35.0112, longitude: 135.7612, address: '京都府京都市中京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '烏丸御池', nameJa: '烏丸御池', nameEn: 'KarasumaOike', description: '十字路', latitude: 35.0112, longitude: 135.7612, address: '京都府京都市中京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '四條', nameJa: '四条', nameEn: 'Shijo', description: '四条通', latitude: 35.0037, longitude: 135.7676, address: '京都府京都市中央区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '河原町', nameJa: '河原町', nameEn: 'Kawaramachi', description: '河原町通', latitude: 35.0062, longitude: 135.7676, address: '京都府京都市中央区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '祇園四条', nameJa: '祇園四条', nameEn: 'GionShijo', description: '祇園区', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化体験'] },
    { name: '東山', nameJa: '東山', nameEn: 'Higashiyama', description: '東山区', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['フォトスポット'] },
    { name: '蹴上', nameJa: '蹴上', nameEn: 'Keage', description: '蹴上駅', latitude: 35.0114, longitude: 135.7953, address: '京都府京都市左京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '自然景観'] },
    { name: '平安神宮', nameJa: '平安神宮', nameEn: 'HeianShrine', description: '守護神社', latitude: 35.0114, longitude: 135.7853, address: '京都府京都市左京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歴史古蹟'] },
    { name: '岡崎', nameJa: '岡崎', nameEn: 'Okazaki', description: '岡崎公園', latitude: 35.0114, longitude: 135.7853, address: '京都府京都市左京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景観'] },
    { name: '知恩院', nameJa: '知恩院', nameEn: 'Chionin', description: '浄土宗総本山', latitude: 35.0037, longitude: 135.7812, address: '京都府京都市東山区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歴史古蹟'] },
    { name: '七條', nameJa: '七条', nameEn: 'Shichijo', description: '七条駅', latitude: 35.0119, longitude: 135.7701, address: '京都府京都市下京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境'] },
    { name: '清水五条', nameJa: '五条', nameEn: 'Gojo', description: '五条駅', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '八坂', nameJa: '八坂', nameEn: 'Yasaka', description: '八坂神社', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歴史古蹟'] },
    { name: '京都站前', nameJa: '京都駅前', nameEn: 'KyotoStaMae', description: '駅広場', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['ショッピング'] },
    { name: '京都塔前', nameJa: '京都タワー前', nameEn: 'KyotoTower', description: '京都タワー', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京区', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['フォトスポット'] },
    { name: '西本願寺前', nameJa: '西本願寺前', nameEn: 'NishiHongan', description: '西本願寺', latitude: 35.0143, longitude: 135.7476, address: '京都府京都市下京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歴史古蹟'] },
    { name: '東本願寺前', nameJa: '東本願寺前', nameEn: 'HigashiHongan', description: '東本願寺', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京区', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歴史古蹟'] },
    { name: '伏見稻荷前', nameJa: '伏見稲荷前', nameEn: 'FushimiMae', description: '伏見稲荷駅前', latitude: 34.9671, longitude: 135.7727, address: '京都府京都市伏見区', languageBarrier: 2, prefectureId: kyoto.id, categories: ['ショッピング'] },
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
        data: { spotId: spot.id, type: 'blog', title: spot.name, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 65, quality: 'primary' }
      });
      created++;
      if (created % 10 === 0) console.log(`Progress: ${created}...`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total} (new: ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
