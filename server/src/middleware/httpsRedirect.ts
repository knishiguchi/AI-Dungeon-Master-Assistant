import { Request, Response, NextFunction } from 'express';
import config from '../config';

/**
 * Redirect HTTP → HTTPS in production.
 * Most cloud platforms (Vercel, Railway, Render) set the
 * `x-forwarded-proto` header when terminating TLS at the proxy.
 *
 * In development this middleware is a no-op so localhost works over HTTP.
 */
export function httpsRedirect(req: Request, res: Response, next: NextFunction): void {
  if (
    config.nodeEnv === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    return;
  }
  next();
}
