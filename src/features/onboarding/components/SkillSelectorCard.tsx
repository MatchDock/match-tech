import { Plus } from "lucide-react";
import { useMemo } from "react";

import type { Skill } from "@/domain/entities/Skill";
import { Card } from "@/shared/components/ui/Card";

interface Props {
  value: string;
  skills: Skill[];
  onChange: (value: string) => void;
  onSelect: (skill: Skill) => void;
  onCreate: (name: string) => void;
}

export function SkillSelectorCard({ value, skills, onChange, onSelect, onCreate }: Props) {
  // Filtra localmente (UI burra, sem regra de negócio)
  const filteredSkills = useMemo(() => {
    if (!value.trim()) return skills;

    return skills.filter((skill) => skill.normalizedName.includes(value.toLowerCase().trim()));
  }, [value, skills]);

  const hasResults = filteredSkills.length > 0;
  const canCreate = value.trim().length > 0;

  return (
    <Card
      variant="white"
      padding="none"
      className="border-4 shadow-[12px_12px_0_0_#00D9FF] overflow-hidden"
    >
      {/* HEADER */}
      <div className="bg-neo-cyan p-4 border-b-4 border-neo-black">
        <h2 className="text-2xl font-heading text-neo-black uppercase">
          ARSENAL_DE_SKILLS (SEARCH)
        </h2>
      </div>

      {/* INPUT */}
      <div className="p-4 border-b-4 border-neo-black bg-white">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar ou criar skill..."
          className="w-full px-4 py-3 border-4 border-neo-black font-bold uppercase text-sm outline-none shadow-[4px_4px_0_0_#000]"
        />
      </div>

      {/* LISTA */}
      <div className="p-4 flex flex-col gap-2 max-h-64 overflow-auto">
        {filteredSkills.map((skill) => (
          <button
            key={skill.id}
            type="button"
            onClick={() => onSelect(skill)}
            className="w-full text-left px-4 py-3 border-3 border-neo-black bg-white hover:bg-neo-lime transition-all font-black uppercase text-sm shadow-[3px_3px_0_0_#000]"
          >
            {skill.name}
          </button>
        ))}

        {/* EMPTY STATE + CREATE */}
        {!hasResults && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-black uppercase opacity-60">Nenhuma skill encontrada</p>

            {canCreate && (
              <button
                type="button"
                onClick={() => onCreate(value)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-neo-black text-neo-lime font-black uppercase border-4 border-neo-black shadow-[4px_4px_0_0_#B8FF29]"
              >
                <Plus className="w-4 h-4" />
                Adicionar "{value}"
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
