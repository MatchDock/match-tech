# Mapa do Código — Match Tech

> **Última atualização:** Junho 2026 — Refatoração Clean Architecture (Fases 0–7)
>
> Este documento é um guia de navegação rápida pela codebase atual.
> Para a explicação completa da arquitetura e dos padrões, consulte [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Estrutura de Diretórios

```text
match-tech/
│
├── src/
│   │
│   ├── domain/                        ← Núcleo — zero dependências externas
│   │   ├── entities/
│   │   │   ├── Member.ts              # Tipo Member (ISP: MemberIdentity, MemberRoles, MemberSkills...)
│   │   │   ├── Squad.ts               # Tipo Squad e SquadMember
│   │   │   └── Shared.ts              # RoastPersona, Tag, SkillRadar, SquadStatus
│   │   ├── ports/
│   │   │   ├── IProfileRepository.ts  # Contrato de acesso a perfis
│   │   │   ├── ISquadRepository.ts    # Contrato de acesso a squads
│   │   │   ├── IAuthService.ts        # Contrato de autenticação
│   │   │   └── IRoastService.ts       # Contrato de geração de roast
│   │   └── usecases/
│   │       ├── compatibilityAlgorithm.ts  # calculateCompatibility, scoreSkillsForRole, filterMembers...
│   │       └── __tests__/
│   │           └── compatibilityAlgorithm.test.ts  # 22 testes unitários
│   │
│   ├── infrastructure/
│   │   └── firebase/
│   │       ├── profileRepository.ts   # FirebaseProfileRepository implements IProfileRepository
│   │       ├── squadRepository.ts     # FirebaseSquadRepository implements ISquadRepository
│   │       ├── schemas.ts             # Schemas Zod (MemberSchema, SquadSchema, TagSchema...)
│   │       └── index.ts               # Barrel export
│   │
│   ├── features/                      ← Módulos de produto (cada um é independente)
│   │   ├── discover/
│   │   │   ├── components/            # ProfilesGrid (virtualizado), RoastModal (adaptador), DiscoverFilters...
│   │   │   ├── hooks/                 # useProfilesRealtime, useDiscoverFilters, useRoastProfile
│   │   │   ├── model/                 # discover.types.ts (Profile, RoastPersona re-export), discover.selectors.ts
│   │   │   ├── services/              # discover.repository.ts (updateProfile)
│   │   │   ├── constants/
│   │   │   └── pages/
│   │   │       └── DiscoverPage.tsx   # Rota: /discover (auth obrigatória)
│   │   │
│   │   ├── guilda/
│   │   │   ├── components/            # GuildMembersGrid, GuildRoastModal (adaptador), GuildMemberCard...
│   │   │   ├── hooks/                 # useGuildMembersRealtime, useGuildRoast
│   │   │   ├── model/                 # guilda.types.ts (GuildMember, RoastPersona re-export)
│   │   │   ├── services/              # guilda.repository.ts (saveRoast)
│   │   │   ├── constants/
│   │   │   ├── utils/
│   │   │   └── pages/
│   │   │       └── GuildaPage.tsx     # Rota: /guilda (auth obrigatória)
│   │   │
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   ├── AuthGate/          # LoginScreen, MagicLinkSentScreen, CompletingMagicLink, MagicLinkConfirmScreen
│   │   │   │   ├── IdentityCard.tsx
│   │   │   │   ├── ClassSelector.tsx
│   │   │   │   ├── SkillSliders.tsx
│   │   │   │   ├── TagCategoryCard.tsx
│   │   │   │   ├── ArsenalCalibration.tsx
│   │   │   │   └── GuildPassport.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useOnboardingForm.ts   # Form state + Firestore save/load
│   │   │   ├── constants/
│   │   │   │   ├── roles.ts               # ROLES_LIST
│   │   │   │   └── tagCategories.ts       # TAG_CATEGORIES
│   │   │   └── pages/
│   │   │       └── Onboarding.tsx         # Rota: /onboarding (callback do magic link — sem auth guard)
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   └── ShareProfileButton.tsx # Canvas PNG 1200×630
│   │   │   └── pages/
│   │   │       └── PublicProfilePage.tsx  # Rota pública: /p/:uid
│   │   │
│   │   ├── squad/
│   │   │   └── pages/
│   │   │       └── JoinSquadPage.tsx      # Rota de convite: /join/:squadId
│   │   │
│   │   └── landing/
│   │       └── Landing.tsx                # Rota: / (pública)
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── RoastModal.tsx         # Modal genérico de veredito (usado por discover e guilda)
│   │   │   │   ├── SkillRadar.tsx         # Radar chart memoizado (React.memo + useMemo)
│   │   │   │   ├── ProfileCard.tsx        # Card de perfil do feed discover
│   │   │   │   ├── Avatar.tsx             # Avatar com fallback chain (Google → GitHub → iniciais)
│   │   │   │   ├── Button.tsx             # Botão Neo-Brutalista
│   │   │   │   ├── Card.tsx               # Card Neo-Brutalista
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── TagBadge.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   └── states/                    # LoadingState, EmptyState, ErrorState
│   │   ├── hooks/
│   │   │   ├── useFirestoreSubscription.ts  # Hook genérico onSnapshot<T>
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   └── RepositoryContext.tsx        # RepositoryProvider + useRepositories()
│   │   ├── lib/
│   │   │   ├── firebase/
│   │   │   │   ├── firebase.client.ts       # initializeApp, getAuth, getFirestore
│   │   │   │   └── firebase.config.ts       # lê firebase-applet-config.json
│   │   │   ├── logger/
│   │   │   │   └── logger.ts               # Loggers por módulo (authLog, firestoreLog, apiLog...)
│   │   │   ├── utils/
│   │   │   │   ├── cn.ts                   # cn() = clsx + tailwind-merge
│   │   │   │   └── entity.ts               # sortByCurrentUserAndName()
│   │   │   └── AppError.ts                 # AppError class + códigos + getUserErrorMessage() PT-BR
│   │   └── services/
│   │       └── roast.service.ts             # POST /api/roast (cliente HTTP)
│   │
│   ├── routes/
│   │   ├── routes.tsx                 # createBrowserRouter — todas as rotas com lazy + loaders
│   │   ├── ProtectedLayout.tsx        # Re-export de RootLayout como Component lazy
│   │   └── ErrorPage.tsx              # Trata AppError + isRouteErrorResponse
│   │
│   ├── layouts/
│   │   └── RootLayout.tsx             # Nav + Outlet + logout modal
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx            # Firebase Auth: Google OAuth + Magic Link
│   │
│   ├── server/                        ← Express API (backend serverless no Vercel)
│   │   ├── app.ts                     # Instância Express
│   │   ├── routes/
│   │   │   └── index.ts               # Registro: /api/health, /api/roast, /api/oraculo/match
│   │   ├── features/
│   │   │   ├── roast/                 # POST /api/roast — análise IA individual (5 req/min)
│   │   │   └── oraculo/               # POST /api/oraculo/match — match por IA (10 req/min)
│   │   └── shared/
│   │       ├── lib/
│   │       │   ├── gemini.server.ts   # Cliente Gemini (gemini-2.5-flash)
│   │       │   └── firebase-admin.server.ts
│   │       └── utils/
│   │           └── async-handler.ts
│   │
│   ├── App.tsx         # QueryClientProvider + AuthProvider + RepositoryProvider + RouterProvider
│   └── main.tsx        # createRoot + global error listeners
│
├── docs/
│   ├── ARCHITECTURE.md          ← Referência técnica principal (atualizada)
│   ├── CODEBASE_MAP.md          ← Este arquivo
│   ├── VISION_MATCH_TECH.md     ← Visão de produto e design system
│   ├── TODO_MATCH_TECH.md       ← Histórico de desenvolvimento (arquivo)
│   ├── FRONTEND_BLUEPRINT.md    ← Blueprint original (depreciado → ver ARCHITECTURE.md)
│   └── hackathon_tech_floripa_2026_strategy.md ← Estratégia do evento
│
├── .github/workflows/
│   └── ci.yml           # typecheck → lint → build (Node 22)
│
├── firebase-applet-config.json  # Config Firebase (sem chaves sensíveis)
├── firestore.rules              # Regras de segurança do Firestore
├── vercel.json                  # /api/* → /api/index.ts (serverless)
├── vite.config.ts               # Vite + Tailwind + PWA + Vitest
├── tsconfig.json                # paths: { "@/*": ["src/*"] }
└── package.json
```

---

## Rotas da Aplicação

| Rota | Componente | Auth | Loader |
| --- | --- | --- | --- |
| `/` | Landing | Pública | — |
| `/onboarding` | Onboarding | Pública* | — |
| `/discover` | DiscoverPage | `requireAuth` | — |
| `/guilda` | GuildaPage | `requireAuth` | — |
| `/p/:uid` | PublicProfilePage | Pública | `profileRepository.getPublicProfile(uid)` |
| `/join/:squadId` | JoinSquadPage | Pública | `squadRepository.getSquad(squadId)` |

*`/onboarding` é intencionalmente público — é o callback do magic link.

---

## API Routes

| Método | Rota | Rate Limit | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Status check |
| `POST` | `/api/roast` | 5 req/min | Análise individual via Gemini |
| `POST` | `/api/oraculo/match` | 10 req/min | Match de compatibilidade via Gemini |

---

## Coleções Firestore

### `profiles`

Usada pela feature `discover`. Escrita pelo `useOnboardingForm`.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `userId` | string | Firebase Auth UID |
| `name` | string | Nome do membro |
| `photoURL` | string\|null | Foto (Google ou null) |
| `github` | string | Handle do GitHub |
| `linkedin` | string | Handle do LinkedIn |
| `bio` | string | Descrição pessoal |
| `primaryRole` | string | Role principal |
| `secondaryRoles` | string[] | Roles secundárias |
| `skills` | map | `{frontend, backend, ux_ui, dados, hardware_android, vibe_coding}` (1–10) |
| `canvas` | map | `{loves, comfort, veto}` — arrays de tags |
| `status` | string | `"looking"` \| `"open"` \| `"complete"` |
| `roastBrutal` | string\|null | Análise IA brutal gerada |
| `roastMild` | string\|null | Análise IA suave gerada |
| `createdAt` | Timestamp | Criação |
| `updatedAt` | Timestamp | Última atualização |

### `members`

Usada pela feature `guilda`. Schema similar a `profiles` com campos de skills diferentes.

### `squads`

Usada pelo `ISquadRepository`. Campos: `id`, `name`, `description`, `ownerId`, `members[]`, `maxMembers`, `createdAt`, `updatedAt`.

---

## Dependências Principais

| Pacote | Versão | Uso |
| --- | --- | --- |
| `react` | ^19 | UI Framework |
| `react-router-dom` | ^7.14 | Roteamento (framework mode) |
| `@tanstack/react-query` | ^5.100 | Cache de server state |
| `@tanstack/react-virtual` | ^3.14 | Virtualização de listas |
| `firebase` | ^12 | Auth + Firestore client |
| `firebase-admin` | ^13 | Admin SDK (server) |
| `@google/genai` | ^1.29 | Gemini AI SDK (server only) |
| `express` | ^4.21 | API server |
| `express-rate-limit` | ^8.5 | Rate limiting Gemini routes |
| `zod` | ^4.4 | Validação runtime |
| `tailwindcss` | ^4.1 | Estilo (Neo-Brutalismo) |
| `motion` | ^12 | Animações |
| `recharts` | ^3.8 | Radar charts |
| `vitest` | ^4.1 | Testes unitários |

---

## Design System (Neo-Brutalismo — não alterar)

| Classe/Token | Valor | Uso |
| --- | --- | --- |
| `bg-neo-bg` | `#f5f5f0` | Fundo principal |
| `text-neo-black` / `border-neo-black` | `#0a0a0a` | Texto e bordas |
| `bg-neo-lime` | `#B8FF29` | Acento primário |
| `bg-neo-pink` | `#FF2E93` | Alertas, destrutivo |
| `bg-neo-cyan` | `#00E5FF` | Ações secundárias |
| `bg-neo-yellow` | `#FFC900` | Acento amarelo |
| `font-heading` | Space Grotesk / Archivo Black | Títulos UPPERCASE |
| `shadow-[4px_4px_0_0_#000]` | — | Sombra deslocada padrão |
| `border-[3px] border-neo-black` | — | Borda grossa padrão |

---

*Este mapa reflete o estado após a refatoração Clean Architecture (Junho 2026).*
