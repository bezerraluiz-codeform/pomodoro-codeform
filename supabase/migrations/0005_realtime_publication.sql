-- Migration: enable Realtime for tasks and workspace_timer_state
-- Objetivo: adicionar tabelas na publicação supabase_realtime para consumo pelo front-end

alter publication supabase_realtime add table public.tasks;

alter publication supabase_realtime add table public.workspace_timer_state;


