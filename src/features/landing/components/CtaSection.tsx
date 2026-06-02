import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";

interface Props {
  onNavigateOnboarding: () => void;
}

export function CtaSection({ onNavigateOnboarding }: Props) {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-neo-black neo-border border-[6px] p-8 md:p-12 text-center relative overflow-hidden group"
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8FF29_1px,transparent_1px)] bg-size-[16px_16px]" />

        <h2
          className="text-3xl md:text-5xl font-heading font-black text-neo-lime uppercase tracking-tighter relative z-10 mb-4"
          style={{ textShadow: "3px 3px 0 #000" }}
        >
          NÃO CHEGUE SOZINHO_
        </h2>

        <p className="text-white font-bold text-lg md:text-xl mb-8 relative z-10 max-w-xl mx-auto">
          40% dos participantes de hackathons desistem por falta de equipe. Não seja esse.
        </p>

        <div className="relative z-10">
          <Button variant="accent-lime" size="xl" onClick={onNavigateOnboarding}>
            <span className="flex items-center gap-3">
              CRIAR MEU PERFIL AGORA
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
