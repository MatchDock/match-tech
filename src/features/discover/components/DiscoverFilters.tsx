import { Filter, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";

import { ROLE_OPTIONS, STATUS_OPTIONS } from "../constants/discover.constants";

interface DiscoverFiltersProps {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
  selectedTag: string;
  topTags: string[];
  allTags: string[];
  setSearchQuery: (value: string) => void;
  setSelectedRole: (value: string) => void;
  setSelectedStatus: (value: string) => void;
  setSelectedTag: (value: string) => void;
  clearSelectedTag: () => void;
}

export function DiscoverFilters({
  searchQuery,
  selectedRole,
  selectedStatus,
  selectedTag,
  topTags,
  allTags,
  setSearchQuery,
  setSelectedRole,
  setSelectedStatus,
  setSelectedTag,
  clearSelectedTag,
}: DiscoverFiltersProps) {
  const [tagSearch, setTagSearch] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedTagSearch = tagSearch.trim();

  const visibleTags = useMemo(() => {
    if (!trimmedTagSearch) return allTags;
    return allTags.filter((tag) => tag.toLowerCase().includes(trimmedTagSearch.toLowerCase()));
  }, [allTags, trimmedTagSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTagDropdownOpen(false);
        setTagSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setTagSearch("");
    setIsTagDropdownOpen(false);
  };

  return (
    <div className="bg-white border-4 border-neo-black p-6 shadow-[8px_8px_0_0_#000] space-y-6">
      <h3 className="font-heading font-black text-2xl uppercase tracking-tight flex items-center gap-2">
        <Filter className="w-6 h-6 text-neo-cyan" /> FILTRAR OPERADORES
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase text-neo-black/60 tracking-wider">
            Busca livre (nome, github, bio)
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-neo-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar operador..."
              className="w-full pl-12 pr-4 py-3 neo-border bg-neo-bg font-bold focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase text-neo-black/60 tracking-wider">
            Classe Principal
          </label>
          <select
            title="Selecionar classe"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3.5 neo-border bg-neo-bg font-black focus:bg-white transition-all outline-none text-xs"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role === "ALL" ? "TODAS AS CLASSES" : role.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase text-neo-black/60 tracking-wider">
            Disponibilidade
          </label>
          <select
            title="Selecionar disponibilidade"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3.5 neo-border bg-neo-bg font-black focus:bg-white transition-all outline-none text-xs"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-dashed border-neo-black flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-black uppercase text-neo-black/60 shrink-0">
          Filtrar por Skills:
        </span>

        {/* ── Top 3 Tags (Quick Filters) ── */}
        {topTags.map((tag) => {
          const isSelected = selectedTag === tag;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(isSelected ? "" : tag)}
              className={`px-3 py-1.5 text-[10px] font-heading font-black uppercase border-2 border-neo-black transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0_0_#000] active:shadow-none ${
                isSelected
                  ? "bg-neo-cyan text-neo-black"
                  : "bg-white text-neo-black hover:bg-neo-bg-alt"
              }`}
            >
              {tag}
            </button>
          );
        })}

        {/* ── Search Bar (Autocomplete) ── */}
        <div ref={dropdownRef} className="relative flex-1 min-w-[200px] max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neo-black/60" strokeWidth={3} />
            <input
              ref={inputRef}
              type="text"
              value={tagSearch}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setIsTagDropdownOpen(true);
              }}
              onFocus={() => setIsTagDropdownOpen(true)}
              placeholder="BUSCAR MAIS SKILLS..."
              className="w-full pl-9 pr-8 py-2 bg-neo-bg border-2 border-neo-black font-black text-[11px] uppercase tracking-widest focus:bg-white transition-all outline-none"
            />
            {tagSearch && (
              <button
                type="button"
                onClick={() => {
                  setTagSearch("");
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-2.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4 text-neo-black/60" strokeWidth={3} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {isTagDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.1 }}
                className="absolute z-50 left-0 right-0 top-full mt-1 border-4 border-neo-black bg-white shadow-[4px_4px_0_0_#000] max-h-48 overflow-y-auto"
              >
                {visibleTags.length > 0 ? (
                  visibleTags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleTagSelect(tag);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-black text-[11px] uppercase tracking-widest border-b-2 border-neo-black/10 last:border-0 transition-colors ${
                          isSelected ? "bg-neo-cyan text-neo-black" : "hover:bg-neo-cyan/20"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neo-black/40">
                      Nenhuma skill encontrada.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected tag indicator if it's not in the top 3 */}
        {selectedTag && !topTags.includes(selectedTag) && (
          <button
            type="button"
            onClick={clearSelectedTag}
            className="px-3 py-1.5 text-[10px] font-heading font-black uppercase bg-neo-cyan text-neo-black border-2 border-neo-black transition-all shadow-[2px_2px_0_0_#000] flex items-center gap-1"
          >
            {selectedTag} <X className="w-3 h-3" strokeWidth={3} />
          </button>
        )}

        {selectedTag && (
          <button
            type="button"
            onClick={clearSelectedTag}
            className="text-[9px] font-black text-neo-pink uppercase hover:underline shrink-0"
          >
            [Limpar Filtro]
          </button>
        )}
      </div>
    </div>
  );
}
