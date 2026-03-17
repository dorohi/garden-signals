import { Router, Request, Response } from 'express';
import rruleLib from 'rrule';
import prisma from '../../lib/prisma.js';

const { RRule } = rruleLib;

export const profileRouter = Router();

profileRouter.get('/', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        regionId: true,
        region: true,
        digestTime: true,
        notifyByPush: true,
        notifyByTelegram: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

profileRouter.put('/', async (req: Request, res: Response) => {
  try {
    const { name, regionId, digestTime, notifyByPush, notifyByTelegram } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!currentUser) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    const regionChanged = regionId !== undefined && regionId !== currentUser.regionId;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(regionId !== undefined && { regionId }),
        ...(digestTime !== undefined && { digestTime }),
        ...(notifyByPush !== undefined && { notifyByPush }),
        ...(notifyByTelegram !== undefined && { notifyByTelegram }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        regionId: true,
        region: true,
        digestTime: true,
        notifyByPush: true,
        notifyByTelegram: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If region changed, recalculate all CareSchedule nextDueDates
    if (regionChanged && regionId) {
      const region = await prisma.climateRegion.findUnique({
        where: { id: regionId },
      });

      const offsetDays = region?.calendarOffsetDays ?? 0;

      const schedules = await prisma.careSchedule.findMany({
        where: {
          userPlant: {
            garden: { userId: req.userId },
          },
          isActive: true,
        },
      });

      for (const schedule of schedules) {
        if (schedule.rrule) {
          try {
            const rule = RRule.fromString(schedule.rrule);
            const now = new Date();
            const next = rule.after(now, true);
            if (next) {
              next.setDate(next.getDate() + offsetDays);
              await prisma.careSchedule.update({
                where: { id: schedule.id },
                data: { nextDueDate: next },
              });
            }
          } catch (e) {
            console.error(`Failed to recompute schedule ${schedule.id}:`, e);
          }
        }
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
