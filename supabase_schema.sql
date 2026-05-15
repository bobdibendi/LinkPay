-- Colle ce SQL dans Supabase -> SQL Editor -> Run

-- Table des utilisateurs (étendue de auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  username text unique,
  balance numeric(10,4) default 0,
  total_earnings numeric(10,4) default 0,
  created_at timestamp with time zone default now()
);

-- Table des liens
create table public.links (
  id text primary key,              -- ex: "x7k2m"
  user_id uuid references public.profiles(id) on delete cascade,
  destination_url text not null,
  title text,
  visits integer default 0,
  earnings numeric(10,4) default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Table des clics (pour stats détaillées)
create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  link_id text references public.links(id) on delete cascade,
  ip_hash text,                     -- hash de l'IP (pas l'IP brute, RGPD)
  country text,
  user_agent text,
  earnings numeric(10,6) default 0,
  created_at timestamp with time zone default now()
);

-- Table des retraits
create table public.withdrawals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  amount numeric(10,2),
  method text default 'paypal',     -- paypal, virement
  paypal_email text,
  status text default 'pending',    -- pending, paid, rejected
  created_at timestamp with time zone default now()
);

-- RLS (Row Level Security) : chaque user ne voit que ses données
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.withdrawals enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own links" on public.links for select using (auth.uid() = user_id);
create policy "Users can insert own links" on public.links for insert with check (auth.uid() = user_id);
create policy "Users can update own links" on public.links for update using (auth.uid() = user_id);
create policy "Users can delete own links" on public.links for delete using (auth.uid() = user_id);
create policy "Public can view active links" on public.links for select using (is_active = true);

create policy "Users can view own clicks" on public.clicks for select using (
  link_id in (select id from public.links where user_id = auth.uid())
);

create policy "Users can view own withdrawals" on public.withdrawals for select using (auth.uid() = user_id);
create policy "Users can insert own withdrawals" on public.withdrawals for insert with check (auth.uid() = user_id);

-- Fonction auto-création de profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
