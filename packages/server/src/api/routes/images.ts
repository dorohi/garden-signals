import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import prisma from '../../lib/prisma.js';
import { authMiddleware } from '../../lib/middleware.js';
import { adminMiddleware } from '../../lib/adminMiddleware.js';

export const imagesRouter = Router();

const UPLOAD_DIR = path.resolve('uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Допустимы только изображения (jpg, png, webp, gif)'));
    }
  },
});

// GET /api/images?entityType=disease&entityId=xxx — public
imagesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.query;
    if (!entityType || !entityId) {
      res.status(400).json({ error: 'entityType и entityId обязательны' });
      return;
    }

    const images = await prisma.image.findMany({
      where: { entityType: entityType as string, entityId: entityId as string },
      orderBy: { order: 'asc' },
    });

    res.json(images.map((img) => ({
      id: img.id,
      url: `/uploads/${img.filename}`,
      filename: img.filename,
      order: img.order,
    })));
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// POST /api/images — admin only, multipart upload
imagesRouter.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.body;
    if (!entityType || !entityId || !req.file) {
      res.status(400).json({ error: 'entityType, entityId и файл обязательны' });
      return;
    }

    const count = await prisma.image.count({
      where: { entityType, entityId },
    });

    const image = await prisma.image.create({
      data: {
        entityType,
        entityId,
        filename: req.file.filename,
        order: count,
      },
    });

    res.status(201).json({
      id: image.id,
      url: `/uploads/${image.filename}`,
      filename: image.filename,
      order: image.order,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// DELETE /api/images/:id — admin only
imagesRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      res.status(404).json({ error: 'Изображение не найдено' });
      return;
    }

    // Delete file
    const filePath = path.join(UPLOAD_DIR, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.image.delete({ where: { id } });

    res.json({ message: 'Изображение удалено' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
