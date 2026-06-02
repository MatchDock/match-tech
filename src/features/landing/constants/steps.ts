import { Users, Zap, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Step {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: "lime" | "yellow" | "pink";
  accent: string;
}

export const STEPS: Step[] = [
  {
    icon: Target,
    title: "MAPEIE_",
    desc: "Registre suas skills, paixões e vetos. Sem currículo genérico — só verdade.",
    color: "lime",
    accent: "bg-neo-pink",
  },
  {
    icon: Users,
    title: "DESCUBRA_",
    desc: "Explore perfis complementares ao seu. Filtre por role, stack ou afinidade.",
    color: "yellow",
    accent: "bg-neo-cyan",
  },
  {
    icon: Zap,
    title: "CONECTE_",
    desc: "Forme sua equipe ideal antes do kickoff. Sem surpresas no dia D.",
    color: "pink",
    accent: "bg-neo-lime",
  },
];
