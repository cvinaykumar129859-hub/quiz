import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true, validate: (items: string[]) => items.length === 4 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true }
}, { _id: false });

const quizSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Difficult'], required: true, index: true },
  description: { type: String, required: true },
  questions: { type: [questionSchema], required: true, validate: (items: unknown[]) => items.length === 10 }
}, { timestamps: true });
quizSchema.index({ category: 1, difficulty: 1 }, { unique: true });

export const Quiz = model('Quiz', quizSchema);
