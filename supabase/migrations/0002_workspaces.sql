-- Migration: create workspaces and workspace_members tables
-- Objetivo: modelo de workspaces em grupo com RLS baseada em membros

-- Tabela de workspaces
create table public.workspaces (
  id uuid primary key,
  name text not null,
  slug text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index workspaces_slug_key on public.workspaces (slug);

-- Tabela de associação usuário <-> workspace
create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role public.user_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workspace_members_pkey primary key (workspace_id, user_id)
);

-- Índices auxiliares para consultas por usuário e workspace
create index workspace_members_user_id_idx on public.workspace_members (user_id);
create index workspace_members_workspace_id_idx on public.workspace_members (workspace_id);

-- RLS em workspaces: usuário só enxerga workspaces em que é membro
alter table public.workspaces enable row level security;

create policy "Workspace members can read workspace"
  on public.workspaces
  for select
  using (
    exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
        and workspace_members.user_id = auth.uid()
    )
  );

-- RLS em workspace_members: usuário só enxerga suas próprias associações
alter table public.workspace_members enable row level security;

create policy "Users can read own workspace memberships"
  on public.workspace_members
  for select
  using (auth.uid() = user_id);

-- Triggers de updated_at reutilizando função genérica
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

create trigger set_workspace_members_updated_at
before update on public.workspace_members
for each row
execute function public.set_updated_at();


