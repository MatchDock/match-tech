import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";

import type { Conversation } from "../model/messages.types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
  loading: boolean;
}

function formatTime(ts: { toMillis: () => number } | null): string {
  if (!ts) return "";
  const date = new Date(ts.toMillis());
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  loading,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-neo-black/5 border-2 border-neo-black/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-4 text-center">
        <div className="bg-neo-bg p-4 border-4 border-neo-black shadow-[4px_4px_0_0_#000] rotate-2">
          <MessageSquare className="w-10 h-10 text-neo-black/30" />
        </div>
        <p className="font-heading font-black text-sm uppercase tracking-wider text-neo-black/40">
          Nenhuma conversa ainda
        </p>
        <p className="font-mono text-xs text-neo-black/30 max-w-[180px]">
          Vá para Descobrir e mande uma mensagem para alguém!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y-4 divide-neo-black overflow-y-auto">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        return (
          <motion.button
            key={conv.id}
            onClick={() => onSelect(conv)}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-4 flex items-start gap-3 transition-colors cursor-pointer ${
              isActive ? "bg-neo-lime" : "bg-white hover:bg-neo-bg"
            }`}
          >
            {/* Avatar Placeholder */}
            <div
              className={`w-10 h-10 shrink-0 border-[3px] border-neo-black font-heading font-black text-sm uppercase flex items-center justify-center shadow-[2px_2px_0_0_#000] ${
                isActive ? "bg-neo-black text-neo-lime" : "bg-neo-cyan text-neo-black"
              }`}
            >
              {conv.partnerName.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading font-black text-sm uppercase truncate leading-none">
                  {conv.partnerName}
                </span>
                <span className="font-mono text-[10px] text-neo-black/50 shrink-0">
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <p className="font-mono text-xs text-neo-black/60 truncate mt-1 leading-tight">
                {conv.lastMessage || "…"}
              </p>
            </div>

            {/* Unread badge */}
            {conv.unreadCount > 0 && (
              <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-black bg-neo-pink text-white border-2 border-neo-black shadow-[1.5px_1.5px_0_0_#000] self-center">
                {conv.unreadCount}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
