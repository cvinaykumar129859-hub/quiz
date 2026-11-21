import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request { userId?: string }

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const secret = process.env.JWT_SECRET;
  const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  const token = req.cookies?.quizmaster_token ?? bearer;
  if (!secret || !token) { res.status(401).json({ message: 'Authentication required' }); return; }
  try {
    const payload = jwt.verify(token, secret) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch { res.status(401).json({ message: 'Session expired or invalid' }); }
}
