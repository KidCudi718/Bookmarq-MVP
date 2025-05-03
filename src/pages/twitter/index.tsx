// /src/pages/twitter/index.tsx

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TwitterDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    fetchUser();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Twitter Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email || 'Twitter User'}!</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}