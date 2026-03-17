import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const pestsRouter = Router();

pestsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search as string };
    }

    const pests = await prisma.pest.findMany({ where });

    res.json(pests);
  } catch (error) {
    console.error('Get pests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

pestsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pest = await prisma.pest.findUnique({
      where: { id },
      include: {
        plantPests: {
          include: {
            species: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!pest) {
      res.status(404).json({ error: 'Pest not found' });
      return;
    }

    res.json(pest);
  } catch (error) {
    console.error('Get pest by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
