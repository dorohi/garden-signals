import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
import { authMiddleware } from '../../lib/middleware.js';
import { adminMiddleware } from '../../lib/adminMiddleware.js';

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

catalogRouter.post('/species', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, categoryId, description, nameScientific, wateringIntervalDays, wateringNormLiters, sunRequirement, soilType, imageUrl } = req.body;

    if (!name || !categoryId) {
      res.status(400).json({ error: 'Название и категория обязательны' });
      return;
    }

    const species = await prisma.plantSpecies.create({
      data: {
        name,
        categoryId,
        description,
        nameScientific,
        wateringIntervalDays: wateringIntervalDays ?? 7,
        wateringNormLiters: wateringNormLiters ?? 5.0,
        sunRequirement: sunRequirement ?? 'FULL_SUN',
        soilType: soilType ?? 'LOAMY',
        imageUrl,
      },
      include: { category: true },
    });

    res.status(201).json(species);
  } catch (error) {
    console.error('Create species error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

catalogRouter.put('/species/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, categoryId, description, nameScientific, wateringIntervalDays, wateringNormLiters, sunRequirement, soilType, imageUrl } = req.body;

    const existing = await prisma.plantSpecies.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Вид не найден' });
      return;
    }

    const species = await prisma.plantSpecies.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(nameScientific !== undefined && { nameScientific }),
        ...(wateringIntervalDays !== undefined && { wateringIntervalDays }),
        ...(wateringNormLiters !== undefined && { wateringNormLiters }),
        ...(sunRequirement !== undefined && { sunRequirement }),
        ...(soilType !== undefined && { soilType }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      include: { category: true },
    });

    res.json(species);
  } catch (error) {
    console.error('Update species error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

catalogRouter.delete('/species/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.plantSpecies.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Вид не найден' });
      return;
    }

    await prisma.$transaction([
      prisma.plantDisease.deleteMany({ where: { speciesId: id } }),
      prisma.plantPest.deleteMany({ where: { speciesId: id } }),
      prisma.careTemplate.deleteMany({ where: { speciesId: id } }),
      prisma.plantVariety.deleteMany({ where: { speciesId: id } }),
      prisma.plantSpecies.delete({ where: { id } }),
    ]);

    res.json({ message: 'Вид удалён' });
  } catch (error) {
    console.error('Delete species error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
