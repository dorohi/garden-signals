import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';

export const plantsRouter = Router();

plantsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const plant = await prisma.userPlant.findFirst({
      where: {
        id,
        garden: { userId: req.userId },
      },
      include: {
        variety: {
          include: {
            species: {
              include: { category: true },
            },
          },
        },
        schedules: {
          include: { fertilizer: true, treatment: true },
        },
      },
    });

    if (!plant) {
      res.status(404).json({ error: 'Plant not found' });
      return;
    }

    res.json(plant);
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

plantsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nickname, notes, quantity } = req.body;

    // Verify ownership through garden -> user
    const plant = await prisma.userPlant.findFirst({
      where: {
        id,
        garden: { userId: req.userId },
      },
    });

    if (!plant) {
      res.status(404).json({ error: 'Plant not found' });
      return;
    }

    const updated = await prisma.userPlant.update({
      where: { id },
      data: {
        ...(nickname !== undefined && { nickname }),
        ...(notes !== undefined && { notes }),
        ...(quantity !== undefined && { quantity }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

plantsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership through garden -> user
    const plant = await prisma.userPlant.findFirst({
      where: {
        id,
        garden: { userId: req.userId },
      },
    });

    if (!plant) {
      res.status(404).json({ error: 'Plant not found' });
      return;
    }

    // Delete schedules and then the plant
    await prisma.careSchedule.deleteMany({ where: { userPlantId: id } });
    await prisma.userPlant.delete({ where: { id } });

    res.json({ message: 'Plant deleted' });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

plantsRouter.get('/:id/schedules', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const plant = await prisma.userPlant.findFirst({
      where: {
        id,
        garden: { userId: req.userId },
      },
    });

    if (!plant) {
      res.status(404).json({ error: 'Plant not found' });
      return;
    }

    const schedules = await prisma.careSchedule.findMany({
      where: {
        userPlantId: id,
        isActive: true,
      },
      include: { fertilizer: true, treatment: true },
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get plant schedules error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

plantsRouter.get('/:id/logs', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const plant = await prisma.userPlant.findFirst({
      where: {
        id,
        garden: { userId: req.userId },
      },
    });

    if (!plant) {
      res.status(404).json({ error: 'Plant not found' });
      return;
    }

    const logs = await prisma.careLog.findMany({
      where: { userPlantId: id },
      orderBy: { completedAt: 'desc' },
      include: {
        schedule: true,
      },
    });

    res.json(logs);
  } catch (error) {
    console.error('Get plant logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
