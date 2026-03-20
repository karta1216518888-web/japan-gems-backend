import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding more spots (batch 2)...');

  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });
  const osakaCity = await prisma.city.findFirst({ where: { name: '大阪市' } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: '京都市' } });

  if (!osaka || !kyoto || !osakaCity || !kyotoCity) {
    console.log('❌ Missing data');
    return;
  }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  // 更多大阪景點
  const osakaSpots = [
    { name: '臨空城Outlet', nameJa: '臨空城プレミアム・アウトレット', nameEn: 'Rinku Premium Outlets', description: '關西機場旁的大型Outlet', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市', languageBarrier: 1, prefectureId: osaka.id, categories: ['購物'], wheelchairAccess: true },
    { name: 'ATC', nameJa: 'アジア太平洋トレードセンター', nameEn: 'ATC', description: '關西最大展示場', latitude: 34.4317, longitude: 135.4044, address: '大阪府大阪市住之江區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: 'Cosmo Square', nameJa: 'コスモスクエア', nameEn: 'Cosmo Square', description: '港區購物中心', latitude: 34.6413, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: ' Zepp', nameJa: ' Zepp Osaka', nameEn: 'Zepp Osaka', description: '知名演唱會場館', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '天保山摩天輪', nameJa: '天保山大観覧車', nameEn: 'Tempozan Ferris Wheel', description: '高度112.5m的摩天輪', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '咲洲Commons', nameJa: '咲洲Commons', nameEn: 'Sakishima Commons', description: '港區辦公大樓展望台', latitude: 34.6413, longitude: 135.4513, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: 'ATC Hall', nameJa: 'ATCホール', nameEn: 'ATC Hall', description: '國際會議場', latitude: 34.4317, longitude: 135.4044, address: '大阪府泉佐野市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: 'EXPOCITY', nameJa: 'EXPOCITY', nameEn: 'EXPOCITY', description: '萬博紀念公園購物區', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物', '文化體驗'] },
    { name: '萬博紀念公園', nameJa: '万博記念公園', nameEn: 'Expo Park', description: '1970世博會紀念公園', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '太陽之塔', nameJa: '太陽の塔', nameEn: 'Tower of the Sun', description: '岡本太郎代表作', latitude: 34.8134, longitude: 135.5313, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點', '秘境'] },
    { name: '服部綠地', nameJa: '服部緑地', nameEn: 'Hattori Ryokuchi', description: '大阪最大綠地公園', latitude: 34.7612, longitude: 135.4812, address: '大阪府豐中市', languageBarrier: 3, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '千里中央', nameJa: '千里中央', nameEn: 'Senchu Chuo', description: '新城區中心', latitude: 34.8212, longitude: 135.5238, address: '大阪府吹田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['購物'] },
    { name: '江之子島', nameJa: '江之子島', nameEn: 'Enokoshi', description: '島類藝術中心', latitude: 34.7012, longitude: 135.4912, address: '大阪府大阪市西區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '文化體驗'] },
    { name: '中之島Lib', nameJa: '中之島Lib', nameEn: 'Nakanoshima Lib', description: '中之島圖書館', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大阪國立國際美術館', nameJa: '大阪国立国際美術館', nameEn: 'National Museum of Art', description: '日本唯一的國立當代藝術館', latitude: 34.6873, longitude: 135.4912, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '大阪市立科學館', nameJa: '大阪市立科学館', nameEn: 'Osaka Science Museum', description: '天文館和科學展示', latitude: 34.6873, longitude: 135.4912, address: '大阪府大阪市北區', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '大阪中之島公園', nameJa: '大阪中之島公園', nameEn: 'Osaka Nakanoshima Park', description: '水源綠洲', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '靱公園', nameJa: '靱公園', nameEn: 'Utsubo Park', description: '網球場和玫瑰園', latitude: 34.6812, longitude: 135.4812, address: '大阪府大阪市西區', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '住吉大社', nameJa: '住吉大社', nameEn: 'Sumiyoshi Taisha', description: '大阪最重要的神社', latitude: 34.6012, longitude: 135.4912, address: '大阪府大阪市住吉區', languageBarrier: 2, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '住吉公園', nameJa: '住吉公園', nameEn: 'Sumiyoshi Park', description: '最古老的公園', latitude: 34.6012, longitude: 135.4912, address: '大阪府大阪市住吉區', languageBarrier: 3, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '大仙公園', nameJa: '大仙公園', nameEn: 'Daisen Park', description: '古坟公园', latitude: 34.5712, longitude: 135.4812, address: '大阪府大阪市住吉區', languageBarrier: 3, prefectureId: osaka.id, categories: ['自然景觀', '歷史古蹟'] },
    { name: '堺', nameJa: '堺', nameEn: 'Sakai', description: '刀具和古坟之城', latitude: 34.5712, longitude: 135.4812, address: '大阪府堺市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗', '秘境'] },
    { name: '堺利晶之社', nameJa: '堺利晶之社', nameEn: 'Sakai Rits', description: '千利休相關設施', latitude: 34.5712, longitude: 135.4812, address: '大阪府堺市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '臨空城海灘', nameJa: '臨空城ビーチ', nameEn: 'Rinku Beach', description: '人工海灘', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '自然景觀'] },
    { name: '關西機場觀景台', nameJa: '関西空港展望デッキ', nameEn: 'KIX Airport View', description: '飛機起降觀景', latitude: 34.4273, longitude: 135.2444, address: '大阪府泉佐田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '飛行者神社', nameJa: '飛行者神社', nameEn: 'Hikousha Shrine', description: '航空相關神社', latitude: 34.4273, longitude: 135.2444, address: '大阪府泉佐田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '歷史古蹟'] },
    { name: '貝塚', nameJa: '貝塚', nameEn: 'Kaizuka', description: '原始古代遗迹', latitude: 34.4512, longitude: 135.3512, address: '大阪府貝塚市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '歷史古蹟'] },
    { name: '岸和田Dam', nameJa: '岸和田ダ牟', nameEn: 'Kishiwada Dam', description: '水庫風景', latitude: 34.4512, longitude: 135.4512, address: '大阪府岸和田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '自然景觀'] },
    { name: '久米田池', nameJa: '久米田池', nameEn: 'Kumeta Pond', description: '歷史水池', latitude: 34.4512, longitude: 135.4512, address: '大阪府岸和田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '久寶寺', nameJa: '久寶寺', nameEn: 'Kuhōji', description: '真言宗寺廟', latitude: 34.6312, longitude: 135.6012, address: '大阪府八尾市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '歷史古蹟'] },
  ];

  // 更多京都景點
  const kyotoSpots = [
    { name: '渡月橋', nameJa: '渡月橋', nameEn: 'Togetsukyo', description: '嵐山標誌性橋樑', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點', '自然景觀'] },
    { name: '仁和寺', nameJa: '仁和寺', nameEn: 'Ninna-ji', description: '世界遺產，門跡寺廟', latitude: 35.0312, longitude: 135.7112, address: '京都府京都市右京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '妙心寺', nameJa: '妙心寺', nameEn: 'Myoshin-ji', description: '臨濟宗妙心寺派', latitude: 35.0312, longitude: 135.7212, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '大德寺', nameJa: '大徳寺', nameEn: 'Daitoku-ji', description: '臨濟宗大本山', latitude: 35.0412, longitude: 135.7212, address: '京都府京都市北區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '金閣寺前箔吹', nameJa: '金閣寺前箔吹', nameEn: 'Kinkaku Before', description: '金閣寺周邊', latitude: 35.0394, longitude: 135.7292, address: '京都府京都市北區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點'] },
    { name: '北山', nameJa: '北山', nameEn: 'Kitayama', description: '北山Street', latitude: 35.0412, longitude: 135.7412, address: '京都府京都市北區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '大原有棲川', nameJa: '大原有棲川', nameEn: 'Oharano', description: '皇室舊領地', latitude: 35.0112, longitude: 135.7512, address: '京都府京都市西京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境'] },
    { name: '名神高速', nameJa: '名神高速', nameEn: 'Meishin', description: '高速景觀', latitude: 35.0612, longitude: 135.8012, address: '京都府京都市', languageBarrier: 4, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境'] },
    { name: '山科', nameJa: '山科', nameEn: 'Yamashina', description: '山科疏水', latitude: 35.0112, longitude: 135.8112, address: '京都府京都市山科區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '秘境'] },
    { name: '醍醐寺伽藍', nameJa: '醍醐寺伽藍', nameEn: 'Daigoji', description: '醍醐寺總本山', latitude: 34.9451, longitude: 135.8523, address: '京都府京都市伏見區', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '伏見港', nameJa: '伏見港', nameEn: 'Fushimi Port', description: '伏見運河', latitude: 34.9512, longitude: 135.7712, address: '京都府京都市伏見區', languageBarrier: 3, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '月桂冠大倉紀念館', nameJa: '月桂冠大倉記念館', nameEn: 'Kikumasamune', description: '伏見清酒見學', latitude: 34.9412, longitude: 135.7612, address: '京都府京都市伏見區', languageBarrier: 2, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '黃櫻紀念館', nameJa: '黄桜記念館', nameEn: 'Kizakura', description: '清酒資料館', latitude: 34.9412, longitude: 135.7612, address: '京都府京都市伏見區', languageBarrier: 2, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '松尾大社', nameJa: '松尾大社', nameEn: 'Matsuo Taisha', description: '松尾神社', latitude: 35.0112, longitude: 135.6912, address: '京都府京都市西京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '嵐山竹林', nameJa: '嵐山竹林', nameEn: 'Arashiyama Bamboo', description: '竹林步道', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '拍照景點'] },
    { name: '清涼寺', nameJa: '清涼寺', nameEn: 'Seiryo-ji', description: '清涼寺', latitude: 35.0012, longitude: 135.6712, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '、常寂光寺', nameJa: '常寂光寺', nameEn: 'Jojakko-ji', description: '苔蘚寺院', latitude: 35.0112, longitude: 135.6712, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '二尊院', nameJa: '二尊院', nameEn: 'Nison-in', description: '落葉名刹', latitude: 35.0112, longitude: 135.6712, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '祇園甲部', nameJa: '祇園甲部', nameEn: 'Gion Kaburenjo', description: '藝伎練習場', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '先斗町', nameJa: '先斗町', nameEn: 'Pontocho', description: '傳統町家街', latitude: 35.0037, longitude: 135.7712, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食', '拍照景點'] },
    { name: '木屋町', nameJa: '木屋町', nameEn: 'Kiyamachi', description: '柳並木街道', latitude: 35.0037, longitude: 135.7712, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食', '自然景觀'] },
    { name: '寺町京極', nameJa: '寺町京極', nameEn: 'Teramachi', description: '寺廟商店街', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '新京極', nameJa: '新京極', nameEn: 'Shinkyogoku', description: '拱廊購物街', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '大丸', nameJa: '大丸', nameEn: 'Daimaru', description: '京都本店', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '京都車站', nameJa: '京都駅', nameEn: 'Kyoto Station', description: 'JR京都站', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗'] },
    { name: '京都塔', nameJa: '京都タワー', nameEn: 'Kyoto Tower', description: '京都地標', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點'] },
    { name: '東寺', nameJa: '東寺', nameEn: 'To-ji', description: '世界遺產', latitude: 35.0119, longitude: 135.7701, address: '京都府京都市南區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '西寺', nameJa: '西寺', nameEn: 'Nishi-ji', description: '東寺相對', latitude: 35.0119, longitude: 135.7501, address: '京都府京都市南區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '歷史古蹟'] },
    { name: '羅城門', nameJa: '羅城門', nameEn: 'Rajomon', description: '古代遺迹', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市', languageBarrier: 4, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境'] },
    { name: '橘島', nameJa: '橘島', nameEn: 'Tachibana', description: '小火車站', latitude: 35.0612, longitude: 135.7612, address: '京都府京都市', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境'] },
  ];

  const allSpots = [...osakaSpots, ...kyotoSpots];
  let created = 0;

  for (const spotData of allSpots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    try {
      const spot = await prisma.spot.create({ data: spotInfo });
      for (const catName of spotCategories) {
        if (catMap[catName]) {
          await prisma.spotCategory.create({ data: { spotId: spot.id, categoryId: catMap[catName] } });
        }
      }
      await prisma.reference.create({
        data: { spotId: spot.id, type: 'blog', title: `${spot.name}`, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 70, quality: 'primary' }
      });
      created++;
      console.log(`✅ ${spot.name}`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total} (new: ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
