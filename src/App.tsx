import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./shared/components/ui/ErrorBoundary";

import { router } from "@/routes/routes";
import { RepositoryProvider } from "@/shared/context/RepositoryContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RepositoryProvider>
          <RouterProvider router={router} />
        </RepositoryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
