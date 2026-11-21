import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export const notFound: RequestHandler = (_req, res) => { res.status(404).json({ message: 'Route not found' }); };

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) { res.status(400).json({ message: 'Invalid request', errors: error.flatten().fieldErrors }); return; }
  if (error?.code === 11000) { res.status(409).json({ message: 'An account with this email already exists' }); return; }
  const status = Number(error?.status) || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: error?.message || 'Unexpected server error' });
};
