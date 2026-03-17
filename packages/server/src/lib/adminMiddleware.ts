import { Request, Response, NextFunction } from 'express';
import prisma from './prisma.js';

export async function adminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Доступ запрещён' });
      return;
    }

    next();
  } catch {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
