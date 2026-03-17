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
      res.status(404).json({ error: 'Растение не найдено' });
      return;
    }

    res.json(plant);
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
      res.status(404).json({ error: 'Растение не найдено' });
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
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
      res.status(404).json({ error: 'Растение не найдено' });
      return;
    }

    // Delete schedules and then the plant
    await prisma.careSchedule.deleteMany({ where: { userPlantId: id } });
    await prisma.userPlant.delete({ where: { id } });

    res.json({ message: 'Растение удалено' });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
      res.status(404).json({ error: 'Растение не найдено' });
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
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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
      res.status(404).json({ error: 'Растение не найдено' });
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
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

plantsRouter.put('/logs/:logId', async (req: Request, res: Response) => {
  try {
    const { logId } = req.params;
    const { title, notes, completedAt } = req.body;

    const log = await prisma.careLog.findFirst({
      where: { id: logId, userId: req.userId },
    });

    if (!log) {
      res.status(404).json({ error: 'Запись не найдена' });
      return;
    }

    const updated = await prisma.careLog.update({
      where: { id: logId },
      data: {
        ...(title !== undefined && { title }),
        ...(notes !== undefined && { notes }),
        ...(completedAt !== undefined && { completedAt: new Date(completedAt) }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update care log error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

plantsRouter.delete('/logs/:logId', async (req: Request, res: Response) => {
  try {
    const { logId } = req.params;

    const log = await prisma.careLog.findFirst({
      where: { id: logId, userId: req.userId },
    });

    if (!log) {
      res.status(404).json({ error: 'Запись не найдена' });
      return;
    }

    await prisma.careLog.delete({ where: { id: logId } });

    res.json({ message: 'Запись удалена' });
  } catch (error) {
    console.error('Delete care log error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
