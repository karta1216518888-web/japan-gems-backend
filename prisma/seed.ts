import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 景點資料列表
const spotsData = [
  // === 大阪府 (Osaka) ===
  {
    name: '箕面大滝',
    nameJa: '箕面大滝',
    nameEn: 'Minoo Waterfall',
    nameZh: '箕面瀑布',
    prefecture: '大阪府',
    city: '箕面市',
    description: '位於箕面公園內的知名瀑布，是大阪近郊的自然秘境。秋天紅葉景色優美，是在地人喜愛的健行景點。',
    localTip: '建議清晨前往，可以避開人潮。公園內有溫泉設施，可以泡腳休息。',
    latitude: 34.8431,
    longitude: 135.4694,
    address: '大阪府箕面市箕面公園',
    categories: ['自然景觀', '秘境'],
    languageBarrier: 4,
    paymentAccept: ['cash', 'suica']
  },
  {
    name: '空堀商店街',
    nameJa: '空堀商店街',
    nameEn: 'Sorahori Shopping Street',
    nameZh: '空堀商業街',
    prefecture: '大阪府',
    city: '大阪市',
    description: '古き良き大阪の面影を感じられる場所で、路地裏には隠れ家カフェが点在しています。',
    localTip: '朝早く行くのおすすめ。地元の人が集まる Coffee Shop がある。',
    latitude: 34.6686,
    longitude: 135.5032,
    address: '大阪府大阪市中央區空堀筋',
    categories: ['購物', '文化體驗'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '少彦名神社',
    nameJa: '少彦名神社',
    nameEn: 'Sukunahikona Shrine',
    nameZh: '少彥名神社',
    prefecture: '大阪府',
    city: '大阪市',
    description: '神農さんと呼ばれる歴史と文化触れることができる穴場スポット。',
    localTip: '病除け効果があるとして雰囲。境内の売店のおすすめは甘酒。',
    latitude: 34.6732,
    longitude: 135.5113,
    address: '大阪府大阪市中央區道修町',
    categories: ['歷史古蹟', '文化體驗'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '富田林寺内町',
    nameJa: '富田林寺内町',
    nameEn: 'Tondabayashi Shinaimachi',
    nameZh: '富田林寺內町',
    prefecture: '大阪府',
    city: '富田林市',
    description: '時が止まったような歴史的な町並みが広がる穴場。保存状態のよい商家建築が立ち並ぶ。',
    localTip: '靴下で歩くのが一番おすすめ。レンタル自転車の場所がある。',
    latitude: 34.4999,
    longitude: 135.6003,
    address: '大阪府富田林市寺内町',
    categories: ['歷史古蹟', '秘境'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '天神橋筋商店会',
    nameJa: '天神橋筋商店会',
    nameEn: 'Tenjinbashi Shopping Street',
    nameZh: '天神橋筋商店街',
    prefecture: '大阪府',
    city: '大阪市',
    description: '全线約2.6kmにもわたる直線型のアーケード商店街の長さ日本一。',
    localTip: '食べ歩きおすすめ！朝からやっている甘味処がある。',
    latitude: 34.7111,
    longitude: 135.5114,
    address: '大阪府大阪市北区天神橋',
    categories: ['購物', '美食'],
    languageBarrier: 2,
    paymentAccept: ['cash', 'suica']
  },
  {
    name: '中之島・北浜エリア',
    nameJa: '中之島・北浜エリア',
    nameEn: 'Nakanoshima & Kitahama Area',
    nameZh: '中之島・北浜區域',
    prefecture: '大阪府',
    city: '大阪市',
    description: '中之島図書館 للأطفالや大阪中之島美術館など、ゆっくりと遊べるスポットが集結。',
    localTip: '週末のフリーライブラリーはおすすめ。川沿いの散歩が気持ちいい。',
    latitude: 34.6940,
    longitude: 135.5030,
    address: '大阪府大阪市北区中之島',
    categories: ['文化體驗', '拍照景點'],
    languageBarrier: 3,
    paymentAccept: ['cash', 'visa']
  },
  {
    name: '摂津峡',
    nameJa: '摂津峡',
    nameEn: 'Setstsukyo',
    nameZh: '攝津峽',
    prefecture: '大阪府',
    city: '高槻市',
    description: '大阪の奥座敷と呼ばれる自然の寶庫。ハイキングコース齊全。',
    localTip: '春は桜、秋は紅葉が素晴らしい。登山初心者でも楽しめる。',
    latitude: 34.8865,
    longitude: 135.6165,
    address: '大阪府高槻市津之江町',
    categories: ['自然景觀', '秘境'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '大阪城公園',
    nameJa: '大阪城公園',
    nameEn: 'Osaka Castle Park',
    nameZh: '大阪城公園',
    prefecture: '大阪府',
    city: '大阪市',
    description: '都会のオアシスで深呼吸できる場所。 Morenaの自然スポット也在其中。',
    localTip: '晨练推荐。跑步者和当地人聚集的热门地点。',
    latitude: 34.6873,
    longitude: 135.5260,
    address: '大阪府大阪市中央區大阪城',
    categories: ['自然景觀', '歷史古蹟'],
    languageBarrier: 2,
    paymentAccept: ['cash', 'suica', 'visa']
  },
  {
    name: '猪名川河川敷サイクリンクロード',
    nameJa: '猪名川河川敷サイクリンクロード',
    nameEn: 'Inagawa Cycling Road',
    nameZh: '豬名川自行車道',
    prefecture: '大阪府',
    city: '池田市',
    description: '風を感じながら自然を満喫できる穴場。',
    localTip: ' rental bicycle available nearby.',
    latitude: 34.8220,
    longitude: 135.4280,
    address: '大阪府池田市内猪名川河川敷',
    categories: ['自然景觀', '運動'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },

  // === 京都府 (Kyoto) ===
  {
    name: '伊根の舟屋',
    nameJa: '伊根の舟屋',
    nameEn: 'Ine Funaya',
    nameZh: '伊根舟屋',
    prefecture: '京都府',
    city: '伊根町',
    description: '京都北部伊根町的傳統舟屋群，面朝日本海，保存傳統的生活方式。重要傳統建造物群保存地區。',
    localTip: '建議住在舟屋一晚，清晨和傍晚的景色最美。品嚐當地的海鮮料理。',
    latitude: 35.6818,
    longitude: 135.3107,
    address: '京都府与謝郡伊根町字伊根',
    categories: ['文化體驗', '秘境'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '常寂光寺',
    nameJa: '常寂光寺',
    nameEn: 'Jojakko-ji Temple',
    nameZh: '常寂光寺',
    prefecture: '京都府',
    city: '京都市',
    description: '嵐山にある日蓮宗の寺院で、紅葉の名所として知られています。秋には境内が赤や金のグラデーションに染まり、絵画のような景色が広がります。',
    localTip: '建議清晨或傍晚前往，避開人潮。',
    latitude: 35.0094,
    longitude: 135.6669,
    address: '京都府京都市右京區嵐山',
    categories: ['歷史古蹟', '自然景觀', '拍照景點'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '建仁寺',
    nameJa: '建仁寺',
    nameEn: 'Kennin-ji Temple',
    nameZh: '建仁寺',
    prefecture: '京都府',
    city: '京都市',
    description: '本坊の風神雷神図（複製）や法堂の天井一面に描かれた双龍図など、様々な美術品が所蔵されているお寺。',
    localTip: '美術品をじっくり堪能したい方におすすめ。',
    latitude: 35.0036,
    longitude: 135.7785,
    address: '京都府京都市東山区建仁寺',
    categories: ['歷史古蹟', '文化體驗'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '廬山寺',
    nameJa: '廬山寺',
    nameEn: 'Rozan-ji Temple',
    nameZh: '廬山寺',
    prefecture: '京都府',
    city: '京都市',
    description: '『源氏物語』が生まれた地としてゆかりがあり、「源氏の庭」と呼ばれる庭園があります。',
    localTip: '6月中旬から9月中旬には紫色の桔梗の花が見ごろを迎えます。',
    latitude: 35.0116,
    longitude: 135.7632,
    address: '京都府京都市上京區廬山寺',
    categories: ['歷史古蹟', '自然景觀'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '岡崎神社',
    nameJa: '岡崎神社',
    nameEn: 'Okazaki Shrine',
    nameZh: '岡崎神社',
    prefecture: '京都府',
    city: '京都市',
    description: '可愛らしいうさぎの像で知られる神社で、若い女性にも人気ですが、比較的混雑が少ない穴場として紹介されています。',
    localTip: '兔子籤很受歡迎。',
    latitude: 35.0114,
    longitude: 135.7723,
    address: '京都府京都市左京區岡崎',
    categories: ['歷史古蹟', '文化體驗'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '石塀小路',
    nameJa:石塀小路',
    nameEn: 'Ishibei Koji',
    nameZh: '石疊小路',
    prefecture: '京都府',
    city: '京都市',
    description: '「The 京都」を味わえる、細い路地にある穴場スポット。昼間だけでなく、夜には玄関などの灯りがつき、また違った風情を楽しめます。',
    localTip: '夜景拍照推薦。',
    latitude: 35.0039,
    longitude: 135.7786,
    address: '京都府京都市東山區石疊',
    categories: ['拍照景點', '秘境'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: 'かやぶきの里・美山',
    nameJa: 'かやぶきの里・美山',
    nameEn: 'Kayabuki no Sato Miyama',
    nameZh: '茅草之里・美山',
    prefecture: '京都府',
    city: '南丹市',
    description: '京都府南丹市美山町にある、昔ながらのかやぶき屋根の集落で、日本の原風景を感じられる日帰り旅行におすすめのスポット。',
    localTip: '建議自駕或預約巴士。',
    latitude: 35.2933,
    longitude: 135.4944,
    address: '京都府南丹市美山町',
    categories: ['文化體驗', '秘境', '自然景觀'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '大原三千院',
    nameJa: '大原三千院',
    nameEn: 'Ohara Sanzen-in',
    nameZh: '大原三千院',
    prefecture: '京都府',
    city: '京都市',
    description: '市内中心部からバスで約1時間かかりますが、喧騒から離れた静寂な苔庭とわらべ地蔵が心を癒やしてくれます。',
    localTip: '建議安排半天時間。',
    latitude: 35.0569,
    longitude: 135.7972,
    address: '京都府京都市左京區大原',
    categories: ['歷史古蹟', '自然景觀'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '萬福寺',
    nameJa: '萬福寺',
    nameEn: 'Manpuku-ji Temple',
    nameZh: '萬福寺',
    prefecture: '京都府',
    city: '宇治市',
    description: '宇治の有名スポットから離れた黄檗宗の大本山で、中国明朝様式の伽藍配置が特徴です。広大な敷地でゆったりと静かに散策できます。',
    localTip: '遠離人群的寧靜選擇。',
    latitude: 34.8911,
    longitude: 135.7972,
    address: '京都府宇治市五ヶ庄',
    categories: ['歷史古蹟', '秘境'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '西芳寺',
    nameJa: '西芳寺',
    nameEn: 'Saiho-ji Temple',
    nameZh: '西芳寺',
    prefecture: '京都府',
    city: '京都市',
    description: '著名的苔寺，需要提前預約。',
    localTip: '要提前幾週預約。',
    latitude: 35.0275,
    longitude: 135.6692,
    address: '京都府京都市西京區松尾',
    categories: ['歷史古蹟', '自然景觀'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '無鄰菴',
    nameJa: '無鄰菴',
    nameEn: 'Murin-an Garden',
    nameZh: '無鄰庵',
    prefecture: '京都府',
    city: '京都市',
    description: '需要提前預約的日式庭院。',
    localTip: '提前預約。',
    latitude: 35.0136,
    longitude: 135.7589,
    address: '京都府京都市左京區南禪寺',
    categories: ['自然景觀', '拍照景點'],
    languageBarrier: 4,
    paymentAccept: ['cash']
  },
  {
    name: '琵琶湖疏水沿い',
    nameJa: '琵琶湖疏水沿い',
    nameEn: 'Biwa Canal Path',
    nameZh: '琵琶湖疏水沿岸',
    prefecture: '京都府',
    city: '京都市',
    description: 'のんびりと川沿いを散歩でき、ラーメン激戦區也在附近。',
    localTip: '當地拉麵激戰區。',
    latitude: 35.0211,
    longitude: 135.7656,
    address: '京都府京都市',
    categories: ['自然景觀', '美食'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  },
  {
    name: '古川町商店会',
    nameJa: '古川市商店会',
    nameEn: 'Furukawa Shopping Street',
    nameZh: '古川商店街',
    prefecture: '京都府',
    city: '京都市',
    description: '千個以上のパステルランタンが吊るされ、インスタ映えスポットとしても注目されています。',
    localTip: '拍照打卡聖地。',
    latitude: 35.0032,
    longitude: 135.7708,
    address: '京都府京都市東山區古川',
    categories: ['拍照景點', '購物'],
    languageBarrier: 3,
    paymentAccept: ['cash']
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // 建立地域
  const kansai = await prisma.region.upsert({
    where: { name: '關西地方' },
    update: {},
    create: {
      name: '關西地方',
      nameJa: '関西地方',
      nameEn: 'Kansai'
    }
  });

  // 建立都道府縣
  const osaka = await prisma.prefecture.upsert({
    where: { name: '大阪府' },
    update: {},
    create: {
      name: '大阪府',
      nameJa: '大阪府',
      nameEn: 'Osaka',
      regionId: kansai.id
    }
  });

  const kyoto = await prisma.prefecture.upsert({
    where: { name: '京都府' },
    update: {},
    create: {
      name: '京都府',
      nameJa: '京都府',
      nameEn: 'Kyoto',
      regionId: kansai.id
    }
  });

  // 建立城市
  const osakaCity = await prisma.city.upsert({
    where: { name: '大阪市' },
    update: {},
    create: {
      name: '大阪市',
      nameJa: '大阪市',
      nameEn: 'Osaka City',
      prefectureId: osaka.id
    }
  });

  const kyotoCity = await prisma.city.upsert({
    where: { name: '京都市' },
    update: {},
    create: {
      name: '京都市',
      nameJa: '京都市',
      nameEn: 'Kyoto City',
      prefectureId: kyoto.id
    }
  });

  // 獲取分類
  const categoryNames = ['自然景觀', '文化體驗', '歷史古蹟', '秘境', '拍照景點', '購物', '溫泉', '美食', '運動'];
  const categories = await Promise.all(
    categoryNames.map(name => 
      prisma.category.findUnique({ where: { name } })
    )
  );

  // 建立景點
  for (const spotData of spotsData) {
    const cityName = spotData.city;
    let city;
    
    if (cityName === '大阪市') {
      city = osakaCity;
    } else if (cityName === '京都市') {
      city = kyotoCity;
    } else {
      // 其他城市創建
      city = await prisma.city.upsert({
        where: { name: cityName },
        update: {},
        create: {
          name: cityName,
          nameJa: cityName,
          prefectureId: spotData.prefecture === '大阪府' ? osaka.id : kyoto.id
        }
      });
    }

    const spot = await prisma.spot.upsert({
      where: { id: `spot-${spotData.name}` },
      update: {},
      create: {
        id: `spot-${spotData.name}`,
        name: spotData.name,
        nameJa: spotData.nameJa,
        nameEn: spotData.nameEn,
        nameZh: spotData.nameZh,
        description: spotData.description,
        localTip: spotData.localTip,
        latitude: spotData.latitude,
        longitude: spotData.longitude,
        address: spotData.address,
        languageBarrier: spotData.languageBarrier,
        paymentAccept: spotData.paymentAccept,
        prefectureId: spotData.prefecture === '大阪府' ? osaka.id : kyoto.id,
        cityId: city.id,
        regionId: kansai.id
      }
    });

    // 關聯分類
    for (const catName of spotData.categories) {
      const cat = categories.find(c => c?.name === catName);
      if (cat) {
        await prisma.spotCategory.upsert({
          where: { spotId_categoryId: { spotId: spot.id, categoryId: cat.id } },
          update: {},
          create: { spotId: spot.id, categoryId: cat.id }
        });
      }
    }

    // 建立範例參考資料
    await prisma.reference.upsert({
      where: { id: `ref-${spotData.name}` },
      update: {},
      create: {
        id: `ref-${spotData.name}`,
        spotId: spot.id,
        type: 'blog',
        title: `${spotData.name} - 在地人推薦`,
        url: `https://example.com/${encodeURIComponent(spotData.name)}`,
        source: 'Japan Hidden Gems 資料庫',
        language: '中文',
        reliabilityScore: Math.floor(Math.random() * 30) + 70, // 70-100
        quality: 'primary'
      }
    });
  }

  console.log('✅ Seeding complete!');
  console.log(`📍 Total spots: ${spotsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
