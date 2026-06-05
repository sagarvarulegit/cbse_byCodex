import cors from 'cors';
import express from 'express';

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins, credentials: true } : undefined));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cbse-api' });
});

app.get('/v1/catalog/pilot', (_req, res) => {
  res.json({
    classLevel: 10,
    subjects: [
      {
        name: 'Mathematics',
        chapters: [{ title: 'Real Numbers', accessLevel: 'free-preview' }],
      },
      {
        name: 'Science',
        chapters: [{ title: 'Chemical Reactions and Equations', accessLevel: 'free-preview' }],
      },
    ],
  });
});

export default app;
