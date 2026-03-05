import cors from 'cors';
import config from '../config';

/**
 * CORS configuration middleware.
 * Allows requests from the configured frontend origin.
 */
const corsConfig = cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
});

export default corsConfig;
