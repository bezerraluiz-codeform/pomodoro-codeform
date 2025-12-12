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
  - [ ] Configurar variáveis de ambiente no projeto Next (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
  - [ ] Versionar scripts de criação de schema (SQL ou via Supabase CLI) em repositório separado ou pasta `infra/` do projeto.

- [ ] **Autenticação e usuários pré-cadastrados**

  - [ ] Definir método de autenticação (e-mail + senha) no Supabase Auth, desabilitando sign-up público.  
        _Configuração manual no dashboard do Supabase: habilitar apenas e-mail/senha e desabilitar sign-up público._
  - [x] Criar tabela `users` (perfil de usuário) referenciando `auth.users`:
    - [x] `id` (uuid, PK, referência para `auth.users.id`)
    - [x] `name`
    - [x] `email`
    - [x] `role` (enum: `admin`, `member`)
    - [x] `created_at`, `updated_at`
  - [x] Habilitar RLS na tabela `users` com políticas para que o usuário só consiga ler/atualizar o próprio perfil.

- [x] **Modelagem de workspaces e membros**

  - [x] Criar tabela `workspaces`:
    - [x] `id` (uuid, PK)
    - [x] `name`
    - [x] `slug`
    - [x] `created_at`, `updated_at`
  - [x] Criar tabela `workspace_members`:
    - [x] `workspace_id` (FK para `workspaces.id`)
    - [x] `user_id` (FK para `users.id`)
    - [x] `role` (enum: `admin`, `member`)
    - [x] `created_at`, `updated_at`
    - [x] Constraint de unicidade (`workspace_id`, `user_id`)
  - [x] Configurar RLS em `workspaces` e `workspace_members` garantindo que o usuário só veja dados de workspaces dos quais participa.

- [x] **Modelagem de tasks**

  - [x] Criar tabela `tasks`:
    - [x] `id` (uuid, PK)
    - [x] `workspace_id` (FK para `workspaces.id`)
    - [x] `owner_id` (FK para `users.id`)
    - [x] `title`
    - [x] `description`
    - [x] `status` (enum: `doing`, `done` ou similar)
    - [x] `sla_datetime`
    - [x] `created_at`, `updated_at`
  - [x] Adicionar trigger genérica para atualizar `updated_at` em `tasks`, `workspaces` e `workspace_members` em `UPDATE`.
  - [x] Configurar RLS em `tasks` para que:
    - [x] Usuários só leiam tasks do próprio workspace.
    - [x] Apenas o `owner_id` ou administradores do workspace possam atualizar/deletar tasks.

- [x] **Modelagem do timer por workspace**

  - [x] Criar tabela `workspace_timer_state`:
  - [x] `workspace_id` (PK/FK para `workspaces.id`)
  - [x] `status` (enum: `running`, `paused`, `idle`)
  - [x] `remaining_seconds`
  - [x] `updated_at`
  - [x] Configurar RLS em `workspace_timer_state` permitindo acesso somente a membros do workspace.
  - [x] Preparar índice se necessário para consultas por `workspace_id`.

- [x] **Realtime (nível Supabase)**

  - [x] Habilitar Realtime para as tabelas `tasks` e `workspace_timer_state` adicionando-as à publicação `supabase_realtime`:

    ```sql
    alter publication supabase_realtime add table public.tasks;
    alter publication supabase_realtime add table public.workspace_timer_state;
    ```

  - [x] Definir filtros de canal (por schema e tabela) limitando apenas ao necessário para o Pomodoro CodeForm:

    - **Tasks**: canal lógico por workspace (ex.: `pomodoro:tasks:workspace:{workspaceId}`) assinando mudanças na tabela `public.tasks` filtradas por `workspace_id`:

      ```ts
      supabase
        .channel(`pomodoro:tasks:workspace:${workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `workspace_id=eq.${workspaceId}`,
          },
          handleTaskChange,
        )
        .subscribe();
      ```

    - **Timer por workspace**: canal lógico por workspace (ex.: `pomodoro:timer:workspace:{workspaceId}`) assinando mudanças na tabela `public.workspace_timer_state` filtradas por `workspace_id`:

      ```ts
      supabase
        .channel(`pomodoro:timer:workspace:${workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "workspace_timer_state",
            filter: `workspace_id=eq.${workspaceId}`,
          },
          handleTimerChange,
        )
        .subscribe();
      ```

  - [x] Documentar canais/eventos que o front-end deverá assinar para atender `FEATURES.md` e as sprints 02 e 03:

    - Eventos `postgres_changes` em `public.tasks` para refletir criação, atualização e deleção de tasks entre membros do mesmo workspace.
    - Eventos `postgres_changes` em `public.workspace_timer_state` para manter o timer sincronizado entre todos os usuários do workspace.
    - Uso consistente de filtros por `workspace_id` para garantir isolamento entre workspaces e alinhamento com as políticas de RLS.

- [x] **Documentação**
  - [x] Validar que os dados prontos atendem ao cenário descrito em `FEATURES.md` (usuários e workspaces pré-cadastrados), garantindo pelo menos:
    - Usuário pré-cadastrado com e-mail `luiz.a@cartoriocriciuma.com.br` existente em `auth.users` e sincronizado em `public.users` com papel adequado (`admin` ou `member`) via trigger `handle_new_auth_user`.
    - Pelo menos um `workspace` criado em `public.workspaces` e associado ao usuário via `public.workspace_members`, respeitando o modelo de workspaces em grupo.
    - Um registro em `public.workspace_timer_state` para cada workspace ativo, permitindo que o timer em realtime seja compartilhado entre os membros do mesmo workspace.

## Critérios de aceite

- Projeto Supabase criado e acessível, com URL e chaves configuradas em ambiente de desenvolvimento do Pomodoro CodeForm.
- Tabelas `users`, `workspaces`, `workspace_members`, `tasks` e `workspace_timer_state` criadas com FKs, constraints e enums definidos.
- Triggers de negócio configuradas (por exemplo, atualização de timestamps e garantias de integridade) testadas e funcionando.
- RLS habilitado e testado, garantindo que um usuário não consegue acessar dados de outro workspace.
- Realtime habilitado e validado para `tasks` e `workspace_timer_state` (eventos visíveis via console ou script de teste).
- Supabase Auth e sincronizados com a tabela `users`.

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
