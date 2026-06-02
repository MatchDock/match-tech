import { createBrowserRouter, redirect } from "react-router-dom";

import { ErrorPage } from "./ErrorPage";

import { auth } from "@/shared/lib/firebase/firebase.client";

// Redirects to / if the user is not authenticated.
// Uses auth.authStateReady() so Firebase persistence is resolved before checking.
// NOTE: /onboarding is intentionally unguarded — it is the magic-link callback URL,
// meaning Firebase auth completes there after the page loads. A loader-level guard
// would fire before sign-in resolves and redirect the user away.
async function requireAuth() {
  await auth.authStateReady();
  if (!auth.currentUser) throw redirect("/");
  return null;
}

export const router = createBrowserRouter([
  {
    // Root shell — lazy-loads RootLayout (nav + Outlet + background)
    path: "/",
    lazy: () => import("./ProtectedLayout"),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: () =>
          import("@/features/landing/Landing").then((m) => ({
            Component: m.default,
          })),
      },
      {
        // Magic-link callback target — must remain public at loader level
        path: "onboarding",
        lazy: () =>
          import("@/features/onboarding/pages/Onboarding").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "discover",
        loader: requireAuth,
        lazy: () =>
          import("@/features/discover/pages/DiscoverPage").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "guilda",
        loader: requireAuth,
        lazy: () =>
          import("@/features/guilda/pages/GuildaPage").then((m) => ({
            Component: m.default,
          })),
      },
      // Public profile — no auth required
      {
        path: "p/:uid",
        lazy: () =>
          import("@/features/profile/pages/PublicProfilePage").then((m) => ({
            Component: m.default,
          })),
        loader: async ({ params }) => {
          const { profileRepository } = await import("@/infrastructure/firebase/profileRepository");
          return profileRepository.getPublicProfile(params.uid!);
        },
      },
      // Squad invite deep link — no auth required at load time
      {
        path: "join/:squadId",
        lazy: () =>
          import("@/features/squad/pages/JoinSquadPage").then((m) => ({
            Component: m.default,
          })),
        loader: async ({ params }) => {
          const { squadRepository } = await import("@/infrastructure/firebase/squadRepository");
          return squadRepository.getSquad(params.squadId!);
        },
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-neo-bg font-sans">
        <h1 className="font-heading font-black text-6xl uppercase tracking-tighter text-neo-black mb-4">
          404
        </h1>
        <p className="font-bold text-neo-black/70 mb-6">Página não encontrada.</p>
        <a
          href="/"
          className="px-6 py-3 bg-neo-lime text-neo-black font-heading font-bold uppercase border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#000] transition-all inline-block"
        >
          VOLTAR AO INÍCIO
        </a>
      </div>
    ),
  },
]);
