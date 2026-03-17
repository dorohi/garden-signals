import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const catalogRouter = Router();

catalogRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.plantCategory.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

catalogRouter.get('/species', async (req: Request, res: Response) => {
  try {
    const { categoryId, search } = req.query;

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (search) {
      where.name = { contains: search as string };
    }

    const species = await prisma.plantSpecies.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { varieties: true },
        },
      },
    });

    res.json(species);
  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

catalogRouter.get('/species/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const species = await prisma.plantSpecies.findUnique({
      where: { id },
      include: {
        category: true,
        varieties: true,
        careTemplates: {
          include: {
            fertilizer: { select: { id: true, name: true } },
            treatment: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!species) {
      res.status(404).json({ error: 'Вид не найден' });
      return;
    }

    res.json(species);
  } catch (error) {
    console.error('Get species by id error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
