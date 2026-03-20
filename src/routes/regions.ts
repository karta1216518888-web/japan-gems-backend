import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function regionRoutes(fastify: FastifyInstance) {
  // 獲取所有地域
  fastify.get('/', async () => {
    const regions = await prisma.region.findMany({
      include: {
        prefecture: {
          include: {
            cities: true
          }
        }
      }
    });
    
    return { data: regions };
  });
  
  // 獲取單一地域
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any;
    
    const region = await prisma.region.findUnique({
      where: { id },
      include: {
        prefecture: {
          include: {
            cities: true
          }
        }
      }
    });
    
    return region;
  });
  
  // 獲取所有都道府縣
  fastify.get('/prefectures/all', async () => {
    const prefectures = await prisma.prefecture.findMany({
      include: {
        region: true,
        _count: { select: { spots: true } }
      },
      orderBy: { name: 'asc' }
    });
    
    return { data: prefectures };
  });
  
  // 獲取所有城市
  fastify.get('/cities/all', async () => {
    const cities = await prisma.city.findMany({
      include: {
        prefecture: true,
        _count: { select: { spots: true } }
      },
      orderBy: { name: 'asc' }
    });
    
    return { data: cities };
  });
  
  // 獲取所有分類
  fastify.get('/categories/all', async () => {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { spots: true } }
      }
    });
    
    return { data: categories };
  });
}
