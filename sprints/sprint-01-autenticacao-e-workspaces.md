# Sprint 01 - Autenticação e Workspaces

## Contexto

O produto Pomodoro CodeForm já possui um timer funcional focado em produtividade. Nesta fase, o foco é preparar a base de autenticação e organização de usuários em workspaces, garantindo que apenas contas pré-cadastradas tenham acesso ao sistema.

## Objetivo da sprint

Garantir que somente usuários pré-cadastrados consigam acessar o Pomodoro CodeForm por meio de autenticação, já associados a um workspace em grupo, utilizando a base de dados e permissões configuradas no Supabase na Sprint 00.

## Escopo (User Stories)

- **US01 - Login com usuário pré-cadastrado**  
  Como colaborador da CodeForm, quero fazer login no Pomodoro usando minha conta pré-cadastrada para acessar o workspace de foco da equipe.

- **US02 - Workspaces em grupo**
  Como PO, quero que cada usuário pertença a um workspace em grupo para manter o foco da equipe organizado, sem impor um limite fixo de usuários por workspace.

- **US03 - Usuários e grupos pré-definidos**  
  Como time de produto, quero que exista uma lista de usuários e workspaces pré-configurados no banco para que o acesso inicial seja controlado e sem fluxo de cadastro público.

## Backlog da sprint

- [ ] Integrar autenticação com Supabase no app Next (login por email pré-cadastrado, usando modelo de dados e RLS da Sprint 00)
- [ ] Criar tela de login com validação básica (usuário não cadastrado não acessa)
- [ ] Redirecionar para a tela principal do Pomodoro após login bem-sucedido
- [ ] Exibir no layout principal o nome do usuário autenticado e o workspace atual

## Critérios de aceite

- Usuário só consegue acessar a tela principal do Pomodoro após efetuar login com conta existente na tabela de usuários.
- Caso o e-mail não exista, o sistema deve impedir o acesso e exibir mensagem amigável em português.
- Cada usuário autenticado está vinculado exatamente a um workspace.
- É possível ter múltiplos usuários vinculados a um mesmo workspace, sem limite fixo imposto pela aplicação.
- Os dados de usuário e workspace devem estar persistidos no Supabase.

## Não escopo

- Fluxo de cadastro aberto (self-service) de novos usuários.
- Interface avançada de gerenciamento de workspaces (CRUD completo de workspaces).
- Qualquer lógica de tasks ou board visual.

## Riscos e dependências

- Dependência da conclusão da **Sprint 00 - Configuração Supabase** (projeto, tabelas, RLS, seeds e Realtime) para que a autenticação funcione de ponta a ponta.
- Definição de papéis (roles) iniciais pode impactar permissões futuras; é importante ao menos separar `admin` e `member`.

## Definição de pronto (DoD)

- Modelos de dados criados e versionados (migration ou script de criação de tabelas).
- Projeto consegue conectar ao Supabase em ambiente de desenvolvimento.
- Login funcional com usuários pré-cadastrados.
- Workspace do usuário é identificado e exibido na interface após login.
