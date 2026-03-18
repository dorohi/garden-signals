import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
import { authMiddleware } from '../../lib/middleware.js';
import { adminMiddleware } from '../../lib/adminMiddleware.js';

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
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
      res.status(404).json({ error: 'Вредитель не найден' });
      return;
    }

    res.json(pest);
  } catch (error) {
    console.error('Get pest by id error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

pestsRouter.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, signs, damage, preventionMethods, treatmentChemical, treatmentBio, treatmentFolk, imageUrl } = req.body;

    if (!name || !signs) {
      res.status(400).json({ error: 'Название и признаки обязательны' });
      return;
    }

    const pest = await prisma.pest.create({
      data: { name, signs, damage, preventionMethods, treatmentChemical, treatmentBio, treatmentFolk, imageUrl },
    });

    res.status(201).json(pest);
  } catch (error) {
    console.error('Create pest error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

pestsRouter.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, signs, damage, preventionMethods, treatmentChemical, treatmentBio, treatmentFolk, imageUrl } = req.body;

    const existing = await prisma.pest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Вредитель не найден' });
      return;
    }

    const pest = await prisma.pest.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(signs !== undefined && { signs }),
        ...(damage !== undefined && { damage }),
        ...(preventionMethods !== undefined && { preventionMethods }),
        ...(treatmentChemical !== undefined && { treatmentChemical }),
        ...(treatmentBio !== undefined && { treatmentBio }),
        ...(treatmentFolk !== undefined && { treatmentFolk }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    res.json(pest);
  } catch (error) {
    console.error('Update pest error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

pestsRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.pest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Вредитель не найден' });
      return;
    }

    await prisma.$transaction([
      prisma.plantPest.deleteMany({ where: { pestId: id } }),
      prisma.pest.delete({ where: { id } }),
    ]);

    res.json({ message: 'Вредитель удалён' });
  } catch (error) {
    console.error('Delete pest error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
