# 📋 ROADMAP & TO-DO: Match Tech — Evolução para Comunidade

> **📦 ARQUIVO HISTÓRICO — Junho 2026**
>
> Este documento registra o desenvolvimento original do projeto (Maio 2026).
> Muitas das tarefas listadas foram implementadas de formas diferentes das planejadas aqui,
> como resultado da refatoração Clean Architecture realizada nas Fases 0–7.
>
> Para o estado técnico atual do projeto, consulte:
>
> - [`ARCHITECTURE.md`](./ARCHITECTURE.md) — arquitetura atual
> - [`CODEBASE_MAP.md`](./CODEBASE_MAP.md) — mapa de arquivos atualizado
> - [`../README.md`](../README.md) — guia de contribuição

---

**Documento de Acompanhamento de Progresso**
**Versão 2.0 — Maio 2026**

> **PARA O AGENTE DE IA:** Este é o seu checklist operacional.
> Marque `[x]` conforme completar cada item.
> Sempre que iniciar uma sessão de trabalho, leia este arquivo para saber ONDE parou.
> Referência completa: `VISION_MATCH_TECH.md` e `FRONTEND_BLUEPRINT.md`.
>
> **LEMBRETE:** O visual é NEO-BRUTALISMO. Não trocar para dark mode / SaaS.

---

## FASE 0: 📚 Documentação Estratégica
- [x] Criar `docs/VISION_MATCH_TECH.md` — Visão do produto, identidade visual, arquitetura.
- [x] Criar `docs/FRONTEND_BLUEPRINT.md` — Blueprint técnico de implementação.
- [x] Criar `docs/TODO_MATCH_TECH.md` — Este roadmap.
- [x] Criar `docs/CODEBASE_MAP.md` — Mapa do código existente.
- [x] Revisado com o Tony — MDs v2 documentam Neo-Brutalismo real. Encoding corrigido.

---

## FASE 1: 🎨 Novas Páginas + Abertura para Comunidade

> **REGRA DA FASE 1:** Nenhuma mudança visual. Usar os mesmos tokens, classes e
> componentes que já existem. O que muda é o PROPÓSITO, não o DESIGN.

### 1.1 Componentes Novos (usando design system existente)
- [ ] **`src/components/ui/Avatar.tsx`** — Criar.
  - [ ] Extrair lógica de `OnboardingAvatar` e `Avatar` da Guilda.
  - [ ] Fallback chain: Google Photo → GitHub Photo → Iniciais.
  - [ ] Props: `size` (sm/md/lg/xl), `user` object.
  - [ ] Estilo: `neo-border` no container.

- [ ] **`src/components/ui/SkillRadar.tsx`** — Criar.
  - [ ] Extrair de Onboarding/Guilda a configuração do RadarChart.
  - [ ] Props: `skills`, `size`.
  - [ ] Cores: neo-lime para stroke, lime/30 para fill.

- [ ] **`src/components/ui/TagBadge.tsx`** — Criar.
  - [ ] 3 variantes: love (lime), comfort (yellow), veto (pink).
  - [ ] Estilo: `neo-border`, `font-heading uppercase text-xs`.

- [ ] **`src/components/ui/StatusBadge.tsx`** — Criar.
  - [ ] 3 estados: `looking` (verde), `open` (amarelo), `complete` (cinza).

- [ ] **`src/components/ui/ProfileCard.tsx`** — Criar.
  - [ ] Composição: Avatar + Nome + Role + Mini Radar + Top Tags + Status Badge.
  - [ ] Usa `<Card>` existente. Hover: `neo-shadow-hover`.
  - [ ] Variante `compact` para uso em listas de Squad.

### 1.2 Páginas Novas (estilo Neo-Brutalista)
- [x] **`src/pages/Landing.tsx`** — Criada.
  - [x] Hero com headline gigante + partículas Neo-Brutalistas (reaproveitadas do Bunker).
  - [x] Seção "Como Funciona" (3 Cards: lime, yellow, pink).
  - [x] CTA final em fundo preto.
  - [x] Footer com branding MATCH_TECH.

- [ ] **`src/pages/Discover.tsx`** — Criar (baseado na Guilda).
  - [ ] Copiar lógica de fetch do Guilda.tsx (onSnapshot, real-time).
  - [ ] Adicionar barra de filtros (nome, role, status).
  - [ ] Grid responsivo de ProfileCards.
  - [ ] Estado vazio: CTA para criar perfil.

### 1.3 Páginas Existentes (Ajustes mínimos)
- [ ] **`src/pages/Onboarding.tsx`** — Ajustar textos militaristas.
  - [ ] **NÃO TOCAR no visual ou lógica de state/validação.**
  - [ ] Remover `guildId: 'TECH_FLORIPA_2026'` hardcoded → usar `eventId` dinâmico.
  - [ ] Ajustar `setDoc` para collection `profiles` (em vez de `members`).

### 1.4 Layout e Navegação
- [x] **`src/layouts/RootLayout.tsx`** — Atualizado.
  - [x] Logo: MATCH_TECH com ícone Zap.
  - [x] Links: ONBOARDING + A GUILDA.
  - [x] Removido: Bunker, Oráculo, Logística.

### 1.5 Roteamento
- [x] **`src/App.tsx`** — Rotas atualizadas.
  - [x] `/` → Landing.tsx
  - [x] `/onboarding` → Onboarding.tsx
  - [x] `/guilda` → Guilda.tsx (aberta para todos)
  - [x] Removido: Bunker, Oráculo, Logística

### 1.6 Limpeza
- [x] Removido `src/pages/Bunker.tsx`
- [x] Removido `src/pages/Logistica.tsx`
- [x] Removido `src/pages/Oraculo.tsx`
- [x] Removido `src/components/ui/PostModal.tsx`
- [x] Removido `src/utils/timer.ts` e `src/utils/timer.test.ts`
- [x] Guilda: removido filtro `guildId` → agora lista TODOS os perfis

---

## FASE 2: 🔗 Matchmaking + Social

### 2.1 Perfil Público
- [ ] **`src/pages/Profile.tsx`** — Criar.
  - [ ] Fetch de perfil por ID do Firestore.
  - [ ] Header: avatar, nome, role, links sociais.
  - [ ] Radar Chart grande.
  - [ ] Tags detalhadas (3 Cards coloridos: lime/yellow/pink).
  - [ ] Botão "LER MINHA SINA" (chama IA).
  - [ ] Botão "ANALISAR COMPATIBILIDADE".

### 2.2 Filtros na Discover
- [ ] Filtro por nome (search input neo-border).
- [ ] Filtro por role (dropdown neo-border).
- [ ] Filtro por status (looking/open/all).
- [ ] Filtro por tag específica.
- [ ] Ordenação (por data de criação).

### 2.3 Sistema de Squads
- [ ] **`src/pages/Squad.tsx`** — Criar.
- [ ] Collection `squads` no Firestore.
- [ ] Criar equipe (nome, líder).
- [ ] Enviar convites.
- [ ] Aceitar/recusar convite.
- [ ] Visualização: grid de membros, radar sobreposto.
- [ ] IA: Oráculo analisa composição (3 caminhos).

### 2.4 IA de Compatibilidade
- [ ] Nova rota `POST /api/compatibility` no server.ts.
- [ ] Prompt: recebe 2 perfis, retorna score + análise.
- [ ] UI: Modal Neo-Brutalista com resultado.

### 2.5 Firestore Schema Migration
- [ ] Renomear collection `members` → `profiles`.
- [ ] Remover `guildId` hardcoded → usar `eventId` dinâmico.
- [ ] Adicionar campos: `bio`, `status`, `squadId`, `eventId`.
- [ ] Atualizar `firestore.rules` para novo schema.

---

## FASE 3: ✨ Polish + Deploy

### 3.1 Responsividade
- [ ] Testar todas as páginas em mobile (375px).
- [ ] Testar em tablet (768px).

### 3.2 SEO e Meta Tags
- [ ] `<title>` dinâmico por página.
- [ ] `<meta description>` por página.
- [ ] Open Graph tags.
- [ ] Favicon e manifest atualizados.

### 3.3 PWA
- [ ] Atualizar manifest com branding Match Tech.
- [ ] Gerar ícones (192x192, 512x512).

### 3.4 Deploy
- [ ] Configurar Vercel.
- [ ] Variáveis de ambiente.
- [ ] Testar em produção.

---

## FASE 0.5: 🔧 Hotfixes & Quick Wins (Sprint Sábado)

> **Objetivo:** Versão mínima funcional para divulgar no Python Floripa.

- [x] **Login Google:** Trocar `signInWithRedirect` → `signInWithPopup` (corrige tela branca no localhost e Vercel).
- [x] **Botão de SAIR:** Adicionado no navbar (desktop + mobile) com estilo Neo-Brutalista `bg-neo-pink`.
- [x] **Fix IA (Modelo Gemini):** Trocar `gemini-1.5-flash` (descontinuado) → `gemini-2.5-flash` em `server.ts`.
- [x] **Página de Erro Personalizada & Animada:** `ErrorBoundary.tsx` reescrito com estilo Neo-Brutalista, mensagem divertida e animações fluidas incríveis com Framer Motion (efeito spring no card, formas flutuantes de background, wobbling nos cantos decorativos e micro-interações táteis).
- [x] **Logger unificado:** Substituir `console.error/log` por loggers estilizados (`authLog`, `firestoreLog`, `serverLog`, etc) em todos os arquivos.
- [x] **Magic Link Login:** Firebase `sendSignInLinkToEmail` + `isSignInWithEmailLink` + `signInWithEmailLink` implementado como segunda opção ao Google OAuth. Tela de login redesenhada com 3 estados visuais (login, link enviado, validando link).
- [x] **Aviso de Spam e Explicação de Acesso:** Adicionado box explicativo sobre os métodos de login e alerta proeminente para verificar a pasta de SPAM (evitando frustrações quando o email atrasar).
- [x] **Confirmação de Saída Personalizada:** Modal de confirmação Neo-Brutalist ao clicar em "SAIR", garantindo segurança e melhorando a usabilidade.
- [x] **Simulação de Bug (Easter Egg):** Botão discreto "BUG" fixado no cantinho inferior da tela como um easter egg para forçar erro de renderização e testar a tela de erro (ErrorBoundary) sem atrapalhar a navegação ou poluir o visual.
- [x] **Correção de Vazamento de Credenciais:** Removido `firebase-applet-config.json` do rastreamento do Git, migrado as chaves de configuração pública do Firebase para o arquivo `.env` (seguro e ignorado por padrão) com o prefixo `VITE_` para consumo seguro do lado do cliente, e adicionado o arquivo de configuração no `.gitignore` para eliminar permanentemente o alerta de segurança do GitHub.

---

## DECISÕES PENDENTES

| # | Decisão | Opções | Status |
|---|---------|--------|--------|
| 1 | Nome final | Match Tech? Outro? | **Match Tech (provisório)** |
| 2 | Navegação | Manter top nav atual | **Confirmado** |
| 3 | Multi-evento | Só Tech Floripa 2026 ou genérico? | **Começar com um** |
| 4 | Firebase config | Manter o projeto atual | **Confirmado** |
| 5 | Deploy | Vercel? Firebase Hosting? | **Vercel (confirmado)** |
| 6 | Modelo IA | gemini-1.5-flash / 2.5-flash / 3.5-flash | **gemini-2.5-flash (confirmado)** |
| 7 | Login alternativo | Google Only vs Magic Link | **Google (por enquanto), Magic Link (pós-sábado)** |

---

## LOG DE SESSÕES

| Data | O que foi feito | Próximo passo |
|------|----------------|---------------|
| 07/05/2026 | Clonado repo, criados MDs de referência (v1 — ERRADA, dark SaaS). | Corrigir MDs. |
| 07/05/2026 | Outro chat tentou Fase 1 com visual dark. Tony reverteu. | Reescrever MDs. |
| 07/05/2026 | MDs reescritos (v2) — Neo-Brutalismo real. Novo repo `match-tec` no GitHub criado. | Iniciar Fase 1. |
| 07/05/2026 | **FASE 1 CONCLUÍDA:** Landing Page, novo navbar MATCH_TECH, remoção de 6 arquivos obsoletos, Guilda aberta para todos. | Onboarding (ajuste textos) + Fase 2. |
| 25/05/2026 | Logger unificado com cores por módulo. Merge develop → main. | Hotfixes para versão mínima. |
| 27/05/2026 | **FASE 0.5 Sprint:** Fix login Google (popup), botão SAIR, fix modelo IA (gemini-2.5-flash), página de erro Neo-Brutalista, `.env` configurado localmente. | Magic Link Login. |
| 27/05/2026 | **Magic Link Login:** AuthContext reescrito com 2 métodos (Google + Email). Tela de login redesenhada Neo-Brutalista com 3 estados visuais. | Testar Magic Link, commit, merge → main, deploy Vercel. |
| 27/05/2026 | **Melhorias de Acesso & UI:** Alerta de spam proeminente, explicação de login sutil, confirmação de logout em modal Neo-Brutalist e botão BUG fixado discretamente como easter egg. | Implementar animações premium na tela de erro. |
| 27/05/2026 | **Animações na Página de Erro:** Adicionado Framer Motion na ErrorBoundary para criar efeitos fluidos, partículas flutuantes ao fundo, wobbling e micro-interações. | Tudo pronto e com 0 erros de compilação! |
| 29/05/2026 | **Hotfix de Segurança:** Removido `firebase-applet-config.json` do rastreamento do Git, migrado credenciais para `.env` com prefixo `VITE_` e adicionado o JSON no `.gitignore` para sanar alerta de vazamento do GitHub. | Segurança restabelecida com 0 erros TypeScript! |

---

*Atualize este documento a cada sessão de trabalho. Ele é o seu "diário de bordo".*
