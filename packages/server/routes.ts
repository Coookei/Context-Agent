import type { Request, Response } from 'express';
import express from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.json({ message: 'API is online' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
