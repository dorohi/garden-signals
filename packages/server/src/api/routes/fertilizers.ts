import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const fertilizersRouter = Router();

fertilizersRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const fertilizers = await prisma.fertilizer.findMany();
    res.json(fertilizers);
  } catch (error) {
    console.error('Get fertilizers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
