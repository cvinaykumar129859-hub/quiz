import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { loginSchema, registerSchema } from '../validators/schemas';

const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
const publicUser = (user: any) => ({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt });

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    if (await User.exists({ email: input.email.toLowerCase() })) { res.status(409).json({ message: 'An account with this email already exists' }); return; }
    const user = await User.create({ username: input.username, email: input.email, password: await bcrypt.hash(input.password, 12) });
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');
    res.cookie('quizmaster_token', jwt.sign({}, secret, { subject: String(user._id), expiresIn: '7d' }), cookieOptions());
    res.status(201).json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(input.password, user.password))) { res.status(401).json({ message: 'Email or password is incorrect' }); return; }
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');
    res.cookie('quizmaster_token', jwt.sign({}, secret, { subject: String(user._id), expiresIn: '7d' }), cookieOptions());
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { const user = await User.findById(req.userId); if (!user) { res.status(404).json({ message: 'User not found' }); return; } res.json({ user: publicUser(user) }); }
  catch (error) { next(error); }
}

export function logout(_req: Request, res: Response): void { res.clearCookie('quizmaster_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' }); res.json({ message: 'Logged out' }); }
