# Sprint 02 - Tasks Persistentes e Board por Usuário

## Contexto

Com a autenticação e os workspaces definidos, o próximo passo é permitir que as tasks do usuário sejam persistidas em banco e organizadas visualmente em colunas por usuário, atendendo ao cenário de trabalho em grupo descrito em `FEATURES.md`.

## Objetivo da sprint

Permitir que as tasks sejam salvas em banco de dados (Supabase), compartilhadas entre membros do mesmo workspace e exibidas em um board em colunas por usuário, com informações de responsável, status, nome da task e SLA.

## Escopo (User Stories)

- **US04 - Tasks salvas em banco**  
  Como usuário autenticado, quero que minhas tasks sejam salvas em banco de dados para não perder meu planejamento entre sessões.

- **US05 - Tasks compartilhadas por workspace**  
  Como membro de um workspace, quero visualizar as tasks de todos os usuários do meu workspace para ter visão do trabalho em grupo.

- **US06 - Board em colunas por usuário**  
  Como usuário, quero visualizar um board com colunas por usuário (uma coluna por pessoa do workspace) contendo cards com responsável, status, nome da task e SLA.

## Backlog da sprint

- [ ] Validar se a modelagem da tabela `tasks` e relacionamentos criada na Sprint 00 atende aos casos de uso desta sprint, ajustando via migration incremental se necessário
- [ ] Implementar endpoints/camadas de acesso a dados para CRUD básico de tasks (create, read, update, delete) respeitando o workspace do usuário logado
- [ ] Adaptar o front-end para buscar e salvar tasks no Supabase (substituir ou complementar o uso de `localStorage`)
- [ ] Implementar board visual em colunas por usuário dentro do workspace:
- [ ] Coluna com nome do usuário
- [ ] Cards exibindo responsável, status, nome da task e SLA
- [ ] Garantir que o usuário só veja tasks do seu workspace

## Critérios de aceite

- Tasks criadas pelo usuário autenticado são persistidas no Supabase e carregadas novamente ao recarregar a página.
- Usuários do mesmo workspace veem o mesmo conjunto de tasks, em colunas separadas por responsável.
- Cada card de task exibe claramente: responsável, status, nome da task e SLA.
- Usuário não vê tasks de workspaces diferentes.

## Não escopo

- Atualização em tempo real (realtime) das tasks entre usuários (será tratada em sprint futura).
- Regras avançadas de permissão além de responsável e workspace (por exemplo, papéis complexos de aprovação).
- Histórico de alterações de tasks.

## Riscos e dependências

- Modelagem inadequada da tabela de tasks (definida na Sprint 00) pode dificultar futuras regras de permissão e realtime.
- A performance de consultas pode ser impactada se filtros por workspace e usuário não forem bem planejados.

## Definição de pronto (DoD)

- Tabelas criadas e testadas no Supabase.
- Fluxo de criação, leitura e atualização de tasks funcionando em ambiente de desenvolvimento.
- Board visual por usuário disponível e integrado ao backend.
