import { Filter, Search } from "lucide-react";

import { ROLE_OPTIONS, STATUS_OPTIONS } from "../constants/discover.constants";

interface DiscoverFiltersProps {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
  selectedTag: string;
  popularTags: string[];
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
  popularTags,
  setSearchQuery,
  setSelectedRole,
  setSelectedStatus,
  setSelectedTag,
  clearSelectedTag,
}: DiscoverFiltersProps) {
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

      {popularTags.length > 0 && (
        <div className="pt-4 border-t-2 border-dashed border-neo-black flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase text-neo-black/60">
            Filtrar por Paixão:
          </span>

          {popularTags.map((tag) => {
            const isSelected = selectedTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? "" : tag)}
                className={`px-3 py-1 text-[10px] font-heading font-black uppercase border-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0_0_#000] active:shadow-none ${
                  isSelected
                    ? "bg-neo-cyan text-neo-black"
                    : "bg-white text-neo-black hover:bg-neo-bg-alt"
                }`}
              >
                {tag}
              </button>
            );
          })}

          {selectedTag && (
            <button
              type="button"
              onClick={clearSelectedTag}
              className="text-[9px] font-black text-neo-pink uppercase hover:underline"
            >
              [Limpar Tag]
            </button>
          )}
        </div>
      )}
    </div>
  );
}
