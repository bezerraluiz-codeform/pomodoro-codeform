## Pomodoro CodeForm

[![CI](https://github.com/bezerraluiz-codeform/pomodoro-codeform/actions/workflows/ci.yml/badge.svg)](https://github.com/bezerraluiz-codeform/pomodoro-codeform/actions)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)

### Visão geral

**Pomodoro CodeForm** é uma aplicação web de foco baseada na técnica de Pomodoro, construída em Next.js com foco em Clean Architecture e boas práticas de frontend.
O objetivo é oferecer um fluxo de foco simples, visualmente agradável e alinhado ao padrão de desenvolvimento da CodeForm.

### Funcionalidades

- **Timer de Pomodoro configurável**  
  - Modo **30 min**: 30 min de foco, 10 min de short break, 20 min de long break  
  - Modo **20 min**: 20 min de foco, 5 min de short break, 10 min de long break  
  - Alternância via seletor ao lado do controle de **Tempo contínuo**

- **Lista de tarefas integrada ao foco**  
  - **Criação**, **conclusão** e **remoção** de tarefas  
  - Tarefas associadas ao contexto atual de foco

- **Feedback visual pelo modo atual**  
  - Fundo predominante preto com **camada sutil de cor** para cada modo  
  - Diferenciação entre **Focus**, **Short Break** e **Long Break**

- **Vídeos de foco ao término do ciclo**  
  - Ao final de cada período de foco, um vídeo em tela cheia é reproduzido, sem controles  
  - Seleção aleatória entre `focus.mp4` e `focus2.mp4`  
  - Sobreposição bloqueia interação até o término do vídeo

- **Tempo contínuo (auto-start)**  
  - Opção para iniciar automaticamente o próximo ciclo assim que o atual termina

### Arquitetura e organização

- **Clean Architecture e separação por camadas**
  - **Domain**: entidades e regras de negócio (`src/modules/pomodoro/domain`)
  - **Presentation / ViewModels**: lógica de interface desacoplada de componentes (`viewmodels`)
  - **Presentation / Views**: componentes React e composição de tela (`views` e `components`)

- **Tecnologias principais**
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - ESLint 9 com `eslint-config-next`

### Como rodar o projeto localmente

- **Pré-requisitos**
  - Node.js 22  
  - npm (recomendado usar `npm ci` para instalação reprodutível)

- **Variáveis de ambiente (runtime)**
  - Este projeto usa runtime env via `public/env.js` (build once, deploy anywhere).
  - Fonte de verdade das envs de plataforma: `pomodoro-codeform-backend/plataforma-infra/docker-compose.yml`.
  - Env obrigatórias:
    - `API_URL` (URL base da API, ex.: `http://localhost:3333`)
    - `ENV_NAME` (ex.: `local`, `dev`, `staging`, `prod`)
    - `DEBUG` (`true` ou `false`)
  - Em `npm run dev`/`npm run start`, o arquivo `public/env.js` é gerado a partir de `public/env.template.js`.
  - Se você não for rodar via docker-compose, copie `.env.example` para `.env` e ajuste os valores.

- **Instalação**

```bash
npm ci
```

- **Ambiente de desenvolvimento**

```bash
npm run dev
```

Aplicação disponível em: `http://localhost:3000`

### Scripts disponíveis

- **`npm run dev`**  
  Sobe o servidor de desenvolvimento do Next.js.

- **`npm run env:generate`**  
  Gera `public/env.js` a partir de `public/env.template.js` usando as envs do ambiente.

- **`npm run build`**  
  Gera o build de produção da aplicação.

- **`npm run start`**  
  Sobe o servidor de produção a partir do build gerado.

- **`npm run lint`**  
  Executa o ESLint seguindo a configuração do projeto.

### Pipeline de CI e Deploy

- **GitHub Actions (CI)**  
  - Workflow em `.github/workflows/ci.yml`  
  - Executa:
    - Instalação de dependências (`npm ci`)
    - Lint (`npm run lint`)
    - Build (`npm run build`)

- **GitHub Pages (CD)**  
  - O projeto é preparado para ser publicado em `GitHub Pages`, servindo a aplicação no caminho:  
    `https://bezerraluiz-codeform.github.io/pomodoro-codeform`
  - A publicação é feita via workflow de Actions apontando para a pasta estática exportada pelo Next.js.

### Próximos passos sugeridos

- **Testes automatizados** para casos de uso principais (troca de modos, auto-start, tarefas, seleção de vídeos).  
- **Monitoramento de performance de UI** para garantir fluidez mesmo em dispositivos mais modestos.  
- **Integração com ferramentas de produtividade** (por exemplo, criação de tarefas a partir de outros sistemas internos).  

