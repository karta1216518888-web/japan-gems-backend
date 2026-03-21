import Fastify from 'fastify';
import cors from '@fastify/cors';
import { spotRoutes } from './routes/spots.js';
import { referenceRoutes } from './routes/references.js';
import { regionRoutes } from './routes/regions.js';
import { weatherRoutes } from './routes/weather.js';

const isProduction = process.env.NODE_ENV === 'production';

const fastify = Fastify({
  logger: isProduction ? false : true,
  trustProxy: true,
});

// Register CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
});

// Health check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    spots: 400 
  };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(500).send({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : error.message,
  });
});

// Not found handler
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
  });
});

// Register routes
fastify.register(spotRoutes, { prefix: '/api/spots' });
fastify.register(referenceRoutes, { prefix: '/api/references' });
fastify.register(regionRoutes, { prefix: '/api/regions' });
fastify.register(weatherRoutes, { prefix: '/api/weather' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = isProduction ? '0.0.0.0' : '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    console.log(`
🚀 Japan Gems API Server
   Version: 1.0.0
   Mode: ${isProduction ? 'Production' : 'Development'}
   Port: ${port}
   Health: http://localhost:${port}/health
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
