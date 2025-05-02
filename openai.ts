import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const bookmarkSchema = z.object({
  category: z.enum(['article', 'prompt', 'code', 'meme', 'todo']),
  urgency: z.enum(['low', 'medium', 'high']),
  action: z.enum(['read', 'use', 'share', 'ignore']),
});

export async function classifyBookmark(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: `You are a JSON classifier. Output must follow this JSON schema exactly: ${bookmarkSchema.toString()}` },
      { role: 'user', content: text },
    ],
    response_format: { type: 'json_object' },
  });
  const parsed = bookmarkSchema.parse(JSON.parse(response.choices[0].message.content));
  return parsed;
}
