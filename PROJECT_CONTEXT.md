## Contexto do Projeto – Pomodoro CodeForm

### Visão geral
- **Propósito**: Criar uma página web de pomodoro focada em produtividade para pessoas desenvolvedoras da CodeForm, com visual dark, clean e minimalista.
- **Branding**: A experiência deve comunicar claramente a marca CodeForm, com o texto **“CodeForm”** em destaque no centro da tela e uso da logo `assets/CodeFormSymbol-SVG-White.svg`.

### Usuário-alvo
- **Perfis principais**:
  - Pessoas desenvolvedoras que trabalham em foco profundo (deep work)
  - Designers e pessoas de produto que alternam entre tarefas criativas e análises
  - Colaboradores da CodeForm que querem organizar blocos de trabalho e descanso

- **Cenários de uso**:
  - Organização de blocos de foco de 30 minutos durante o expediente
  - Pausas rápidas para descanso, alongamento ou água
  - Intervalos maiores para recuperação após períodos prolongados de concentração

## Regras de negócio do Pomodoro
- **Ciclos de foco e descanso**:
  - **Foco**: 30 minutos de trabalho (work)
  - **Descanso curto**: 10 minutos de pausa após cada ciclo de foco
  - **Descanso longo**: 20 minutos de pausa após completar 2 horas de trabalho efetivo

- **Cálculo de 2 horas para descanso longo**:
  - Cada bloco de foco tem 30 minutos
  - Após acumular **4 blocos de foco de 30 minutos (totalizando 120 minutos / 2 horas)**, o próximo descanso deve ser de 20 minutos
  - Sequência típica:
    - Foco 1 (30 min) → Descanso curto (10 min)
    - Foco 2 (30 min) → Descanso curto (10 min)
    - Foco 3 (30 min) → Descanso curto (10 min)
    - Foco 4 (30 min) → **Descanso longo (20 min)**

- **Transição automática entre estados**:
  - Ao finalizar um período de foco, o cronômetro troca automaticamente para o modo descanso (curto ou longo, conforme regra)
  - Ao finalizar um descanso, o cronômetro retorna automaticamente para o próximo período de foco

- **Controles básicos**:
  - Iniciar / Pausar cronômetro
  - Resetar ciclo atual
  - Avançar para o próximo estado (pular descanso ou foco, se o usuário desejar)

## Experiência do Usuário (UX)

### Princípios
- **Foco no essencial**: A interface deve destacar apenas o que é necessário para o uso diário (tempo restante, tipo de período, marca CodeForm e controles principais).
- **Baixa distração**: Nada de animações exageradas, notificações intrusivas ou excesso de texto.
- **Estado sempre claro**: O usuário deve entender instantaneamente se está em **foco** ou **descanso** e quanto tempo falta.

### Fluxo principal
- **Entrada na página**:
  - O usuário vê imediatamente o cronômetro central, o texto **“CodeForm”**, e um botão principal de **Start**.
  - O modo inicial é sempre **Foco – 30:00**.

- **Uso durante o trabalho**:
  - Ao clicar em **Start**, a contagem regressiva começa.
  - Durante o foco, a interface não muda de layout, apenas atualiza o tempo.
  - Ao fim do foco, o usuário é notificado visualmente (mudança de cor/estado) e opcionalmente com um feedback sutil (como uma animação leve ou micro transição).

- **Uso durante o descanso**:
  - O título do modo muda para **“Rest”** ou **“Break”**, e a cor de destaque muda para indicar relaxamento.
  - O texto **“CodeForm”** permanece central como parte da identidade da ferramenta.

## Interface do Usuário (UI)

### Layout geral (tema dark, clean e minimalista)
- **Estrutura**:
  - Fundo em tom escuro sólido (ex.: `#050815` ou similar), sem texturas.
  - Conteúdo principal centralizado vertical e horizontalmente.
  - Layout de página única (single page) sem colunas ou cards desnecessários.

- **Bloco central**:
  - No centro da tela:
    - Logo CodeForm (`assets/CodeFormSymbol-SVG-White.svg`) em destaque, em branco.
    - Abaixo (ou ao lado, dependendo do layout final), o texto **“CodeForm”** em tipografia moderna, bem legível.
    - Cronômetro em dígitos grandes e de alto contraste (ex.: `30:00`), ocupando a maior área visual.
    - Etiqueta de estado (ex.: “Focus”, “Short Break”, “Long Break”) próxima ao cronômetro.

- **Controles**:
  - Botões minimalistas com rótulos claros em inglês:
    - `Start` / `Pause` / `Resume`
    - `Reset`
    - `Skip`
  - Sem bordas pesadas; utilizar cantos levemente arredondados e ícones minimalistas (play/pause).

### Cores e tipografia
- **Paleta base**:
  - Fundo: tons de preto/azul bem escuros (ex.: `#050815`, `#020617`)
  - Texto primário: branco suave (ex.: `#F9FAFB`)
  - Texto secundário: cinza suave (ex.: `#9CA3AF`)

- **Estados do cronômetro**:
  - Foco: cor de destaque mais intensa (ex.: verde água `#22C55E` ou ciano `#22D3EE`)
  - Descanso curto: azul suave (ex.: `#3B82F6`)
  - Descanso longo: roxo/azul mais relaxante (ex.: `#6366F1` ou `#8B5CF6`)

- **Tipografia**:
  - Fonte limpa e moderna (ex.: `Inter`, `SF Pro`, `Roboto`).
  - Título “CodeForm” em peso médio ou semi-bold, sem serifa.
  - Dígitos do cronômetro em peso bold, espaçamento confortável, garantindo ótima legibilidade.

## Comportamento do cronômetro

### Estados principais
- **Focus**:
  - Duração padrão: 30:00
  - Após terminar:
    - Incrementa contador de blocos de foco
    - Verifica se atingiu 4 blocos:
      - Se sim → próximo estado: **Long Break (20:00)** e zera contador de blocos
      - Se não → próximo estado: **Short Break (10:00)**

- **Short Break**:
  - Duração: 10:00
  - Após terminar:
    - Volta para **Focus (30:00)**

- **Long Break**:
  - Duração: 20:00
  - Após terminar:
    - Volta para **Focus (30:00)** com contador de blocos zerado

### Interação com o usuário
- **Start/Pause/Resume**:
  - Usuário pode pausar e retomar sem perder o estado atual.

- **Reset**:
  - Zera apenas o período atual (mantendo ou não o contador de blocos, conforme definição técnica futura).

- **Skip**:
  - Permite pular para o próximo estado (por exemplo, pular um descanso curto se o usuário desejar continuar focado).

## Acessibilidade e usabilidade
- **Contraste**: Garantir contraste alto entre texto/cronômetro e fundo para leitura confortável em tema dark.
- **Tamanho de fonte**: Cronômetro com tamanho bem grande para ser visto de longe; texto de suporte em tamanho mínimo recomendado de acessibilidade.
- **Teclado**: Controles principais (Start, Pause, Reset, Skip) acessíveis via teclado (tab/enter/space).
- **Feedback visual**: Mudança clara de cor e rótulo ao trocar de estado, para que seja óbvio se o momento é de foco ou descanso.

## Futuras extensões (fora do escopo inicial)
- Customização de duração de foco e descanso.
- Histórico de sessões (quantos blocos de foco foram concluídos no dia).
- Notificações desktop (quando o tempo acaba).
- Integração com contas de colaboradores da CodeForm para sincronizar preferências.


