import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function spotRoutes(fastify: FastifyInstance) {
  // 獲取所有景點 (支援分頁、篩選)
  fastify.get('/', async (request) => {
    const { 
      city, 
      category, 
      search, 
      page = '1', 
      limit = '20' 
    } = request.query as any;
    
    const where: any = { status: 'active' };
    
    if (city) {
      where.city = { name: city };
    }
    
    if (category) {
      where.categories = {
        some: { category: { name: category } }
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameJa: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [spots, total] = await Promise.all([
      prisma.spot.findMany({
        where,
        include: {
          city: true,
          prefecture: true,
          categories: { include: { category: true } },
          photos: { where: { isPrimary: true } },
          _count: { select: { references: true } }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.spot.count({ where })
    ]);
    
    return {
      data: spots,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  });
  
  // 獲取單一景點詳情
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any;
    
    const spot = await prisma.spot.findUnique({
      where: { id },
      include: {
        city: true,
        prefecture: true,
        region: true,
        categories: { include: { category: true } },
        photos: true,
        references: {
          orderBy: { reliabilityScore: 'desc' }
        }
      }
    });
    
    if (!spot) {
      throw { statusCode: 404, message: 'Spot not found' };
    }
    
    return spot;
  });
  
  // 搜尋景點
  fastify.get('/search', async (request) => {
    const { q } = request.query as any;
    
    if (!q || q.length < 2) {
      return { data: [] };
    }
    
    const spots = await prisma.spot.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { nameJa: { contains: q, mode: 'insensitive' } },
          { nameEn: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } }
        ]
      },
      include: {
        city: true,
        photos: { where: { isPrimary: true }, take: 1 }
      },
      take: 10
    });
    
    return { data: spots };
  });
  
  // 獲取景點地圖資料
  fastify.get('/map/all', async () => {
    const spots = await prisma.spot.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        nameJa: true,
        latitude: true,
        longitude: true,
        city: { select: { name: true } },
        categories: { include: { category: true } }
      }
    });
    
    return { data: spots };
  });
}

// 統計 API
spotsRouter.get('/stats', async (request) => {
  const total = await prisma.spot.count({ where: { status: 'active' } });
  const byPrefecture = await prisma.spot.groupBy({
    by: ['prefectureId'],
    where: { status: 'active' },
    _count: true
  });
  const byCategory = await prisma.spotCategory.groupBy({
    by: ['categoryId'],
    _count: true
  });
  
  const prefectureNames = await Promise.all(
    byPrefecture.map(p => prisma.prefecture.findUnique({ where: { id: p.prefectureId } }))
  );
  
  return {
    total,
    byPrefecture: byPrefecture.map((p, i) => ({
      name: prefectureNames[i]?.name || 'Unknown',
      count: p._count
    })),
    categoriesCount: byCategory.length
  };
});
