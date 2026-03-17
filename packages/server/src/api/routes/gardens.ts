import { Router, Request, Response } from 'express';
import rruleLib from 'rrule';
const { RRule } = rruleLib;
import prisma from '../../lib/prisma.js';

export const gardensRouter = Router();

function computeNextDueDate(rruleStr: string, offsetDays: number, monthStart?: number, monthEnd?: number): Date | null {
  // Build a proper RRULE with DTSTART at the beginning of the active season
  const now = new Date();
  let dtstart: Date;

  if (monthStart) {
    // Start from the beginning of the active month this year
    dtstart = new Date(now.getFullYear(), monthStart - 1, 1);
    // If the active season has passed, try next year
    if (monthEnd && now.getMonth() + 1 > monthEnd) {
      dtstart = new Date(now.getFullYear() + 1, monthStart - 1, 1);
    }
  } else {
    dtstart = now;
  }

  const rule = RRule.fromString(rruleStr);
  const ruleWithStart = new RRule({
    ...rule.origOptions,
    dtstart,
  });

  const next = ruleWithStart.after(now, true);
  if (!next) return null;
  // Apply regional offset
  next.setDate(next.getDate() + offsetDays);
  return next;
}

gardensRouter.get('/', async (req: Request, res: Response) => {
  try {
    const gardens = await prisma.garden.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: { plants: true },
        },
      },
    });

    res.json(gardens);
  } catch (error) {
    console.error('Get gardens error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Название сада обязательно' });
      return;
    }

    const garden = await prisma.garden.create({
      data: {
        name,
        description,
        userId: req.userId!,
      },
    });

    res.status(201).json(garden);
  } catch (error) {
    console.error('Create garden error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const garden = await prisma.garden.findFirst({
      where: { id, userId: req.userId },
      include: {
        plants: {
          include: {
            variety: {
              include: {
                species: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!garden) {
      res.status(404).json({ error: 'Сад не найден' });
      return;
    }

    res.json(garden);
  } catch (error) {
    console.error('Get garden by id error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const garden = await prisma.garden.findFirst({
      where: { id, userId: req.userId },
    });

    if (!garden) {
      res.status(404).json({ error: 'Сад не найден' });
      return;
    }

    const updated = await prisma.garden.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update garden error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const garden = await prisma.garden.findFirst({
      where: { id, userId: req.userId },
    });

    if (!garden) {
      res.status(404).json({ error: 'Сад не найден' });
      return;
    }

    await prisma.garden.delete({ where: { id } });

    res.json({ message: 'Сад удалён' });
  } catch (error) {
    console.error('Delete garden error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.post('/:id/plants', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { varietyId, nickname, plantedDate, quantity, notes } = req.body;

    // Verify garden ownership
    const garden = await prisma.garden.findFirst({
      where: { id, userId: req.userId },
    });

    if (!garden) {
      res.status(404).json({ error: 'Сад не найден' });
      return;
    }

    if (!varietyId) {
      res.status(400).json({ error: 'Необходимо указать сорт' });
      return;
    }

    // Get variety to find species for care templates
    const variety = await prisma.plantVariety.findUnique({
      where: { id: varietyId },
      include: {
        species: {
          include: {
            careTemplates: true,
          },
        },
      },
    });

    if (!variety) {
      res.status(404).json({ error: 'Сорт не найден' });
      return;
    }

    // Get user's region for calendar offset
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { region: true },
    });

    const offsetDays = user?.region?.calendarOffsetDays ?? 0;

    // Create the plant
    const plant = await prisma.userPlant.create({
      data: {
        gardenId: id,
        varietyId,
        nickname,
        plantedDate: plantedDate ? new Date(plantedDate) : null,
        quantity: quantity ?? 1,
        notes,
      },
    });

    // Generate CareSchedules from CareTemplates
    const scheduleData = [];
    for (const template of variety.species.careTemplates) {
      if (template.rrule) {
        const nextDueDate = computeNextDueDate(template.rrule, offsetDays, template.monthStart, template.monthEnd);
        scheduleData.push({
          userPlantId: plant.id,
          careType: template.careType,
          title: template.title,
          rrule: template.rrule,
          nextDueDate,
          fertilizerId: template.fertilizerId,
          treatmentId: template.treatmentId,
          isActive: true,
        });
      }
    }

    if (scheduleData.length > 0) {
      await prisma.careSchedule.createMany({ data: scheduleData });
    }

    // Return the plant with its schedules
    const plantWithSchedules = await prisma.userPlant.findUnique({
      where: { id: plant.id },
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

    res.status(201).json(plantWithSchedules);
  } catch (error) {
    console.error('Add plant to garden error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

gardensRouter.get('/:id/plants', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify garden ownership
    const garden = await prisma.garden.findFirst({
      where: { id, userId: req.userId },
    });

    if (!garden) {
      res.status(404).json({ error: 'Сад не найден' });
      return;
    }

    const plants = await prisma.userPlant.findMany({
      where: { gardenId: id },
      include: {
        variety: {
          include: {
            species: {
              include: { category: true },
            },
          },
        },
      },
    });

    res.json(plants);
  } catch (error) {
    console.error('Get garden plants error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
