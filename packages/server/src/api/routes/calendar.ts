import { Router, Request, Response } from 'express';
import { startOfDay, endOfDay } from 'date-fns';
import prisma from '../../lib/prisma.js';

export const calendarRouter = Router();

calendarRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: 'Параметры from и to обязательны (даты в формате ISO)' });
      return;
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    const schedules = await prisma.careSchedule.findMany({
      where: {
        userPlant: {
          garden: { userId: req.userId },
        },
        isActive: true,
        nextDueDate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        fertilizer: true,
        treatment: true,
        userPlant: {
          include: {
            variety: {
              include: {
                species: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
      orderBy: { nextDueDate: 'asc' },
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

calendarRouter.get('/today', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const todayEnd = endOfDay(now);

    const schedules = await prisma.careSchedule.findMany({
      where: {
        userPlant: {
          garden: { userId: req.userId },
        },
        isActive: true,
        nextDueDate: {
          lte: todayEnd,
        },
      },
      include: {
        fertilizer: true,
        treatment: true,
        userPlant: {
          include: {
            variety: {
              include: {
                species: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
