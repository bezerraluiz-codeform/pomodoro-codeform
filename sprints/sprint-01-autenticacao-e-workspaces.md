# Sprint 01 - Autenticação e Workspaces

## Contexto

O produto Pomodoro CodeForm já possui um timer funcional focado em produtividade. Nesta fase, o foco é preparar a base de autenticação e organização de usuários em workspaces, respeitando o limite de até 4 usuários por workspace e garantindo que apenas contas pré-cadastradas tenham acesso ao sistema.

## Objetivo da sprint

Garantir que somente usuários pré-cadastrados consigam acessar o Pomodoro CodeForm por meio de autenticação, já associados a um workspace em grupo (até 4 pessoas), preparando a base de dados no Supabase para os próximos incrementos.

## Escopo (User Stories)

- **US01 - Login com usuário pré-cadastrado**  
  Como colaborador da CodeForm, quero fazer login no Pomodoro usando minha conta pré-cadastrada para acessar o workspace de foco da equipe.

- **US02 - Workspaces em grupo (até 4 usuários)**  
  Como PO, quero que cada usuário pertença a um workspace com no máximo 4 usuários para manter o foco em grupos pequenos e controlados.

- **US03 - Usuários e grupos pré-definidos**  
  Como time de produto, quero que exista uma lista de usuários e workspaces pré-configurados no banco para que o acesso inicial seja controlado e sem fluxo de cadastro público.

## Backlog da sprint

- [ ] Configurar projeto Supabase para o Pomodoro CodeForm
- [ ] Modelar tabelas iniciais:
  - [ ] `users` (id, name, email, role, created_at)
  - [ ] `workspaces` (id, name, slug, created_at)
  - [ ] `workspace_members` (workspace_id, user_id, role, created_at)
- [ ] Criar seed de usuários e de um workspace de exemplo (incluindo o usuário informado em `FEATURES.md`)
- [ ] Integrar autenticação com Supabase no app Next (login por email pré-cadastrado)
- [ ] Criar tela de login com validação básica (usuário não cadastrado não acessa)
- [ ] Redirecionar para a tela principal do Pomodoro após login bem-sucedido
- [ ] Exibir no layout principal o nome do usuário autenticado e o workspace atual

## Critérios de aceite

- Usuário só consegue acessar a tela principal do Pomodoro após efetuar login com conta existente na tabela de usuários.
- Caso o e-mail não exista, o sistema deve impedir o acesso e exibir mensagem amigável em português.
- Cada usuário autenticado está vinculado exatamente a um workspace.
- Não é possível ter mais de 4 usuários vinculados ao mesmo workspace.
- Os dados de usuário e workspace devem estar persistidos no Supabase.

## Não escopo

- Fluxo de cadastro aberto (self-service) de novos usuários.
- Interface avançada de gerenciamento de workspaces (CRUD completo de workspaces).
- Qualquer lógica de tasks ou board visual.

## Riscos e dependências

- Dependência de configuração correta do projeto Supabase (chaves, variáveis de ambiente, URL).
- Definição de papéis (roles) iniciais pode impactar permissões futuras; é importante ao menos separar `admin` e `member`.

## Definição de pronto (DoD)

- Modelos de dados criados e versionados (migration ou script de criação de tabelas).
- Projeto consegue conectar ao Supabase em ambiente de desenvolvimento.
- Login funcional com usuários pré-cadastrados.
- Workspace do usuário é identificado e exibido na interface após login.
