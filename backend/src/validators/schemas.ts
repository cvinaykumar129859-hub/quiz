import { z } from 'zod';

export const registerSchema = z.object({ username: z.string().trim().min(2).max(40), email: z.string().trim().email().max(254), password: z.string().min(8).max(128), confirmPassword: z.string().min(8).max(128) }).refine(data => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });
export const submitSchema = z.object({ answers: z.array(z.object({ questionIndex: z.number().int().min(0).max(9), selectedAnswer: z.number().int().min(0).max(3).nullable() })).length(10) }).superRefine((data, context) => {
	if (new Set(data.answers.map(answer => answer.questionIndex)).size !== 10) {
		context.addIssue({ code: z.ZodIssueCode.custom, path: ['answers'], message: 'Each question must be answered exactly once' });
	}
});
export const profileSchema = z.object({ username: z.string().trim().min(2).max(40) });
