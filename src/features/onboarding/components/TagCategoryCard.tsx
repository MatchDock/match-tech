import { Heart, Check, Ban, Search, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";

import type { OnboardingForm, TagSentiment } from "../types";

import { Card } from "@/shared/components/ui/Card";

interface TagCategory {
  key: string;
  name: string;
  color: string;
  textColor: string;
  tags: string[];
}

interface Props {
  category: TagCategory;
  extraTags?: string[]; // tags criadas pelo usuário nesta categoria
  form: OnboardingForm;
  onSetSentiment: (tag: string, sentiment: TagSentiment) => void;
  onCreateSkill: (name: string, categoryKey: string) => Promise<void>;
}

export function TagCategoryCard({
  category,
  extraTags = [],
  form,
  onSetSentiment,
  onCreateSkill,
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // All tags: fixed + user-created, deduplicated and sorted alphabetically
  const allTags = useMemo(() => {
    const merged = [
      ...category.tags,
      ...extraTags.filter((t) => !category.tags.some((ct) => ct.toLowerCase() === t.toLowerCase())),
    ];
    return merged.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  }, [category.tags, extraTags]);

  const trimmed = search.trim();

  // Tags visible in the list — filtered when there's a search term
  const visibleTags = useMemo(() => {
    if (!trimmed) return allTags;
    return allTags.filter((tag) => tag.toLowerCase().includes(trimmed.toLowerCase()));
  }, [allTags, trimmed]);

  const hasResults = visibleTags.length > 0;
  const showNoResults = open && trimmed.length > 0 && !hasResults;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = useCallback(async () => {
    if (!trimmed || creating) return;
    setCreating(true);
    try {
      await onCreateSkill(trimmed, category.key);
      setSearch("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }, [trimmed, creating, onCreateSkill, category.key]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showNoResults) handleCreate();
    }
  };

  return (
    <Card
      variant="white"
      padding="none"
      className="border-4 shadow-[10px_10px_0_0_#000] overflow-hidden flex flex-col group hover:shadow-[14px_14px_0_0_#000] transition-all"
    >
      {/* ── Category header ── */}
      <div className="bg-neo-black p-3 flex justify-between items-center group-hover:bg-neo-black/90 transition-colors">
        <h3
          className={`font-heading text-xl ${category.textColor} uppercase italic tracking-tighter`}
        >
          {category.name}
        </h3>
        <div className={`w-3 h-3 rounded-full ${category.color} animate-pulse`} />
      </div>

      {/* ── Inline search ── */}
      <div ref={containerRef} className="relative border-b-4 border-neo-black">
        <div
          className={`flex items-center bg-neo-bg transition-all
            ${open ? "shadow-inner" : ""}`}
        >
          <Search className="w-4 h-4 ml-3 text-neo-black/30 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            placeholder="BUSCAR OU ADICIONAR..."
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2.5 font-black text-[11px] uppercase tracking-widest bg-transparent outline-none text-neo-black placeholder:text-neo-black/20"
          />
          {search && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setSearch("");
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="mr-2 p-0.5 hover:bg-neo-pink/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-neo-black/40" />
            </button>
          )}
        </div>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {open && trimmed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute z-50 left-0 right-0 top-full border-4 border-t-0 border-neo-black bg-white shadow-[6px_6px_0_0_#000] max-h-48 overflow-y-auto"
            >
              {hasResults
                ? visibleTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // Scroll to or highlight the tag — just close and clear search
                        // so the user sees it in the list below
                        setSearch("");
                        setOpen(false);
                        inputRef.current?.focus();
                      }}
                      className="w-full text-left px-4 py-2.5 font-black text-[11px] uppercase tracking-widest hover:bg-neo-cyan/20 border-b-2 border-neo-black/10 last:border-0 transition-colors"
                    >
                      {tag}
                    </button>
                  ))
                : null}

              {showNoResults && (
                <div className="p-3 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neo-black/40">
                    Nenhuma skill encontrada.
                  </p>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                    disabled={creating}
                    className="flex items-center gap-2 bg-neo-black text-white px-3 py-2 border-2 border-neo-black font-black text-[11px] uppercase tracking-widest hover:bg-neo-black/80 disabled:opacity-50 transition-colors w-full"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    {creating ? "ADICIONANDO..." : `Adicionar "${trimmed}"`}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tag rows (alphabetical, filtered when searching) ── */}
      <div className="p-4 flex flex-col gap-2 bg-neo-bg/30">
        <AnimatePresence initial={false}>
          {(trimmed ? visibleTags : allTags).map((tag) => {
            const isLoves = form.loves.includes(tag);
            const isComfort = form.comfort.includes(tag);
            const isVeto = form.veto.includes(tag);
            const isNew = extraTags.some((t) => t.toLowerCase() === tag.toLowerCase());

            return (
              <motion.div
                key={tag}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center neo-border bg-white overflow-hidden h-12 group/row hover:border-neo-black transition-all hover:bg-white/80">
                  <span className="flex-1 px-4 font-black text-xs uppercase truncate text-neo-black/80 flex items-center gap-2">
                    {tag}
                    {/* Badge for user-created skills */}
                    {isNew && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-neo-cyan/20 text-neo-black/60 px-1.5 py-0.5 border border-neo-black/20">
                        NOVA
                      </span>
                    )}
                  </span>

                  <div className="flex h-full border-l-4 border-neo-black bg-neo-bg">
                    {/* Loves */}
                    <button
                      type="button"
                      title="Amo"
                      onClick={() => onSetSentiment(tag, isLoves ? null : "loves")}
                      className={`w-12 h-full flex items-center justify-center border-r-2 border-black transition-all group/btn
                        ${isLoves ? "bg-neo-pink text-white" : "bg-white hover:bg-neo-pink/20"}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.4, rotate: [0, 15, -15, 0] }}
                        animate={isLoves ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
                        transition={{ repeat: isLoves ? 1 : 0 }}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLoves ? "fill-current" : "text-neo-black/20 group-hover/btn:text-neo-pink"}`}
                        />
                      </motion.div>
                    </button>

                    {/* Comfort */}
                    <button
                      type="button"
                      title="Conforto"
                      onClick={() => onSetSentiment(tag, isComfort ? null : "comfort")}
                      className={`w-12 h-full flex items-center justify-center border-r-2 border-black transition-all group/btn
                        ${isComfort ? "bg-neo-lime text-black" : "bg-white hover:bg-neo-lime/20"}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.4, rotate: 360 }}
                        animate={isComfort ? { rotate: [0, 360], scale: [1, 1.4, 1] } : {}}
                      >
                        <Check
                          className={`w-5 h-5 ${isComfort ? "text-black" : "text-neo-black/20 group-hover/btn:text-neo-lime"}`}
                        />
                      </motion.div>
                    </button>

                    {/* Veto */}
                    <button
                      type="button"
                      title="Veto"
                      onClick={() => onSetSentiment(tag, isVeto ? null : "veto")}
                      className={`w-12 h-full flex items-center justify-center transition-all group/btn
                        ${isVeto ? "bg-neo-black text-neo-pink shadow-inner" : "bg-white hover:bg-neo-pink/10"}`}
                    >
                      <motion.div
                        whileHover={{ x: [-2, 2, -2, 2, 0], scale: 1.1 }}
                        animate={isVeto ? { x: [-1, 1, -1, 1, 0] } : {}}
                      >
                        <Ban
                          className={`w-5 h-5 ${isVeto ? "text-neo-pink" : "text-neo-black/20 group-hover/btn:text-neo-pink"}`}
                        />
                      </motion.div>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
