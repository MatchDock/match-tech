import { useNavigate } from "react-router-dom";

import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { NeoParticles } from "./components/NeoParticles";
import { STEPS } from "./constants/steps";

import { useAuth } from "@/contexts/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      <NeoParticles />
      <HeroSection
        user={user}
        onNavigateOnboarding={() => navigate("/onboarding")}
        onNavigateDiscover={() => navigate("/discover")}
      />
      <HowItWorksSection steps={STEPS} />
      <CtaSection onNavigateOnboarding={() => navigate("/onboarding")} />
      <Footer />
    </div>
  );
}
