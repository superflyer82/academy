import 'dotenv/config';
import app from './app';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';

const PORT = Number(process.env.PORT ?? 3001);

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
