import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/Button";

interface Props {
  // eslint-disable-next-line
  user: any; // TODO
  onNavigateOnboarding: () => void;
  onNavigateDiscover: () => void;
}

export function HeroSection({ user, onNavigateOnboarding, onNavigateDiscover }: Props) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Badge */}
        <div className="inline-block mb-8">
          <span className="font-mono text-xs font-black uppercase bg-neo-black text-neo-lime px-4 py-2 border-[3px] border-neo-black shadow-[4px_4px_0_0_#B8FF29]">
            HACKATHON TECH FLORIPA 2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black uppercase leading-none tracking-tighter mb-6">
          ENCONTRE SUA
          <br />
          <span className="inline-block bg-neo-lime neo-border px-4 py-2 -rotate-1 shadow-[6px_6px_0_0_#000] mt-2">
            EQUIPE IDEAL_
          </span>
        </h1>

        <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto mb-10 bg-white inline-block px-6 py-4 neo-border">
          Mapeie suas skills reais. Descubra perfis complementares.
          <br className="hidden md:block" />
          Monte seu time <span className="bg-neo-yellow px-1">antes do kickoff</span>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="accent-lime" size="xl" onClick={onNavigateOnboarding}>
            <span className="flex items-center gap-3">
              CRIAR MEU PERFIL
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>

          {user && (
            <Button variant="secondary" size="lg" onClick={onNavigateDiscover}>
              VER PERFIS
            </Button>
          )}
        </div>

        {!user && (
          <p className="mt-6 font-mono text-sm font-bold">
            Já tem conta?{" "}
            <button
              onClick={onNavigateOnboarding}
              className="text-neo-pink underline underline-offset-4 hover:text-neo-black transition-colors"
            >
              ENTRAR
            </button>
          </p>
        )}
      </motion.div>
    </section>
  );
}
