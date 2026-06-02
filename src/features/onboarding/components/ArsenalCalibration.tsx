import { motion } from "motion/react";
import { Info, ShieldCheck } from "lucide-react";
import type { OnboardingForm } from "../types";

interface Props {
  form: OnboardingForm;
}

export function ArsenalCalibration({ form }: Props) {
  const total = form.loves.length + form.veto.length;
  const isCalibrated = total >= 10;

  return (
    <div className="bg-white neo-border border-4 shadow-[12px_12px_0_0_#000] p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neo-cyan/10 rounded-full -mr-16 -mt-16 blur-2xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neo-cyan neo-border border-2">
              <ShieldCheck className="w-6 h-6 text-neo-black" />
            </div>
            <h3 className="text-neo-black font-heading text-2xl uppercase tracking-tighter">
              CALIBRAGEM DO ARSENAL
            </h3>
          </div>
          <p className="text-[11px] text-neo-black/60 font-black uppercase tracking-widest pl-12">
            Precisamos conhecer seu perfil para gerar sua ID única.
          </p>
        </div>

        <div className="bg-neo-black text-white px-4 py-2 neo-border border-2 self-end md:self-auto">
          <span className={`text-2xl font-heading leading-none ${isCalibrated ? "text-neo-lime" : "text-neo-pink"}`}>
            {Math.min(total, 10)} / 10
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-8 bg-neo-bg neo-border border-4 overflow-hidden p-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((total / 10) * 100, 100)}%` }}
          className={`h-full transition-colors ${isCalibrated ? "bg-neo-lime" : "bg-neo-pink"}`}
        />
      </div>

      {/* Info boxes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-neo-cyan/10 p-4 neo-border border-2">
          <Info className="w-6 h-6 text-neo-cyan shrink-0" />
          <p className="text-[10px] text-neo-black font-bold uppercase leading-tight">
            <span className="text-neo-cyan block mb-1">POR QUE ISSO?</span>
            Para que nossa IA crie um mapeamento justo e te conecte às melhores missões,
            precisamos de pelo menos 10 opiniões (Amo ou Veto) sobre as tecnologias abaixo.
          </p>
        </div>

        <div
          className={`flex items-center gap-3 p-4 neo-border border-2 transition-all
            ${isCalibrated ? "bg-neo-lime/10 border-neo-lime" : "bg-neo-pink/10 border-neo-pink animate-pulse"}`}
        >
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCalibrated ? "bg-neo-lime" : "bg-neo-pink"}`} />
          <p className="text-[10px] text-neo-black font-bold uppercase leading-tight">
            <span className="block mb-1">STATUS DO SISTEMA:</span>
            {isCalibrated
              ? "SISTEMA CALIBRADO! VOCÊ JÁ PODE ENTRAR, MAS QUANTO MAIS TAGS MARCAR, MELHOR SERÁ SEU MATCH COM A GUILDA."
              : `AGUARDANDO DADOS: MARQUE MAIS ${10 - total} TAGS.`}
          </p>
        </div>
      </div>
    </div>
  );
}
