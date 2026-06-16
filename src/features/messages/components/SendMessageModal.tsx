import { Send, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { messageRepository } from "@/infrastructure/firebase/messageRepository";

interface SendMessageModalProps {
  receiverId: string;
  receiverName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendMessageModal({
  receiverId,
  receiverName,
  onClose,
  onSuccess,
}: SendMessageModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar autenticado para enviar mensagens.");
      return;
    }
    if (!text.trim()) {
      setError("Digite sua mensagem antes de enviar.");
      return;
    }
    if (text.length > 2000) {
      setError("Mensagem muito longa! Limite de 2000 caracteres.");
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const senderName = user.displayName || "Operador Anônimo";

      await messageRepository.sendMessage({
        senderId: user.uid,
        senderName: senderName,
        receiverId,
        receiverName,
        text: text.trim(),
      });

      setText("");
      if (onSuccess) onSuccess();
      onClose();
      // Redirect to the conversation thread so the user can see the full history
      navigate(`/messages?with=${receiverId}`);
    } catch (err) {
      setError("Erro ao enviar mensagem. Tente novamente.");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-neo-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-24 pb-20 sm:p-8 sm:pt-28">
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 50, rotate: -1 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, y: 50, rotate: 1 }}
          className="relative max-w-lg w-full mx-auto"
        >
          {/* Close button */}
          <div className="absolute -top-6 -right-4 z-10">
            <button
              onClick={onClose}
              className="bg-neo-pink text-white border-[4px] border-neo-black w-12 h-12 rounded-full font-black text-lg shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center cursor-pointer"
            >
              X
            </button>
          </div>

          <div className="bg-white border-[6px] border-neo-black shadow-[12px_12px_0_0_#00E5FF] flex flex-col">
            {/* Header */}
            <div className="bg-neo-black p-6 flex items-center gap-4 text-neo-cyan relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:12px_12px]" />
              <Send className="w-8 h-8 relative z-10 shrink-0" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-heading uppercase m-0 leading-none">
                  Enviar Mensagem_
                </h2>
                <p className="text-white font-mono mt-1 text-xs truncate">
                  DESTINATÁRIO: {receiverName}
                </p>
              </div>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSend} className="p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-neo-yellow/20 border-2 border-neo-black p-3 text-xs font-bold leading-normal text-neo-black/90">
                <AlertTriangle className="w-5 h-5 text-neo-yellow shrink-0" />
                <span>
                  Sua mensagem será enviada diretamente para a caixa de entrada interna deste
                  operador.
                </span>
              </div>

              {error && (
                <div className="bg-neo-pink/20 border-2 border-neo-pink p-3 text-xs font-black text-neo-pink">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-neo-black/50">
                  Mensagem
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva sua mensagem... (ex: achei seu perfil incrível para a nossa equipe, vamos conversar?)"
                  className="w-full h-32 p-3 font-mono text-xs border-4 border-neo-black shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-y-1 focus:translate-x-1 outline-none resize-none transition-all placeholder:text-gray-400"
                  maxLength={2000}
                  disabled={isSending}
                  required
                />
                <span className="text-[9px] text-right font-mono text-neo-black/45">
                  {text.length}/2000 caracteres
                </span>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border-[3px] border-black bg-white hover:bg-neo-bg text-neo-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none"
                  disabled={isSending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 border-[3px] border-black bg-neo-cyan text-neo-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0_0_#000] hover:bg-white active:translate-y-1 active:shadow-none"
                  disabled={isSending}
                >
                  {isSending ? "Enviando..." : "ENVIAR MENSAGEM ⚡"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-neo-black text-white p-4 font-heading tracking-widest text-[10px] flex justify-between items-center border-t-[4px] border-neo-black">
              <span>[SISTEMA DE COMUNICAÇÃO] &copy; 2026</span>
              <span className="bg-neo-cyan text-neo-black px-2 py-0.5 border-2 border-white font-bold">
                MATCH_TECH
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
