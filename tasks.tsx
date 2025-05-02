
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Task = {
  id: string;
  tweet_text: string;
  classification: any;
  approved: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const fetchTasks = async () => {
    const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
    if (!error) setTasks(data as any);
  };
  useEffect(() => { fetchTasks(); }, []);

  const approve = async (id: string) => {
    await fetch('/api/tasks/approve', { method: 'POST', body: JSON.stringify({ id }) });
    setTasks((t) => t.map((x) => x.id === id ? { ...x, approved: true } : x));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Bookmark Tasks</h1>
      {tasks.map(task => (
        <div key={task.id} className="border rounded p-4 mb-3">
          <p className="mb-2">{task.tweet_text}</p>
          <pre className="text-xs bg-gray-100 p-2 rounded mb-2">{JSON.stringify(task.classification, null, 2)}</pre>
          <button
            onClick={() => approve(task.id)}
            disabled={task.approved}
            className="px-3 py-1 text-sm rounded bg-green-600 text-white disabled:opacity-50"
          >
            {task.approved ? 'Approved' : 'Approve & Log'}
          </button>
        </div>
      ))}
    </div>
  );
}
