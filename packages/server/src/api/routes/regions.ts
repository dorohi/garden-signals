import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const regionsRouter = Router();

regionsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const regions = await prisma.climateRegion.findMany();
    res.json(regions);
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
