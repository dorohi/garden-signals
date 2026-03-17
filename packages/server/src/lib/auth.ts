import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } {
  const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
  return { userId: payload.userId };
}
