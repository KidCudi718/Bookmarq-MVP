import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) console.error('Error loading tasks:', error.message);
      else setTasks(data);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const addTask = async (title: string) => {
    const { data, error } = await supabase.from('tasks').insert([{ title, completed: false }]);
    if (error) console.error('Error adding task:', error.message);
    else setTasks([...tasks, ...data]);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title} {task.completed ? '(Done)' : ''}</li>
          ))}
        </ul>
      )}
      <button onClick={() => addTask('New Task')}>Add Task</button>
    </div>
  );
}