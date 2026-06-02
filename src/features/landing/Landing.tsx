import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import { STEPS } from "./constants/steps";
import { NeoParticles } from "./components/NeoParticles";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      <NeoParticles />
      <HeroSection
        user={user}
        onNavigateOnboarding={() => navigate("/onboarding")}
        onNavigateGuilda={() => navigate("/guilda")}
      />
      <HowItWorksSection steps={STEPS} />
      <CtaSection onNavigateOnboarding={() => navigate("/onboarding")} />
      <Footer />
    </div>
  );
}
