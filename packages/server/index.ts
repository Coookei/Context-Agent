import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import OpenAI from 'openai';
import z from 'zod';

const client = new OpenAI();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

const conversations = new Map<string, string>(); // conversationId: lastResponseId

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(z.treeifyError(parsed.error));
  }

  try {
    const { prompt, conversationId } = parsed.data;

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, response.id);

    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response.' });
    console.error('Error generating text:', error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
