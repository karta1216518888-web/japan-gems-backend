import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const searchCache: { data: any[]; time: number } = { data: [], time: 0 };

export async function spotRoutes(fastify: FastifyInstance) {
  
  // 獲取所有景點 (支援分頁、篩選、排序)
  fastify.get('/', async (request) => {
    const { city, category, search, page = '1', limit = '20', sort = 'newest' } = request.query as any;
    
    const where: any = { status: 'active' };
    if (city) where.city = { name: city };
    if (category) where.categories = { some: { category: { name: category } } };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameJa: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'name') orderBy = { name: 'asc' };
    if (sort === 'nameJa') orderBy = { nameJa: 'asc' };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [spots, total] = await Promise.all([
      prisma.spot.findMany({
        where,
        include: { city: true, prefecture: true, categories: { include: { category: true } }, photos: { where: { isPrimary: true } }, _count: { select: { references: true } } },
        skip, take: parseInt(limit), orderBy
      }),
      prisma.spot.count({ where })
    ]);
    
    return { data: spots, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } };
  });

  // 獲取單一景點詳情
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any;
    const spot = await prisma.spot.findUnique({
      where: { id },
      include: { city: true, prefecture: true, categories: { include: { category: true } }, references: true, photos: true }
    });
    if (!spot) return { error: 'Spot not found' };
    return { data: spot };
  });

  // 隨機景點
  fastify.get('/random', async () => {
    const count = await prisma.spot.count({ where: { status: 'active' } });
    const random = Math.floor(Math.random() * count);
    const spots = await prisma.spot.findMany({ where: { status: 'active' }, include: { prefecture: true }, skip: random, take: 5 });
    return { data: spots };
  });

  // 熱門景點
  fastify.get('/popular', async () => {
    const spots = await prisma.spot.findMany({
      where: { status: 'active' },
      include: { _count: { select: { references: true } }, prefecture: true },
      orderBy: { references: { _count: 'desc' } },
      take: 10
    });
    return { data: spots };
  });

  // 統計
  fastify.get('/stats', async () => {
    const total = await prisma.spot.count({ where: { status: 'active' } });
    const byPrefecture = await prisma.spot.groupBy({ by: ['prefectureId'], where: { status: 'active' }, _count: true });
    const byCategory = await prisma.spotCategory.groupBy({ by: ['categoryId'], _count: true });
    const prefectureNames = await Promise.all(byPrefecture.map(p => prisma.prefecture.findUnique({ where: { id: p.prefectureId } })));
    return { total, byPrefecture: byPrefecture.map((p, i) => ({ name: prefectureNames[i]?.name || 'Unknown', count: p._count })), categoriesCount: byCategory.length };
  });

  // 附近景點
  fastify.get('/nearby', async (request) => {
    const { lat, lng, radius = '10' } = request.query as any;
    const r = parseFloat(radius);
    const spots = await prisma.spot.findMany({ where: { status: 'active' }, include: { prefecture: true } });
    const nearby = spots.filter(s => {
      const d = Math.sqrt(Math.pow((s.latitude - parseFloat(lat)) * 111, 2) + Math.pow((s.longitude - parseFloat(lng)) * 111 * Math.cos(s.latitude), 2));
      return d <= r;
    }).slice(0, 10);
    return { data: nearby };
  });

  // 搜尋建議
  fastify.get('/suggest', async (request) => {
    const { q = '' } = request.query as any;
    const now = Date.now();
    
    // Cache for 5 minutes
    if (!searchCache.data.length || now - searchCache.time > 5 * 60 * 1000) {
      const spots = await prisma.spot.findMany({
        select: { id: true, name: true, nameJa: true, prefecture: { select: { name: true } } }
      });
      searchCache.data = spots;
      searchCache.time = now;
    }
    
    const query = q.toLowerCase();
    const results = searchCache.data
      .filter(s => s.name.toLowerCase().includes(query) || s.nameJa.includes(query))
      .slice(0, 10)
      .map(s => ({ id: s.id, name: s.name, nameJa: s.nameJa, city: s.prefecture?.name }));
    
    return { data: results };
  });
}
