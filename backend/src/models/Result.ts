import { Schema, model } from 'mongoose';

const answerSchema = new Schema({
  questionIndex: { type: Number, required: true },
  selectedAnswer: { type: Number, default: null },
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const resultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: { type: [answerSchema], required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Result = model('Result', resultSchema);
