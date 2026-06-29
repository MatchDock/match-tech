import { Search, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";

import type { Skill } from "@/domain/entities/Skill";

interface Props {
  search: string;
  filteredSkills: Skill[];
  selectedSkills: Skill[];
  onSearchChange: (value: string) => void;
  onSelectSkill: (skill: Skill) => void;
  onRemoveSkill: (skillId: string) => void;
  onCreateSkill: (name: string) => Promise<void>;
}

export function SkillAutocomplete({
  search,
  filteredSkills,
  selectedSkills,
  onSearchChange,
  onSelectSkill,
  onRemoveSkill,
  onCreateSkill,
}: Props) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = search.trim();

  // Fecha o dropdown ao clicar fora do container inteiro
  // Isso é mais confiável do que onBlur + setTimeout
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mostra resultados sempre que está aberto — lista completa quando vazio, filtrada quando tem texto
  const showNoResults = open && trimmed.length > 0 && filteredSkills.length === 0;
  const showResults = open && filteredSkills.length > 0;

  const handleSelect = useCallback(
    (skill: Skill) => {
      onSelectSkill(skill);
      onSearchChange("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [onSelectSkill, onSearchChange],
  );

  const handleCreate = useCallback(async () => {
    if (!trimmed || creating) return;
    setCreating(true);
    try {
      await onCreateSkill(trimmed);
      onSearchChange("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }, [trimmed, creating, onCreateSkill, onSearchChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      onSearchChange("");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showNoResults) {
        handleCreate();
      } else if (filteredSkills.length === 1) {
        handleSelect(filteredSkills[0]);
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* ── Search input ── */}
      <div className="relative">
        <div
          className={`flex items-center neo-border border-4 bg-white transition-all
            ${open ? "shadow-[10px_10px_0_0_#000]" : "shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000]"}`}
        >
          <Search className="w-5 h-5 ml-4 text-neo-black/40 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={search}
            placeholder="BUSCAR OU ADICIONAR SKILL..."
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 font-black text-sm uppercase tracking-widest bg-transparent outline-none text-neo-black placeholder:text-neo-black/25"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                inputRef.current?.focus();
                setOpen(true);
              }}
              className="mr-3 p-1 hover:bg-neo-pink/20 transition-colors"
              tabIndex={-1}
            >
              <X className="w-4 h-4 text-neo-black/50" />
            </button>
          )}
        </div>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.1 }}
              className="absolute z-50 top-full left-0 right-0 mt-1 neo-border border-4 bg-white shadow-[8px_8px_0_0_#000] max-h-60 overflow-y-auto"
            >
              {showResults && (
                <>
                  {/* Label de contexto */}
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neo-black/30">
                      {trimmed ? `Resultados para "${trimmed}"` : "Todas as skills disponíveis"}
                    </span>
                  </div>

                  {filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      // mousedown registra antes do blur — sem precisar de setTimeout
                      onMouseDown={(e) => {
                        e.preventDefault(); // impede blur no input
                        handleSelect(skill);
                      }}
                      className="w-full text-left px-4 py-3 font-black text-xs uppercase tracking-widest hover:bg-neo-cyan/20 border-b-2 border-neo-black/10 last:border-0 transition-colors"
                    >
                      {skill.name}
                    </button>
                  ))}
                </>
              )}

              {showNoResults && (
                <div className="p-4 space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-neo-black/50">
                    Nenhuma skill encontrada.
                  </p>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                    disabled={creating}
                    className="flex items-center gap-2 bg-neo-black text-white px-4 py-2 neo-border border-2 font-black text-xs uppercase tracking-widest hover:bg-neo-black/80 disabled:opacity-50 transition-colors w-full"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    {creating ? "ADICIONANDO..." : `Adicionar "${trimmed}"`}
                  </button>
                </div>
              )}

              {/* Campo vazio + dropdown aberto: nenhum texto digitado ainda */}
              {open && !trimmed && filteredSkills.length === 0 && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-neo-black/40">
                    Todas as skills já foram adicionadas.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Selected skills chips ── */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-2 bg-neo-black text-white px-3 py-1.5 neo-border border-2 shadow-[3px_3px_0_0_#00e5ff]"
              >
                <span className="font-black text-xs uppercase tracking-widest text-neo-cyan">
                  {skill.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill.id)}
                  className="text-white/40 hover:text-neo-pink transition-colors"
                  title={`Remover ${skill.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
