import { NextFunction, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Quiz } from '../models/Quiz';
import { Result } from '../models/Result';
import { submitSchema } from '../validators/schemas';

export async function listQuizzes(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { const quizzes = await Quiz.find().select('-questions.correctAnswer -questions.explanation').sort({ category: 1, difficulty: 1 }); res.json({ quizzes }); } catch (error) { next(error); }
}
export async function categories(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { const values = await Quiz.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]); res.json({ categories: values.map(item => ({ name: item._id, quizCount: item.count })) }); } catch (error) { next(error); }
}
export async function quizDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { if (!isValidObjectId(req.params.id)) { res.status(404).json({ message: 'Quiz not found' }); return; } const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation'); if (!quiz) { res.status(404).json({ message: 'Quiz not found' }); return; } res.json({ quiz }); } catch (error) { next(error); }
}
export async function quizQuestions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> { return quizDetails(req, res, next); }
export async function submitQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = submitSchema.parse(req.body);
    if (!isValidObjectId(req.params.id)) { res.status(404).json({ message: 'Quiz not found' }); return; }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) { res.status(404).json({ message: 'Quiz not found' }); return; }
    const questions = quiz.questions.toObject();
    const answers = input.answers.map(answer => {
      const question = questions[answer.questionIndex];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      return { questionIndex: answer.questionIndex, selectedAnswer: answer.selectedAnswer, correctAnswer: question.correctAnswer, isCorrect, explanation: question.explanation };
    });
    const score = answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round(score / totalQuestions * 100);
    const result = await Result.create({ userId: req.userId, quizId: quiz._id, category: quiz.category, difficulty: quiz.difficulty, score, totalQuestions, percentage, answers });
    res.status(201).json({ result: { id: result._id, category: quiz.category, difficulty: quiz.difficulty, score, totalQuestions, percentage, passed: percentage >= 60, answers: answers.map(answer => ({ ...answer, question: questions[answer.questionIndex].text, options: questions[answer.questionIndex].options })), completedAt: result.completedAt } });
  } catch (error) { next(error); }
}
