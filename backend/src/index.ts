import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRouter from './routes';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errors';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
connectDatabase().then(() => app.listen(port, () => console.log(`QuizMaster API listening on ${port}`))).catch(error => {
  console.error('Unable to start QuizMaster API:', error.message);
  process.exit(1);
});
