-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Create Trigger for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create User Library Table
create type public.library_status as enum ('watching', 'completed', 'dropped', 'plan_to_watch');

create table public.user_library (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  anime_id_jikan integer not null,
  title text not null,
  image_url text,
  status public.library_status default 'watching' not null,
  score integer check (score >= 0 and score <= 10),
  episodes_watched integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(user_id, anime_id_jikan)
);

-- Enable RLS on User Library
alter table public.user_library enable row level security;

create policy "Users can view their own library items." on public.user_library
  for select using (auth.uid() = user_id);

create policy "Users can insert their own library items." on public.user_library
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own library items." on public.user_library
  for update using (auth.uid() = user_id);

create policy "Users can delete their own library items." on public.user_library
  for delete using (auth.uid() = user_id);
