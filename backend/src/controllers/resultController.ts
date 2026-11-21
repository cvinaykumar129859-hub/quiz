import { NextFunction, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Result } from '../models/Result';

export async function myResults(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { const results = await Result.find({ userId: req.userId }).populate('quizId', 'title').sort({ completedAt: -1 }).lean(); res.json({ results }); } catch (error) { next(error); }
}
export async function resultById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!isValidObjectId(req.params.id)) { res.status(404).json({ message: 'Result not found' }); return; }
    const result = await Result.findOne({ _id: req.params.id, userId: req.userId }).populate('quizId', 'title questions.text questions.options').lean();
    if (!result) { res.status(404).json({ message: 'Result not found' }); return; }
    res.json({ result });
  } catch (error) { next(error); }
}
