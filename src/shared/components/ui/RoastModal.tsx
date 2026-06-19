import { Terminal, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import type { RoastPersona } from "@/domain/entities/Shared";

interface RoastModalProps {
  targetName?: string;
  roastText?: string;
  roastBrutal?: string;
  roastMild?: string;
  activePersonaView: RoastPersona | null;
  isGenerating?: boolean;
  streamingText?: string;
  onClose: () => void;
  onGenerateBrutal: () => void;
  onGenerateMild: () => void;
  onDeleteRoast?: () => void;
}

export function RoastModal({
  targetName,
  roastText,
  roastBrutal,
  roastMild,
  activePersonaView,
  isGenerating = false,
  streamingText,
  onClose,
  onGenerateBrutal,
  onGenerateMild,
  onDeleteRoast,
}: RoastModalProps) {
  const isBrutalActive = activePersonaView === "brutal";
  const isMildActive = activePersonaView === "mild";

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-neo-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-24 pb-20 sm:p-8 sm:pt-28">
        <motion.div
          initial={{ scale: 0.9, y: 50, rotate: -2 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, y: 50, rotate: 2 }}
          className="relative max-w-3xl w-full mx-auto"
        >
          <div className="absolute -top-6 -right-4 sm:-right-6 z-10">
            <button
              onClick={onClose}
              className="bg-neo-pink text-white border-[4px] border-neo-black w-14 h-14 sm:w-16 sm:h-16 rounded-full font-black text-xl sm:text-2xl shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center"
            >
              X
            </button>
          </div>

          <div className="bg-white border-[6px] border-neo-black shadow-[12px_12px_0_0_#B8FF29] sm:shadow-[16px_16px_0_0_#B8FF29] flex flex-col">
            <div className="bg-neo-black p-6 sm:p-8 flex items-center gap-4 text-neo-lime relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#B8FF29_1px,transparent_1px)] [background-size:12px_12px]" />
              <Terminal className="w-10 h-10 sm:w-12 sm:h-12 relative z-10 shrink-0" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading uppercase m-0 leading-none truncate">
                  O Veredito_
                </h2>
                <p className="text-white font-mono mt-1 sm:mt-2 text-xs sm:text-sm truncate">
                  ALVO: {targetName}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10 md:p-12">
              <div className="text-base sm:text-lg md:text-xl font-bold font-sans whitespace-pre-wrap leading-relaxed text-neo-black bg-neo-bg p-6 sm:p-8 neo-border border-4 relative min-h-45">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-neo-pink rounded-full border-4 border-black shadow-[2px_2px_0_0_#000] hidden sm:block" />
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-neo-pink rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] sm:hidden" />
                {isGenerating ? (
                  <>
                    {streamingText || "Gerando veredito..."}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="inline-block ml-0.5"
                    >
                      |
                    </motion.span>
                  </>
                ) : (
                  roastText
                )}
              </div>

              <div className="mt-8 pt-6 border-t-4 border-black border-dashed flex flex-col md:flex-row gap-4">
                <button
                  className={`flex-1 py-4 px-3 border-[3px] border-black bg-neo-black hover:bg-white text-neo-pink hover:text-black text-xs md:text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${
                    isBrutalActive
                      ? "opacity-50 cursor-not-allowed border-dashed shadow-none"
                      : "shadow-[4px_4px_0_0_#000] hover:shadow-none -translate-y-0.5 hover:translate-y-0 active:translate-y-1"
                  }`}
                  disabled={isBrutalActive || isGenerating}
                  onClick={onGenerateBrutal}
                >
                  {roastBrutal ? "VER TECH LEAD (BRUTAL)" : "GERAR TECH LEAD (BRUTAL)"}
                </button>

                <button
                  className={`flex-1 py-4 px-3 border-[3px] border-black bg-neo-black hover:bg-white text-neo-cyan hover:text-black text-xs md:text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${
                    isMildActive
                      ? "opacity-50 cursor-not-allowed border-dashed shadow-none"
                      : "shadow-[4px_4px_0_0_#000] hover:shadow-none -translate-y-0.5 hover:translate-y-0 active:translate-y-1"
                  }`}
                  disabled={isMildActive || isGenerating}
                  onClick={onGenerateMild}
                >
                  {roastMild ? "VER MENTOR (SUAVE)" : "GERAR MENTOR (SUAVE)"}
                </button>

                {onDeleteRoast && roastText && (
                  <button
                    className="py-4 px-5 border-[3px] border-black bg-neo-pink hover:bg-white text-white hover:text-neo-pink font-black transition-all cursor-pointer shadow-[4px_4px_0_0_#000] hover:shadow-none -translate-y-0.5 hover:translate-y-0 active:translate-y-1 flex items-center justify-center shrink-0"
                    disabled={isGenerating}
                    onClick={onDeleteRoast}
                    title="Apagar este veredito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-neo-black text-white p-4 sm:p-6 font-heading tracking-widest text-[10px] sm:text-xs flex flex-wrap justify-between items-center gap-2 border-t-[6px] border-neo-black">
              <span>[SISTEMA ROASTED &amp; TOASTED] &copy; 2026</span>
              <span className="bg-neo-pink px-2 py-1 border-2 border-white">
                STRICTLY CONFIDENTIAL
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
