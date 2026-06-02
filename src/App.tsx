import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./shared/components/ui/ErrorBoundary";
import DiscoverPage from "./features/discover/pages/DiscoverPage";
import Onboarding from "./features/onboarding/pages/Onboarding";
import Landing from "./features/landing/Landing";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Landing />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="discover" element={<DiscoverPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
