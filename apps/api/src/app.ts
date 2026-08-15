import cors from 'cors';
import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';

import { authRouter } from './routes/auth.js';
import { catalogRouter } from './routes/catalog.js';
import {
  adminExamPapersRouter,
  examPapersRouter,
} from './routes/exam-papers.js';
import { feedbackRouter } from './routes/feedback.js';
import { progressRouter } from './routes/progress.js';
import { videoRouter } from './routes/video.js';

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = allowedOrigins?.length
  ? { origin: allowedOrigins, credentials: true }
  : process.env.NODE_ENV === 'production'
    ? { origin: false }
    : undefined;

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cbse-api' });
});

app.use('/v1/auth', authRouter);
app.use('/v1/catalog', catalogRouter);
app.use('/v1/lessons', videoRouter);
app.use('/v1/progress', progressRouter);
app.use('/v1/feedback', feedbackRouter);
app.use('/v1/exam-papers', examPapersRouter);
app.use('/v1/admin/exam-papers', adminExamPapersRouter);

// Express 4 does not catch rejected promises from async handlers; without this
// a thrown error would leave the client hanging with no response.
const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Not found.' });
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({ message: 'An unexpected error occurred.' });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
