create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  tweet_url text not null,
  category text,
  draft text,
  approved boolean default false,
  inserted_at timestamp default now()
);
