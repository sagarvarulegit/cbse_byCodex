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
import { paymentsRouter } from './routes/payments.js';
import { progressRouter } from './routes/progress.js';
import { recoveryRouter } from './routes/recovery.js';
import { tutorChatRouter } from './routes/tutor-chat.js';
import { tutorRouter } from './routes/tutor.js';
import { videoRouter } from './routes/video.js';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://www.chapterready.in',
  'https://chapterready.in',
  'https://cbse-bycodex-web.vercel.app',
  'https://cbse-bycodex-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (DEFAULT_ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (process.env.CORS_ORIGIN) {
    const envOrigins = process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
    if (envOrigins.includes(origin) || envOrigins.includes('*')) return true;
  }
  return false;
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'Accept'],
};

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cbse-api' });
});

app.use('/v1/auth', authRouter);
app.use('/v1/auth/recovery', recoveryRouter);
app.use('/v1/catalog', catalogRouter);
app.use('/v1/lessons', videoRouter);
app.use('/v1/progress', progressRouter);
app.use('/v1/tutor', tutorRouter);
app.use('/v1/tutor', tutorChatRouter);
app.use('/v1/feedback', feedbackRouter);
app.use('/v1/payments', paymentsRouter);
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
