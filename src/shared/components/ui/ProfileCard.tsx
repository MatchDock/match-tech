import { Github, Heart, Sparkles, UserRound } from "lucide-react";

import type { Profile } from "@/features/discover/model/discover.types";

interface ProfileCardProps {
  profile: Profile;
  colorIndex?: number;
  onClick: () => void;
}

const cardAccentStyles = [
  "shadow-[8px_8px_0_0_#000]",
  "shadow-[8px_8px_0_0_#B8FF29]",
  "shadow-[8px_8px_0_0_#00F0FF]",
  "shadow-[8px_8px_0_0_#FF2E93]",
  "shadow-[8px_8px_0_0_#FFD84D]",
];

const statusLabelMap: Record<string, string> = {
  looking: "BUSCANDO EQUIPE",
  open: "ABERTO A PROPOSTAS",
  complete: "EQUIPE FORMADA",
};

const statusStylesMap: Record<string, string> = {
  looking: "bg-neo-yellow text-neo-black",
  open: "bg-neo-cyan text-neo-black",
  complete: "bg-neo-lime text-neo-black",
};

function getCardAccentStyle(colorIndex = 0) {
  return cardAccentStyles[colorIndex % cardAccentStyles.length];
}

function getDisplayRoles(profile: Profile) {
  const roles = [profile.primaryRole, ...(profile.secondaryRoles ?? [])].filter(Boolean);

  return Array.from(new Set(roles)).slice(0, 3);
}

function getDisplayTags(profile: Profile) {
  const loves = profile.canvas?.loves ?? [];
  const comfort = profile.canvas?.comfort ?? [];

  return Array.from(new Set([...loves, ...comfort])).slice(0, 4);
}

export default function ProfileCard({ profile, colorIndex = 0, onClick }: ProfileCardProps) {
  const displayRoles = getDisplayRoles(profile);
  const displayTags = getDisplayTags(profile);
  const statusLabel = statusLabelMap[profile.status ?? ""] ?? "SEM STATUS";
  const statusStyle = statusStylesMap[profile.status ?? ""] ?? "bg-white text-neo-black";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left bg-white border-4 border-neo-black p-6",
        "transition-all duration-200 hover:-translate-y-1 active:translate-y-0",
        "focus:outline-none focus:ring-4 focus:ring-neo-cyan/40",
        getCardAccentStyle(colorIndex),
      ].join(" ")}
      aria-label={`Abrir perfil de ${profile.name ?? "operador"}`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 shrink-0 rounded-full border-[3px] border-neo-black bg-neo-bg flex items-center justify-center">
              <UserRound className="w-6 h-6 text-neo-black" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-heading uppercase tracking-tight text-neo-black truncate">
                {profile.name ?? "Operador sem nome"}
              </h3>

              {profile.github && (
                <div className="flex items-center gap-2 text-sm font-bold text-neo-black/70 truncate">
                  <Github className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">@{profile.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 px-3 py-2 border-2 border-neo-black text-[10px] font-black uppercase tracking-wider ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      {displayRoles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayRoles.map((role) => (
            <span
              key={role}
              className="px-2 py-1 bg-neo-black text-white text-[10px] font-black uppercase tracking-wider border-2 border-neo-black"
            >
              {role}
            </span>
          ))}
        </div>
      )}

      <p className="min-h-18 text-sm font-bold text-gray-700 leading-relaxed line-clamp-3">
        {profile.bio || "Sem bio cadastrada até o momento."}
      </p>

      {displayTags.length > 0 && (
        <div className="mt-5 pt-4 border-t-[3px] border-dashed border-neo-black">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-neo-pink" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-wider text-neo-black/70">
              Interesses e conforto
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-neo-bg text-neo-black text-[10px] font-black uppercase tracking-wide border-2 border-neo-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 pt-4 border-t-[3px] border-neo-black flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-neo-black/60">
          Clique para ver o veredito
        </span>

        <div className="flex items-center gap-2 text-neo-black">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs font-black uppercase">
            {profile.roastBrutal || profile.roastMild ? "Sina disponível" : "Gerar sina"}
          </span>
        </div>
      </div>
    </button>
  );
}
