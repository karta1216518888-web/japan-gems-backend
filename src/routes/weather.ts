import { FastifyInstance } from 'fastify';

const weatherCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30分鐘

export async function weatherRoutes(fastify: FastifyInstance) {
  // 獲取天氣資訊
  fastify.get('/', async (request) => {
    const { city = 'osaka' } = request.query as any;
    
    const cityCoords: Record<string, { lat: number; lng: number; name: string }> = {
      osaka: { lat: 34.6937, lng: 135.5025, name: '大阪' },
      kyoto: { lat: 35.0116, lng: 135.7681, name: '京都' },
      nara: { lat: 34.6851, lng: 135.8048, name: '奈良' }
    };
    
    const coords = cityCoords[city] || cityCoords.osaka;
    
    // 模擬天氣資料 (可用 wttr.in 替換)
    const now = Date.now();
    const cacheKey = city;
    
    if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp) < CACHE_TTL) {
      return weatherCache[cacheKey].data;
    }
    
    // 模擬天氣資料
    const weatherData = {
      location: coords.name,
      temperature: Math.round(15 + Math.random() * 10),
      condition: ['晴れ', '曇り', '雨'][Math.floor(Math.random() * 3)],
      humidity: Math.round(50 + Math.random() * 30),
      wind: Math.round(5 + Math.random() * 15),
      forecast: [
        { day: '今日', high: Math.round(20 + Math.random() * 5), low: Math.round(10 + Math.random() * 5), condition: '晴れ' },
        { day: '明日', high: Math.round(20 + Math.random() * 5), low: Math.round(10 + Math.random() * 5), condition: '曇り' },
        { day: '明後', high: Math.round(20 + Math.random() * 5), low: Math.round(10 + Math.random() * 5), condition: '晴れ' }
      ],
      updated: new Date().toISOString()
    };
    
    weatherCache[cacheKey] = { data: weatherData, timestamp: now };
    
    return weatherData;
  });
}
