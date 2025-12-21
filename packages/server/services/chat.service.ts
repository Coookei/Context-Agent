import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import template from '../prompts/agent.txt';
import { conversationRepository } from '../repositories/conversation.repository';

const client = new OpenAI();

const context = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'context.md'),
  'utf-8'
);
const instructions = template.replace('{{context}}', context);

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 200,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
