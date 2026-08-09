import cors from 'cors';
import express from 'express';

import { authRouter } from './routes/auth.js';
import { catalogRouter } from './routes/catalog.js';
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

export default app;
