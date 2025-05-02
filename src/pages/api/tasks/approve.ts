
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '@/lib/supabase';
import { logToHedera } from '@/lib/hedera';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = JSON.parse(req.body);
  if (!id) return res.status(400).json({ error: 'id required' });

  // mark approved
  const { error } = await supabaseService.from('bookmarks').update({ approved: true }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  // log to Hedera
  await logToHedera(`Bookmark task ${id} approved at ${new Date().toISOString()}`);

  return res.json({ success: true });
}
