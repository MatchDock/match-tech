import { AnimatePresence, motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import { Card } from "../../../shared/components/ui/Card";
import { Button } from "../../../shared/components/ui/Button";
import Avatar from "../../../shared/components/ui/Avatar";
import type { OnboardingForm, OnboardingSkills } from "../types";

interface Props {
  form: OnboardingForm;
  skills: OnboardingSkills;
  user: any;
  radarData: { subject: string; A: number; fullMark: number }[];
  loading: boolean;
  submitError: string | null;
  onSubmit: (e?: React.FormEvent) => Promise<void>;
}

export function GuildPassport({ form, skills, user, radarData, loading, submitError, onSubmit }: Props) {
  const totalSentiment = form.loves.length + form.veto.length;
  const isUnlocked = totalSentiment >= 10;

  return (
    <div className="space-y-6">
      <Card variant="white" padding="none" className="border-8 border-neo-black overflow-hidden shadow-[16px_16px_0_0_#000] group">
        {/* Passport header */}
        <div className="bg-neo-black text-neo-lime p-5 flex justify-between items-center border-b-4 border-neo-black">
          <div className="flex flex-col">
            <span className="font-heading text-lg leading-none">PASAPORTE_GUILDA</span>
            <span className="text-[8px] font-mono opacity-50 uppercase tracking-[0.2em]">Tech_Floripa_2026</span>
          </div>
          <ShieldCheck className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </div>

        <div className="p-8 space-y-8 bg-white relative">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neo-black/10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neo-black/10" />

          {/* Avatar + identity */}
          <div className="flex gap-6">
            <div className="w-28 h-28 flex items-center justify-center overflow-hidden rotate-2">
              <Avatar
                user={{ photoURL: user.photoURL, github: form.github, name: form.name }}
                size="lg"
                className="shadow-none border-4 w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] opacity-40 font-black uppercase tracking-tighter">NOME_OPERADOR:</p>
                <p className="text-2xl font-black uppercase truncate leading-none tracking-tight">
                  {form.name || "Aguardando..."}
                </p>
              </div>
              <div>
                <p className="text-[10px] opacity-40 font-black uppercase tracking-tighter">CLASSE_PRIMÁRIA:</p>
                <p className="text-[11px] font-black leading-tight bg-neo-lime p-1 neo-border border-2 uppercase inline-block">
                  {form.primaryRole || "AGUARDANDO..."}
                </p>
              </div>
              {form.secondaryRoles.length > 0 && (
                <div>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-tighter">CLASSES_SEC:</p>
                  <div className="flex flex-wrap gap-1">
                    {form.secondaryRoles.map(r => (
                      <span key={r} className="text-[9px] bg-neo-cyan px-2 py-0.5 neo-border border-2 font-black uppercase">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Radar chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase bg-neo-black text-white px-2">Análise de Campo</p>
              <p className="text-[8px] font-mono opacity-50 uppercase">Vibe: {skills.vibe_coding}/10</p>
            </div>
            <div
              className="neo-border border-4 bg-neo-bg flex items-center justify-center relative overflow-hidden group/chart cursor-crosshair"
              style={{ height: "256px", minHeight: "256px" }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
              <RadarChart cx="50%" cy="50%" outerRadius="75%" width={256} height={256} data={radarData}>
                <PolarGrid stroke="#000" strokeWidth={1} strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#000", fontSize: 10, fontWeight: "900", textAnchor: "middle" }}
                />
                <Radar
                  name="Skill"
                  dataKey="A"
                  stroke="#FF2E93"
                  strokeWidth={4}
                  fill="#FF2E93"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </div>
          </div>

          {/* Operator ID row */}
          <div className="grid grid-cols-2 gap-4 border-t-4 border-neo-black pt-6">
            <div>
              <p className="text-[9px] font-black opacity-40 uppercase">ID_OPERADOR</p>
              <p className="text-[10px] font-mono font-bold uppercase truncate">
                {user?.uid.slice(0, 10).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black opacity-40 uppercase text-right">ORIGEM</p>
              <p className="text-[10px] font-mono font-bold uppercase text-right truncate">FLN_BRAZIL</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-neo-black p-6 space-y-3">
          <Button
            onClick={() => onSubmit()}
            variant={isUnlocked ? "accent-lime" : "primary"}
            size="xl"
            className={`w-full text-xl py-6 transition-all ${
              isUnlocked ? "scale-105 shadow-[0_0_20px_#B8FF29]/30" : "opacity-50 grayscale cursor-not-allowed"
            }`}
            disabled={loading || !isUnlocked}
          >
            {loading ? "PROCESSANDO..." : !isUnlocked ? "BLOQUEADO" : "REGISTRAR OPERADOR"}
          </Button>

          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-neo-pink text-white border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] px-4 py-3 text-sm font-bold flex items-center gap-2"
              >
                <span>⚠️</span>
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Debug monitor */}
      <div className="bg-neo-pink text-white p-5 neo-border border-4 shadow-[8px_8px_0_0_#000] font-mono text-[10px] space-y-2 relative overflow-hidden">
        <p className="font-black text-white">&gt; MONITORAMENTO_STATUS:</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="opacity-80">LOVES: {form.loves.length}</p>
          <p className="opacity-80">CONFORT: {form.comfort.length}</p>
          <p className="opacity-80">VETOS: {form.veto.length}</p>
          <p className="opacity-80 underline">ROLES: {form.primaryRole ? 1 : 0}/1</p>
        </div>
        {form.loves.length < 3 && (
          <p className="text-white bg-black px-1 animate-pulse">
            ALERTA: Adicione mais PAIXÕES para calibragem total.
          </p>
        )}
      </div>
    </div>
  );
}
