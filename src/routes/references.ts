import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function referenceRoutes(fastify: FastifyInstance) {
  // 獲取景點的所有參考資料
  fastify.get('/spot/:spotId', async (request) => {
    const { spotId } = request.params as any;
    
    const references = await prisma.reference.findMany({
      where: { spotId },
      orderBy: { reliabilityScore: 'desc' }
    });
    
    return { data: references };
  });
  
  // 獲取單一參考資料
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any;
    
    const reference = await prisma.reference.findUnique({
      where: { id },
      include: { spot: true }
    });
    
    if (!reference) {
      throw { statusCode: 404, message: 'Reference not found' };
    }
    
    return reference;
  });
  
  // 老闆手動調整可靠性分數
  fastify.patch('/:id/reliability', async (request) => {
    const { id } = request.params as any;
    const { manualOverride, notes } = request.body as any;
    
    const reference = await prisma.reference.update({
      where: { id },
      data: {
        manualOverride,
        lastVerified: new Date()
      }
    });
    
    return reference;
  });
  
  // 來源管理 - 獲取所有來源
  fastify.get('/sources/all', async () => {
    const sources = await prisma.source.findMany({
      include: {
        _count: { select: { references: true } }
      },
      orderBy: { defaultReliability: 'desc' }
    });
    
    return { data: sources };
  });
  
  // 來源管理 - 更新來源設定
  fastify.patch('/sources/:id', async (request) => {
    const { id } = request.params as any;
    const { defaultReliability, isBlacklisted, isWhitelisted, manualNotes } = request.body as any;
    
    const source = await prisma.source.update({
      where: { id },
      data: {
        defaultReliability,
        isBlacklisted,
        isWhitelisted,
        manualNotes
      }
    });
    
    return source;
  });
}
