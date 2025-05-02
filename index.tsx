import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('bookmarks').select('*').then(({ data }) => setBookmarks(data ?? []));
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Bookmarq Dashboard</h1>
      {!bookmarks.length && <p>No bookmarks yet.</p>}
      <ul className="space-y-4">
        {bookmarks.map((bm) => (
          <li key={bm.id} className="border p-4 rounded">
            <a href={`https://x.com/i/bookmarks/${bm.tweet_id}`} target="_blank" rel="noreferrer" className="font-medium hover:underline">
              {bm.tweet_text?.slice(0, 120) ?? bm.tweet_id}
            </a>
            <pre className="text-xs mt-2">{JSON.stringify(bm.classification, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
