import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add search suggestions
async function main() {
  // Get all spots for search index
  const spots = await prisma.spot.findMany({
    select: { id: true, name: true, nameJa: true, prefecture: { select: { name: true } } }
  });
  
  console.log(`Total spots: ${spots.length}`);
  
  // Create search suggestions
  const suggestions = spots.flatMap(s => [
    s.name,
    s.nameJa,
    `${s.name} ${s.prefecture?.name || ''}`,
    `${s.nameJa} ${s.prefecture?.name || ''}`
  ]);
  
  console.log(`Suggestions: ${suggestions.length}`);
  
  // Store as JSON file for frontend
  const fs = await import('fs');
  fs.writeFileSync(
    '/tmp/search-index.json', 
    JSON.stringify(spots.map(s => ({
      id: s.id,
      name: s.name,
      nameJa: s.nameJa,
      city: s.prefecture?.name
    })))
  );
  
  console.log('Search index created!');
}

main().finally(() => prisma.$disconnect());
