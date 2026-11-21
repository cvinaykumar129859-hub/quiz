export interface User { id: string; username: string; email: string; createdAt: string }
export interface QuizQuestion { text: string; options: string[] }
export interface Quiz { _id: string; title: string; category: string; difficulty: 'Easy' | 'Moderate' | 'Difficult'; description: string; questions?: QuizQuestion[] }
export interface AnswerReview { questionIndex: number; selectedAnswer: number | null; correctAnswer: number; isCorrect: boolean; explanation: string; question?: string; options?: string[] }
export interface QuizResult { id?: string; _id?: string; category: string; difficulty: string; score: number; totalQuestions: number; percentage: number; passed?: boolean; answers: AnswerReview[]; completedAt: string; quizId?: { title?: string; questions?: QuizQuestion[] } }
export interface DashboardData { stats: { totalAvailable: number; totalAttempted: number; totalCompleted: number; averageScore: number; highestScore: number }; recent: QuizResult[]; popular: { _id: string; attempts: number; average: number }[] }
