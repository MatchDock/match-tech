import { Inbox, MailOpen, Reply, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { SendMessageModal } from "../components/SendMessageModal";
import type { Message } from "../model/messages.types";

import { useAuth } from "@/contexts/useAuth";
import { messageRepository } from "@/infrastructure/firebase/messageRepository";

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = messageRepository.subscribeToInbox(
      user.uid,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching inbox: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageRepository.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark message as read: ", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja mesmo excluir esta mensagem de forma permanente?")) return;
    try {
      await messageRepository.deleteMessage(id);
      showNotification("Mensagem apagada com sucesso!");
    } catch (err) {
      console.error("Failed to delete message: ", err);
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const formatDate = (createdAt: unknown) => {
    if (!createdAt) return "Processando...";
    const isTimestamp =
      createdAt &&
      typeof createdAt === "object" &&
      "toDate" in createdAt &&
      typeof (createdAt as { toDate: unknown }).toDate === "function";

    const date = isTimestamp
      ? (createdAt as { toDate: () => Date }).toDate()
      : new Date(createdAt as string | number);

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-neo-lime text-neo-black border-4 border-neo-black py-3 px-6 shadow-[4px_4px_0_0_#000] font-black uppercase text-xs"
          >
            {actionSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-[4px] border-neo-black bg-white p-6 md:p-8 mb-8 shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neo-lime opacity-10 rotate-12 -mr-6 -mt-6"></div>
        <div>
          <h1 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none">
            Caixa de Entrada_
          </h1>
          <p className="font-mono text-xs text-neo-black/60 mt-2">
            MENSAGENS INTERNAS COM OUTROS OPERADORES
          </p>
        </div>
        <div className="bg-neo-black text-neo-lime font-mono text-xs px-3 py-1.5 border-2 border-neo-black font-bold flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
          <Inbox className="w-4 h-4" />
          <span>{messages.filter((m) => !m.read).length} NÃO LIDAS</span>
        </div>
      </div>

      {/* Inbox List */}
      {loading ? (
        <div className="border-[4px] border-neo-black bg-white p-12 text-center shadow-[8px_8px_0_0_#000]">
          <span className="font-mono text-sm animate-pulse">
            Sintonizando frequências do inbox...
          </span>
        </div>
      ) : messages.length === 0 ? (
        <div className="border-[4px] border-neo-black bg-white p-16 text-center shadow-[8px_8px_0_0_#000] flex flex-col items-center justify-center gap-4">
          <div className="bg-neo-bg p-4 border-2 border-neo-black rounded-none shadow-[3px_3px_0_0_#000] rotate-2">
            <MailOpen className="w-12 h-12 text-neo-black/40" />
          </div>
          <h3 className="font-heading font-black text-xl uppercase tracking-wider mt-2">
            Nenhuma mensagem por aqui
          </h3>
          <p className="font-bold text-xs text-neo-black/55 max-w-sm">
            Fique atento! Se algum operador der match ou quiser você na equipe deles, eles enviarão
            uma mensagem direta para cá.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              className={`border-[4px] border-neo-black p-5 md:p-6 bg-white shadow-[6px_6px_0_0_#000] relative flex flex-col gap-4 transition-all ${
                !message.read ? "shadow-[6px_6px_0_0_#B8FF29] border-neo-black bg-neo-lime/5" : ""
              }`}
            >
              {/* Header inside Card */}
              <div className="flex flex-wrap justify-between items-center gap-2 border-b-2 border-dashed border-neo-black/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 border border-neo-black ${
                      !message.read ? "bg-neo-lime" : "bg-gray-300"
                    }`}
                    title={!message.read ? "Não lida" : "Lida"}
                  />
                  <span className="font-heading font-black text-sm uppercase">
                    DE: {message.senderName}
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-neo-bg px-2 py-0.5 border border-neo-black text-neo-black/60">
                  {formatDate(message.createdAt)}
                </span>
              </div>

              {/* Message text */}
              <div className="font-mono text-xs md:text-sm font-medium leading-relaxed text-neo-black bg-neo-bg/30 border border-neo-black/10 p-4 whitespace-pre-wrap italic">
                &quot;{message.text}&quot;
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap justify-between items-center gap-4 pt-1">
                <div className="flex gap-2">
                  {!message.read && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="px-3 py-1.5 bg-neo-lime text-neo-black border-2 border-neo-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-y-[1px] active:shadow-none hover:bg-white transition-all cursor-pointer"
                    >
                      Lida ✓
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setReplyTarget({ id: message.senderId, name: message.senderName })
                    }
                    className="px-3 py-1.5 bg-neo-cyan text-neo-black border-2 border-neo-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-y-[1px] active:shadow-none hover:bg-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Responder
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(message.id)}
                  className="px-2.5 py-1.5 bg-neo-pink text-white border-2 border-neo-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-y-[1px] active:shadow-none hover:bg-white hover:text-neo-pink transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Send Message Modal (Reply) */}
      <AnimatePresence>
        {replyTarget && (
          <SendMessageModal
            receiverId={replyTarget.id}
            receiverName={replyTarget.name}
            onClose={() => setReplyTarget(null)}
            onSuccess={() => showNotification("Resposta enviada com sucesso!")}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
