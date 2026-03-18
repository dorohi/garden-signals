import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
import { authMiddleware } from '../../lib/middleware.js';
import { adminMiddleware } from '../../lib/adminMiddleware.js';

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

diseasesRouter.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, symptoms, cause, prevention, treatmentChemical, treatmentBio, treatmentFolk, imageUrl } = req.body;

    if (!name || !symptoms) {
      res.status(400).json({ error: 'Название и симптомы обязательны' });
      return;
    }

    const disease = await prisma.disease.create({
      data: { name, symptoms, cause, prevention, treatmentChemical, treatmentBio, treatmentFolk, imageUrl },
    });

    res.status(201).json(disease);
  } catch (error) {
    console.error('Create disease error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

diseasesRouter.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, symptoms, cause, prevention, treatmentChemical, treatmentBio, treatmentFolk, imageUrl } = req.body;

    const existing = await prisma.disease.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Болезнь не найдена' });
      return;
    }

    const disease = await prisma.disease.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(symptoms !== undefined && { symptoms }),
        ...(cause !== undefined && { cause }),
        ...(prevention !== undefined && { prevention }),
        ...(treatmentChemical !== undefined && { treatmentChemical }),
        ...(treatmentBio !== undefined && { treatmentBio }),
        ...(treatmentFolk !== undefined && { treatmentFolk }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    res.json(disease);
  } catch (error) {
    console.error('Update disease error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

diseasesRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.disease.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Болезнь не найдена' });
      return;
    }

    await prisma.$transaction([
      prisma.plantDisease.deleteMany({ where: { diseaseId: id } }),
      prisma.disease.delete({ where: { id } }),
    ]);

    res.json({ message: 'Болезнь удалена' });
  } catch (error) {
    console.error('Delete disease error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
