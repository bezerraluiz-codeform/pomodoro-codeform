-- Migration: create tasks table
-- Objetivo: modelar tasks por workspace com RLS baseada em membros e owner

create type public.task_status as enum ('doing', 'done');

create table public.tasks (
  id uuid primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  owner_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'doing',
  sla_datetime timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index tasks_workspace_id_idx on public.tasks (workspace_id);
create index tasks_owner_id_idx on public.tasks (owner_id);

alter table public.tasks enable row level security;

-- RLS: membros do workspace podem ler tasks do próprio workspace
create policy "Workspace members can read workspace tasks"
  on public.tasks
  for select
  using (
    exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- RLS: apenas owner ou admins do workspace podem atualizar tasks
create policy "Task owner or workspace admins can update task"
  on public.tasks
  for update
  using (
    auth.uid() = owner_id
    or exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- RLS: apenas owner ou admins do workspace podem deletar tasks
create policy "Task owner or workspace admins can delete task"
  on public.tasks
  for delete
  using (
    auth.uid() = owner_id
    or exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- Trigger de updated_at reutilizando função genérica
create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();


