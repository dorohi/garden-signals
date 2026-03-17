import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { endOfDay, addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { config } from '../config.js';
import prisma from './prisma.js';

let bot: Bot | null = null;
let botUsername: string | null = null;

// In-memory map: linkCode -> userId (expires after 10 min)
const pendingLinks = new Map<string, { userId: string; expiresAt: number }>();

function generateLinkCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createLinkCode(userId: string): string {
  for (const [code, entry] of pendingLinks) {
    if (entry.userId === userId) pendingLinks.delete(code);
  }
  const code = generateLinkCode();
  pendingLinks.set(code, { userId, expiresAt: Date.now() + 10 * 60 * 1000 });
  return code;
}

export async function sendTelegramMessage(chatId: string, text: string, keyboard?: InlineKeyboard): Promise<boolean> {
  if (!bot) return false;
  try {
    await bot.api.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      ...(keyboard ? { reply_markup: keyboard } : {}),
    });
    return true;
  } catch (error) {
    console.error(`Failed to send Telegram message to ${chatId}:`, error);
    return false;
  }
}

export async function sendCareReminder(userId: string, tasks: { title: string; plantName: string }[]): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.telegramChatId || !user.notifyByTelegram) return false;

  const lines = tasks.map((t) => `• <b>${t.plantName}</b> — ${t.title}`);
  const text = `🌱 <b>Задачи на сегодня:</b>\n\n${lines.join('\n')}`;
  return sendTelegramMessage(user.telegramChatId, text);
}

// ---- Helpers for bot commands ----

async function findUserByChatId(chatId: string) {
  return prisma.user.findFirst({ where: { telegramChatId: chatId } });
}

async function getTodayTasks(userId: string) {
  const todayEnd = endOfDay(new Date());
  return prisma.careSchedule.findMany({
    where: {
      userPlant: { garden: { userId } },
      isActive: true,
      nextDueDate: { lte: todayEnd },
    },
    include: {
      userPlant: {
        include: {
          variety: { include: { species: true } },
        },
      },
    },
    orderBy: { nextDueDate: 'asc' },
  });
}

async function getWeekTasks(userId: string) {
  const now = new Date();
  const weekEnd = endOfDay(addDays(now, 7));
  return prisma.careSchedule.findMany({
    where: {
      userPlant: { garden: { userId } },
      isActive: true,
      nextDueDate: { lte: weekEnd },
    },
    include: {
      userPlant: {
        include: {
          variety: { include: { species: true } },
        },
      },
    },
    orderBy: { nextDueDate: 'asc' },
  });
}

async function getUserGardens(userId: string) {
  return prisma.garden.findMany({
    where: { userId },
    include: {
      plants: {
        include: {
          variety: { include: { species: { include: { category: true } } } },
        },
      },
    },
  });
}

const careTypeEmoji: Record<string, string> = {
  WATER: '💧',
  FERTILIZE: '🧪',
  PRUNE: '✂️',
  SPRAY: '🛡️',
  HARVEST: '🍎',
  PLANT: '🌱',
};

function formatTask(schedule: any): string {
  const emoji = careTypeEmoji[schedule.careType] || '📋';
  const plantName = schedule.userPlant?.nickname
    || schedule.userPlant?.variety?.species?.name
    || 'Растение';
  const date = schedule.nextDueDate
    ? format(new Date(schedule.nextDueDate), 'd MMM', { locale: ru })
    : '';
  return `${emoji} <b>${plantName}</b> — ${schedule.title}${date ? ` (${date})` : ''}`;
}

// ---- Main menu keyboard ----

function mainKeyboard() {
  return new Keyboard()
    .text('📋 Сегодня').text('📅 Неделя').row()
    .text('🌿 Мой сад').text('❓ Помощь').row()
    .resized();
}

// ---- Bot initialization ----

export function initTelegramBot(): void {
  if (!config.telegramBotToken) {
    console.log('TELEGRAM_BOT_TOKEN not set, skipping bot init');
    return;
  }

  bot = new Bot(config.telegramBotToken);

  // /start — link or greet
  bot.command('start', async (ctx) => {
    const args = ctx.match;
    if (args) {
      const entry = pendingLinks.get(args);
      if (!entry) {
        await ctx.reply('Код привязки недействителен или истёк. Сгенерируйте новый в настройках DachaCare.');
        return;
      }
      if (entry.expiresAt < Date.now()) {
        pendingLinks.delete(args);
        await ctx.reply('Код привязки истёк. Сгенерируйте новый в настройках DachaCare.');
        return;
      }

      const chatId = ctx.chat.id.toString();
      await prisma.user.update({
        where: { id: entry.userId },
        data: { telegramChatId: chatId, notifyByTelegram: true },
      });
      pendingLinks.delete(args);

      await ctx.reply(
        '✅ Аккаунт DachaCare успешно привязан!\n\nВыберите действие:',
        { reply_markup: mainKeyboard() },
      );
    } else {
      await ctx.reply(
        'Привет! Я бот DachaCare 🌱\n\n'
        + 'Чтобы привязать аккаунт, перейдите в Настройки → Уведомления в приложении DachaCare и нажмите «Привязать Telegram».',
        { reply_markup: mainKeyboard() },
      );
    }
  });

  // /stop — disable notifications
  bot.command('stop', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { notifyByTelegram: false },
      });
      await ctx.reply('🔕 Уведомления отключены. Включить обратно можно командой /on или в настройках DachaCare.');
    } else {
      await ctx.reply('Аккаунт не привязан.');
    }
  });

  // /on — enable notifications
  bot.command('on', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { notifyByTelegram: true },
      });
      await ctx.reply('🔔 Уведомления включены!');
    } else {
      await ctx.reply('Аккаунт не привязан.');
    }
  });

  // /today — tasks for today
  bot.command('today', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }

    const tasks = await getTodayTasks(user.id);
    if (tasks.length === 0) {
      await ctx.reply('✅ На сегодня задач нет. Отдыхайте!');
      return;
    }
    const lines = tasks.map(formatTask);
    await ctx.reply(`📋 <b>Задачи на сегодня (${tasks.length}):</b>\n\n${lines.join('\n')}`, { parse_mode: 'HTML' });
  });

  // /week — tasks for the week
  bot.command('week', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }

    const tasks = await getWeekTasks(user.id);
    if (tasks.length === 0) {
      await ctx.reply('✅ На ближайшую неделю задач нет.');
      return;
    }
    const lines = tasks.map(formatTask);
    await ctx.reply(`📅 <b>Задачи на неделю (${tasks.length}):</b>\n\n${lines.join('\n')}`, { parse_mode: 'HTML' });
  });

  // /garden — list plants
  bot.command('garden', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }

    const gardens = await getUserGardens(user.id);
    if (gardens.length === 0) {
      await ctx.reply('У вас пока нет сада. Создайте его в приложении DachaCare.');
      return;
    }

    const parts: string[] = [];
    for (const garden of gardens) {
      const header = `🏡 <b>${garden.name}</b>`;
      if (garden.plants.length === 0) {
        parts.push(`${header}\n  Пока пусто`);
      } else {
        const plantLines = garden.plants.map((p: any) => {
          const name = p.nickname || p.variety?.species?.name || 'Растение';
          const variety = p.variety?.name || '';
          const cat = p.variety?.species?.category?.name || '';
          return `  🌿 ${name}${variety ? ` (${variety})` : ''}${cat ? ` — ${cat}` : ''}`;
        });
        parts.push(`${header}\n${plantLines.join('\n')}`);
      }
    }

    await ctx.reply(parts.join('\n\n'), { parse_mode: 'HTML' });
  });

  // /help
  bot.command('help', async (ctx) => {
    await ctx.reply(
      '🌱 <b>Команды DachaCare:</b>\n\n'
      + '📋 /today — задачи на сегодня\n'
      + '📅 /week — задачи на неделю\n'
      + '🌿 /garden — мои растения\n'
      + '🔔 /on — включить уведомления\n'
      + '🔕 /stop — выключить уведомления\n'
      + '❓ /help — эта справка',
      { parse_mode: 'HTML', reply_markup: mainKeyboard() },
    );
  });

  // ---- Handle keyboard button presses ----
  bot.hears('📋 Сегодня', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }
    const tasks = await getTodayTasks(user.id);
    if (tasks.length === 0) { await ctx.reply('✅ На сегодня задач нет. Отдыхайте!'); return; }
    await ctx.reply(`📋 <b>Задачи на сегодня (${tasks.length}):</b>\n\n${tasks.map(formatTask).join('\n')}`, { parse_mode: 'HTML' });
  });

  bot.hears('📅 Неделя', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }
    const tasks = await getWeekTasks(user.id);
    if (tasks.length === 0) { await ctx.reply('✅ На ближайшую неделю задач нет.'); return; }
    await ctx.reply(`📅 <b>Задачи на неделю (${tasks.length}):</b>\n\n${tasks.map(formatTask).join('\n')}`, { parse_mode: 'HTML' });
  });

  bot.hears('🌿 Мой сад', async (ctx) => {
    const user = await findUserByChatId(ctx.chat.id.toString());
    if (!user) { await ctx.reply('Аккаунт не привязан.'); return; }
    const gardens = await getUserGardens(user.id);
    if (gardens.length === 0) { await ctx.reply('У вас пока нет сада.'); return; }
    const parts: string[] = [];
    for (const garden of gardens) {
      const header = `🏡 <b>${garden.name}</b>`;
      if (garden.plants.length === 0) {
        parts.push(`${header}\n  Пока пусто`);
      } else {
        const plantLines = garden.plants.map((p: any) => {
          const name = p.nickname || p.variety?.species?.name || 'Растение';
          const variety = p.variety?.name || '';
          return `  🌿 ${name}${variety ? ` (${variety})` : ''}`;
        });
        parts.push(`${header}\n${plantLines.join('\n')}`);
      }
    }
    await ctx.reply(parts.join('\n\n'), { parse_mode: 'HTML' });
  });

  bot.hears('❓ Помощь', async (ctx) => {
    await ctx.reply(
      '🌱 <b>Команды DachaCare:</b>\n\n'
      + '📋 /today — задачи на сегодня\n'
      + '📅 /week — задачи на неделю\n'
      + '🌿 /garden — мои растения\n'
      + '🔔 /on — включить уведомления\n'
      + '🔕 /stop — выключить уведомления\n'
      + '❓ /help — эта справка',
      { parse_mode: 'HTML', reply_markup: mainKeyboard() },
    );
  });

  // ---- Start bot ----
  bot.api.getMe().then((me) => {
    botUsername = me.username;
    console.log(`Telegram bot @${botUsername} initialized`);
    bot!.start();
    console.log('Telegram bot polling started');
  }).catch((err) => {
    console.error('Failed to initialize Telegram bot (check TELEGRAM_BOT_TOKEN):', err.message);
    bot = null;
  });
}

export function getBotUsername(): string | null {
  return botUsername;
}
