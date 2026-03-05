import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config';
import corsConfig from './middleware/corsConfig';
import rateLimiter from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import rulesRouter from './routes/rules';
import creaturesRouter from './routes/creatures';
import npcsRouter from './routes/npcs';
import itemsRouter from './routes/items';

const app = express();

// ---------------------------------------------------------------------------
// Security & parsing middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(corsConfig);
app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------
const morganFormat = config.nodeEnv === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// ---------------------------------------------------------------------------
// Rate limiting (applied to /api routes only)
// ---------------------------------------------------------------------------
app.use('/api', rateLimiter);

// ---------------------------------------------------------------------------
// Health check (no rate limiting)
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api/rules', rulesRouter);
app.use('/api/creatures', creaturesRouter);
app.use('/api/npcs', npcsRouter);
app.use('/api/items', itemsRouter);

// ---------------------------------------------------------------------------
// Error handling (must come after routes)
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
