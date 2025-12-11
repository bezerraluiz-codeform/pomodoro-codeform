# Sprint 00 - Configuração Supabase (Auth, Tabelas e Realtime)

## Contexto

O Pomodoro CodeForm usará o Supabase como backend gerenciado (Postgres, Auth, Storage e Realtime). Antes de implementar autenticação, workspaces, tasks e timer colaborativo, é necessário preparar uma base de dados consistente, segura (RLS) e com suporte a eventos em tempo real.

## Objetivo da sprint

Entregar um projeto Supabase configurado e versionado para o Pomodoro CodeForm, com:

- autenticação restrita a usuários pré-cadastrados,
- modelo de dados principal (`users`, `workspaces`, `workspace_members`, `tasks`, `workspace_timer_state`),
- triggers e constraints para garantir regras de negócio críticas (por exemplo, integridade dos relacionamentos e atualização de timestamps),
- Realtime habilitado para as tabelas que serão usadas nas próximas sprints.

## Escopo (Technical Stories)

- **TS01 - Projeto Supabase configurado e versionado**  
  Como time de engenharia, quero ter um projeto Supabase configurado e versionado (migrations/seed) para que o app Next consiga conectar com segurança em qualquer ambiente.

- **TS02 - Autenticação com usuários pré-cadastrados**  
  Como time de produto, quero que apenas usuários pré-cadastrados consigam autenticar via Supabase, respeitando os usuários definidos em `FEATURES.md`.

- **TS03 - Modelo de dados para workspaces, tasks e timer**  
  Como time de engenharia, quero um modelo de dados consistente para usuários, workspaces, tasks e timer por workspace, preparado para regras de permissão e realtime.

- **TS04 - Realtime habilitado para tasks e timer**  
  Como time de engenharia, quero o Realtime configurado nas tabelas relevantes para que o front-end consiga assinar atualizações sem depender de pooling.

## Backlog da sprint

- [ ] **Configuração do projeto Supabase**

  - [ ] Criar projeto Supabase dedicado ao Pomodoro CodeForm.
  - [ ] Configurar variáveis de ambiente no projeto Next (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` em ambiente seguro).
  - [ ] Versionar scripts de criação de schema (SQL ou via Supabase CLI) em repositório separado ou pasta `infra/` do projeto.

- [ ] **Autenticação e usuários pré-cadastrados**

  - [ ] Definir método de autenticação (e-mail + senha) no Supabase Auth, desabilitando sign-up público.
  - [ ] Criar script/seed para cadastro dos usuários pré-definidos (por exemplo, `luiz.a@cartoriocriciuma.com.br`) diretamente no Auth do Supabase.
  - [ ] Criar tabela `users` (perfil de usuário) referenciando `auth.users`:
    - [ ] `id` (uuid, PK, referência para `auth.users.id`)
    - [ ] `name`
    - [ ] `email`
    - [ ] `role` (enum: `admin`, `member`)
    - [ ] `created_at`, `updated_at`
  - [ ] Habilitar RLS na tabela `users` com políticas para que o usuário só consiga ler/atualizar o próprio perfil.

- [ ] **Modelagem de workspaces e membros**

  - [ ] Criar tabela `workspaces`:
    - [ ] `id` (uuid, PK)
    - [ ] `name`
    - [ ] `slug`
    - [ ] `created_at`, `updated_at`
  - [ ] Criar tabela `workspace_members`:
    - [ ] `workspace_id` (FK para `workspaces.id`)
    - [ ] `user_id` (FK para `users.id`)
    - [ ] `role` (enum: `admin`, `member`)
    - [ ] `created_at`, `updated_at`
    - [ ] Constraint de unicidade (`workspace_id`, `user_id`)
  - [ ] Configurar RLS em `workspaces` e `workspace_members` garantindo que o usuário só veja dados de workspaces dos quais participa.

- [ ] **Modelagem de tasks**

  - [ ] Criar tabela `tasks`:
    - [ ] `id` (uuid, PK)
    - [ ] `workspace_id` (FK para `workspaces.id`)
    - [ ] `owner_id` (FK para `users.id`)
    - [ ] `title`
    - [ ] `description`
    - [ ] `status` (enum: `todo`, `doing`, `done` ou similar)
    - [ ] `sla_datetime`
    - [ ] `created_at`, `updated_at`
  - [ ] Adicionar trigger genérica para atualizar `updated_at` em `tasks`, `workspaces` e `workspace_members` em `UPDATE`.
  - [ ] Configurar RLS em `tasks` para que:
    - [ ] Usuários só leiam tasks do próprio workspace.
    - [ ] Apenas o `owner_id` ou administradores do workspace possam atualizar/deletar tasks.

- [ ] **Modelagem do timer por workspace**

  - [ ] Criar tabela `workspace_timer_state`:
    - [ ] `workspace_id` (PK/FK para `workspaces.id`)
    - [ ] `status` (enum: `running`, `paused`, `idle`)
    - [ ] `remaining_seconds`
    - [ ] `updated_at`
  - [ ] Configurar RLS em `workspace_timer_state` permitindo acesso somente a membros do workspace.
  - [ ] Preparar índice se necessário para consultas por `workspace_id`.

- [ ] **Realtime (nível Supabase)**

  - [ ] Habilitar Realtime para as tabelas `tasks` e `workspace_timer_state`.
  - [ ] Verificar filtros de canal (por schema e tabela) e limitar apenas ao necessário para o Pomodoro CodeForm.
  - [ ] Documentar canais/eventos que o front-end deverá assinar (ex.: `postgres_changes` em `public.tasks` e `public.workspace_timer_state`).

- [ ] **Migrations, seeds e documentação**
  - [ ] Garantir que toda criação de tabelas, enums, triggers, RLS e seeds esteja versionada em scripts reproduzíveis.
  - [ ] Documentar no repositório como subir o banco localmente (ou usar Supabase cloud) e como aplicar migrations/seeds.
  - [ ] Validar que os dados prontos atendem ao cenário descrito em `FEATURES.md` (usuários e workspaces pré-cadastrados).

## Critérios de aceite

- Projeto Supabase criado e acessível, com URL e chaves configuradas em ambiente de desenvolvimento do Pomodoro CodeForm.
- Tabelas `users`, `workspaces`, `workspace_members`, `tasks` e `workspace_timer_state` criadas com FKs, constraints e enums definidos.
- Triggers de negócio configuradas (por exemplo, atualização de timestamps e garantias de integridade) testadas e funcionando.
- RLS habilitado e testado, garantindo que um usuário não consegue acessar dados de outro workspace.
- Realtime habilitado e validado para `tasks` e `workspace_timer_state` (eventos visíveis via console ou script de teste).
- Usuários pré-cadastrados disponíveis no Supabase Auth e sincronizados com a tabela `users`.

## Não escopo

- Telas de login, navegação ou UX do Pomodoro (tratadas nas sprints 01+).
- Board visual de tasks e integração em tempo real com o front-end.
- Qualquer fluxo de cadastro público de novos usuários.

## Riscos e dependências

- Má configuração de RLS pode vazar dados entre workspaces; exige revisão cuidadosa dos scripts.
- Configuração incorreta de constraints ou triggers pode causar inconsistência de dados ou falhas silenciosas.
- Dependência da disponibilidade do Supabase (cloud ou self-hosted) para desenvolvimento e testes das sprints seguintes.

## Definição de pronto (DoD)

- Scripts de schema, RLS, triggers, enums e seeds versionados no repositório.
- Banco Supabase provisionado, acessível e com dados iniciais consistentes com `FEATURES.md`.
- Checklist de testes manuais executado validando autenticação, acesso às tabelas e comportamento de Realtime nas tabelas configuradas.
- Documentação mínima para outros devs conseguirem subir o ambiente em menos de 30 minutos.
