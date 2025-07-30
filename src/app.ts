import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import errorMiddleware from './middleware/errorMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import authRoutes from './routes/auth';
import boardRoutes from './routes/boardRoutes';
import columnRoutes from './routes/columnRoutes';
import taskRoutes from './routes/taskRoutes';

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(helmet());

  app.use(
    cors({
      origin: ['http://localhost:5173'],
      credentials: true,
    })
  );

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, try again later.',
  });
  app.use('/api', limiter);

  // Swagger (dev only)
  if (process.env.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api', boardRoutes);
  app.use('/api', columnRoutes);
  app.use('/api', taskRoutes);

  // Test route

  app.get('/', (req, res) => {
    res.send('API Kanban is running');
  });

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.get('/me', authMiddleware, (req, res) => {
    res.json({
      message: 'You are authenticated',
      user: req.user,
    });
  });

  app.use(errorMiddleware);

  return app;
};

export const app = createApp();
