import { AlertTriangle, X as XIcon } from "lucide-react";
import { motion } from "motion/react";

import type { ToastState } from "../model/discover.types";

interface DiscoverToastProps {
  toast: ToastState;
  onClose: () => void;
}

export function DiscoverToast({ toast, onClose }: DiscoverToastProps) {
  return (
    <motion.div
      key="toast"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="fixed top-24 right-4 z-9999 max-w-sm w-full flex items-start gap-3 bg-neo-pink text-white border-[3px] border-neo-black shadow-[6px_6px_0_0_#000] p-4"
    >
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="font-bold text-sm flex-1 leading-snug">{toast.message}</p>
      <button
        title="Fechar notificação"
        type="button"
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
