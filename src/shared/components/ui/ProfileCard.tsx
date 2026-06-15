import { Github, Linkedin } from "lucide-react";

import Avatar from "./Avatar";
import { Card } from "./Card";
import SkillRadar from "./SkillRadar";
import StatusBadge from "./StatusBadge";
import TagBadge from "./TagBadge";

import type { Profile } from "@/features/discover/model/discover.types";
import { cn } from "@/shared/lib/utils/cn";

interface ProfileCardProps {
  profile: Profile;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
  colorIndex?: number;
}

export default function ProfileCard({
  profile,
  onClick,
  compact = false,
  className,
  colorIndex = 0,
}: ProfileCardProps) {
  const {
    name,
    github,
    linkedin,
    bio,
    primaryRole,
    secondaryRoles = [],
    skills,
    canvas = { loves: [], comfort: [], veto: [] },
    status = "looking",
  } = profile;

  // Neo-Brutalist color configurations for variety
  const bgColors = ["bg-neo-lime", "bg-neo-pink", "bg-neo-cyan", "bg-neo-yellow"];
  const headerBg = bgColors[colorIndex % bgColors.length];

  // Decide text colors based on background
  const headerText = headerBg === "bg-neo-pink" ? "text-white" : "text-neo-black";

  const getGithubUrl = (val?: string) => {
    if (!val) return "";
    const clean = val
      .trim()
      .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, "")
      .replace(/\/$/, "")
      .replace(/^@/, "");
    return `https://github.com/${clean}`;
  };

  const getLinkedinUrl = (val?: string) => {
    if (!val) return "";
    const clean = val
      .trim()
      .replace(/^(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com\/(?:in|profile)\//i, "")
      .replace(/\/$/, "")
      .replace(/^@/, "");
    return `https://linkedin.com/in/${clean}`;
  };

  const vetos = canvas.veto ?? canvas.vetoes ?? [];

  if (compact) {
    return (
      <Card
        variant="white"
        padding="none"
        onClick={onClick}
        className={cn(
          "flex flex-col border-4 neo-shadow-hover h-full cursor-pointer group",
          className,
        )}
      >
        {/* Compact Header */}
        <div
          className={cn(
            "p-4 border-b-4 border-neo-black font-heading font-black text-sm uppercase truncate",
            headerBg,
            headerText,
          )}
        >
          {primaryRole || "OPERADOR"}
        </div>

        {/* Compact Body */}
        <div className="p-4 flex items-center gap-4 flex-1">
          <Avatar
            user={{ photoURL: profile.photoURL, github, name }}
            size="sm"
            className="group-hover:scale-105 transition-transform"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-black text-lg uppercase truncate leading-none mb-1">
              {name || "NOME_NULO"}
            </h4>
            <div className="flex gap-2">
              <StatusBadge
                status={status}
                className="shadow-none text-[8px] py-0.5 px-1.5 border-[1.5px]"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="white"
      padding="none"
      onClick={onClick}
      className={cn(
        "flex flex-col border-4 neo-shadow-hover h-full cursor-pointer group select-none relative",
        className,
      )}
    >
      {/* Bento Header */}
      <div
        className={cn(
          "p-4 md:p-5 border-b-4 border-neo-black flex flex-wrap justify-between items-center gap-2",
          headerBg,
          headerText,
        )}
      >
        <span className="font-heading font-black text-xl md:text-2xl uppercase tracking-widest leading-none truncate max-w-[70%]">
          {primaryRole || "OPERADOR"}
        </span>
        <span className="font-mono text-xs uppercase bg-neo-black text-white px-2 py-0.5 font-bold">
          ID_{profile.id?.slice(0, 5) || profile.userId?.slice(0, 5) || "NULO"}
        </span>
      </div>

      {/* Bento Identity Section */}
      <div className="p-5 flex gap-4 items-center bg-neo-bg/20 border-b-4 border-neo-black relative overflow-hidden">
        {/* Floating background shape */}
        <div className={cn("absolute -top-6 -right-6 w-16 h-16 opacity-10 rotate-12", headerBg)} />

        <Avatar
          user={{ photoURL: profile.photoURL, github, name }}
          size="md"
          className="group-hover:rotate-[-2deg] transition-transform z-10 shrink-0"
        />

        <div className="flex-1 min-w-0 z-10">
          <h3 className="font-heading font-black text-xl md:text-2xl uppercase truncate leading-none mb-1 bg-white px-2 py-1 border-2 border-neo-black shadow-[3px_3px_0_0_#000] rotate-[-0.5deg]">
            {name || "NOME_NULO"}
          </h3>

          <div className="flex gap-3 items-center mt-2.5">
            {github && (
              <a
                href={getGithubUrl(github)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-neo-black hover:text-neo-lime transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {linkedin && (
              <a
                href={getLinkedinUrl(linkedin)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-neo-black hover:text-neo-pink transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {secondaryRoles.slice(0, 1).map((role) => (
              <span
                key={role}
                className="text-[8px] font-mono border-2 border-neo-black px-1.5 py-0.5 bg-white uppercase truncate font-bold"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Bio */}
      {bio && (
        <div className="p-4 border-b-4 border-neo-black bg-white font-sans text-xs font-bold leading-normal text-neo-black/75 line-clamp-2 italic">
          &quot;{bio}&quot;
        </div>
      )}

      {/* Bento Skills Chart */}
      {skills && (
        <div className="border-b-4 border-neo-black bg-neo-bg">
          <SkillRadar skills={skills} size="sm" />
        </div>
      )}

      {/* Bento Tags Section */}
      <div className="p-4 flex-1 bg-white flex flex-col gap-3.5">
        {canvas.loves && canvas.loves.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-neo-black bg-neo-lime border-2 border-neo-black px-1.5 py-0.5 shadow-[1.5px_1.5px_0_0_#000] -rotate-1 inline-block">
              PAIXÕES
            </span>
            <div className="flex flex-wrap gap-1">
              {canvas.loves.slice(0, 3).map((love) => (
                <TagBadge
                  key={love}
                  tag={love}
                  sentiment="love"
                  className="text-[8px] px-1.5 py-0.5"
                />
              ))}
            </div>
          </div>
        )}

        {vetos.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-neo-pink border-2 border-neo-black px-1.5 py-0.5 shadow-[1.5px_1.5px_0_0_#000] rotate-1 inline-block">
              VETOS
            </span>
            <div className="flex flex-wrap gap-1">
              {vetos.slice(0, 3).map((v) => (
                <TagBadge key={v} tag={v} sentiment="veto" className="text-[8px] px-1.5 py-0.5" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bento Status Bar */}
      <div className="p-4 border-t-4 border-neo-black bg-neo-bg/50 flex justify-between items-center">
        <StatusBadge
          status={status}
          className="shadow-none border-2 text-[9px] py-1 px-2.5 bg-white"
        />
        <span className="font-heading font-black text-xs text-neo-black group-hover:translate-x-1 transition-transform">
          VER SINA →
        </span>
      </div>
    </Card>
  );
}
