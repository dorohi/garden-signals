import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const treatmentsRouter = Router();

treatmentsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const treatments = await prisma.treatment.findMany();
    res.json(treatments);
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
