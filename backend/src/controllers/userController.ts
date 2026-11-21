import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Quiz } from '../models/Quiz';
import { Result } from '../models/Result';
import { profileSchema } from '../validators/schemas';

export async function profile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    const results = await Result.find({ userId: req.userId }).sort({ completedAt: -1 }).limit(5).lean();
    res.json({ user, stats: await getStats(String(req.userId)), recent: results });
  } catch (error) { next(error); }
}
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { const input = profileSchema.parse(req.body); const user = await User.findByIdAndUpdate(req.userId, { username: input.username }, { new: true, runValidators: true }).select('-password'); if (!user) { res.status(404).json({ message: 'User not found' }); return; } res.json({ user }); }
  catch (error) { next(error); }
}
async function getStats(userId: string): Promise<Record<string, unknown>> {
  const results = await Result.find({ userId }).lean();
  const count = results.length;
  const average = count ? Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / count) : 0;
  const levels = ['Easy', 'Moderate', 'Difficult'].map(difficulty => { const items = results.filter(result => result.difficulty === difficulty); return { difficulty, attempted: items.length, average: items.length ? Math.round(items.reduce((sum, item) => sum + item.percentage, 0) / items.length) : 0 }; });
  return { totalAttempted: count, totalCompleted: count, averageScore: average, highestScore: count ? Math.max(...results.map(item => item.percentage)) : 0, levels };
}
export async function dashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const [stats, recent, popular, quizCount] = await Promise.all([
      getStats(String(req.userId)),
      Result.find({ userId: req.userId }).sort({ completedAt: -1 }).limit(5).lean(),
      Result.aggregate([{ $group: { _id: '$category', attempts: { $sum: 1 }, average: { $avg: '$percentage' } } }, { $sort: { attempts: -1 } }, { $limit: 5 }]),
      Quiz.countDocuments()
    ]);
    res.json({ stats: { ...stats, totalAvailable: quizCount }, recent, popular });
  } catch (error) { next(error); }
}
