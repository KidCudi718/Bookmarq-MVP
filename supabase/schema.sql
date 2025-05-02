
-- Bookmarq Supabase Schema

-- Profiles table (one row per user)
create table if not exists profiles (
  id uuid primary key,
  twitter_tokens_encrypted text not null,
  last_bookmark_id text,
  inserted_at timestamptz default now()
);

-- Bookmarks table
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  twitter_id text,
  tweet_text text,
  classification jsonb,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Any rows readable only by owner (enable RLS after hackathon)
