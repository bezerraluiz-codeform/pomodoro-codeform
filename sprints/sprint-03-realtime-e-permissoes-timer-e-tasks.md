# Sprint 03 - Realtime e Permissões (Timer e Tasks)

## Contexto

Após autenticação, workspaces e tasks persistentes com board por usuário, o próximo passo é atender às necessidades de colaboração em tempo real e regras de permissão específicas: atualização das tasks e do timer em realtime e controle de quem pode pausar o timer.

## Objetivo da sprint

Garantir que tasks e timer sejam atualizados em tempo real entre os membros do mesmo workspace e que apenas usuários administradores possam pausar o timer, enquanto cada usuário só consegue editar as tasks das quais é responsável.

## Escopo (User Stories)

- **US07 - Atualização realtime das tasks**  
  Como membro de um workspace, quero ver as tasks sendo atualizadas em tempo real para acompanhar o trabalho da equipe sem precisar recarregar a página.

- **US08 - Timer em realtime por workspace**  
  Como membro de um workspace, quero ver o timer rodando em tempo real de forma sincronizada entre todos os usuários do grupo.

- **US09 - Edição restrita por responsável**  
  Como usuário, quero poder atualizar apenas as tasks em que sou o responsável para evitar alterações indevidas nas tasks de outros.

- **US10 - Timer pausado apenas por administradores**  
  Como administrador do workspace, quero ser a única pessoa com permissão para pausar o timer, garantindo controle do ritmo de foco do grupo.

## Backlog da sprint

- [ ] Configurar Supabase Realtime (ou recurso equivalente) para a tabela de `tasks`
- [ ] Implementar assinatura em tempo real no front-end para refletir alterações de tasks entre usuários do mesmo workspace
- [ ] Definir e persistir papel do usuário no workspace (`admin` x `member`) na tabela `workspace_members`
- [ ] Implementar regra de permissão no backend/camada de domínio para que apenas o responsável pela task possa editá-la
- [ ] Adaptar o board para bloquear edição de tasks quando o usuário não é o responsável
- [ ] Modelar e persistir o estado do timer por workspace (por exemplo, tabela `workspace_timer_state` ou equivalente)
- [ ] Implementar atualização em tempo real do estado do timer para todos os usuários do workspace
- [ ] Implementar regra de permissão que apenas usuários `admin` possam pausar (e, se definido, iniciar/resetar) o timer do workspace

## Critérios de aceite

- Quando um usuário cria ou altera uma task, os demais membros do mesmo workspace veem a mudança em tempo real sem recarregar a página.
- Usuário só consegue editar tasks em que é o responsável; tentativas de edição de tasks de outros usuários são bloqueadas.
- Timer do workspace permanece sincronizado entre todos os membros (mesmo tempo e estado).
- Somente usuários com papel `admin` conseguem pausar o timer; usuários comuns não veem ou não conseguem acionar a ação de pause.

## Não escopo

- Notificações desktop ou push quando tasks ou timer mudarem de estado.
- Histórico de eventos de timer (log detalhado).
- Painéis analíticos ou relatórios de uso.

## Riscos e dependências

- Configuração incorreta de canais realtime pode gerar inconsistências entre os clientes.
- Regras de permissão precisam ser centralizadas em camada de domínio/backend para evitar brechas de segurança no front.
- A implementação do timer compartilhado depende de como o timer atual foi projetado; pode haver necessidade de refatoração.

## Definição de pronto (DoD)

- Realtime de tasks funcionando em ambiente de desenvolvimento entre dois ou mais usuários logados no mesmo workspace.
- Timer sincronizado entre múltiplas sessões do mesmo workspace.
- Regras de permissão para edição de tasks e pause do timer validadas com cenários de teste básicos.
