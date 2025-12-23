import type { NextFunction, Request, Response } from 'express';
import { BLOCKED_ORIGINS_MESSAGE } from './cors';

export function error(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error && err.message === BLOCKED_ORIGINS_MESSAGE) {
    console.warn('Blocked request from disallowed origin:', req.headers.origin);
    res.status(403).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' });
}
