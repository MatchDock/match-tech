# Arquitetura do Match Tech

Este documento descreve a arquitetura técnica do projeto, os padrões de design adotados, a organização de pastas e as convenções que devem ser seguidas ao contribuir.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Diagrama de Camadas](#2-diagrama-de-camadas)
3. [Estrutura de Pastas Detalhada](#3-estrutura-de-pastas-detalhada)
4. [Camada de Domínio](#4-camada-de-domínio)
5. [Camada de Infraestrutura](#5-camada-de-infraestrutura)
6. [Camada de Features](#6-camada-de-features)
7. [Camada Shared](#7-camada-shared)
8. [Roteamento](#8-roteamento)
9. [API Server](#9-api-server)
10. [Fluxo de Dados](#10-fluxo-de-dados)
11. [Injeção de Dependência](#11-injeção-de-dependência)
12. [Padrões e Convenções](#12-padrões-e-convenções)
13. [Testes](#13-testes)
14. [Deploy e CI/CD](#14-deploy-e-cicd)

---

## 1. Visão Geral

O Match Tech é uma SPA (Single Page Application) React com um backend Express mínimo usado exclusivamente para chamadas à API do Gemini (IA). O frontend se comunica diretamente com o Firebase para autenticação e banco de dados.

A arquitetura segue os princípios de **Clean Architecture**:

- **Regras de negócio** ficam na camada de domínio, sem dependências externas
- **Detalhes de implementação** (Firebase, Gemini) ficam nas camadas externas
- **Features** são independentes entre si e dependem do domínio, nunca umas das outras
- **Inversão de dependência**: componentes dependem de interfaces, não de implementações concretas

---

## 2. Diagrama de Camadas

```text
┌─────────────────────────────────────────────────────────┐
│                      APRESENTAÇÃO                       │
│   features/   routes/   layouts/   shared/components/   │
└─────────────────────┬───────────────────────────────────┘
                      │ usa
┌─────────────────────▼───────────────────────────────────┐
│                    APLICAÇÃO                            │
│        shared/hooks/   shared/context/                  │
│        shared/services/   contexts/                     │
└─────────────────────┬───────────────────────────────────┘
                      │ depende de interfaces de
┌─────────────────────▼───────────────────────────────────┐
│                     DOMÍNIO                             │
│   domain/entities/   domain/ports/   domain/usecases/   │
└─────────────────────┬───────────────────────────────────┘
                      │ implementado por
┌─────────────────────▼───────────────────────────────────┐
│                  INFRAESTRUTURA                         │
│        infrastructure/firebase/                         │
│        server/ (Express + Gemini)                       │
└─────────────────────────────────────────────────────────┘
```

A regra fundamental: **as setas de dependência apontam sempre para dentro** — o domínio não conhece nenhuma camada externa.

---

## 3. Estrutura de Pastas Detalhada

```text
src/
│
├── domain/                        ← Núcleo da aplicação (sem imports externos)
│   ├── entities/
│   │   ├── Member.ts              # Tipo Member e sub-interfaces (ISP)
│   │   ├── Squad.ts               # Tipo Squad e SquadMember
│   │   └── Shared.ts              # RoastPersona, Tag, SkillRadar, SquadStatus
│   ├── ports/
│   │   ├── IProfileRepository.ts  # Interface do repositório de perfis
│   │   ├── ISquadRepository.ts    # Interface do repositório de squads
│   │   ├── IAuthService.ts        # Interface do serviço de autenticação
│   │   └── IRoastService.ts       # Interface do serviço de roast/IA
│   └── usecases/
│       ├── compatibilityAlgorithm.ts  # calculateCompatibility, scoreSkillsForRole, etc.
│       └── __tests__/
│           └── compatibilityAlgorithm.test.ts
│
├── infrastructure/                ← Implementações concretas
│   └── firebase/
│       ├── profileRepository.ts   # FirebaseProfileRepository implements IProfileRepository
│       ├── squadRepository.ts     # FirebaseSquadRepository implements ISquadRepository
│       ├── schemas.ts             # Schemas Zod para validação em runtime
│       └── index.ts               # Barrel export
│
├── features/                      ← Módulos de produto (cada um é independente)
│   ├── discover/
│   │   ├── components/            # ProfilesGrid, RoastModal, DiscoverFilters...
│   │   ├── hooks/                 # useProfilesRealtime, useDiscoverFilters, useRoastProfile
│   │   ├── model/                 # discover.types.ts, discover.selectors.ts
│   │   ├── services/              # discover.repository.ts (updateProfile)
│   │   ├── constants/
│   │   └── pages/
│   │       └── DiscoverPage.tsx
│   ├── guilda/
│   │   ├── components/            # GuildMembersGrid, GuildRoastModal, GuildMemberCard...
│   │   ├── hooks/                 # useGuildMembersRealtime, useGuildRoast
│   │   ├── model/                 # guilda.types.ts, guilda.selectors.ts
│   │   ├── services/              # guilda.repository.ts (saveRoast)
│   │   ├── constants/
│   │   ├── utils/
│   │   └── pages/
│   │       └── GuildaPage.tsx
│   ├── onboarding/
│   │   ├── components/
│   │   │   └── AuthGate/          # LoginScreen, MagicLinkSentScreen, CompletingMagicLink...
│   │   ├── hooks/
│   │   │   └── useOnboardingForm.ts
│   │   ├── constants/
│   │   └── pages/
│   │       └── Onboarding.tsx
│   ├── profile/
│   │   ├── components/
│   │   │   └── ShareProfileButton.tsx   # Exportação PNG via canvas
│   │   └── pages/
│   │       └── PublicProfilePage.tsx    # Rota pública /p/:uid
│   ├── squad/
│   │   └── pages/
│   │       └── JoinSquadPage.tsx        # Rota de convite /join/:squadId
│   └── landing/
│       └── Landing.tsx
│
├── shared/                        ← Código reutilizável entre features
│   ├── components/
│   │   ├── ui/                    # Componentes puramente apresentacionais
│   │   │   ├── RoastModal.tsx     # Modal genérico de veredito (usado em discover e guilda)
│   │   │   ├── SkillRadar.tsx     # Radar chart memoizado
│   │   │   ├── ProfileCard.tsx    # Card de perfil
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ...
│   │   └── states/                # Estados de UI (loading, empty, error)
│   ├── hooks/
│   │   ├── useFirestoreSubscription.ts  # Hook genérico para onSnapshot em tempo real
│   │   └── index.ts
│   ├── context/
│   │   └── RepositoryContext.tsx  # RepositoryProvider + useRepositories()
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── firebase.client.ts # Inicialização do Firebase SDK
│   │   │   └── firebase.config.ts
│   │   ├── logger/                # Logger estruturado
│   │   ├── utils/                 # cn(), entity helpers
│   │   └── AppError.ts            # Classe AppError + códigos + mensagens PT-BR
│   └── services/
│       └── roast.service.ts       # Cliente HTTP para POST /api/roast
│
├── routes/                        ← Configuração de roteamento
│   ├── routes.tsx                 # createBrowserRouter com todas as rotas
│   ├── ProtectedLayout.tsx        # Re-exporta RootLayout como Component lazy
│   └── ErrorPage.tsx              # Página de erro de rota (trata AppError)
│
├── layouts/
│   └── RootLayout.tsx             # Shell da aplicação: nav + Outlet + modal de logout
│
├── contexts/
│   └── AuthContext.tsx            # Firebase Auth (Google OAuth + Magic Link)
│
├── server/                        ← API Express (backend serverless no Vercel)
│   ├── app.ts                     # Instância Express
│   ├── routes/
│   │   └── index.ts               # Registro das rotas
│   ├── features/
│   │   ├── roast/                 # POST /api/roast — análise Gemini individual
│   │   │   ├── roast.controller.ts
│   │   │   ├── roast.service.ts
│   │   │   ├── roast.repository.ts
│   │   │   ├── roast.routes.ts    # Rate limit: 5 req/min
│   │   │   ├── roast.prompts.ts
│   │   │   └── roast.types.ts
│   │   └── oraculo/               # POST /api/oraculo/match — match por IA
│   │       ├── match.controller.ts
│   │       ├── match.service.ts
│   │       ├── match.routes.ts    # Rate limit: 10 req/min
│   │       ├── match.prompts.ts
│   │       └── match.types.ts
│   └── shared/
│       ├── lib/
│       │   ├── gemini.server.ts   # Cliente Gemini (gemini-2.5-flash)
│       │   └── firebase-admin.server.ts
│       └── utils/
│           └── async-handler.ts
│
├── App.tsx                        # QueryClientProvider + AuthProvider + RouterProvider
└── main.tsx                       # createRoot + global error listeners
```

---

## 4. Camada de Domínio

A camada de domínio contém as regras de negócio puras. **Nenhum arquivo aqui pode importar Firebase, React, ou qualquer lib externa.**

### Entidades (`domain/entities/`)

As entidades seguem o **Interface Segregation Principle (ISP)**: em vez de um tipo `Member` gigante, temos interfaces menores que são compostas:

```typescript
// Member é a composição de interfaces focadas
type Member = MemberIdentity      // uid, displayName, photoURL, bio
            & MemberRoles         // role, secondaryRoles[]
            & MemberSkills        // skills: SkillRadar
            & MemberTags          // tags: Tag[]
            & MemberSquadStatus   // squadId?, squadStatus
            & { createdAt, updatedAt, visibility }

// PublicMember expõe apenas o que é seguro tornar público
type PublicMember = MemberIdentity & MemberRoles & { visibility: "public"; tags?: Tag[] }
```

Isso permite que componentes recebam apenas as interfaces que precisam (`ProfileCardData = MemberIdentity & MemberRoles`), sem carregar campos desnecessários.

### Ports (`domain/ports/`)

Ports são interfaces TypeScript que definem **contratos** entre o domínio e a infraestrutura:

```typescript
interface IProfileRepository {
  getProfile(uid: string): Promise<Member>
  getPublicProfile(uid: string): Promise<PublicMember>
  updateProfile(uid: string, data: Partial<Member>): Promise<void>
  listPublicProfiles(filters?: ProfileFilters): Promise<Member[]>
  deleteProfile(uid: string): Promise<void>
}
```

O domínio só conhece essa interface. A implementação concreta (`FirebaseProfileRepository`) fica na infraestrutura e pode ser trocada (ex: para um mock em testes) sem mudar nada no domínio ou nas features.

### Usecases (`domain/usecases/`)

Funções puras com a lógica de negócio central:

| Função | Descrição |
|--------|-----------|
| `calculateCompatibility(m1, m2)` | Score 0–90: 40% overlap de skills + 40% compatibilidade de tags + 10% bônus de roles diferentes |
| `scoreSkillsForRole(skills, role)` | Pontua skills de 0–100 com pesos específicos por role |
| `filterMembers(members, role?, status?)` | Filtra lista de membros por role e/ou squadStatus |
| `sortByCompatibility(members, target)` | Ordena lista pelo score de compatibilidade com o membro alvo |
| `getTopCompatibleMembers(members, target, limit)` | Retorna os N membros mais compatíveis |

**Algoritmo de compatibilidade em detalhe:**

```text
calculateCompatibility(m1, m2):
  skillOverlap  = 100 - (Σ|skill_i_m1 - skill_i_m2| / maxDiff) * 100
  tagCompat     = 100 - penalidades (love↔veto = -20, veto↔veto = -5) → mínimo 0
  roleBonus     = m1.role ≠ m2.role ? 10 : 0
  score         = Math.round(skillOverlap * 0.4 + tagCompat * 0.4 + roleBonus)
  range         = [0, 90]
```

---

## 5. Camada de Infraestrutura

Implementa as interfaces do domínio usando Firebase e Zod.

### Repositórios (`infrastructure/firebase/`)

Cada repositório:

1. Implementa a interface correspondente do domínio (`implements IProfileRepository`)
2. Usa `MemberSchema.parse(snap.data())` para validar dados do Firestore com Zod
3. Lança `AppError` com códigos semânticos em caso de erro (`PROFILE_NOT_FOUND`, `FIRESTORE_UNAVAILABLE`, etc.)
4. Exporta uma instância singleton (`export const profileRepository = new FirebaseProfileRepository()`)

### Schemas Zod (`infrastructure/firebase/schemas.ts`)

Schemas Zod validam todos os dados vindos do Firestore em runtime, protegendo contra drift de schema:

```typescript
const MemberSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  skills: SkillRadarSchema,
  tags: z.array(TagSchema).min(10),
  squadStatus: z.enum(["open", "looking", "closed"]).default("open"),
  // ...
})
```

Se um documento do Firestore não corresponder ao schema, um `ZodError` é lançado e convertido em `AppError("FIRESTORE_UNAVAILABLE")`.

---

## 6. Camada de Features

Cada feature é um módulo independente organizado por domínio de produto. A estrutura interna padrão de uma feature é:

```text
features/nome-da-feature/
├── components/     # Componentes React específicos desta feature
├── hooks/          # Custom hooks (estado, side effects, acesso a dados)
├── model/          # Types locais e funções de seleção/transformação
├── services/       # Chamadas diretas ao Firestore (operações de escrita)
├── constants/      # Constantes estáticas (listas de roles, categorias de tags)
└── pages/          # Componentes de página (montados pelo roteador)
```

### Regras importantes

- **Features não importam de outras features.** Se um componente precisa ser compartilhado, ele vai para `shared/`.
- **Dados em tempo real** usam `useFirestoreSubscription<T>` da camada shared.
- **Operações de escrita** ficam nos `services/` da feature (ex: `updateProfile`, `saveRoast`).
- **Estado de UI** fica nos `hooks/` (ex: `useDiscoverFilters`, `useGuildRoast`).

---

## 7. Camada Shared

### `shared/components/ui/`

Componentes **puramente apresentacionais** — sem fetching de dados, sem efeitos colaterais de negócio:

- Recebem dados via props
- Emitem eventos via callbacks
- Aceitam `className` para override de estilo
- São testáveis de forma isolada

Exemplo: `RoastModal` — modal genérico de veredito usado em `discover` e `guilda`. A lógica específica de cada feature fica nos hooks, o modal apenas renderiza o que recebe.

### `shared/hooks/useFirestoreSubscription<T>`

Hook genérico que elimina a duplicação de subscriptions em tempo real:

```typescript
const { data, loading, error } = useFirestoreSubscription<Profile>({
  collectionName: "profiles",
  constraints: [where("visibility", "==", "public")], // opcional
})
```

Gerencia automaticamente: subscription/cleanup, loading state, error state, unmount seguro.

### `shared/lib/AppError.ts`

Classe de erro centralizada com:

- Códigos semânticos (`PROFILE_NOT_FOUND`, `UNAUTHORIZED`, `ANALYSIS_FAILED`...)
- Mapeamento para HTTP status codes
- Mensagens em português via `getUserErrorMessage(code)`
- Função `isAppError(error)` para type narrowing

### `shared/context/RepositoryContext.tsx`

Implementa o **Dependency Inversion Principle (DIP)**:

```tsx
// Fornece implementações Firebase por padrão
<RepositoryProvider>
  {children}
</RepositoryProvider>

// Em testes, injeta mocks
<RepositoryProvider profileRepo={mockProfileRepo} squadRepo={mockSquadRepo}>
  {children}
</RepositoryProvider>

// Nos componentes:
const { profileRepo, squadRepo } = useRepositories()
```

---

## 8. Roteamento

O projeto usa React Router v7 em **framework mode** (`createBrowserRouter` + `RouterProvider`), não library mode.

### Hierarquia de rotas

```text
/                    ← Shell (RootLayout) — nav + Outlet
├── /                  Landing (público)
├── /onboarding        Cadastro de perfil (público — callback do magic link)
├── /discover          Lista de perfis (requireAuth)
├── /guilda            Gestão da guilda (requireAuth)
├── /p/:uid            Perfil público (sem auth — loader: getPublicProfile)
└── /join/:squadId     Convite de squad (sem auth — loader: getSquad)
```

### Auth guard (`requireAuth`)

Loader assíncrono que roda antes de qualquer rota protegida:

```typescript
async function requireAuth() {
  await auth.authStateReady() // aguarda Firebase resolver persistência
  if (!auth.currentUser) throw redirect("/")
  return null
}
```

`/onboarding` é **intencionalmente** deixado sem guard: é a URL de callback do magic link, onde o Firebase conclui a autenticação após o carregamento da página.

### Lazy loading

Todas as páginas são carregadas de forma lazy. O build gera um chunk separado por página:

```text
ProtectedLayout-*.js   ~8 kB
Landing-*.js           ~9 kB
DiscoverPage-*.js      ~19 kB
GuildaPage-*.js        ~18 kB
Onboarding-*.js        ~40 kB
```

### Tratamento de erros de rota

O `ErrorPage` captura erros de loaders (ex: `PROFILE_NOT_FOUND`, `SQUAD_NOT_FOUND`) e exibe mensagens amigáveis em português via `getUserErrorMessage()`.

---

## 9. API Server

O backend é uma instância Express mínima, usada exclusivamente para ocultar as chaves da API do Gemini do bundle do cliente.

### Endpoints

| Método | Rota | Rate Limit | Descrição |
|--------|------|-----------|-----------|
| `GET` | `/api/health` | — | Status check |
| `POST` | `/api/roast` | 5 req/min | Gera análise individual (brutal ou suave) via Gemini |
| `POST` | `/api/oraculo/match` | 10 req/min | Gera sugestões de match via Gemini |

### Deploy no Vercel

```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/index.ts" }]
}
```

Toda requisição para `/api/*` é encaminhada para a serverless function em `/api/index.ts`. O restante é servido como SPA estática via CDN do Vercel.

---

## 10. Fluxo de Dados

### Leitura em tempo real (Discover / Guilda)

```text
Firestore
  └─ onSnapshot("profiles")
       └─ useFirestoreSubscription<Profile>
            └─ useProfilesRealtime(currentUserId)
                 ├─ sortProfiles(data, currentUserId) via useMemo
                 └─ useDiscoverFilters(profiles)
                      └─ ProfilesGrid (virtualizado) → ProfileCard
```

### Geração de roast

```text
Usuário clica em "Gerar Sina"
  └─ useRoastProfile.executeRoast(profile, persona)
       ├─ verifica se já existe roast em cache (profile.roastBrutal / roastMild)
       ├─ se não existe → POST /api/roast (shared/services/roast.service)
       │    └─ Express → Gemini API → resposta
       ├─ updateProfile(profile.id, { roastBrutal: text }) → Firestore
       └─ setSelectedProfile({ ...profile, roastBrutal: text })
            └─ RoastModal re-renderiza com o novo texto
```

### Perfil público

```text
Usuário acessa /p/abc123
  └─ Route loader: profileRepository.getPublicProfile("abc123")
       ├─ getDoc(db, "members", "abc123")
       ├─ verifica visibility === "public" (AppError UNAUTHORIZED se não for)
       └─ PublicMemberSchema.parse(data)
            └─ PublicProfilePage recebe dados via useLoaderData()
```

### Convite de squad

```text
Usuário acessa /join/squad456
  └─ Route loader: squadRepository.getSquad("squad456")
       └─ JoinSquadPage recebe Squad via useLoaderData()
            ├─ Não autenticado → salva "pendingJoin" no sessionStorage → /onboarding
            └─ Autenticado → squadRepo.addMemberToSquad(id, uid) → /guilda
```

---

## 11. Injeção de Dependência

O projeto usa **Context API** como container de DI, sem libs externas:

```text
App.tsx
└─ QueryClientProvider      ← TanStack Query (server state cache)
   └─ AuthProvider          ← Firebase Auth state
      └─ RepositoryProvider ← Repositórios injetados
         └─ RouterProvider  ← Páginas têm acesso a tudo acima
```

Para trocar implementações em testes de integração:

```tsx
render(
  <RepositoryProvider
    profileRepo={new MockProfileRepository()}
    squadRepo={new MockSquadRepository()}
  >
    <ComponenteATestar />
  </RepositoryProvider>
)
```

---

## 12. Padrões e Convenções

### Importações

O alias `@/` aponta para `src/`. Sempre use o alias, nunca caminhos relativos que atravessam mais de uma pasta:

```typescript
// ✅ correto
import { AppError } from "@/shared/lib/AppError"
import type { Member } from "@/domain/entities/Member"

// ❌ evitar
import { AppError } from "../../../shared/lib/AppError"
```

Ordem de importações (enforçada pelo ESLint):

1. Pacotes externos (`react`, `firebase`, `motion/react`...)
2. Imports internos com `@/` (domínio → infraestrutura → shared → features)
3. Imports relativos do próprio módulo

### Componentes

- **Componentes de página** têm `export default` e ficam em `pages/`
- **Componentes de UI** têm `export function` nomeado e ficam em `components/`
- **Lazy routes** exportam `default` para que o `.then(m => ({ Component: m.default }))` funcione
- Componentes puramente apresentacionais não fazem fetch de dados

### Hooks

- Hooks que gerenciam dados externos usam `useFirestoreSubscription<T>` da camada shared
- Sorting e transformações de dados ficam em `useMemo` dentro do hook, não no `sortFn` do subscription (evita re-triggers infinitos)

### Erros

Sempre lance `AppError` com código semântico. Nunca `throw new Error("alguma coisa")` em código de produção:

```typescript
// ✅
throw new AppError("PROFILE_NOT_FOUND", uid)

// ❌
throw new Error("perfil não encontrado")
```

### Estilo

O projeto usa **Tailwind CSS v4** com tema neo-brutalista. As classes de tema principais:

| Classe | Cor / Uso |
|--------|-----------|
| `bg-neo-black` / `text-neo-black` | Preto `#0a0a0a` — texto e bordas principais |
| `bg-neo-lime` | Verde limão `#B8FF29` — destaque primário |
| `bg-neo-pink` | Rosa `#FF2E93` — alertas e ações destrutivas |
| `bg-neo-cyan` | Ciano `#00E5FF` — ações secundárias |
| `bg-neo-bg` | Fundo `#f5f5f0` — fundo padrão da app |
| `shadow-[4px_4px_0_0_#000]` | Sombra neo-brutalista deslocada |
| `border-[3px] border-neo-black` | Borda grossa padrão |
| `font-heading` | Fonte display (títulos em caixa alta) |

---

## 13. Testes

### Configuração

Vitest está configurado no `vite.config.ts` com `environment: "node"` e alias `@/` para que os testes importem tipos de domínio normalmente.

### O que testar

| Camada | O que testar | Ferramenta |
|--------|-------------|-----------|
| `domain/usecases/` | Funções puras (compatibilidade, filtros, ranking) | Vitest |
| `infrastructure/firebase/` | Repositórios contra Firestore Emulator | Vitest + Firebase Emulator |
| `features/*/hooks/` | Lógica de estado com mocks de repositório | Vitest + Testing Library |
| `shared/components/ui/` | Renderização e interação | Vitest + Testing Library |

### Rodando os testes

```bash
npm test                               # modo watch
npx vitest run                         # execução única
npx vitest run --reporter=verbose      # com detalhes
```

### Estrutura de um arquivo de teste

```typescript
// src/domain/usecases/__tests__/minhaFuncao.test.ts
import { describe, it, expect } from "vitest"
import { minhaFuncao } from "../minhaFuncao"

// Helper para criar fixtures
function criarMembro(overrides: Partial<Member> = {}): Member {
  return { /* valores padrão */ ...overrides }
}

describe("minhaFuncao", () => {
  it("descrição do comportamento esperado", () => {
    expect(minhaFuncao(criarMembro())).toBe(valorEsperado)
  })
})
```

---

## 14. Deploy e CI/CD

### Pipeline de CI (GitHub Actions)

Executa em todo PR e push para `main`:

```yaml
typecheck → lint (zero avisos) → build
```

O build falha se qualquer etapa falhar, bloqueando o merge.

### Deploy (Vercel)

O deploy é automático ao fazer merge em `main`:

1. Vercel detecta o push
2. Roda `npm run build` → gera `dist/`
3. Assets estáticos servidos via CDN global
4. Funções serverless em `/api/index.ts` servem as rotas `/api/*`

### Variáveis de ambiente no Vercel

Configure no painel do projeto em Vercel > Settings > Environment Variables:

| Variável | Obrigatória | Descrição |
|----------|------------|-----------|
| `GEMINI_API_KEY` | ✅ Sim | Chave da API do Google Gemini |
| `APP_URL` | ✅ Sim | URL do app em produção (ex: `https://matchtech-sooty.vercel.app`) |

As chaves do Firebase ficam em `firebase-applet-config.json` (commitado, sem dados sensíveis) e são lidas pelo cliente diretamente.
