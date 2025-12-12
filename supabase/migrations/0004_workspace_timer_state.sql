-- Migration: create workspace_timer_state table
-- Objetivo: modelar estado de timer por workspace com RLS baseada em membros e regra de pausa apenas por admins

create type public.workspace_timer_status as enum ('running', 'paused', 'idle');

create table public.workspace_timer_state (
  workspace_id uuid primary key references public.workspaces (id) on delete cascade,
  status public.workspace_timer_status not null default 'idle',
  remaining_seconds integer not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.workspace_timer_state enable row level security;

-- RLS: membros do workspace podem ler o estado do timer
create policy "Workspace members can read timer state"
  on public.workspace_timer_state
  for select
  using (
    exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = workspace_timer_state.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- RLS: apenas membros do workspace podem atualizar o estado do timer
-- e somente administradores podem deixar o status em 'paused'
create policy "Workspace members can update timer state with admin pause restriction"
  on public.workspace_timer_state
  for update
  using (
    exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = workspace_timer_state.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.workspace_members
      where workspace_members.workspace_id = workspace_timer_state.workspace_id
        and workspace_members.user_id = auth.uid()
    )
    and (
      status <> 'paused'
      or exists (
        select 1
        from public.workspace_members
        where workspace_members.workspace_id = workspace_timer_state.workspace_id
          and workspace_members.user_id = auth.uid()
          and workspace_members.role = 'admin'
      )
    )
  );

-- Trigger de updated_at reutilizando função genérica
create trigger set_workspace_timer_state_updated_at
before update on public.workspace_timer_state
for each row
execute function public.set_updated_at();


