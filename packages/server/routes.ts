import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is online' });
});

router.post('/api/chat', chatController.sendMessage);

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

router.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;
