import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
import { config } from '../../config.js';
import { createLinkCode, sendTelegramMessage, getBotUsername } from '../../lib/telegram.js';

export const notificationsRouter = Router();

notificationsRouter.post('/subscribe', async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'Not implemented yet' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationsRouter.delete('/subscribe', async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'Not implemented yet' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationsRouter.put('/preferences', async (req: Request, res: Response) => {
  try {
    const { digestTime, notifyByTelegram } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(digestTime !== undefined && { digestTime }),
        ...(notifyByTelegram !== undefined && { notifyByTelegram }),
      },
      select: {
        digestTime: true,
        notifyByTelegram: true,
        notifyByPush: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate a link code and return the deep-link URL
notificationsRouter.post('/telegram/link', async (req: Request, res: Response) => {
  try {
    const username = getBotUsername();
    if (!config.telegramBotToken || !username) {
      res.status(400).json({ error: 'Telegram bot not configured' });
      return;
    }

    const code = createLinkCode(req.userId!);
    const deepLink = `https://t.me/${username}?start=${code}`;

    res.json({ code, deepLink });
  } catch (error) {
    console.error('Telegram link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlink telegram
notificationsRouter.post('/telegram/unlink', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (user?.telegramChatId) {
      await sendTelegramMessage(user.telegramChatId, 'Аккаунт DachaCare отвязан от этого чата.');
    }

    await prisma.user.update({
      where: { id: req.userId },
      data: { telegramChatId: null, notifyByTelegram: false },
    });

    res.json({ message: 'Telegram unlinked' });
  } catch (error) {
    console.error('Telegram unlink error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get telegram link status
notificationsRouter.get('/telegram/status', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { telegramChatId: true, notifyByTelegram: true },
    });

    res.json({
      linked: !!user?.telegramChatId,
      notifyByTelegram: user?.notifyByTelegram ?? false,
    });
  } catch (error) {
    console.error('Telegram status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
