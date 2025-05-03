// /src/pages/index.tsx

import { supabase } from '@/lib/supabase';

const handleTwitterLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  });
  if (error) console.error('Twitter login error:', error.message);
};

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Bookmarq</h1>
      <p>Sign in to access your bookmarks and Twitter data.</p>
      <button
        onClick={handleTwitterLogin}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#1DA1F2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Sign in with Twitter
      </button>
      <div style={{ marginTop: '1rem' }}>
        <a href="/twitter">Go to Twitter Dashboard</a>
      </div>
    </div>
  );
}