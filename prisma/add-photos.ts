import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add proper images to spots from Unsplash
async function main() {
  const spots = await prisma.spot.findMany({ take: 50 });
  
  const unsplashImages: Record<string, string> = {
    '大阪城': 'https://images.unsplash.com/photo-1578643463396-0997cb532858?w=800',
    '道頓堀': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800',
    '清水寺': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    '金閣寺': 'https://images.unsplash.com/photo-1624253321171-1be53e12f5fa?w=800',
    '嵐山': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    '伏見稻荷': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    '祇園': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    '心齋橋': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800',
    '通天閣': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    '天王寺': 'https://images.unsplash.com/photo-1590059899731-a382839e5549?w=800',
  };

  for (const spot of spots) {
    const imageUrl = unsplashImages[spot.name] || `https://picsum.photos/seed/${spot.id}/800/600`;
    
    await prisma.spotPhoto.create({
      data: {
        spotId: spot.id,
        url: imageUrl,
        isPrimary: true,
        caption: spot.name
      }
    });
    
    console.log(`Added image for: ${spot.name}`);
  }

  console.log('Done!');
}

main().finally(() => prisma.$disconnect());
