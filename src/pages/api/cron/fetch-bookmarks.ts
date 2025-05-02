import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '@/lib/supabase';
import { fetchBookmarksForUser } from '@/lib/twitter';
import { classifyBookmark } from '@/lib/openai';
import { logToHedera } from '@/lib/hedera';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  // 1. get users with twitter tokens
  const { data: users, error } = await supabaseService
    .from('profiles')
    .select('id, twitter_tokens_encrypted, last_bookmark_id');
  if (error) return res.status(500).json({ error: error.message });

  for (const user of users) {
    try {
      const bookmarks = await fetchBookmarksForUser(user.twitter_tokens_encrypted, user.last_bookmark_id);
      for (const bm of bookmarks) {
        const classification = await classifyBookmark(bm.text ?? bm.url ?? '');
        await supabaseService.from('bookmarks').insert({
          user_id: user.id,
          tweet_id: bm.id,
          tweet_text: bm.text,
          classification,
        });
      }
      if (bookmarks.length) {
        await supabaseService.from('profiles').update({ last_bookmark_id: bookmarks[0].id }).eq('id', user.id);
        await logToHedera(`User ${user.id} imported ${bookmarks.length} bookmarks at ${new Date().toISOString()}`);
      }
    } catch (e: any) {
      console.error('bookmark import failed', e.message);
    }
  }
  res.json({ success: true });
}
