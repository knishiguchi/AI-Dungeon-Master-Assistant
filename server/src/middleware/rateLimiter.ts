import rateLimit from 'express-rate-limit';
import config from '../config';
import { AppError } from './errorHandler';

/**
 * Rate limiting middleware.
 * Limits each IP to a configured number of requests per window.
 * Default: 100 requests per 5 minutes.
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (_req, _res, next) => {
    next(
      new AppError(
        'Too many requests from this IP address. Please wait a few minutes.',
        429,
        'RATE_LIMIT_EXCEEDED',
        'Wait a few minutes before making more requests.'
      )
    );
  },
});

export default rateLimiter;
