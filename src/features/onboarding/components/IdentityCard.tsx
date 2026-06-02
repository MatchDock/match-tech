import { User, Github, Linkedin, ShieldCheck } from "lucide-react";
import { Card } from "../../../shared/components/ui/Card";
import type { OnboardingForm } from "../types";

interface Props {
  form: OnboardingForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function IdentityCard({ form, onChange, onBioChange }: Props) {
  return (
    <Card variant="white" padding="none" className="border-4 shadow-[12px_12px_0_0_#000] overflow-hidden">
      <div className="bg-neo-cyan p-4 border-b-4 border-neo-black">
        <h2 className="text-2xl font-heading text-neo-black flex items-center gap-2">
          <User className="w-6 h-6" /> 01. IDENTIDADE
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Trust bridge callout */}
        <div className="bg-neo-yellow/20 p-4 neo-border border-2 flex gap-4 items-center">
          <div className="bg-neo-black p-2 rounded-full ring-2 ring-neo-yellow">
            <ShieldCheck className="w-6 h-6 text-neo-yellow" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black uppercase leading-tight italic">PONTE DE CONFIANÇA:</p>
            <p className="text-[10px] font-bold uppercase opacity-70">
              O algoritmo da guilda cruza dados do GitHub e LinkedIn para validar xp e sugerir
              missões de alto impacto. Sem pontes, você é um fantasma.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-bold mb-1 text-xs text-gray-500 uppercase tracking-widest">
              Codinome / Nome de Guerra
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              className="w-full neo-border p-4 bg-neo-bg font-black focus:bg-white transition-all focus:ring-8 focus:ring-neo-cyan/20 outline-none text-lg"
              placeholder="EX: CYBER_KUN"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold mb-1 text-xs text-gray-500 uppercase tracking-widest">
              Bio / Pitch Pessoal (Max 280 caracteres)
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onBioChange}
              className="w-full neo-border p-4 bg-neo-bg font-bold focus:bg-white transition-all focus:ring-8 focus:ring-neo-cyan/20 outline-none text-sm resize-none h-24"
              placeholder="Ex: Desenvolvedor Android embarcado focado em CD e coletores industriais..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-bold mb-1 text-xs text-gray-500 uppercase tracking-widest">
              Status de Matchmaking
            </label>
            <select
              name="status"
              title="Status Select"
              value={form.status}
              onChange={onChange}
              className="w-full neo-border p-4 bg-neo-bg font-black focus:bg-white transition-all focus:ring-8 focus:ring-neo-cyan/20 outline-none text-sm"
            >
              <option value="looking">BUSCANDO EQUIPE</option>
              <option value="open">ABERTO A PROPOSTAS</option>
              <option value="complete">EQUIPE FORMADA</option>
            </select>
          </div>

          {/* Social links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-xs text-gray-500 uppercase flex items-center gap-1">
                <Github className="w-4 h-4" /> GitHub / Terminal
              </label>
              <input
                name="github"
                value={form.github}
                onChange={onChange}
                type="text"
                className="w-full neo-border p-3 bg-neo-bg font-bold focus:bg-white transition-all focus:ring-4 focus:ring-neo-black/10 outline-none"
                placeholder="@username"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-xs text-gray-500 uppercase flex items-center gap-1">
                <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn / Rede
              </label>
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={onChange}
                type="text"
                className="w-full neo-border p-3 bg-neo-bg font-bold focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/10 outline-none"
                placeholder="in/perfil"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
