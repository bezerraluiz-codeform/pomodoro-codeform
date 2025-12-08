# Sprint 1 - Pomodoro CodeForm

**Objetivo da Sprint**: Entregar a primeira versão utilizável da página de pomodoro da CodeForm, com layout dark minimalista, cronômetro de foco de 30 minutos e controles básicos.

**Duração sugerida**: 2 semanas  
**Foco principal**: UI base + cronômetro de foco (30 min).

---

## Histórias de Usuário

### História 1: BB-1 - Layout base dark e branding CodeForm

**Como** pessoa colaboradora da CodeForm,  
**Quero** acessar uma página de pomodoro com identidade visual da CodeForm em tema dark,  
**Para** sentir que estou em um ambiente consistente com os produtos da empresa e manter o foco sem distrações.

#### Critérios de Aceite
- [ ] A página deve utilizar tema dark com fundo em tom escuro sólido (por exemplo, `#050815` ou similar), sem texturas.
- [ ] O conteúdo principal (cronômetro, marca, controles) deve estar centralizado vertical e horizontalmente.
- [ ] A logo da CodeForm (`assets/CodeFormSymbol-SVG-White.svg`) deve ser exibida em destaque na região central.
- [ ] O texto **“CodeForm”** deve aparecer em tipografia moderna e legível, próximo à logo.
- [ ] Deve haver espaço visual claro para o cronômetro central, sem elementos visuais concorrendo por atenção.

**Estimativa**: 5 Story Points  
**Labels**: `frontend`, `design`

---

### História 2: BB-2 - Cronômetro de foco de 30 minutos com controles básicos

**Como** pessoa usuária que deseja trabalhar em blocos de foco,  
**Quero** iniciar um cronômetro de 30 minutos de foco, com controles de start, pause, resume e reset,  
**Para** organizar períodos de trabalho concentrado sem precisar de outra ferramenta.

#### Critérios de Aceite
- [ ] O modo inicial da página deve ser **Focus – 30:00** ao carregar.
- [ ] Ao clicar em **Start**, o cronômetro deve iniciar contagem regressiva de 30:00 até 00:00.
- [ ] Ao clicar em **Pause**, o tempo deve parar de diminuir, mantendo o valor atual.
- [ ] Ao clicar em **Resume**, o cronômetro deve continuar a contagem a partir do tempo pausado.
- [ ] Ao clicar em **Reset**, o tempo deve voltar para 30:00 no estado de foco.
- [ ] O cronômetro não deve ficar negativo; ao chegar em 00:00, a contagem deve parar.
- [ ] Os botões devem estar claramente identificados com rótulos em inglês: `Start`, `Pause` (ou `Resume`), `Reset`.

**Estimativa**: 8 Story Points  
**Labels**: `frontend`

---

### História 3: BB-3 - Indicação visual clara do estado de foco

**Como** pessoa usuária,  
**Quero** ver claramente quando estou em um período de foco,  
**Para** reduzir dúvidas sobre se estou em fase de trabalho ou descanso.

#### Critérios de Aceite
- [ ] Quando o cronômetro estiver em modo de foco, deve haver uma etiqueta textual próxima ao timer com o texto **“Focus”**.
- [ ] A cor de destaque do cronômetro em foco deve seguir a paleta definida (por exemplo, verde água `#22C55E` ou ciano `#22D3EE`).
- [ ] O restante da UI (fundos, textos secundários) deve manter o tema dark sem poluição visual.
- [ ] O estado de foco deve ser perceptível em menos de 1 segundo de observação (princípio de clareza imediata).

**Estimativa**: 3 Story Points  
**Labels**: `frontend`, `design`

---

### História 4: BB-4 - Responsividade básica do layout central

**Como** pessoa usuária que pode usar a ferramenta em diferentes tamanhos de tela,  
**Quero** que o cronômetro, a marca CodeForm e os controles se adaptem bem em telas pequenas e grandes,  
**Para** conseguir utilizar o pomodoro tanto em monitores quanto em notebooks.

#### Critérios de Aceite
- [ ] O bloco central (logo, texto “CodeForm”, cronômetro e controles) deve permanecer centrado em resoluções comuns de desktop e notebook.
- [ ] Em telas menores, o cronômetro e os botões não devem ficar cortados ou sobrepostos.
- [ ] A tipografia deve permanecer legível em diferentes larguras (sem fontes extremamente pequenas em telas reduzidas).
- [ ] Não é obrigatório otimizar para mobile nesta sprint, mas não deve haver quebra crítica da interface em larguras a partir de ~1024px.

**Estimativa**: 5 Story Points  
**Labels**: `frontend`, `design`

---

## Definição de Pronto (DoD) da Sprint 1
- [ ] Todas as histórias acima possuem critérios de aceite atendidos e validados em ambiente de desenvolvimento.
- [ ] UI em tema dark implementada conforme paleta base proposta no `PROJECT_CONTEXT.md`.
- [ ] Cronômetro de 30 minutos de foco funcionando com start/pause/resume/reset.
- [ ] Estado de foco claramente indicado visualmente.
- [ ] Não há erros críticos no console do navegador relacionados ao fluxo principal da tela.


