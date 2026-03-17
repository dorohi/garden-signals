import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { authMiddleware } from './lib/middleware.js';

import { authRouter } from './api/routes/auth.js';
import { catalogRouter } from './api/routes/catalog.js';
import { diseasesRouter } from './api/routes/diseases.js';
import { pestsRouter } from './api/routes/pests.js';
import { fertilizersRouter } from './api/routes/fertilizers.js';
import { treatmentsRouter } from './api/routes/treatments.js';
import { regionsRouter } from './api/routes/regions.js';
import { profileRouter } from './api/routes/profile.js';
import { gardensRouter } from './api/routes/gardens.js';
import { plantsRouter } from './api/routes/plants.js';
import { schedulesRouter } from './api/routes/schedules.js';
import { calendarRouter } from './api/routes/calendar.js';
import { notificationsRouter } from './api/routes/notifications.js';
import { initTelegramBot } from './lib/telegram.js';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/diseases', diseasesRouter);
app.use('/api/pests', pestsRouter);
app.use('/api/fertilizers', fertilizersRouter);
app.use('/api/treatments', treatmentsRouter);
app.use('/api/regions', regionsRouter);

// Auth-protected routes
app.use('/api/profile', authMiddleware, profileRouter);
app.use('/api/gardens', authMiddleware, gardensRouter);
app.use('/api/plants', authMiddleware, plantsRouter);
app.use('/api/schedules', authMiddleware, schedulesRouter);
app.use('/api/calendar', authMiddleware, calendarRouter);
app.use('/api/notifications', authMiddleware, notificationsRouter);

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  initTelegramBot();
});

export default app;
