# match-tech — Upgrade & Improvement Guide

> **Purpose:** This document is a step-by-step guide for an AI agent to apply architectural improvements, clean code principles, SOLID patterns, React Router v7 migration, shareable features, and scalability upgrades to the `match-tech` project.
>
> **Repo:** https://github.com/dev-mauricioAB/match-tech  
> **Stack:** React 19 · Vite · TypeScript · Firebase · Tailwind v4 · react-router-dom v7 · Recharts · Gemini SDK · Express · Vercel

---

## Table of Contents

1. [Project Structure Refactor](#1-project-structure-refactor)
2. [React Router v7 — Framework Mode Migration](#2-react-router-v7--framework-mode-migration)
3. [SOLID Principles](#3-solid-principles)
4. [Shareable Features](#4-shareable-features)
5. [Clean Code Improvements](#5-clean-code-improvements)
6. [Performance & Scalability](#6-performance--scalability)
7. [DX — Tooling & Testing](#7-dx--tooling--testing)
8. [Execution Order](#8-execution-order)

---

## 1. Project Structure Refactor

### Goal
Move from a flat component dump to a **feature-based architecture** with a clear domain layer.

### Target Folder Structure

```
src/
├── features/
│   ├── profile/
│   │   ├── components/       # ProfileCard, RadarChart, SkillSliders, TagSelector
│   │   ├── hooks/            # useProfile.ts, useProfileUpdate.ts
│   │   ├── types.ts          # MemberIdentity, MemberSkills, MemberTags, MemberSquadStatus
│   │   ├── api.ts            # Firestore calls for profile (will be replaced by repository)
│   │   └── index.ts          # barrel export
│   ├── discover/
│   │   ├── components/       # ProfileListCard, FilterBar, DiscoverGrid
│   │   ├── hooks/            # useDiscover.ts, useDiscoverFilters.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── squad/
│   │   ├── components/       # SquadCard, SquadRadarOverlay, InviteButton
│   │   ├── hooks/            # useSquad.ts, useSquadInvite.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── ai/
│       ├── components/       # AnalysisPanel, AnalysisToneToggle
│       ├── hooks/            # useAnalysis.ts
│       ├── strategies/       # profileAnalysis.ts, compatibilityAnalysis.ts, teamAnalysis.ts
│       ├── types.ts
│       └── index.ts
├── domain/
│   ├── ports/                # TypeScript interfaces (IProfileRepository, ISquadRepository)
│   ├── entities/             # Pure domain types (Member, Squad, Tag, Skill)
│   └── usecases/             # Business logic functions (calculateCompatibility, scoreSkills)
├── infrastructure/
│   └── firebase/
│       ├── profileRepository.ts    # Implements IProfileRepository
│       ├── squadRepository.ts      # Implements ISquadRepository
│       ├── firebaseConfig.ts       # Firebase init
│       └── firestoreConverters.ts  # Zod-validated converters
├── shared/
│   ├── ui/                   # Button, Badge, Modal, Spinner, Toast (pure presentational)
│   ├── hooks/                # useAuth.ts, useToast.ts, useMediaQuery.ts
│   └── lib/                  # cn(), formatDate(), constants.ts
├── routes/
│   ├── routes.ts             # createBrowserRouter config (see Section 2)
│   ├── ProtectedLayout.tsx   # Auth guard layout route
│   └── ErrorPage.tsx         # Route-level error boundary
├── App.tsx                   # Just renders <RouterProvider>
└── main.tsx
```

### Action Items

- [ ] Create the folder structure above (empty files with barrel exports first)
- [ ] Move each existing component to its feature folder
- [ ] Extract inline logic from components into `/domain/usecases/`
- [ ] Add `@/` path alias (see Section 5)
- [ ] Update all imports after moving files

---

## 2. React Router v7 — Framework Mode Migration

### Goal
Migrate from `<BrowserRouter>` + `<Routes>` (library mode) to `createBrowserRouter` + `RouterProvider` (data router / framework mode). This unlocks loaders, actions, lazy splitting, and typed route params.

### Step 1 — Install nothing new
`react-router-dom@^7` is already installed. No package changes needed.

### Step 2 — Create `src/routes/routes.ts`

```typescript
import { createBrowserRouter, redirect } from "react-router-dom";
import { getAuth } from "firebase/auth";

// Lazy-loaded page modules
const ProfileSetupPage  = () => import("@/features/profile/pages/ProfileSetupPage");
const DiscoverPage      = () => import("@/features/discover/pages/DiscoverPage");
const SquadPage         = () => import("@/features/squad/pages/SquadPage");
const AIAnalysisPage    = () => import("@/features/ai/pages/AIAnalysisPage");
const PublicProfilePage = () => import("@/features/profile/pages/PublicProfilePage");
const LoginPage         = () => import("@/features/auth/pages/LoginPage");
const JoinSquadPage     = () => import("@/features/squad/pages/JoinSquadPage");

// Auth guard loader — redirect to /login if not authenticated
async function requireAuth() {
  const auth = getAuth();
  await auth.authStateReady();
  if (!auth.currentUser) throw redirect("/login");
  return null;
}

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    lazy: LoginPage,
  },
  {
    path: "/p/:uid",
    lazy: PublicProfilePage,
    loader: async ({ params }) => {
      const { profileRepository } = await import("@/infrastructure/firebase/profileRepository");
      return profileRepository.getPublicProfile(params.uid!);
    },
  },
  {
    path: "/join/:squadId",
    lazy: JoinSquadPage,
  },

  // Protected routes — wrapped in ProtectedLayout
  {
    path: "/",
    lazy: () => import("@/routes/ProtectedLayout"),
    loader: requireAuth,
    children: [
      {
        index: true,
        lazy: DiscoverPage,
        loader: async () => {
          const { profileRepository } = await import("@/infrastructure/firebase/profileRepository");
          return profileRepository.listPublicProfiles();
        },
      },
      {
        path: "profile",
        lazy: ProfileSetupPage,
        loader: async () => {
          const auth = getAuth();
          const { profileRepository } = await import("@/infrastructure/firebase/profileRepository");
          return profileRepository.getProfile(auth.currentUser!.uid);
        },
      },
      {
        path: "squad/:squadId",
        lazy: SquadPage,
        loader: async ({ params }) => {
          const { squadRepository } = await import("@/infrastructure/firebase/squadRepository");
          return squadRepository.getSquad(params.squadId!);
        },
      },
      {
        path: "ai",
        lazy: AIAnalysisPage,
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: <div>404 — Page not found</div>,
  },
]);
```

### Step 3 — Update `src/App.tsx`

```typescript
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes";

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Step 4 — Create `src/routes/ProtectedLayout.tsx`

```typescript
import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/ui/Navbar";

// This is the lazy-loaded component for the protected shell
export function Component() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

### Step 5 — Consume loader data in pages

```typescript
// Before (component fetches its own data)
export function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => { fetchProfiles().then(setProfiles); }, []);
  // ...
}

// After (loader fetched data, component just renders)
import { useLoaderData } from "react-router-dom";
import type { Member } from "@/domain/entities/Member";

export function Component() {              // named export "Component" = RR v7 lazy convention
  const profiles = useLoaderData() as Member[];
  return <DiscoverGrid profiles={profiles} />;
}
```

### Step 6 — Error handling at route level

```typescript
// src/routes/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : "Something went wrong";
  return <div className="error-page">{message}</div>;
}

// Add errorElement to root route in routes.ts:
{
  path: "/",
  lazy: () => import("@/routes/ProtectedLayout"),
  loader: requireAuth,
  errorElement: <ErrorPage />,
  children: [ ... ]
}
```

---

## 3. SOLID Principles

### 3.1 — Single Responsibility Principle (SRP)

**Rule:** Each file/function has one reason to change.

**Before (anti-pattern):**
```typescript
// ProfilePage.tsx — does everything
export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    getDoc(doc(db, "members", auth.currentUser.uid))
      .then(snap => setProfile(snap.data()));
  }, []);

  const handleSave = async (data) => {
    await setDoc(doc(db, "members", auth.currentUser.uid), data);
  };

  // 300 lines of JSX with inline validation logic...
}
```

**After (SRP applied):**
```typescript
// domain/usecases/validateProfile.ts — pure function, testable
export function validateProfile(data: ProfileFormData): ValidationResult { ... }

// features/profile/hooks/useProfile.ts — data layer concern
export function useProfile(uid: string) {
  return useQuery({ queryKey: ["profile", uid], queryFn: () => profileRepo.getProfile(uid) });
}

// features/profile/components/ProfileForm.tsx — pure UI, receives props
export function ProfileForm({ profile, onSave }: ProfileFormProps) { ... }

// features/profile/pages/ProfileSetupPage.tsx — orchestrates
export function Component() {
  const profile = useLoaderData() as Member;
  const { mutate: saveProfile } = useMutation({ mutationFn: profileRepo.updateProfile });
  return <ProfileForm profile={profile} onSave={saveProfile} />;
}
```

### 3.2 — Open/Closed Principle (OCP)

**Rule:** Open for extension, closed for modification.

Apply to the AI analysis feature:

```typescript
// domain/ports/IAnalysisStrategy.ts
export interface IAnalysisStrategy {
  readonly type: "profile" | "compatibility" | "team";
  readonly tone: "brutal" | "gentle";
  buildPrompt(data: AnalysisInput): string;
  parseResponse(raw: string): AnalysisResult;
}

// features/ai/strategies/profileAnalysis.ts
export class ProfileAnalysisStrategy implements IAnalysisStrategy {
  type = "profile" as const;
  tone: "brutal" | "gentle";
  constructor(tone: "brutal" | "gentle") { this.tone = tone; }
  buildPrompt(data: AnalysisInput): string { /* profile-specific prompt */ }
  parseResponse(raw: string): AnalysisResult { /* ... */ }
}

// features/ai/strategies/compatibilityAnalysis.ts
export class CompatibilityAnalysisStrategy implements IAnalysisStrategy {
  // New analysis type — zero changes to existing code
}

// features/ai/AIAnalysisService.ts
export class AIAnalysisService {
  async analyze(strategy: IAnalysisStrategy, data: AnalysisInput): Promise<AnalysisResult> {
    const prompt = strategy.buildPrompt(data);
    const raw = await callGeminiAPI(prompt);          // one place, one function
    return strategy.parseResponse(raw);
  }
}
```

### 3.3 — Liskov Substitution Principle (LSP)

Apply to repository pattern — any implementation must be substitutable:

```typescript
// domain/ports/IProfileRepository.ts
export interface IProfileRepository {
  getProfile(uid: string): Promise<Member>;
  getPublicProfile(uid: string): Promise<PublicMember>;
  updateProfile(uid: string, data: Partial<Member>): Promise<void>;
  listPublicProfiles(filters?: ProfileFilters): Promise<Member[]>;
}

// infrastructure/firebase/profileRepository.ts
export class FirebaseProfileRepository implements IProfileRepository {
  async getProfile(uid: string): Promise<Member> {
    const snap = await getDoc(doc(db, "members", uid));
    return MemberSchema.parse(snap.data());   // Zod validates at runtime
  }
  // ... all interface methods implemented
}

// For tests — swap with in-memory mock, no code changes elsewhere
export class MockProfileRepository implements IProfileRepository {
  private store: Map<string, Member> = new Map();
  async getProfile(uid: string) { return this.store.get(uid)!; }
  // ...
}
```

### 3.4 — Interface Segregation Principle (ISP)

**Rule:** Don't force components to depend on interfaces they don't use.

```typescript
// BAD — one giant Member type imported everywhere
type Member = {
  uid: string; displayName: string; photoURL: string;
  role: string; secondaryRoles: string[];
  skills: SkillRadar; tags: Tag[];
  squadId?: string; squadStatus: SquadStatus;
  createdAt: Timestamp; updatedAt: Timestamp;
  bio: string; linkedIn?: string; github?: string;
}

// GOOD — split into focused interfaces
// domain/entities/Member.ts
export interface MemberIdentity {
  uid: string;
  displayName: string;
  photoURL: string;
  bio: string;
}

export interface MemberRoles {
  role: string;
  secondaryRoles: string[];
}

export interface MemberSkills {
  skills: SkillRadar;
}

export interface MemberTags {
  tags: Tag[];
}

export interface MemberSquadStatus {
  squadId?: string;
  squadStatus: "open" | "looking" | "closed";
}

// Full member = all interfaces combined
export type Member = MemberIdentity & MemberRoles & MemberSkills & MemberTags & MemberSquadStatus;

// Profile card only needs identity + roles — no skills radar imported
export type ProfileCardData = MemberIdentity & MemberRoles & Pick<MemberSquadStatus, "squadStatus">;
```

### 3.5 — Dependency Inversion Principle (DIP)

**Rule:** High-level modules must not depend on low-level modules. Both depend on abstractions.

```typescript
// BAD — hook depends directly on Firestore
export function useSquad(squadId: string) {
  const [squad, setSquad] = useState(null);
  useEffect(() => {
    getDoc(doc(db, "squads", squadId)).then(snap => setSquad(snap.data()));
  }, [squadId]);
  return squad;
}

// GOOD — hook depends on interface; implementation injected via context or DI container
// shared/context/RepositoryContext.tsx
const RepositoryContext = createContext<{
  profileRepo: IProfileRepository;
  squadRepo: ISquadRepository;
} | null>(null);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  return (
    <RepositoryContext.Provider value={{
      profileRepo: new FirebaseProfileRepository(),
      squadRepo: new FirebaseSquadRepository(),
    }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories() {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error("useRepositories must be inside RepositoryProvider");
  return ctx;
}

// Hook now depends on abstraction
export function useSquad(squadId: string) {
  const { squadRepo } = useRepositories();
  return useQuery({ queryKey: ["squad", squadId], queryFn: () => squadRepo.getSquad(squadId) });
}
```

---

## 4. Shareable Features

### 4.1 — Dynamic OG Meta Tags via Express

The app already has an Express server. Use it to inject meta tags before the SPA HTML is served, so links shared on Discord/WhatsApp/Slack show real content.

```typescript
// server/ogMiddleware.ts
import express from "express";
import { getFirebaseAdmin } from "./firebaseAdmin";

export function ogMiddleware(app: express.Application) {
  // Profile route
  app.get("/p/:uid", async (req, res, next) => {
    try {
      const db = getFirebaseAdmin().firestore();
      const snap = await db.collection("members").doc(req.params.uid).get();
      const member = snap.data();
      if (!member) return next();

      const html = await buildIndexHtml({
        title: `${member.displayName} · ${member.role} — Match Tech`,
        description: `${member.bio ?? "Desenvolvedor na comunidade Match Tech"}`,
        image: member.photoURL ?? "https://matchtech-sooty.vercel.app/og-default.png",
        url: `https://matchtech-sooty.vercel.app/p/${req.params.uid}`,
      });
      res.send(html);
    } catch { next(); }
  });

  // Squad route
  app.get("/squad/:squadId", async (req, res, next) => {
    try {
      const db = getFirebaseAdmin().firestore();
      const snap = await db.collection("squads").doc(req.params.squadId).get();
      const squad = snap.data();
      if (!squad) return next();

      const html = await buildIndexHtml({
        title: `Squad ${squad.name} — Match Tech`,
        description: `${squad.members?.length ?? 0} membros · ${squad.hackathon ?? ""}`,
        image: "https://matchtech-sooty.vercel.app/og-squad.png",
        url: `https://matchtech-sooty.vercel.app/squad/${req.params.squadId}`,
      });
      res.send(html);
    } catch { next(); }
  });
}

// Helper: reads index.html and injects meta tags
async function buildIndexHtml(meta: OGMeta): Promise<string> {
  const template = await fs.readFile("dist/index.html", "utf-8");
  const tags = `
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:url" content="${meta.url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
  `;
  return template.replace("</head>", `${tags}</head>`);
}
```

### 4.2 — Public Profile Route (no login required)

```typescript
// Firestore rules addition (firestore.rules)
// Allow public read of a subset of fields
match /members/{uid} {
  allow read: if request.auth != null;       // existing authenticated read
  allow read: if resource.data.visibility == "public";   // new: public profiles
}

// Public profile page
// features/profile/pages/PublicProfilePage.tsx
export function Component() {
  const profile = useLoaderData() as PublicMember;
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <PublicProfileCard profile={profile} />
      <div className="mt-6 text-center">
        <a href="/login" className="btn-primary">Entrar para conectar</a>
      </div>
    </div>
  );
}
```

### 4.3 — Shareable Profile Card (canvas → PNG)

```typescript
// features/profile/components/ShareProfileButton.tsx
import { useRef } from "react";

export function ShareProfileButton({ profile }: { profile: Member }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleShare() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1200;
    canvas.height = 630;

    // Background
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 1200, 630);

    // Name
    ctx.font = "bold 56px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(profile.displayName, 60, 120);

    // Role
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#a78bfa";
    ctx.fillText(profile.role, 60, 175);

    // Top 3 tags
    profile.tags.filter(t => t.sentiment === "love").slice(0, 3).forEach((tag, i) => {
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "#34d399";
      ctx.fillText(`❤️ ${tag.name}`, 60, 260 + i * 40);
    });

    // Radar chart (simplified polygon)
    drawRadarPolygon(ctx, profile.skills, { cx: 900, cy: 315, r: 220 });

    // Footer
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("matchtech-sooty.vercel.app", 60, 590);

    // Download
    const link = document.createElement("a");
    link.download = `${profile.displayName}-match-tech.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={handleShare} className="btn-secondary">
        Compartilhar Perfil
      </button>
    </>
  );
}
```

### 4.4 — Squad Invite Deep Links

```typescript
// Route: /join/:squadId (public, no auth required at load time)
// features/squad/pages/JoinSquadPage.tsx
export function Component() {
  const { squadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { squadRepo } = useRepositories();
  const squad = useLoaderData() as Squad;

  async function handleAccept() {
    if (!user) {
      // Save intent and redirect to login
      sessionStorage.setItem("pendingJoin", squadId!);
      navigate("/login");
      return;
    }
    await squadRepo.joinSquad(squadId!, user.uid);
    navigate(`/squad/${squadId}`);
  }

  return (
    <div className="invite-page">
      <h1>Você foi convidado para o squad <strong>{squad.name}</strong></h1>
      <SquadPreviewCard squad={squad} />
      <button onClick={handleAccept}>Aceitar Convite</button>
    </div>
  );
}

// In LoginPage — pick up the pending join after auth
export function Component() {
  const navigate = useNavigate();

  async function onAuthSuccess() {
    const pendingJoin = sessionStorage.getItem("pendingJoin");
    if (pendingJoin) {
      sessionStorage.removeItem("pendingJoin");
      navigate(`/join/${pendingJoin}`);
    } else {
      navigate("/");
    }
  }
  // ...
}
```

---

## 5. Clean Code Improvements

### 5.1 — Path Aliases

**`tsconfig.json`:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**`vite.config.ts`:**
```typescript
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
```

### 5.2 — Zod Runtime Validation for Firestore

```typescript
// infrastructure/firebase/schemas.ts
import { z } from "zod";

export const TagSchema = z.object({
  name: z.string(),
  sentiment: z.enum(["love", "ok", "veto"]),
});

export const SkillRadarSchema = z.object({
  frontend: z.number().min(1).max(10),
  backend: z.number().min(1).max(10),
  design: z.number().min(1).max(10),
  data: z.number().min(1).max(10),
  devops: z.number().min(1).max(10),
  soft: z.number().min(1).max(10),
});

export const MemberSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  photoURL: z.string().url().optional(),
  role: z.string(),
  secondaryRoles: z.array(z.string()).default([]),
  skills: SkillRadarSchema,
  tags: z.array(TagSchema).min(10),
  squadId: z.string().optional(),
  squadStatus: z.enum(["open", "looking", "closed"]).default("open"),
  bio: z.string().default(""),
  createdAt: z.any(),
  updatedAt: z.any(),
});

export type Member = z.infer<typeof MemberSchema>;

// Usage in repository
async getProfile(uid: string): Promise<Member> {
  const snap = await getDoc(doc(db, "members", uid));
  if (!snap.exists()) throw new AppError("PROFILE_NOT_FOUND", uid);
  return MemberSchema.parse(snap.data());   // throws ZodError on schema drift
}
```

### 5.3 — Centralized Error Handling

```typescript
// shared/lib/AppError.ts
export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    public context?: string,
  ) {
    super(`[${code}] ${context ?? ""}`);
    this.name = "AppError";
  }
}

export type AppErrorCode =
  | "PROFILE_NOT_FOUND"
  | "SQUAD_NOT_FOUND"
  | "UNAUTHORIZED"
  | "ANALYSIS_FAILED"
  | "FIRESTORE_UNAVAILABLE";

// shared/lib/errorMap.ts — user-friendly messages in Portuguese
export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  PROFILE_NOT_FOUND: "Perfil não encontrado.",
  SQUAD_NOT_FOUND: "Squad não encontrada.",
  UNAUTHORIZED: "Você precisa estar logado para isso.",
  ANALYSIS_FAILED: "A análise por IA falhou. Tente novamente.",
  FIRESTORE_UNAVAILABLE: "Sem conexão com o banco de dados.",
};
```

### 5.4 — Shared UI Component Conventions

All shared UI components must:
- Be purely presentational (no data fetching)
- Accept explicit props (no internal state for data)
- Export a single named component per file
- Have a `className` prop for style overrides

```typescript
// shared/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
}
```

---

## 6. Performance & Scalability

### 6.1 — TanStack Query for Server State

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 min cache
      retry: 2,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <RepositoryProvider>
      <App />
    </RepositoryProvider>
  </QueryClientProvider>
);

// Prefetch in loader (combines RR v7 loaders with TanStack Query)
// routes/routes.ts
{
  path: "profile",
  loader: async ({ request }) => {
    const auth = getAuth();
    await queryClient.prefetchQuery({
      queryKey: ["profile", auth.currentUser!.uid],
      queryFn: () => profileRepo.getProfile(auth.currentUser!.uid),
    });
    return null;   // data is in cache, component reads from there
  },
}
```

### 6.2 — Virtualize the Discover Grid

```bash
npm install @tanstack/react-virtual
```

```typescript
// features/discover/components/DiscoverGrid.tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function DiscoverGrid({ profiles }: { profiles: Member[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: profiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,    // estimated card height in px
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: "80vh", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map(item => (
          <div
            key={item.key}
            style={{ position: "absolute", top: item.start, width: "100%" }}
          >
            <ProfileListCard profile={profiles[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6.3 — Memoize Radar Charts

```typescript
// features/profile/components/RadarChart.tsx
import { memo, useMemo } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import type { SkillRadar } from "@/domain/entities/Member";

interface Props {
  skills: SkillRadar;
  size?: number;
}

export const SkillRadarChart = memo(function SkillRadarChart({ skills, size = 200 }: Props) {
  const data = useMemo(() => [
    { subject: "Frontend", value: skills.frontend },
    { subject: "Backend",  value: skills.backend },
    { subject: "Design",   value: skills.design },
    { subject: "Data",     value: skills.data },
    { subject: "DevOps",   value: skills.devops },
    { subject: "Soft",     value: skills.soft },
  ], [skills]);

  return (
    <RadarChart width={size} height={size} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.35} />
    </RadarChart>
  );
});
```

### 6.4 — Move Gemini to Express API Route

```typescript
// server/routes/analyze.ts
import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { rateLimit } from "express-rate-limit";

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const analysisLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 5,                  // 5 requests per user per minute
  keyGenerator: (req) => req.headers["x-user-uid"] as string ?? req.ip,
});

router.post("/api/analyze", analysisLimiter, async (req, res) => {
  const { type, tone, data } = req.body;

  // Validate input
  const validated = AnalyzeRequestSchema.safeParse(req.body);
  if (!validated.success) return res.status(400).json({ error: "Invalid request" });

  try {
    const prompt = buildPrompt(type, tone, data);   // same logic as before
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ result: response.text });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

export default router;

// Client-side (removes Gemini SDK from browser bundle)
// features/ai/api.ts
export async function requestAnalysis(params: AnalyzeRequest): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-uid": getCurrentUserUid(),
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new AppError("ANALYSIS_FAILED");
  return res.json();
}
```

---

## 7. DX — Tooling & Testing

### 7.1 — ESLint + Prettier

```bash
npm install -D eslint-config-prettier prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-hooks eslint-plugin-import \
  lint-staged husky
```

**`eslint.config.js`:**
```javascript
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { parser: tsparser, parserOptions: { project: true } },
    plugins: { "@typescript-eslint": tseslint, "react-hooks": reactHooks, import: importPlugin },
    rules: {
      ...tseslint.configs["recommended-type-checked"].rules,
      ...reactHooks.configs.recommended.rules,
      "import/order": ["warn", { "newlines-between": "always" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
];
```

**`.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**`package.json` additions:**
```json
{
  "scripts": {
    "lint": "eslint src --max-warnings=0",
    "format": "prettier --write src",
    "typecheck": "tsc --noEmit"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

### 7.2 — Vitest Tests for Domain Logic

```typescript
// src/domain/usecases/__tests__/calculateCompatibility.test.ts
import { describe, it, expect } from "vitest";
import { calculateCompatibility } from "../calculateCompatibility";

const baseProfile = {
  skills: { frontend: 8, backend: 4, design: 3, data: 2, devops: 3, soft: 7 },
  tags: [
    { name: "React", sentiment: "love" },
    { name: "Node", sentiment: "ok" },
    { name: "PHP", sentiment: "veto" },
  ],
  role: "frontend",
};

describe("calculateCompatibility", () => {
  it("returns 100 for identical profiles", () => {
    expect(calculateCompatibility(baseProfile, baseProfile)).toBe(100);
  });

  it("penalizes tag vetoes", () => {
    const other = { ...baseProfile, tags: [{ name: "PHP", sentiment: "love" }] };
    const score = calculateCompatibility(baseProfile, other);
    expect(score).toBeLessThan(50);
  });

  it("rewards complementary skills", () => {
    const backendHeavy = {
      ...baseProfile,
      skills: { frontend: 2, backend: 9, design: 2, data: 7, devops: 8, soft: 6 },
    };
    const score = calculateCompatibility(baseProfile, backendHeavy);
    expect(score).toBeGreaterThan(70);
  });
});
```

### 7.3 — GitHub Actions CI

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npx vitest run --reporter=verbose

      - name: Build
        run: npm run build
```

---

## 8. Execution Order

Apply improvements in this sequence to minimize breaking changes:

### Phase 1 — Foundation (no behavior changes)
1. Add `@/` path aliases to `tsconfig.json` + `vite.config.ts`
2. Create empty folder structure (`features/`, `domain/`, `infrastructure/`, `shared/`)
3. Set up ESLint + Prettier + Husky
4. Add `zod` dependency and write Firestore schemas
5. Add GitHub Actions CI workflow

### Phase 2 — Domain Layer (parallel to UI, no breaking changes)
6. Write `IProfileRepository`, `ISquadRepository` interfaces
7. Write `FirebaseProfileRepository`, `FirebaseSquadRepository` implementations with Zod parsing
8. Write `AppError` class + error messages
9. Split `Member` type into focused interfaces
10. Write `RepositoryProvider` context
11. Write domain usecase functions (compatibility algorithm, etc.)

### Phase 3 — Routing Migration
12. Create `src/routes/routes.ts` with `createBrowserRouter`
13. Create `ProtectedLayout.tsx` and `ErrorPage.tsx`
14. Update `App.tsx` to use `RouterProvider`
15. Move each page's data fetching to its route loader
16. Add lazy loading to all page routes
17. Add public profile route `/p/:uid`
18. Add squad invite route `/join/:squadId`

### Phase 4 — Feature Refactor (one feature at a time)
19. Refactor `profile` feature: extract hooks, split components, use repository
20. Refactor `discover` feature: virtualize list, use TanStack Query
21. Refactor `squad` feature: invite links, deep link handling
22. Refactor `ai` feature: move API call to Express, implement strategy pattern

### Phase 5 — Shareable Items
23. Add OG meta tag injection to Express server
24. Add `ShareProfileButton` with canvas PNG export
25. Add squad invite link generator

### Phase 6 — Performance
26. Install TanStack Query, wrap app, migrate hooks
27. Install TanStack Virtual, apply to DiscoverGrid
28. Add `React.memo` to `SkillRadarChart`
29. Move Gemini calls to `/api/analyze` Express endpoint with rate limiting

### Phase 7 — Tests
30. Write unit tests for all domain usecase functions
31. Write integration tests for repository implementations (Firebase emulator)

---

## Dependencies to Add

```bash
# Required
npm install zod @tanstack/react-query @tanstack/react-virtual

# Dev
npm install -D eslint-config-prettier prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-hooks eslint-plugin-import \
  lint-staged husky

# Optional (for TanStack Query devtools in dev)
npm install -D @tanstack/react-query-devtools
```

---

## Notes for the AI Agent

- **Do not break the existing Firebase config** — `firebase-applet-config.json` must remain untouched
- **Keep Tailwind v4** — do not downgrade or replace with CSS Modules
- **Preserve `motion/react` animations** — component refactors should keep animation wrappers
- **Portuguese strings stay in Portuguese** — UI text, error messages, comments can remain in PT-BR
- **Vercel deploy must keep working** — `vercel.json` SPA fallback config must not be removed
- **Firestore rules** — any new public routes must have corresponding `firestore.rules` updates
- **Test each phase before moving to the next** — run `npm run dev` and verify the app still works after each section

---

*Generated by Claude for match-tech — June 2026*
