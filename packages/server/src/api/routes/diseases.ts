import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const diseasesRouter = Router();

diseasesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search as string };
    }

    const diseases = await prisma.disease.findMany({ where });

    res.json(diseases);
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

diseasesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const disease = await prisma.disease.findUnique({
      where: { id },
      include: {
        plantDiseases: {
          include: {
            species: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!disease) {
      res.status(404).json({ error: 'Болезнь не найдена' });
      return;
    }

    res.json(disease);
  } catch (error) {
    console.error('Get disease by id error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
