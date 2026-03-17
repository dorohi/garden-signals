import { Router, Request, Response } from 'express';
import rruleLib from 'rrule';
const { RRule } = rruleLib;
import prisma from '../../lib/prisma.js';

export const schedulesRouter = Router();

schedulesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Verify ownership
    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id,
        userPlant: {
          garden: { userId: req.userId },
        },
      },
    });

    if (!schedule) {
      res.status(404).json({ error: 'Расписание не найдено' });
      return;
    }

    const updated = await prisma.careSchedule.update({
      where: { id },
      data: { isActive },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

schedulesRouter.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes, photoUrl } = req.body;

    // Verify ownership
    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id,
        userPlant: {
          garden: { userId: req.userId },
        },
      },
      include: {
        userPlant: {
          include: {
            garden: {
              include: {
                user: {
                  include: { region: true },
                },
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      res.status(404).json({ error: 'Расписание не найдено' });
      return;
    }

    // Create care log entry
    const log = await prisma.careLog.create({
      data: {
        userPlantId: schedule.userPlantId,
        scheduleId: id,
        userId: req.userId!,
        careType: schedule.careType,
        title: schedule.title,
        completedAt: new Date(),
        notes,
        photoUrl,
      },
    });

    // Recompute nextDueDate: find next occurrence strictly after today
    let nextDueDate: Date | null = null;
    if (schedule.rrule) {
      try {
        const rule = RRule.fromString(schedule.rrule);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const next = rule.after(tomorrow, true); // inclusive from tomorrow = strictly after today
        if (next) {
          const offsetDays = schedule.userPlant.garden.user.region?.calendarOffsetDays ?? 0;
          next.setDate(next.getDate() + offsetDays);
          nextDueDate = next;
        }
      } catch (e) {
        console.error(`Failed to compute next due date for schedule ${id}:`, e);
      }
    }

    await prisma.careSchedule.update({
      where: { id },
      data: { nextDueDate },
    });

    res.json({ log, nextDueDate });
  } catch (error) {
    console.error('Complete schedule error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

schedulesRouter.post('/:id/snooze', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id,
        userPlant: {
          garden: { userId: req.userId },
        },
      },
    });

    if (!schedule) {
      res.status(404).json({ error: 'Расписание не найдено' });
      return;
    }

    // Push nextDueDate forward by 1 day
    const currentDue = schedule.nextDueDate ? new Date(schedule.nextDueDate) : new Date();
    const newDueDate = new Date(currentDue.getTime() + 24 * 60 * 60 * 1000);

    const updated = await prisma.careSchedule.update({
      where: { id },
      data: { nextDueDate: newDueDate },
    });

    res.json(updated);
  } catch (error) {
    console.error('Snooze schedule error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
