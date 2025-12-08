# Sprint 2 - Pomodoro CodeForm

**Objetivo da Sprint**: Implementar toda a lógica de ciclos de foco e descanso (curto e longo), com transições automáticas, ação de skip e melhorias de acessibilidade na interface.

**Duração sugerida**: 2 semanas  
**Foco principal**: Regras de negócio do pomodoro + acessibilidade.

---

## Histórias de Usuário

### História 1: BB-5 - Descanso curto de 10 minutos após cada foco

**Como** pessoa usuária que utiliza blocos de foco,  
**Quero** que, ao terminar um período de foco, o sistema inicie um descanso curto de 10 minutos,  
**Para** que eu possa descansar sem precisar configurar manualmente cada pausa.

#### Critérios de Aceite
- [ ] Ao o cronômetro de foco chegar a 00:00, o sistema deve automaticamente trocar para o modo **Short Break** com duração de 10:00.
- [ ] O rótulo do estado deve mudar de **“Focus”** para **“Short Break”**.
- [ ] A cor de destaque no modo de descanso curto deve seguir a paleta definida (por exemplo, azul suave `#3B82F6`).
- [ ] O botão principal deve permitir iniciar/pausar o descanso curto (comportamento semelhante ao foco).
- [ ] Ao finalizar o descanso curto (00:00), o sistema deve preparar o próximo estado como foco de 30:00, sem iniciar automaticamente (a menos que definido de outra forma na implementação).

**Estimativa**: 8 Story Points  
**Labels**: `frontend`

---

### História 2: BB-6 - Descanso longo de 20 minutos após 2 horas de foco

**Como** pessoa usuária que trabalha em longos períodos de foco,  
**Quero** que, após completar 2 horas de trabalho efetivo (4 blocos de 30 minutos), o sistema ofereça um descanso longo de 20 minutos,  
**Para** ter uma recuperação maior após ciclos intensos de concentração.

#### Critérios de Aceite
- [ ] O sistema deve manter um contador de blocos de foco concluídos (cada bloco de 30 minutos finalizado conta como 1).
- [ ] Após o término de cada foco, o contador de blocos deve ser incrementado.
- [ ] Ao completar **4 blocos de foco concluídos**, o próximo descanso deve ser configurado como **Long Break – 20:00** em vez de Short Break.
- [ ] No modo de descanso longo, o rótulo deve exibir **“Long Break”** e a cor de destaque deve seguir a paleta relaxante (por exemplo, `#6366F1` ou `#8B5CF6`).
- [ ] Após finalizar o descanso longo (00:00), o contador de blocos de foco deve ser zerado e o próximo estado preparado deve ser **Focus – 30:00**.

**Estimativa**: 8 Story Points  
**Labels**: `frontend`

---

### História 3: BB-7 - Transições automáticas entre foco e descansos

**Como** pessoa usuária que quer se concentrar apenas no trabalho,  
**Quero** que o sistema alterne automaticamente entre períodos de foco e descanso,  
**Para** não precisar gerenciar manualmente cada mudança de estado.

#### Critérios de Aceite
- [ ] Ao terminar um foco, o sistema deve decidir automaticamente se o próximo estado é Short Break (10:00) ou Long Break (20:00), conforme regras de negócio.
- [ ] Ao terminar qualquer descanso (curto ou longo), o próximo estado deve ser configurado como **Focus – 30:00**.
- [ ] A mudança de estado deve ser acompanhada de feedback visual claro (mudança de cor e rótulo).
- [ ] O tempo exibido deve ser atualizado imediatamente ao trocar de estado (sem precisar recarregar a página).
- [ ] As transições não devem quebrar o funcionamento dos botões de Start/Pause/Resume/Reset.

**Estimativa**: 5 Story Points  
**Labels**: `frontend`

---

### História 4: BB-8 - Ação de Skip para avançar para o próximo estado

**Como** pessoa usuária,  
**Quero** poder pular um período de foco ou descanso usando um botão de `Skip`,  
**Para** adaptar o fluxo de pomodoro à minha necessidade em situações específicas.

#### Critérios de Aceite
- [ ] Deve existir um botão claramente identificado como `Skip`.
- [ ] Ao clicar em `Skip` durante um período de foco, o sistema deve interromper o foco atual e avançar para o próximo estado planejado (Short Break ou Long Break, conforme regra de blocos).
- [ ] Ao clicar em `Skip` durante um descanso, o sistema deve interromper o descanso atual e preparar o próximo estado como **Focus – 30:00**.
- [ ] A ação de `Skip` deve resetar o tempo do estado que está sendo iniciado (não pode começar com tempo parcial).
- [ ] A ação de `Skip` não deve corromper o contador de blocos de foco (por exemplo, pular um foco não deve contar como bloco concluído).

**Estimativa**: 5 Story Points  
**Labels**: `frontend`

---

### História 5: BB-9 - Acessibilidade e navegação por teclado

**Como** pessoa usuária que pode ter restrições de uso de mouse,  
**Quero** conseguir controlar o cronômetro (Start, Pause, Reset, Skip) usando o teclado,  
**Para** ter uma experiência acessível e eficiente, mesmo sem interação por mouse.

#### Critérios de Aceite
- [ ] Todos os botões principais (`Start`, `Pause`/`Resume`, `Reset`, `Skip`) devem ser alcançáveis via navegação por teclado (Tab/Shift+Tab).
- [ ] Deve ser possível ativar os botões usando Enter ou Espaço.
- [ ] O foco visual (focus ring) deve ser claramente visível em tema dark ao navegar com teclado.
- [ ] O contraste de textos e números do cronômetro deve respeitar boas práticas de acessibilidade para fundo escuro (ex.: contraste mínimo recomendado).
- [ ] Não devem existir armadilhas de foco (o usuário deve conseguir entrar e sair de todos os elementos focáveis).

**Estimativa**: 5 Story Points  
**Labels**: `frontend`, `design`

---

## Definição de Pronto (DoD) da Sprint 2
- [ ] Ciclo de foco (30 min) + descanso curto (10 min) + descanso longo (20 min) implementados conforme regras do `PROJECT_CONTEXT.md`.
- [ ] Contador de blocos de foco funcional, com descanso longo após 4 blocos concluídos.
- [ ] Transições automáticas entre estados (Focus ↔ Short Break ↔ Long Break) funcionando sem erros aparentes.
- [ ] Botão `Skip` implementado e funcionando conforme critérios.
- [ ] Controles principais da tela utilizáveis apenas com teclado, com foco visual adequado.
- [ ] Não há erros críticos no console do navegador relacionados às regras de negócio do cronômetro.


