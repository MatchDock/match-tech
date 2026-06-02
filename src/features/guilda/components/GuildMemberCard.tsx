import { motion } from "motion/react";
import { Github, Linkedin, Skull } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { getCardPalette, getRadarData } from "../model/guilda.selectors";
import { GuildAvatar } from "./GuildAvatar";
import { getGithubUrl, getLinkedinUrl } from "../utils/guilda.formatters";
import type { GuildMember, RoastStep } from "../model/guilda.types";
import type { User } from "firebase/auth";

interface GuildMemberCardProps {
  member: GuildMember;
  colorIndex: number;
  user: User;
  roastActiveMember: string | null;
  roastStep: RoastStep;
  roastLogs: string[];
  onOpenRoastSelection: (memberId: string) => void;
  onExecuteRoast: (member: GuildMember, persona: "brutal" | "mild") => void;
}

export function GuildMemberCard({
  member,
  colorIndex,
  user,
  roastActiveMember,
  roastStep,
  roastLogs,
  onOpenRoastSelection,
  onExecuteRoast,
}: GuildMemberCardProps) {
  const colors = getCardPalette(colorIndex);

  return (
    <div className="flex flex-col bg-white neo-border border-4 shadow-[8px_8px_0_0_#000] overflow-hidden group">
      <div
        className={`p-4 md:p-6 border-b-4 border-neo-black ${colors.bg} ${colors.text} flex flex-wrap justify-between items-center gap-4`}
      >
        <div className="flex items-center gap-3">
          <span className="font-heading font-black text-2xl md:text-3xl uppercase tracking-widest">
            {member.primaryRole || "OPERADOR"}
          </span>
          {member.secondaryRoles && member.secondaryRoles.length > 0 && (
            <div className="hidden sm:flex gap-2">
              {member.secondaryRoles.map((role) => (
                <span key={role} className="text-[10px] font-black border-2 border-current px-2 py-1 uppercase">
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="font-mono text-sm uppercase bg-black text-white px-3 py-1 font-bold">ID_{member.id.slice(0, 5)}</span>
      </div>

      <div className="flex flex-col sm:flex-row flex-1 p-0">
        <div className="w-full sm:w-1/3 p-6 border-b-4 sm:border-b-0 sm:border-r-4 border-neo-black bg-neo-bg flex flex-col items-center justify-center relative">
          <div className={`absolute top-4 left-4 w-4 h-4 ${colors.accent} border-2 border-black rotate-12`}></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-black rounded-full"></div>

          <div className="w-32 h-32 md:w-40 md:h-40 rounded-none border-[5px] border-black bg-white overflow-hidden shadow-[6px_6px_0_0_#000] rotate-[-2deg] transition-transform group-hover:rotate-0 group-hover:scale-105 duration-300 z-10">
            <GuildAvatar member={member} currentUser={user} getGithubUrl={getGithubUrl} />
          </div>

          <h2 className="text-xl md:text-2xl font-black font-heading uppercase text-center mt-6 break-words leading-none bg-white px-3 py-2 neo-border -rotate-1 relative z-20 shadow-[4px_4px_0_0_#000]">
            {member.name || "NOME_NULO"}
          </h2>

          <div className="flex gap-3 mt-6 w-full justify-center">
            {member.github && (
              <a
                href={getGithubUrl(member.github)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex gap-2 items-center justify-center text-xs font-black bg-white border-2 border-neo-black hover:bg-neo-lime py-2 uppercase shadow-[3px_3px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              >
                <Github className="w-4 h-4" /> HUB
              </a>
            )}
            {member.linkedin && (
              <a
                href={getLinkedinUrl(member.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex gap-2 items-center justify-center text-xs font-black bg-[#0077b5] border-2 border-neo-black text-white hover:bg-white hover:text-[#0077b5] py-2 uppercase shadow-[3px_3px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              >
                <Linkedin className="w-4 h-4" /> IN
              </a>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col pt-6 sm:pt-0">
          <div
            className="p-4 border-b-4 border-neo-black bg-neo-bg relative overflow-hidden group/chart cursor-crosshair flex items-center justify-center"
            style={{ height: "256px", minHeight: "256px" }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" width={256} height={256} data={getRadarData(member.skills)}>
              <PolarGrid stroke="#000" strokeWidth={1} strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#000", fontSize: 10, fontWeight: "900", textAnchor: "middle" }} />
              <Radar name="Skill" dataKey="A" stroke="#FF2E93" strokeWidth={4} fill="#FF2E93" fillOpacity={0.4} />
            </RadarChart>
          </div>

          <div className="p-4 flex-1 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase text-neo-black bg-neo-lime border-2 border-black px-1.5 py-0.5 w-fit shadow-[2px_2px_0_0_#000] -rotate-2">
                PAIXÕES (LOVES)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.canvas?.loves && member.canvas.loves.length > 0 ? (
                  member.canvas.loves.map((item) => (
                    <span key={item} className="text-[9px] font-bold bg-white border border-black px-1.5 py-0.5 shadow-[1px_1px_0_0_#EDEDED]">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-gray-400">Mistério.</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase text-neo-black bg-neo-cyan border-2 border-black px-1.5 py-0.5 w-fit shadow-[2px_2px_0_0_#000]">
                OPERO BEM
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.canvas?.comfort && member.canvas.comfort.length > 0 ? (
                  member.canvas.comfort.map((item) => (
                    <span key={item} className="text-[9px] font-bold bg-white border border-neo-cyan px-1.5 py-0.5 shadow-[1px_1px_0_0_#00E5FF]">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] italic text-gray-400">Neutro.</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase text-white bg-neo-pink border-2 border-black px-1.5 py-0.5 w-fit shadow-[2px_2px_0_0_#000] rotate-2">
                NEM F*DENDO
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.canvas?.veto && member.canvas.veto.length > 0 ? (
                  member.canvas.veto.map((item) => (
                    <span key={item} className="text-[9px] font-bold bg-neo-bg border border-black px-1.5 py-0.5">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] italic text-gray-400">Faz qualquer jogo.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {user.uid === member.id && (
        <div className="bg-neo-black p-4 z-10 w-full relative min-h-[96px] flex flex-col justify-center">
          {roastActiveMember !== member.id ? (
            <button
              className="w-full py-4 px-6 border-4 border-transparent hover:border-neo-lime text-white font-heading font-black text-xl uppercase tracking-widest transition-all hover:bg-neo-lime hover:text-neo-black active:translate-y-1"
              onClick={() => onOpenRoastSelection(member.id)}
            >
              <span className="flex items-center justify-center gap-3">
                <Skull className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {member.roastBrutal || member.roastMild || member.roast ? "VER SINA REGISTRADA" : "LER MINHA SINA"}
              </span>
            </button>
          ) : roastStep === "selecting" ? (
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 py-3 px-2 border-2 border-neo-pink bg-neo-black hover:bg-neo-pink text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_0_#FF2E93] hover:shadow-none translate-y-[-2px] hover:translate-y-0 active:translate-y-1 transition-all"
                onClick={() => onExecuteRoast(member, "brutal")}
              >
                TECH LEAD BRUTAL (SARCÁSTICO)
              </button>
              <button
                className="flex-1 py-3 px-2 border-2 border-neo-cyan bg-neo-black hover:bg-neo-cyan text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_0_#00E5FF] hover:shadow-none translate-y-[-2px] hover:translate-y-0 active:translate-y-1 transition-all"
                onClick={() => onExecuteRoast(member, "mild")}
              >
                MENTOR BONZINHO (SUAVE)
              </button>
            </div>
          ) : (
            <div className="w-full font-mono text-[10px] sm:text-xs text-neo-lime h-full flex flex-col justify-center gap-1 overflow-hidden opacity-80">
              {roastLogs.map((log, index) => (
                <motion.span key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  {">"} {log}
                </motion.span>
              ))}
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <span className="inline-block w-2 h-3 bg-neo-lime ml-1"></span>
              </motion.span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
