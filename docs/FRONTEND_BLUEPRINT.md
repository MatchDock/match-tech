# 🛠️ BLUEPRINT DE FRONT-END: Match Tech

> **⚠️ DOCUMENTO DEPRECIADO — Junho 2026**
>
> Este blueprint foi criado antes da refatoração Clean Architecture (Fases 0–7).
> A estrutura de pastas, os caminhos de arquivos e os padrões descritos aqui **não refletem mais o estado atual do código**.
>
> **Consulte [`ARCHITECTURE.md`](./ARCHITECTURE.md)** para a referência técnica atualizada.
> **Consulte [`CODEBASE_MAP.md`](./CODEBASE_MAP.md)** para o mapa de arquivos atual.
>
> Este documento é mantido apenas como registro histórico do planejamento original.

---

**Guia Técnico de Implementação para Agentes de Código e Desenvolvedores**
**Versão 2.0 — Maio 2026**

> **PARA O AGENTE DE IA:** Este documento é o seu guia de IMPLEMENTAÇÃO.
> Ele detalha COMO construir cada componente, página e interação.
> Para entender O QUE e POR QUE, leia `VISION_MATCH_TECH.md` primeiro.
> Se houver conflito entre os dois documentos, `VISION_MATCH_TECH.md` é a autoridade.
>
> **REGRA CRÍTICA:** O design é NEO-BRUTALISMO (fundo claro, bordas pretas grossas,
> sombras sólidas, cores neon). NÃO é dark mode. NÃO é SaaS minimalista.
> Use as classes `neo-border`, `neo-shadow`, `neo-shadow-hover` que JÁ existem no código.

---

## 1. INVENTÁRIO DO CÓDIGO EXISTENTE (O que temos para reaproveitar)

O app atual é um projeto funcional e robusto. Não vamos jogá-lo fora — vamos **expandi-lo para a comunidade** mantendo o visual original.

### 1.1 Arquivos que PERMANECEM INTACTOS

| Arquivo | Motivo |
|---------|--------|
| `src/index.css` | **NÃO TOCAR.** Design System Neo-Brutalista completo. |
| `src/components/ui/Button.tsx` | **NÃO TOCAR.** Variantes accent-lime/pink/cyan/yellow funcionam. |
| `src/components/ui/Card.tsx` | **NÃO TOCAR.** Variantes lime/pink/yellow/cyan funcionam. |
| `src/lib/firebase.ts` | Inicialização do Firebase, persistência offline. |
| `src/lib/firebase-admin.ts` | Admin SDK para operações server-side. |
| `src/lib/utils.ts` | Utility `cn()` para classes. |
| `src/contexts/AuthContext.tsx` | Auth state management. |
| `src/services/likesService.ts` | Sistema de likes. |
| `server.ts` | Express + Vite middleware + API routes para Gemini. |
| `vite.config.ts` | Config do Vite + Tailwind + PWA. |
| `firebase-applet-config.json` | Config do Firebase. |

### 1.2 Arquivos que serão ADAPTADOS (lógica muda, visual fica)

| Arquivo | O que muda |
|---------|-----------|
| `src/App.tsx` | Adicionar novas rotas (`/discover`, `/profile/:id`, `/squad`). Remover rotas obsoletas. |
| `src/layouts/RootLayout.tsx` | Atualizar links de navegação. Manter o estilo visual Neo-Brutalista. |
| `src/pages/Onboarding.tsx` | Remover referências exclusivas à guilda privada. Manter TODA a lógica e visual. |
| `src/pages/Guilda.tsx` | **EVOLUIR** para Discover — abrir query para todos os perfis, adicionar filtros. |
| `src/pages/Oraculo.tsx` | **EVOLUIR** — manter lógica, ajustar para análise de squad/compatibilidade. |
| `firestore.rules` | Atualizar para o novo schema (`profiles` em vez de `members`). |

### 1.3 Arquivos que serão REMOVIDOS

| Arquivo | Motivo |
|---------|--------|
| `src/pages/Bunker.tsx` | Substituído pela Landing Page. |
| `src/pages/Logistica.tsx` | Era específico do projeto do grupo. |
| `src/components/ui/PostModal.tsx` | Era para posts da timeline do Bunker. |
| `src/utils/timer.ts` + `timer.test.ts` | Countdown não será mais usado. |

### 1.4 Arquivos NOVOS a serem criados

| Arquivo | Propósito |
|---------|-----------|
| `src/pages/Landing.tsx` | Landing page pública — Neo-Brutalista, impactante. |
| `src/pages/Discover.tsx` | Evolução da Guilda — exploração de perfis com filtros. |
| `src/pages/Profile.tsx` | Visualização de perfil público individual. |
| `src/pages/Squad.tsx` | Gerenciamento de equipe formada. |
| `src/components/ui/ProfileCard.tsx` | Card Neo-Brutalista de preview de perfil para o feed. |
| `src/components/ui/SkillRadar.tsx` | Componente isolado do radar chart (extraído do Onboarding). |
| `src/components/ui/TagBadge.tsx` | Badge de tag com variantes (love/comfort/veto). |
| `src/components/ui/StatusBadge.tsx` | Badge de status (buscando equipe, etc). |
| `src/components/ui/SearchFilter.tsx` | Barra de filtros para a Discover. |
| `src/components/ui/Avatar.tsx` | Avatar unificado (extraído de Guilda e Onboarding). |

---

## 2. DESIGN SYSTEM — JÁ EXISTE NO CÓDIGO

> **NÃO REESCREVER O `src/index.css`.** O design system está completo.

### CSS Tokens disponíveis (`@theme` no `index.css`):
```css
--font-sans: "Inter"
--font-heading: "Space Grotesk", "Archivo Black"
--color-neo-bg: #F4F4F0
--color-neo-bg-alt: #E5E5E5
--color-neo-black: #000000
--color-neo-yellow: #FFC900
--color-neo-lime: #B8FF29
--color-neo-pink: #FF2E93
--color-neo-cyan: #00E5FF
```

### Classes utilitárias disponíveis:
```css
.neo-border          /* border: 3px solid #000 */
.neo-shadow          /* box-shadow: 6px 6px 0px 0px #000 + active state */
.neo-shadow-hover    /* hover: sombra cresce, active: afunda */
.slider-thumb-neo    /* slider estilo Neo-Brutalista */
```

### Como usar nos componentes NOVOS:
```tsx
// ✅ CORRETO — Usar os componentes e classes existentes
<Card variant="lime" padding="md">
  <h2 className="font-heading text-2xl uppercase">TÍTULO</h2>
  <p className="font-sans">Conteúdo</p>
</Card>

<Button variant="accent-lime" size="xl">CRIAR PERFIL →</Button>

// ❌ ERRADO — NÃO inventar classes novas como "card-base", "glass", "glow-accent"
// ❌ ERRADO — NÃO usar bg-zinc-900, bg-gray-800, ou qualquer dark mode
// ❌ ERRADO — NÃO usar rounded-lg (cantos arredondados leves)
// ❌ ERRADO — NÃO usar bordas de 1px sutis
```

---

## 3. ESPECIFICAÇÕES POR PÁGINA

### 3.1 Landing Page (`/`)

**Layout:** Full-width, scroll vertical, CAÓTICO E VIVO.

**Seção Hero:**
- Fundo: `bg-neo-bg` + canvas com partículas (ou fundo de alto impacto visual).
- Headline: `font-heading text-6xl md:text-8xl uppercase` em preto.
  - Texto: "ENCONTRE SUA EQUIPE_" ou "MATCHMAKING PARA QUEM CONSTRÓI_"
- CTA: `<Button variant="accent-lime" size="xl">CRIAR PERFIL →</Button>`
- Abaixo: Texto "JÁ TEM CONTA? ENTRAR" com link.

**Seção "Como Funciona" (3 Cards):**
- Layout: 3 colunas (md:grid-cols-3, mobile empilhado).
- Card 1: `<Card variant="lime">` → "MAPEIE" → Ícone + "Registre suas skills, paixões e vetos."
- Card 2: `<Card variant="yellow">` → "DESCUBRA" → "Explore perfis complementares ao seu."
- Card 3: `<Card variant="pink">` → "CONECTE" → "Forme sua equipe ideal antes do evento."

**Seção "Perfis Ativos":**
- Grid de cards mini ou marquee horizontal.
- Usar `<Card variant="white">` com foto, nome, role principal, 3 tags loves.

**Footer:**
- Minimalista. "Feito com ☕ por Tony Max & Squad • Hackathon Tech Floripa 2026"

---

### 3.2 Onboarding (`/onboarding`)

> **MANTER COMO ESTÁ.** Só remover referências privadas.

**Textos a substituir (se houver referências exclusivas à guilda):**

| Antes | Depois |
|-------|--------|
| Referências à "guilda privada" | Referências ao "seu perfil" |
| `guildId: 'TECH_FLORIPA_2026'` hardcoded | `eventId` dinâmico ou padrão |

**Tudo o mais fica igual:** sliders Neo, tags com 3 estados, radar chart, preview card, visual completo.

---

### 3.3 Discover (`/discover`) — Evolução da Guilda

**Base:** Copiar lógica do `Guilda.tsx` (fetch de membros do Firestore, cards, radar, links).

**Mudanças:**
- Remover filtro por `guildId === 'TECH_FLORIPA_2026'` — buscar todos os perfis (ou por eventId).
- Adicionar barra de filtros no topo:
  - Input de busca por nome (`neo-border` input).
  - Dropdown de Role (`neo-border` select).
  - Toggle de Status (Buscando Equipe / Todos).
- Grid responsivo de ProfileCards (estilo Bento Box, cards coloridos).

**ProfileCard (novo componente):**
```
┌──────────────────────────────┐  ← neo-border + neo-shadow
│  [Avatar]  NOME COMPLETO     │
│            @github           │
│            Frontend Dev      │
│                              │
│  [Mini Radar Chart]          │
│                              │
│  ❤️ React  ❤️ TypeScript     │
│                              │
│  ● BUSCANDO EQUIPE           │
└──────────────────────────────┘
```
- Background: `<Card variant="white">` ou randomizar cores (lime, cyan, yellow).
- Hover: `neo-shadow-hover` (sombra cresce).
- Click: abre perfil completo.
- Texto: `font-heading uppercase` para o nome.

---

### 3.4 Perfil Público (`/profile/:id`)

**Layout:** Página dedicada ou modal grande, Neo-Brutalista.

1. **Header:** Avatar grande + Nome (heading) + Role + Links sociais (ícones GitHub, LinkedIn).
2. **Radar Chart:** Full-size com labels visíveis. Cores neon.
3. **Tags:** 3 Cards coloridos lado a lado:
   - `<Card variant="lime">` → "❤️ AMO" → lista de tags loves.
   - `<Card variant="yellow">` → "✅ OPERO BEM" → lista de tags comfort.
   - `<Card variant="pink">` → "🚫 NEM FUDENDO" → lista de tags veto.
4. **Botão "LER MINHA SINA":** `<Button variant="accent-pink">` → chama IA.
5. **Botão "ANALISAR COMPATIBILIDADE":** `<Button variant="accent-cyan">`.

---

### 3.5 Squad (`/squad`)

**Layout:** Dashboard Neo-Brutalista.

- **Se não tem squad:** CTA grande "CRIAR EQUIPE →" + campo de nome.
- **Se tem squad:**
  - Nome da equipe em heading gigante.
  - Grid de ProfileCards compactos dos membros.
  - Radar sobreposto (todos os membros no mesmo chart).
  - Botão "ORÁCULO: ANALISAR EQUIPE" → chama Gemini.
  - Seção de convites pendentes.

---

## 4. NAVEGAÇÃO (RootLayout)

**Manter o estilo existente.** Apenas atualizar os links.

### Links de Navegação:
| Label | Path | Condição |
|-------|------|----------|
| DISCOVER | `/discover` | Logado |
| SQUAD | `/squad` | Logado |
| MEU PERFIL | `/onboarding` | Logado |
| CRIAR PERFIL | `/onboarding` | Não logado |

- Manter o fundo `neo-bg` e o estilo do navbar atual.
- Títulos em `font-heading uppercase`.

---

## 5. COMPONENTES REUTILIZÁVEIS (Component Library)

### 5.1 `<ProfileCard />`
- Props: `profile: UserProfile`, `onClick: () => void`, `compact?: boolean`.
- Usa `<Card>` e `<Button>` existentes.
- Variante `compact` para uso dentro do Squad.

### 5.2 `<SkillRadar />`
- Props: `skills: SkillsMap`, `size?: 'sm' | 'md' | 'lg'`.
- Extraído da lógica duplicada em Onboarding e Guilda.
- Usa Recharts `RadarChart`. Cores: lime para stroke, lime/30 para fill.

### 5.3 `<TagBadge />`
- Props: `tag: string`, `sentiment: 'love' | 'comfort' | 'veto' | 'neutral'`.
- Cores: love=lime, comfort=yellow, veto=pink, neutral=bg-alt.
- Estilo: `neo-border` + padding + `font-heading uppercase text-xs`.

### 5.4 `<Avatar />`
- Props: `user: { photoURL, github, name }`, `size?: 'sm' | 'md' | 'lg' | 'xl'`.
- Unifica `OnboardingAvatar` e `Avatar` da Guilda.
- `neo-border` no container, fallback chain (Google Photo → GitHub → Iniciais).

### 5.5 `<StatusBadge />`
- Props: `status: 'looking' | 'open' | 'complete'`.
- looking: Dot verde pulsante + "BUSCANDO EQUIPE" (uppercase, font-heading).
- open: Dot amarelo + "ABERTO A PROPOSTAS".
- complete: Dot cinza + "EQUIPE FORMADA".

---

## 6. ANIMAÇÕES E TRANSIÇÕES

| Elemento | Animação |
|----------|----------|
| Page transitions | Blocos deslizando das laterais (motion/react) |
| Card hover | neo-shadow-hover (sombra cresce, levanta) |
| Card click/active | neo-shadow active (afunda, perde sombra) |
| Tag selection | Background muda + scale sutil |
| Radar chart | Smooth morph (Recharts native) |
| Loaders | Mensagens piscando estilo terminal ("Compilando vetos...", "Analisando skills...") |

**REGRA:** Animações podem ser mais agressivas que num SaaS — o Neo-Brutalismo permite personalidade.

---

## 7. API ROUTES (server.ts)

### Rotas existentes a manter:
- `POST /api/roast` → Análise IA de perfil (Roasted & Toasted). **Manter nome e lógica.**
- `POST /api/oraculo/match` → Estratégias para equipe. **Manter nome e lógica.**

### Rotas novas:
- `POST /api/compatibility` → Recebe 2 profile IDs, retorna análise de compatibilidade via Gemini.
  - Input: `{ profileA: UserProfile, profileB: UserProfile }`
  - Output: `{ score: number, strengths: string[], gaps: string[], verdict: string }`

---

## 8. ORDEM DE EXECUÇÃO (Para o Agente de IA)

Quando receber a ordem "começar a Fase 1", execute nesta sequência:

1. **`src/components/ui/Avatar.tsx`** → Criar (extrair lógica repetida de Onboarding e Guilda).
2. **`src/components/ui/SkillRadar.tsx`** → Criar (extrair de Onboarding).
3. **`src/components/ui/TagBadge.tsx`** → Criar.
4. **`src/components/ui/StatusBadge.tsx`** → Criar.
5. **`src/components/ui/ProfileCard.tsx`** → Criar (usa Avatar, SkillRadar, TagBadge, StatusBadge).
6. **`src/pages/Landing.tsx`** → Criar no estilo Neo-Brutalista.
7. **`src/pages/Discover.tsx`** → Criar baseado na Guilda (copiar lógica, expandir).
8. **`src/layouts/RootLayout.tsx`** → Atualizar links de navegação (manter visual).
9. **`src/App.tsx`** → Atualizar rotas.
10. **Limpar:** Remover Bunker.tsx, Logistica.tsx, PostModal.tsx, timer.ts.

**IMPORTANTE:** Em NENHUM passo trocar o visual. Usar os mesmos tokens, classes e componentes que já existem.

---

*Este documento é o manual de engenharia. Siga-o passo a passo e o resultado será o mesmo app bonito, expandido para a comunidade.*
