import { Card } from "../../../shared/components/ui/Card";
import type { OnboardingSkills } from "../types";

const SKILL_CONFIG = [
  { label: "Frontend / Visual", key: "frontend" },
  { label: "Backend / Infra", key: "backend" },
  { label: "UX / Psicologia", key: "ux_ui" },
  { label: "Dados / Lógica", key: "dados" },
  { label: "Hardware / IoT", key: "hardware_android" },
  { label: "IA / Vibe Coding", key: "vibe_coding" },
] as const;

interface Props {
  skills: OnboardingSkills;
  onSkillChange: (key: string, value: number) => void;
}

export function SkillSliders({ skills, onSkillChange }: Props) {
  return (
    <Card
      variant="white"
      padding="none"
      className="border-4 shadow-[16px_16px_0_0_#FFC900] overflow-hidden"
    >
      <div className="bg-neo-yellow p-6 border-b-4 border-neo-black flex justify-between items-center">
        <h2 className="text-3xl font-heading text-neo-black uppercase tracking-tighter">
          03. NÍVEL_DE_SINC
        </h2>
        <div className="bg-neo-black text-neo-yellow text-[10px] font-black px-2 py-1 neo-border">
          STATUS: CALIBRANDO
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 bg-white/30 backdrop-blur-sm">
        {SKILL_CONFIG.map(({ label, key }) => (
          <div key={key} className="space-y-4">
            <div className="flex justify-between font-black uppercase text-[10px] tracking-widest">
              <span className="bg-neo-black text-white px-2 py-0.5">{label}</span>
              <span className="text-neo-black text-lg">{skills[key]} / 10</span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                title="Range Input"
                min="1"
                max="10"
                value={skills[key]}
                onChange={(e) => onSkillChange(key, parseInt(e.target.value))}
                className="w-full appearance-none h-6 bg-neo-black neo-border cursor-pointer slider-thumb-neo outline-none"
              />
              <div className="flex justify-between mt-2 px-1 text-[8px] font-black opacity-30">
                <span>MIN</span>
                <span>MAX_CAPACITY</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
