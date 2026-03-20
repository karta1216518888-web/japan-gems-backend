import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding batch 4...');

  const osaka = await prisma.prefecture.findFirst({ where: { name: '大阪府' } });
  const kyoto = await prisma.prefecture.findFirst({ where: { name: '京都府' } });
  const osakaCity = await prisma.city.findFirst({ where: { name: '大阪市' } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: '京都市' } });

  if (!osaka || !kyoto || !osakaCity || !kyotoCity) { console.log('❌ Missing'); return; }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));

  const spots = [
    { name: '天滿橋', nameJa: '天満橋', nameEn: 'Temmabashi', description: '天満橋駅', latitude: 34.7013, longitude: 135.5119, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '北濱', nameJa: '北浜', nameEn: 'Kitahama', description: '金融街', latitude: 34.6908, longitude: 135.5051, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '淀屋橋', nameJa: '淀屋橋', nameEn: 'Yodoyabashi', description: '商務街', latitude: 34.6937, longitude: 135.5019, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '本町', nameJa: '本町', nameEn: 'Hommachi', description: '辦公街', latitude: 34.6873, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '心齋橋', nameJa: '心斎橋', nameEn: 'Shinsaibashi', description: '購物街', latitude: 34.6755, longitude: 135.5013, address: '大阪府大阪市中央區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '難波', nameJa: '難波', nameEn: 'Namba', description: '繁華街', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '日本橋', nameJa: '日本橋', nameEn: 'Nipponbashi', description: '電器街', latitude: 34.6681, longitude: 135.5074, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '新世界', nameJa: '新世界', nameEn: 'Shinsekai', description: '復古街', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 3, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食', '拍照景點'] },
    { name: '天王寺', nameJa: '天王寺', nameEn: 'Tennoji', description: '商業區', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物', '文化體驗'] },
    { name: '阿倍野', nameJa: 'あべの', nameEn: 'Abeno', description: '阿倍野Harukas', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物', '拍照景點'] },
    { name: '大正', nameJa: '大正', nameEn: 'Taisho', description: '大正區', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市大正區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '港', nameJa: '港', nameEn: 'Minato', description: '港區', latitude: 34.6413, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '住之江', nameJa: '住之江', nameEn: 'Suminoe', description: '住之江區', latitude: 34.6312, longitude: 135.4512, address: '大阪府大阪市住之江區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '住吉', nameJa: '住吉', nameEn: 'Sumiyoshi', description: '住吉大社', latitude: 34.6012, longitude: 135.4912, address: '大阪府大阪市住吉區', languageBarrier: 2, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '東住吉', nameJa: '東住吉', nameEn: 'HigashiSumiyoshi', description: '東住吉區', latitude: 34.6412, longitude: 135.5212, address: '大阪府大阪市東住吉區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '平野', nameJa: '平野', nameEn: 'Hirano', description: '平野區', latitude: 34.6512, longitude: 135.6012, address: '大阪府大阪市平野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '生野', nameJa: '生野', nameEn: 'Ikuno', description: '生野區', latitude: 34.6612, longitude: 135.5512, address: '大阪府大阪市生野區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '旭', nameJa: '旭', nameEn: 'Asahi', description: '旭區', latitude: 34.7112, longitude: 135.5212, address: '大阪府大阪市旭區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '城東', nameJa: '城東', nameEn: 'Joto', description: '城東區', latitude: 34.7112, longitude: 135.5512, address: '大阪府大阪市城東區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '鶴見', nameJa: '鶴見', nameEn: 'Tsurumi', description: '鶴見區', latitude: 34.7012, longitude: 135.5812, address: '大阪府大阪市鶴見區', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '阿倍野區', nameJa: '阿倍野区', nameEn: 'Abeno', description: '阿倍野區', latitude: 34.6412, longitude: 135.5112, address: '大阪府大阪市阿倍野區', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '住道', nameJa: '住道', nameEn: 'Suminodo', description: '住道駅', latitude: 34.7512, longitude: 135.6212, address: '大阪府大東市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '石切', nameJa: '石切', nameEn: 'Ishikiri', description: '石切溫泉', latitude: 34.7412, longitude: 135.6412, address: '大阪府東大阪市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '溫泉'] },
    { name: '八尾', nameJa: '八尾', nameEn: 'Yao', description: '八尾市', latitude: 34.6312, longitude: 135.6012, address: '大阪府八尾市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '柏原', nameJa: '柏原', nameEn: 'Kashihara', description: '柏原市', latitude: 34.5812, longitude: 135.6212, address: '大阪府柏原市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '羽曳野', nameJa: '羽曳野', nameEn: 'Habikino', description: '羽曳野市', latitude: 34.5512, longitude: 135.5912, address: '大阪府羽曳野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '富田林', nameJa: '富田林', nameEn: 'Tondabayashi', description: '富田林市', latitude: 34.5012, longitude: 135.6012, address: '大阪府富田林市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '河內長野', nameJa: '河内長野', nameEn: 'Kawachinagano', description: '河內長野市', latitude: 34.4512, longitude: 135.5612, address: '大阪府河內長野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '松原', nameJa: '松原', nameEn: 'Matsubara', description: '松原市', latitude: 34.5612, longitude: 135.5412, address: '大阪府松原市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '藤井寺', nameJa: '藤井寺', nameEn: 'Fujiidera', description: '藤井寺市', latitude: 34.5712, longitude: 135.5612, address: '大阪府藤井寺市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大阪巨蛋', nameJa: '大阪ドーム', nameEn: 'Kyocera Dome', description: '棒球場', latitude: 34.6712, longitude: 135.5112, address: '大阪府大阪市西区', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '臨空城', nameJa: '臨空城', nameEn: 'Rinku', description: '臨空城', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市', languageBarrier: 2, prefectureId: osaka.id, categories: ['購物'] },
    { name: '關西機場', nameJa: '関西空港', nameEn: 'KIX', description: '關西機場', latitude: 34.4273, longitude: 135.2444, address: '大阪府泉佐田市', languageBarrier: 1, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '泉佐野', nameJa: '泉佐野', nameEn: 'Izumisano', description: '泉佐野駅', latitude: 34.4112, longitude: 135.3212, address: '大阪府泉佐野市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '泉南', nameJa: '泉南', nameEn: 'Sennan', description: '泉南市', latitude: 34.3712, longitude: 135.2712, address: '大阪府泉南市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '貝塚', nameJa: '貝塚', nameEn: 'Kaizuka', description: '貝塚市', latitude: 34.4512, longitude: 135.3512, address: '大阪府貝塚市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '岸和田', nameJa: '岸和田', nameEn: 'Kishiwada', description: '岸和田市', latitude: 34.4693, longitude: 135.4267, address: '大阪府岸和田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['歷史古蹟'] },
    { name: '和泉', nameJa: '和泉', nameEn: 'Izumi', description: '和泉市', latitude: 34.4812, longitude: 135.4512, address: '大阪府和泉市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '高石', nameJa: '高石', nameEn: 'Takaishi', description: '高石市', latitude: 34.5112, longitude: 135.4312, address: '大阪府高石市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '忠岡', nameJa: '忠岡', nameEn: 'Tadaoka', description: '忠岡町', latitude: 34.5212, longitude: 135.4212, address: '大阪府忠岡町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '熊取', nameJa: '熊取', nameEn: 'Kumatori', description: '熊取町', latitude: 34.4012, longitude: 135.3012, address: '大阪府熊取町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '田尻', nameJa: '田尻', nameEn: 'Tajiri', description: '田尻町', latitude: 34.4212, longitude: 135.2912, address: '大阪府田尻町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '岬', nameJa: '岬', nameEn: 'Misaki', description: '岬町', latitude: 34.3512, longitude: 135.2512, address: '大阪府岬町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '自然景觀'] },
    { name: '太子', nameJa: '太子', nameEn: 'Taishi', description: '太子町', latitude: 34.5012, longitude: 135.6012, address: '大阪府太子町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '河南', nameJa: '河南', nameEn: 'Kanan', description: '河南町', latitude: 34.4512, longitude: 135.6212, address: '大阪府河南町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '千早赤阪', nameJa: '千早赤阪', nameEn: 'Chihayaakasaka', description: '千早赤阪村', latitude: 34.4212, longitude: 135.6512, address: '大阪府千早赤阪村', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '能勢', nameJa: '能勢', nameEn: 'Nose', description: '能勢町', latitude: 34.9512, longitude: 135.3412, address: '大阪府能勢町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境', '自然景觀'] },
    { name: '豐能', nameJa: '豊能', nameEn: 'Toyono', description: '豐能町', latitude: 34.9212, longitude: 135.4212, address: '大阪府豐能町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '池田市', nameJa: '池田', nameEn: 'Ikeda', description: '池田市', latitude: 34.8812, longitude: 135.4312, address: '大阪府池田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '吹田', nameJa: '吹田', nameEn: 'Suita', description: '吹田市', latitude: 34.7612, longitude: 135.5112, address: '大阪府吹田市', languageBarrier: 2, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '攝津', nameJa: '摂津', nameEn: 'Settsu', description: '攝津市', latitude: 34.7812, longitude: 135.5612, address: '大阪府攝津市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '島本', nameJa: '島本', nameEn: 'Shimamoto', description: '島本町', latitude: 34.8712, longitude: 135.6012, address: '大阪府島本町', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '高槻', nameJa: '高槻', nameEn: 'Takatsuki', description: '高槻市', latitude: 34.8512, longitude: 135.6212, address: '大阪府高槻市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '茨木', nameJa: '茨木', nameEn: 'Ibaraki', description: '茨木市', latitude: 34.8112, longitude: 135.5712, address: '大阪府茨木市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '枚方', nameJa: '枚方', nameEn: 'Hirakata', description: '枚方市', latitude: 34.8135, longitude: 135.6503, address: '大阪府枚方市', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '交野', nameJa: '交野', nameEn: 'Katano', description: '交野市', latitude: 34.7812, longitude: 135.6712, address: '大阪府交野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '寢屋川', nameJa: '寝屋川', nameEn: 'Neyagawa', description: '寢屋川市', latitude: 34.7612, longitude: 135.6312, address: '大阪府寢屋川市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '守口', nameJa: '守口', nameEn: 'Moriguchi', description: '守口市', latitude: 34.7612, longitude: 135.6412, address: '大阪府守口市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '門真', nameJa: '門真', nameEn: 'Kadoma', description: '門真市', latitude: 34.7512, longitude: 135.6312, address: '大阪府門真市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大東', nameJa: '大東', nameEn: 'Daito', description: '大東市', latitude: 34.6712, longitude: 135.6212, address: '大阪府大東市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '四條畷', nameJa: '四条畷', nameEn: 'Shijonawate', description: '四條畷市', latitude: 34.7312, longitude: 135.6512, address: '大阪府四條畷市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '東大阪', nameJa: '東大阪', nameEn: 'Higashiosaka', description: '東大阪市', latitude: 34.6712, longitude: 135.6512, address: '大阪府東大阪市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '八尾', nameJa: '八尾', nameEn: 'Yao', description: '八尾市', latitude: 34.6312, longitude: 135.6012, address: '大阪府八尾市', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '柏原', nameJa: '柏原', nameEn: 'Kashihara', description: '柏原市', latitude: 34.5812, longitude: 135.6212, address: '大阪府柏原市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '羽曳野', nameJa: '羽曳野', nameEn: 'Habikino', description: '羽曳野市', latitude: 34.5512, longitude: 135.5912, address: '大阪府羽曳野市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '藤井寺', nameJa: '藤井寺', nameEn: 'Fujiidera', description: '藤井寺市', latitude: 34.5712, longitude: 135.5612, address: '大阪府藤井寺市', languageBarrier: 3, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '大阪城天守閣', nameJa: '大阪城天守閣', nameEn: 'OsakaCastle', description: '大阪城', latitude: 34.6873, longitude: 135.5261, address: '大阪府大阪市中央區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['歷史古蹟', '拍照景點'] },
    { name: '大阪歷史博物館', nameJa: '大阪歴史博物館', nameEn: 'OsakaHistory', description: '大阪歷史', latitude: 34.6873, longitude: 135.5261, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '道頓堀', nameJa: '道頓堀', nameEn: 'Dotonbori', description: '美食街', latitude: 34.6687, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食', '拍照景點'] },
    { name: '黑門市場', nameJa: '黒門市場', nameEn: 'Kuromon', description: '市場', latitude: 34.6681, longitude: 135.5074, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    { name: '新世界串炸', nameJa: '串カツ', nameEn: 'Kushikatsu', description: '美食', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['美食'] },
    { name: '通天閣', nameJa: '通天閣', nameEn: 'Tsutenkaku', description: '展望台', latitude: 34.6526, longitude: 135.5063, address: '大阪府大阪市浪速區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '梅田藍天大廈', nameJa: '梅田スカイビル', nameEn: 'UmedaSky', description: '展望台', latitude: 34.7055, longitude: 135.4983, address: '大阪府大阪市北區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: 'hep Five', nameJa: 'hep Five', nameEn: 'hep Five', description: '摩天輪', latitude: 34.7055, longitude: 135.4983, address: '大阪府大阪市北區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: 'Grand Front', nameJa: 'グランフロント', nameEn: 'GrandFront', description: '購物中心', latitude: 34.7055, longitude: 135.4983, address: '大阪府大阪市北區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '臨空城Outlet', nameJa: '臨空城アウトレット', nameEn: 'RinkuOutlet', description: 'Outlet', latitude: 34.4317, longitude: 135.3144, address: '大阪府泉佐野市', languageBarrier: 1, prefectureId: osaka.id, categories: ['購物'] },
    { name: '天王寺公園', nameJa: '天王寺公園', nameEn: 'TennojiPark', description: '公園', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['自然景觀'] },
    { name: '天王寺动物园', nameJa: '天王寺动物园', nameEn: 'TennojiZoo', description: '动物园', latitude: 34.6466, longitude: 135.5139, address: '大阪府大阪市天王寺區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '新齋橋', nameJa: '新斎橋', nameEn: 'Shinsaibashi', description: '心齋橋', latitude: 34.6755, longitude: 135.5013, address: '大阪府大阪市中央區', languageBarrier: 1, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['購物'] },
    { name: '橘大橋', nameJa: '橘大橋', nameEn: 'Tachibana', description: '橋', latitude: 34.6712, longitude: 135.5012, address: '大阪府大阪市中央區', languageBarrier: 2, cityId: osakaCity.id, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: 'OBP', nameJa: 'OBP', nameEn: 'OsakaBusiness', description: '商務區', latitude: 34.6712, longitude: 135.4512, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['秘境'] },
    { name: '天保山', nameJa: '天保山', nameEn: 'Tempozan', description: '天保山', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '海遊館', nameJa: '海遊館', nameEn: 'Kaiyukan', description: '水族館', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['文化體驗'] },
    { name: '天保山摩天輪', nameJa: '天保山大観覧車', nameEn: 'TempozanWheel', description: '摩天輪', latitude: 34.6513, longitude: 135.4313, address: '大阪府大阪市港區', languageBarrier: 2, prefectureId: osaka.id, categories: ['拍照景點'] },
    { name: '環球影城', nameJa: 'USJ', nameEn: 'Universal', description: '主題樂園', latitude: 34.6654, longitude: 135.4323, address: '大阪府大阪市此花區', languageBarrier: 1, prefectureId: osaka.id, categories: ['文化體驗'] },
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
      if (created % 20 === 0) console.log(`Progress: ${created}...`);
    } catch (e: any) {
      if (e.code !== 'P2002') console.log(`❌ ${spotData.name}: ${e.message}`);
    }
  }

  const total = await prisma.spot.count();
  console.log(`\n📊 Total spots: ${total} (new: ${created})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
