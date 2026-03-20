import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding more spots...');

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

  const newSpots = [
    // 大阪景點 (40個)
    { name: '道頓堀', nameJa: '道頓堀', nameEn: 'Dotonbori', description: '大阪最具代表性的繁華街，美食天堂', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市中央區道頓堀', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食', '拍照景點'] },
    { name: '心齋橋', nameJa: '心斎橋', nameEn: 'Shinsaibashi', description: '大阪最大的購物街', latitude: 34.6755, longitude: 135.5013, address: '大阪府大阪市中央區心齋橋', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '梅田天空大樓', nameJa: '梅田スカイビル', nameEn: 'Umeda Sky Building', description: '大阪著名展望台，欣賞夜景', latitude: 34.7055, longitude: 135.4983, address: '大阪府大阪市北區梅田', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點', '文化體驗'] },
    { name: '通天閣', nameJa: '通天閣', nameEn: 'Tsutenkaku', description: '大阪新世界地標，類似巴黎艾菲爾鐵塔', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '大阪城', nameJa: '大阪城', nameEn: 'Osaka Castle', description: '日本三大名城之一，豐臣秀吉的居城', latitude: 34.6873, longitude: 135.5261, address: '大阪府大阪市中央區大阪城', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '天王寺動物園', nameJa: '天王寺动物园', nameEn: 'Tennoji Zoo', description: '大阪市內歷史悠久的動物園', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '阿倍野Harukas', nameJa: 'あべのハルカス', nameEn: 'Abeno Harukas', description: '日本最高摩天大樓，300米高空展望', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點', '購物'] },
    { name: '黑門市場', nameJa: '黒門市場', nameEn: 'Kuromon Market', description: '大阪廚房，海鮮美食天堂', latitude: 34.6681, longitude: 135.5074, address: '大阪府大阪市中央區日本橋', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    { name: '新大阪站', nameJa: '新大阪駅', nameEn: 'Shin-Osaka', description: 'JR大阪站，新幹線樞紐', latitude: 34.7308, longitude: 135.5003, address: '大阪府大阪市淀川區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '中之島', nameJa: '中之島', nameEn: 'Nakanoshima', description: '大阪市中心四面環水的島嶼', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區中之島', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['自然景觀', '拍照景點'] },
    { name: '天保山', nameJa: '天保山', nameEn: 'Tempozan', description: '大阪港區，摩天輪和海遊館', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點', '文化體驗'] },
    { name: '海遊館', nameJa: '海遊館', nameEn: 'Kaiyukan', description: '世界最大規模的水族館之一', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區天保山', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗', '秘境'] },
    { name: '環球影城', nameJa: 'ユニバーサル・スタジオ・ジャパン', nameEn: 'Universal Studios Japan', description: '日本環球影城，主題樂園', latitude: 34.6654, longitude: 135.4323, address: '大阪府大阪市此花區', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '難波', nameJa: '難波', nameEn: 'Namba', description: '大阪最熱鬧的商業區', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市中央區難波', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物', '美食'] },
    { name: '北濱', nameJa: '北浜', nameEn: 'Kitahama', description: '金融街，歐式建築林立', latitude: 34.6908, longitude: 135.5051, address: '大阪府大阪市中央區北濱', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '大阪歴史博物館', nameJa: '大阪歴史博物館', nameEn: 'Osaka Museum of History', description: '了解大阪千年歷史', latitude: 34.6873, longitude: 135.5261, address: '大阪府大阪市中央區大阪城', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '天滿橋', nameJa: '天満橋', nameEn: 'Temmabashi', description: '運河沿岸，春季賞櫻', latitude: 34.7013, longitude: 135.5119, address: '大阪府大阪市中央區天滿橋', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['自然景觀', '拍照景點'] },
    { name: '大阪港', nameJa: '大阪港', nameEn: 'Osaka Port', description: '港口區域，觀光船', latitude: 34.6413, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '臨空灣', nameJa: '臨空湾', nameEn: 'Rinku Bay', description: '關西機場對岸，夕陽美景', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['自然景觀', '秘境'] },
    { name: '岸和田城', nameJa: '岸和田城', nameEn: 'Kishiwada Castle', description: '泉州地區的古城', latitude: 34.4693, longitude: 135.4267, address: '大阪府岸和田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '高野山', nameJa: '高野山', nameEn: 'Koyasan', description: '真言宗總本山，宗教聖地', latitude: 34.3686, longitude: 135.5817, address: '和歌山縣伊都郡高野町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '歷史古蹟'] },
    { name: '關西機場', nameJa: '関西国際空港', nameEn: 'Kansai International Airport', description: '關西主要國際機場', latitude: 34.4273, longitude: 135.2444, address: '大阪府泉佐田市', languageBarrier: 1, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '住道', nameJa: '住道', nameEn: 'Suminodo', description: '大阪郊區的寧靜住宅區', latitude: 34.7512, longitude: 135.6212, address: '大阪府大東市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '枚方', nameJa: '枚方', nameEn: 'Hirakata', description: '枚方公園遊樂園', latitude: 34.8135, longitude: 135.6503, address: '大阪府枚方市', languageBarrier: 3, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '千里', nameJa: '千里', nameEn: 'Senri', description: '大阪北部新市鎮', latitude: 34.8212, longitude: 135.5238, address: '大阪府吹田市', languageBarrier: 3, prefectureId: osaka.id, categories: ['購物'] },
    { name: '中之島公園', nameJa: '中之島公園', nameEn: 'Nakanoshima Park', description: '大阪市中心的綠洲', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '大阪天滿宮', nameJa: '大阪天満宮', nameEn: 'Osaka Tenmangu', description: '求學業著名的神社', latitude: 34.7153, longitude: 135.5017, address: '大阪府大阪市北區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '新世界串炸', nameJa: '新世界串カツ', nameEn: 'Shinsekai Kushi-katsu', description: '通天閣附近的必吃美食', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 3, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    { name: '大阪燒', nameJa: 'お好み焼き', nameEn: 'Okonomiyaki', description: '大阪靈魂美食', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    { name: '章魚燒', nameJa: 'たこ焼き', nameEn: 'Takoyaki', description: '章魚小丸子發源地', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    // 京都景點 (40個)
    { name: '清水寺', nameJa: '清水寺', nameEn: 'Kiyomizu-dera', description: '世界遺產，音律舞台', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '金閣寺', nameJa: '金閣寺', nameEn: 'Kinkaku-ji', description: '世界遺產，黃金閣樓', latitude: 35.0394, longitude: 135.7292, address: '京都府京都市北區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '嵐山', nameJa: '嵐山', nameEn: 'Arashiyama', description: '渡月橋、竹林，京都代表景點', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '拍照景點'] },
    { name: '祇園', nameJa: '祇園', nameEn: 'Gion', description: '藝伎街，傳統町家', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['文化體驗', '拍照景點'] },
    { name: '八坂神社', nameJa: '八坂神社', nameEn: 'Yasaka Shrine', description: '祇園信仰中心', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '東福寺', nameJa: '東福寺', nameEn: 'Tofuku-ji', description: '京都最大禪寺，紅葉名勝', latitude: 35.0094, longitude: 135.7729, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '南禪寺', nameJa: '南禅寺', nameEn: 'Nanzen-ji', description: '禪宗寺廟，絕美庭院', latitude: 35.0114, longitude: 135.7953, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '蹴上', nameJa: '蹴上', nameEn: 'Keage', description: '廢棄鐵道，賞櫻秘境', latitude: 35.0114, longitude: 135.7953, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '拍照景點'] },
    { name: '平安神宮', nameJa: '平安神宮', nameEn: 'Heian Shrine', description: '守護京都的神社', latitude: 35.0114, longitude: 135.7853, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '三十三間堂', nameJa: '三十三間堂', nameEn: 'Sanjusangendo', description: '千手觀音菩薩像', latitude: 35.0012, longitude: 135.7912, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '醍醐寺', nameJa: '醍醐寺', nameEn: 'Daigo-ji', description: '真言宗醍醐派總本山', latitude: 34.9451, longitude: 135.8523, address: '京都府京都市伏見區', languageBarrier: 3, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '平等院', nameJa: '平等院', nameEn: 'Byodo-in', description: '世界遺產，鳳凰堂', latitude: 34.8948, longitude: 135.8034, address: '京都府宇治市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '宇治', nameJa: '宇治', nameEn: 'Uji', description: '抹茶故鄉，源氏物語舞台', latitude: 34.8948, longitude: 135.8034, address: '京都府宇治市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['美食', '文化體驗'] },
    { name: '奈良公園', nameJa: '奈良公園', nameEn: 'Nara Park', description: '梅花鹿樂園，東大寺', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 1, prefectureId: kyoto.id, categories: ['自然景觀', '歷史古蹟'] },
    { name: '東大寺', nameJa: '東大寺', nameEn: 'Todai-ji', description: '世界最大木結構建築', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '興福寺', nameJa: '興福寺', nameEn: 'Kofuku-ji', description: '奈良五重塔', latitude: 34.6851, longitude: 135.8048, address: '奈良縣奈良市', languageBarrier: 2, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '渡月橋', nameJa: '渡月橋', nameEn: 'Togetsu-kyo', description: '嵐山象徵，賞櫻秋楓', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['拍照景點', '自然景觀'] },
    { name: '竹林小徑', nameJa: '竹林の小径', nameEn: 'Bamboo Grove', description: '天龍寺旁的竹林步道', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['自然景觀', '秘境'] },
    { name: '野宮神社', nameJa: '野宮神社', nameEn: 'Nonomiya Shrine', description: '竹林中的小神社', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '天龍寺', nameJa: '天龍寺', nameEn: 'Tenryu-ji', description: '臨濟宗天龍寺派總本山', latitude: 35.0094, longitude: 135.6672, address: '京都府京都市右京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '永觀堂', nameJa: '永観堂', nameEn: 'Eikan-do', description: '紅葉名勝，賞楓首選', latitude: 35.0264, longitude: 135.7957, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '自然景觀'] },
    { name: '高台寺', nameJa: '高台寺', nameEn: 'Kodai-ji', description: '豐臣秀吉夫人創建', latitude: 34.9949, longitude: 135.7850, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '建仁寺', nameJa: '建仁寺', nameEn: 'Kennin-ji', description: '京都最古禪寺', latitude: 35.0037, longitude: 135.7786, address: '京都府京都市東山區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '秘境'] },
    { name: '二條城', nameJa: '二条城', nameEn: 'Nijo Castle', description: '世界遺產，幕府將軍府', latitude: 35.0143, longitude: 135.7476, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '京都御所', nameJa: '京都御所', nameEn: 'Kyoto Imperial Palace', description: '舊皇室居城', latitude: 35.0254, longitude: 135.7621, address: '京都府京都市上京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '下鴨神社', nameJa: '下鴨神社', nameEn: 'Shimogamo Shrine', description: '世界遺產，賀茂神社', latitude: 35.0376, longitude: 135.7712, address: '京都府京都市左京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '上賀茂神社', nameJa: '上賀茂神社', nameEn: 'Kamigamo Shrine', description: '世界遺產，賀茂神社', latitude: 35.0376, longitude: 135.7712, address: '京都府京都市北區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '貴船', nameJa: '貴船', nameEn: 'Kibune', description: '夏季川床料理勝地', latitude: 35.0612, longitude: 135.7223, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '美食'] },
    { name: '鞍馬', nameJa: '鞍馬', nameEn: 'Kurama', description: '鞍馬山，自然能量景點', latitude: 35.0612, longitude: 135.7223, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '自然景觀'] },
    { name: '比叡山', nameJa: '比叡山', nameEn: 'Mount Hiei', description: '延曆寺，佛教聖地', latitude: 35.0683, longitude: 135.7612, address: '京都府京都市左京區', languageBarrier: 3, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '歷史古蹟'] },
    { name: '北野天滿宮', nameJa: '北野天滿宮', nameEn: 'Kitano Tenmangu', description: '學問之神，梅花著名', latitude: 35.0312, longitude: 135.7112, address: '京都府京都市上京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '西本願寺', nameJa: '西本願寺', nameEn: 'Nishi Hongan-ji', description: '淨土真宗本願寺派', latitude: 35.0143, longitude: 135.7476, address: '京都府京都市下京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '東本願寺', nameJa: '東本願寺', nameEn: 'Higashi Hongan-ji', description: '淨土真宗東本願寺派', latitude: 35.0119, longitude: 135.7601, address: '京都府京都市下京區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['歷史古蹟'] },
    { name: '錦市場', nameJa: '錦市場', nameEn: 'Nishiki Market', description: '京都廚房，400年歷史', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中京區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['美食', '購物'] },
    { name: '河原町', nameJa: '河原町', nameEn: 'Kawaramachi', description: '京都最熱鬧商圈', latitude: 35.0062, longitude: 135.7676, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '四條', nameJa: '四条', nameEn: 'Shijo', description: '京都主要大道', latitude: 35.0037, longitude: 135.7676, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '烏丸', nameJa: '烏丸', nameEn: 'Karasuma', description: '烏丸線樞紐', latitude: 35.0037, longitude: 135.7612, address: '京都府京都市中央區', languageBarrier: 1, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['購物'] },
    { name: '伏見稻荷', nameJa: '伏見稲荷', nameEn: 'Fushimi Inari', description: '千本鳥居，狐狸神社', latitude: 34.9671, longitude: 135.7727, address: '京都府京都市伏見區', languageBarrier: 1, prefectureId: kyoto.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '東福寺通天橋', nameJa: '東福寺通天橋', nameEn: 'Tofuku-ji Tsutenkyo', description: '虹色楓葉，絕景吊橋', latitude: 35.0094, longitude: 135.7729, address: '京都府京都市東山區', languageBarrier: 2, cityId: kyotoCity.id, prefectureId: kyoto.id, categories: ['秘境', '拍照景點'] },
  ];

  let created = 0;
  for (const spotData of newSpots) {
    const { categories: spotCategories, ...spotInfo } = spotData;
    try {
      const spot = await prisma.spot.create({ data: spotInfo });
      for (const catName of spotCategories) {
        if (catMap[catName]) {
          await prisma.spotCategory.create({ data: { spotId: spot.id, categoryId: catMap[catName] } });
        }
      }
      await prisma.reference.create({
        data: { spotId: spot.id, type: 'blog', title: `${spot.name} - 景點`, url: `https://example.com/${encodeURIComponent(spot.name)}`, source: 'Japan Gems', language: '中文', reliabilityScore: 70, quality: 'primary' }
      });
      created++;
      console.log(`✅ ${spot.name}`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total} (新增 ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
