import 'dotenv/config'; // Add dotenv to deps if needed or just use process.env

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
};
