import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 為景點添加圖片 URL
async function main() {
  const spots = await prisma.spot.findMany({ take: 100 });
  
  // 使用 Picsum 隨機圖片
  for (const spot of spots) {
    const seed = spot.id.slice(-8);
    const imageUrl = `https://picsum.photos/seed/${seed}/400/300`;
    
    await prisma.spot.update({
      where: { id: spot.id },
      data: { 
        // 儲存在 description 欄位當作暫時的圖片參考
        description: `[img:${imageUrl}] ${spot.description || ''}` 
      }
    });
  }
  
  console.log(`Updated ${spots.length} spots with images`);
}

main().finally(() => prisma.$disconnect());
