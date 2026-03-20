import Fastify from 'fastify';
import cors from '@fastify/cors';
import { spotRoutes } from './routes/spots.js';
import { referenceRoutes } from './routes/references.js';
import { regionRoutes } from './routes/regions.js';

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(cors, {
  origin: true,
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
fastify.register(spotRoutes, { prefix: '/api/spots' });
fastify.register(referenceRoutes, { prefix: '/api/references' });
fastify.register(regionRoutes, { prefix: '/api/regions' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
