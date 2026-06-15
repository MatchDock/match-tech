# 🌌 VISÃO DO PRODUTO: Match Tech — Plataforma de Matchmaking para Hackathons

**Documento Mestre de Referência (Versão 2.0)**
**Data de Criação:** 07 de Maio de 2026
**Última Atualização:** 07 de Maio de 2026

> **ATENÇÃO AGENTE DE IA:** Este é o documento de referência PRIMÁRIO de produto do projeto.
> Sempre que você sentir que está "alucinando" ou se perdendo na direção do código ou regras de negócio,
> volte aqui. Tudo o que este documento diz sobre identidade visual, arquitetura de alto nível,
> e funcionalidades é LEI.
> Para a especificação técnica detalhada, organização de pastas pós-refatoração e padrões de código, consulte sempre o [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. ELEVATOR PITCH (2 frases)

**Match Tech** é uma plataforma de matchmaking comunitária para hackathons que permite que desenvolvedores, designers e entusiastas solitários encontrem equipes complementares com base em suas habilidades reais, paixões e vetos. Nasceu da transformação de um app de apresentação de equipe do Tech Floripa 2026, cujo sistema de mapeamento de perfil individual ficou tão bom que decidimos abri-lo para toda a comunidade.

---

## 2. A HISTÓRIA DE ORIGEM (Contexto para a IA)

### O que existia antes (App "Antigo"):
- Um **"Bunker Digital"** interno do grupo do Tony Max para o Hackathon Tech Floripa 2026.
- Tinha 4 páginas: Dashboard (Bunker), Onboarding, Guilda (listagem da equipe), Oráculo (IA estrategista).
- Era **fechado** — só membros do time usavam. A `guildId` era hardcoded como `TECH_FLORIPA_2026`.
- Design: **Neo-Brutalismo** (bordas pretas grossas, sombras sólidas, cores neon gritantes).
- Stack: React 19 + TypeScript + Vite + Tailwind CSS v4 + Firebase (Auth + Firestore) + Express + Gemini AI.

### O que aconteceu:
- O sistema de **Onboarding** (mapeamento individual de skills, paixões, vetos via tags, radar chart) ficou tão polido e divertido que o grupo percebeu: "isso deveria ser aberto para a comunidade inteira".
- A organização do Tech Floripa aprovou a ideia.

### O que muda agora:
- O app deixa de ser um "painel de comando privado" e vira uma **ferramenta comunitária de matchmaking**.
- Qualquer pessoa inscrita no hackathon pode criar seu perfil e buscar equipes/membros complementares.
- **A identidade visual Neo-Brutalista é MANTIDA.** Ela é o diferencial estético do app — não é para ser trocada.
- O que muda é o **propósito** (de equipe privada para comunidade aberta), não o **visual**.

---

## 3. O PROBLEMA QUE RESOLVEMOS

### O Participante Solo (A Dor Real):
- **~40% dos inscritos em hackathons iniciam sem equipe.**
- A falta de equipe é o **maior motivo de desistência** antes do kickoff.
- Quem chega sozinho perde horas preciosas no dia 1 tentando montar time "no feeling".
- Não existe um sistema que cruze habilidades reais (não só "eu sei React") com afinidades humanas (paixões, vetos, estilo de trabalho).

### O que o Match Tech resolve:
1. **Mapeamento honesto de perfil:** Não é um currículo. É um "Team Canvas" gamificado onde você marca o que ama, o que opera bem e o que nem f*dendo.
2. **Matchmaking inteligente:** IA cruza perfis para sugerir combinações complementares (ex: um frontend apaixonado + um backend veterano + um designer UX que detesta código).
3. **Ponte social pré-evento:** Conecta pessoas ANTES do kickoff, dando tempo para alinhar expectativas.

---

## 4. PÚBLICO-ALVO

| Persona | Descrição |
|---------|-----------|
| **Solo Dev** | Inscrito no hackathon sem equipe. Quer encontrar pessoas com habilidades complementares. |
| **Líder de Equipe Incompleta** | Tem 2-3 membros mas precisa de um perfil específico (ex: "precisamos de alguém de UX"). |
| **Curioso / Networking** | Quer ver quem está participando, explorar perfis, avaliar o nível da comunidade antes de se comprometer. |
| **Organização do Evento** | Quer reduzir desistências e aumentar a qualidade dos projetos formados. |

---

## 5. IDENTIDADE VISUAL: NEO-BRUTALISMO (Mantida do app original)

> **REGRA ABSOLUTA:** Este projeto USA e MANTÉM o Neo-Brutalismo.
> A estética NÃO deve parecer um template genérico feito por IA.
> Ela deve gritar "engenharia de software hardcore", com personalidade e ousadia.
> **NÃO TROCAR para dark mode, SaaS minimalista, ou qualquer outro estilo.**

### 5.1 Paleta de Cores (Alto Contraste)

| Token CSS | Hex | Uso |
|-----------|-----|-----|
| `--color-neo-bg` | `#F4F4F0` | Fundo principal (off-white/creme). Nunca branco puro. |
| `--color-neo-bg-alt` | `#E5E5E5` | Fundo alternativo (cinza claro) |
| `--color-neo-black` | `#000000` | Bordas, textos, sombras |
| `--color-neo-yellow` | `#FFC900` | Acento: Amarelo Mostarda |
| `--color-neo-lime` | `#B8FF29` | Acento: Verde Limão/Menta |
| `--color-neo-pink` | `#FF2E93` | Acento: Rosa Choque |
| `--color-neo-cyan` | `#00E5FF` | Acento: Ciano Elétrico |

### 5.2 Tipografia

| Categoria | Font | Peso | Uso |
|-----------|------|------|-----|
| **Títulos** | `Space Grotesk` / `Archivo Black` | Extra-Bold | Maiúsculas, letter-spacing negativo |
| **Body** | `Inter` | 400-700 | Texto corrido, legível |

### 5.3 A Regra Sagrada do Neo-Brutalismo

1. **Bordas sólidas** de `3px` a `4px` em **absolutamente tudo** (botões, cards, modais, inputs).
2. **Sombras sólidas sem blur:** Deslocamento no eixo X e Y (ex: `box-shadow: 6px 6px 0px 0px #000;`).
3. **Interatividade tátil:** Ao clicar (`:active`), o elemento deve "afundar" (`translate(4px, 4px)`) e perder a sombra, simulando um botão físico.
4. **Hover:** A sombra cresce (`8px 8px`) e o elemento "levanta" (`translate(-2px, -2px)`).
5. **Cantos:** Pontiagudos (`rounded-none`) ou perfeitamente ovais (`rounded-full`). Evitar `rounded-md`.
6. **Fundo:** Sempre claro (off-white/creme). **NÃO é dark mode.**
7. **Headings:** Sempre MAIÚSCULAS, peso extra-bold.

### 5.4 Componentes UI (Como implementados no código)

- **Buttons (`Button.tsx`):**
  - Variantes: `primary` (preto), `secondary` (branco), `accent-lime`, `accent-pink`, `accent-cyan`, `accent-yellow`.
  - Todos: `neo-border`, `font-heading`, `font-bold`, `uppercase`.
  - Hover: `neo-shadow-hover` (sombra cresce, elemento levanta).

- **Cards (`Card.tsx`):**
  - Variantes: `default` (bg-alt), `white`, `lime`, `pink`, `yellow`, `cyan`.
  - Todos: `neo-border`, `neo-shadow`.
  - Padding: sm/md/lg.

- **Sliders:**
  - Track: barra preta 8px.
  - Thumb: quadrado branco 32x32, borda 4px preta, sombra sólida 4px.
  - Active: thumb "afunda" (perde sombra, translada).

---

## 6. ARQUITETURA DE PÁGINAS (Mapa do App Novo)

### 6.1 Landing Page `/` (Pública)
**Propósito:** Primeira impressão. Converter visitante em usuário cadastrado.
**Estilo:** Neo-Brutalismo puro. Deve ser caótica, viva e impactante.

- **Hero:** Tipografia GIGANTE ("ENCONTRE SUA EQUIPE_" ou similar) + background com partículas/canvas interativo.
- **CTA:** Botão colossal `accent-lime` "CRIAR PERFIL →".
- **Seção "Como Funciona":** 3 cards Neo-Brutalistas (Lime, Yellow, Pink) com ícones e texto curto.
- **Seção "Perfis Ativos":** Grid ou marquee de cards mini de perfis (estilo Bento Box agressivo).
- **Footer:** Minimalista. Créditos.

### 6.2 Onboarding / Criar Perfil `/onboarding` (Requer Auth)
**Propósito:** O coração do app. Mapear o perfil completo do participante.

> **REAPROVEITAR:** 90% do Onboarding atual — lógica E visual.
> O que muda: remover referências exclusivas ao "grupo" privado.
> O visual Neo-Brutalista é MANTIDO.

**Seções do formulário (já implementadas):**
1. **Identidade:** Nome/Codinome, foto (via Google Auth), GitHub, LinkedIn.
2. **Classe Principal/Secundária:** Seletor de roles.
3. **Skills Radar:** Sliders Neo (1-10) para 6 categorias → gera spider chart em tempo real.
4. **Arsenal de Tags:** Pool de tags com 3 estados (❤️ AMO / ✅ OPERO BEM / 🚫 NEM FUDENDO). Mínimo 10 tags.
5. **Preview do Perfil:** Card de prévia.

### 6.3 Descoberta / Explorar `/discover` (Requer Auth)
**Propósito:** Navegar pelos perfis da comunidade e encontrar matches.
**Evolução da Guilda** — manter o visual Neo-Brutalista, abrir para todos.

- **Feed de Cards:** Grid estilo Bento Box agressivo (cards gigantes e coloridos).
- **Filtros:** Por role, por skill dominante, por tag específica, por status.
- **Card Preview:** Foto, nome, role, mini radar, top 3 tags loves.
- **Ação:** Clicar no card abre perfil completo.

### 6.4 Perfil Público `/profile/:id` (Requer Auth)
**Propósito:** Ver perfil completo de alguém.

- **Header:** Foto, nome, role, links sociais.
- **Radar Chart Grande:** Spider chart completo.
- **Tags detalhadas:** 3 cards coloridos (Lime=loves, Yellow=comfort, Pink=veto).
- **Botão "Ler minha Sina":** Análise IA (humor ácido, estilo Roasted & Toasted).
- **Botão "Analisar Compatibilidade":** Cruza SEU perfil com ESTE.

### 6.5 Minha Equipe / Squad `/squad` (Requer Auth)
**Propósito:** Gerenciar a equipe formada.

- **Membros:** Cards Neo-Brutalistas de cada membro.
- **Radar da Equipe:** Sobreposição dos radares.
- **Oráculo:** IA analisa composição e sugere estratégias (3 caminhos: Seguro/Inovação/Surpresa).
- **Convites:** Enviar/aceitar convites.

---

## 7. STACK TECNOLÓGICA (O que muda e o que fica)

### ✅ O QUE PERMANECE (não mexer sem necessidade):
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19 | UI Framework |
| TypeScript | ~5.8 | Tipagem |
| Vite | ^6.2 | Build System |
| Tailwind CSS | v4 | Estilização |
| Firebase Auth | ^12 | Autenticação (Google OAuth) |
| Firebase Firestore | ^12 | Banco de dados NoSQL |
| Express | ^4 | Server-side API routes |
| Gemini AI | @google/genai | Análises de IA |
| react-router-dom | ^7 | Roteamento SPA |
| motion/react | ^12 | Animações |
| Recharts | ^3 | Gráficos (Radar Chart) |
| Lucide React | Latest | Ícones |

### ✅ O QUE TAMBÉM PERMANECE:
- **Design System Neo-Brutalista inteiro** (cores, bordas, sombras, tipografia).
- **Componentes UI** (Button.tsx, Card.tsx) — mesmas variantes e estilo.
- **Identidade visual** — mesma paleta, mesmas fontes, mesmo "feeling".

### 🔄 O QUE MUDA:
| Item | Antes | Depois |
|------|-------|--------|
| Scope | Equipe privada (guildId hardcoded) | Comunidade aberta (qualquer inscrito) |
| Landing Page | Bunker com countdown (só equipe) | Landing Page pública com CTA (converter visitantes) |
| Navegação | Bunker / Onboarding / Guilda / Oráculo | Home / Onboarding / Discover / Profile / Squad |
| Firestore Schema | Collection `members` com `guildId: TECH_FLORIPA_2026` | Collection `profiles` sem guildId fixo (ou com eventId dinâmico) |
| Guilda | Lista privada da equipe | **Discover** — exploração pública de perfis com filtros |
| Oráculo | Estratégia para UM desafio | Análise de composição de equipe + compatibilidade entre perfis |

### ❌ O QUE SERÁ REMOVIDO:
- Página do Bunker (countdown, timeline — substituída pela Landing Page comunitária).
- Página de Logística (era específica do projeto do grupo).
- Referências hardcoded a `TECH_FLORIPA_2026`.

---

## 8. MODELO DE DADOS (Firestore)

### Collection: `profiles` (antes era `members`)

```typescript
interface UserProfile {
  // Identidade
  uid: string;              // Firebase Auth UID (document ID)
  displayName: string;
  photoURL: string | null;
  github: string;           // username limpo
  linkedin: string;         // profile path limpo
  bio: string;              // max 280 chars (novo campo)
  
  // Classificação
  primaryRole: string;      // ex: "Frontend Developer"
  secondaryRoles: string[]; // max 2
  
  // Skills (1-10) — mesmas categorias do app original
  skills: {
    frontend: number;
    backend: number;
    ux_ui: number;
    dados: number;
    hardware_android: number;
    vibe_coding: number;
  };
  
  // Team Canvas (Tags) — mesma estrutura do app original
  canvas: {
    loves: string[];        // tags que ama (max 50)
    comfort: string[];      // tags que opera bem (max 50)
    veto: string[];         // tags que veta (max 50)
  };
  
  // Matchmaking (campos novos)
  status: "looking" | "open" | "complete";  // buscando equipe / aberto a propostas / equipe formada
  squadId: string | null;   // referência ao squad se tiver
  eventId: string;          // ex: "tech_floripa_2026"
  
  // AI Generated — mesma estrutura do app original
  roast: string | null;
  roastBrutal: string | null;
  roastMild: string | null;
  
  // Meta
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `squads` (nova)

```typescript
interface Squad {
  id: string;               // auto-generated
  name: string;             // nome da equipe
  leaderId: string;         // uid do líder
  memberIds: string[];      // uids dos membros (max 5-6)
  eventId: string;
  status: "forming" | "complete" | "competing";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 9. FLUXO DO USUÁRIO (User Journey)

```
[1] Visitante acessa a Landing Page (Neo-Brutalista, impactante)
    ↓
[2] Clica "CRIAR PERFIL →" → Redireciona para /onboarding
    ↓
[3] Login via Google (Firebase Auth)
    ↓
[4] Preenche o Onboarding (identidade, classes, skills, tags)
    ↓
[5] Perfil é salvo no Firestore → Redireciona para /discover
    ↓
[6] Navega pelos perfis da comunidade, filtra por skills/roles
    ↓
[7] Encontra alguém complementar → Abre perfil completo
    ↓
[8] Convida para equipe (ou é convidado)
    ↓
[9] Equipe formada → Página /squad com visão geral do time
    ↓
[10] Oráculo analisa composição da equipe → Pronto para o hackathon!
```

---

## 10. PRIORIDADES DE IMPLEMENTAÇÃO (Fases)

### FASE 1: Novas Páginas + Abertura (AGORA)
- [ ] Criar Landing Page nova (`/`) — no estilo Neo-Brutalista existente.
- [ ] Adaptar Guilda → Discover (`/discover`) — abrir para todos, adicionar filtros.
- [ ] Ajustar Onboarding — remover referências privadas, manter visual.
- [ ] Ajustar schema do Firestore (profiles, remover guildId hardcoded).
- [ ] Atualizar navegação (RootLayout).

### FASE 2: Matchmaking + Social
- [ ] Implementar filtros na Discover.
- [ ] Criar página de Perfil Público (`/profile/:id`).
- [ ] Implementar sistema de convites (squad formation).
- [ ] Criar página Squad (`/squad`).
- [ ] IA de compatibilidade (comparar 2 perfis).

### FASE 3: Polish + Deploy
- [ ] Responsividade mobile completa.
- [ ] SEO e meta tags.
- [ ] PWA atualizado com branding Match Tech.
- [ ] Deploy em Vercel.
- [ ] Testes.

---

## 11. O QUE ESTE DOCUMENTO NÃO COBRE

- Detalhes de implementação de código (consulte a referência atualizada em [ARCHITECTURE.md](./ARCHITECTURE.md) ou o histórico em [FRONTEND_BLUEPRINT.md](./FRONTEND_BLUEPRINT.md)).
- Roadmap detalhado com checklist (veja o arquivo histórico [TODO_MATCH_TECH.md](./TODO_MATCH_TECH.md)).
- Regras de Firestore atualizadas (veja [firestore.rules](../firestore.rules)).
- Estratégia pessoal do Tony para o hackathon (veja [hackathon_tech_floripa_2026_strategy.md](./hackathon_tech_floripa_2026_strategy.md)).

---

*Este documento é a "Estrela Norte" do projeto. Toda decisão de design, código ou funcionalidade deve ser validada contra o que está escrito aqui. Se algo contradiz este documento, este documento vence.*
