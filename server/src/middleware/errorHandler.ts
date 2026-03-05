import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../types';

/**
 * Custom error class with HTTP status codes and error codes.
 */
export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  suggestion?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    suggestion?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.suggestion = suggestion;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handling middleware.
 * Catches all errors and returns a standardized JSON response.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorCode = err instanceof AppError ? err.errorCode : 'INTERNAL_ERROR';
  const suggestion =
    err instanceof AppError
      ? err.suggestion
      : 'An unexpected error occurred. Please try again.';

  // Log the error for server-side debugging
  console.error(`[ERROR] ${errorCode}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const response: APIResponse = {
    success: false,
    error: err.message,
    errorCode,
    suggestion,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const err = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    'NOT_FOUND',
    'Check the API documentation for valid endpoints.'
  );
  next(err);
}
