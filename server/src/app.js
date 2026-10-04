import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'JobMatch Pro API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
