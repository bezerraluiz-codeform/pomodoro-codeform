-- Migration: create users table linked to auth.users
-- Objetivo: perfil de usuário com RLS restrito ao próprio registro

create type public.user_role as enum ('admin', 'member');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text not null,
  role public.user_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index users_email_key on public.users (email);

alter table public.users enable row level security;

-- RLS: usuário autenticado só lê o próprio perfil
create policy "Users can read own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- RLS: usuário autenticado só atualiza o próprio perfil
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- Trigger genérica para atualizar updated_at em updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- Sincronização entre auth.users e public.users (criação)
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name'
    ),
    new.email,
    'member'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- Sincronização entre auth.users e public.users (atualização de e-mail)
create or replace function public.handle_updated_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
     set email = new.email,
         -- Mantém o valor atual se o metadado não vier preenchido
         name = coalesce(
           new.raw_user_meta_data->>'name',
           new.raw_user_meta_data->>'full_name',
           public.users.name
         )
   where id = new.id;

  return new;
end;
$$;

create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row
execute function public.handle_updated_auth_user();
