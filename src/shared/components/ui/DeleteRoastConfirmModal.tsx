import { Trash2 } from "lucide-react";
import { motion } from "motion/react";

import type { RoastPersona } from "@/domain/entities/Shared";

interface DeleteRoastConfirmModalProps {
  persona: RoastPersona;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteRoastConfirmModal({
  persona,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteRoastConfirmModalProps) {
  const personaLabel = persona === "brutal" ? "TECH LEAD (BRUTAL)" : "MENTOR (SUAVE)";

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-neo-black/95 backdrop-blur-md"
        onClick={onCancel}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-24 pb-20 sm:p-8 sm:pt-28">
        <motion.div
          initial={{ scale: 0.9, y: 50, rotate: -1 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, y: 50, rotate: 1 }}
          className="relative max-w-md w-full mx-auto"
        >
          <div className="absolute -top-6 -right-4 z-10">
            <button
              onClick={onCancel}
              className="bg-neo-pink text-white border-[4px] border-neo-black w-12 h-12 rounded-full font-black text-lg shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center cursor-pointer"
            >
              X
            </button>
          </div>

          <div className="bg-white border-[6px] border-neo-black shadow-[12px_12px_0_0_#FF2D78] flex flex-col">
            <div className="bg-neo-black p-6 flex items-center gap-4 text-neo-pink relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FF2D78_1px,transparent_1px)] [background-size:12px_12px]" />
              <Trash2 className="w-8 h-8 relative z-10 shrink-0" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-heading uppercase m-0 leading-none">
                  APAGAR VEREDITO_
                </h2>
                <p className="text-white font-mono mt-1 text-xs">ALVO: {personaLabel}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="bg-neo-pink/10 border-4 border-neo-pink p-4">
                <p className="font-black text-sm text-neo-black uppercase tracking-wide">
                  ⚠ ESTA AÇÃO É IRREVERSÍVEL
                </p>
                <p className="font-mono text-xs text-neo-black/80 mt-2">
                  O veredito <span className="font-black">{personaLabel}</span> será apagado
                  permanentemente do banco de dados.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="flex-1 py-3 border-[3px] border-black bg-white hover:bg-neo-bg text-neo-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 border-[3px] border-black bg-neo-pink hover:bg-white text-white hover:text-neo-pink text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "APAGANDO..." : "APAGAR 🗑"}
                </button>
              </div>
            </div>

            <div className="bg-neo-black text-white p-4 font-heading tracking-widest text-[10px] flex justify-between items-center border-t-[4px] border-neo-black">
              <span>[SISTEMA ROASTED &amp; TOASTED] &copy; 2026</span>
              <span className="bg-neo-pink px-2 py-0.5 border-2 border-white font-bold">
                PERIGO
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
