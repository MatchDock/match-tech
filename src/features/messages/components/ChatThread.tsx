import { Send, Trash2, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { Conversation, Message } from "../model/messages.types";

interface ChatThreadProps {
  conversation: Conversation;
  currentUserId: string;
  _currentUserName?: string;
  onSend: (text: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  onBack?: () => void;
}

function formatMessageTime(ts: { toMillis: () => number } | null): string {
  if (!ts) return "…";
  const date = new Date(ts.toMillis());
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(ts: { toMillis: () => number } | null): string {
  if (!ts) return "";
  const date = new Date(ts.toMillis());
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) return "HOJE";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return "ONTEM";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function groupMessagesByDay(messages: Message[]): Array<{ date: string; messages: Message[] }> {
  const groups: Array<{ date: string; messages: Message[] }> = [];
  for (const msg of messages) {
    const label = formatDateSeparator(msg.createdAt);
    const last = groups[groups.length - 1];
    if (!last || last.date !== label) {
      groups.push({ date: label, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  }
  return groups;
}

export function ChatThread({
  conversation,
  currentUserId,
  onSend,
  onDelete,
  onBack,
}: ChatThreadProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setText("");
      textareaRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const groups = groupMessagesByDay(conversation.messages);

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="border-b-4 border-neo-black bg-neo-black text-neo-lime px-4 py-3 flex items-center gap-3 shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 bg-neo-lime text-neo-black border-2 border-neo-lime hover:border-white transition-colors"
            aria-label="Voltar para lista"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="w-9 h-9 shrink-0 border-[3px] border-neo-lime bg-neo-cyan text-neo-black font-heading font-black text-sm uppercase flex items-center justify-center">
          {conversation.partnerName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-black text-base uppercase leading-none truncate">
            {conversation.partnerName}
          </p>
          <p className="font-mono text-[10px] text-neo-lime/60 mt-0.5">
            {conversation.messages.length} mensagem{conversation.messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 bg-neo-bg/30">
        {conversation.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-mono text-xs text-neo-black/30 text-center">
              Nenhuma mensagem ainda.
              <br />
              Mande a primeira mensagem!
            </p>
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <div key={group.date} className="flex flex-col gap-1">
                {/* Date Separator */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-neo-black/20" />
                  <span className="font-mono text-[9px] font-bold text-neo-black/40 bg-neo-bg px-2 py-0.5 border border-neo-black/20">
                    {group.date}
                  </span>
                  <div className="flex-1 h-px bg-neo-black/20" />
                </div>

                {group.messages.map((msg) => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <AnimatePresence key={msg.id} mode="popLayout">
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
                      >
                        <div
                          className={`flex flex-col max-w-[75%] ${isMine ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`relative px-3 py-2 border-[3px] border-neo-black shadow-[3px_3px_0_0_#000] ${
                              isMine ? "bg-neo-lime text-neo-black" : "bg-white text-neo-black"
                            }`}
                          >
                            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>

                            {/* Delete button (only for own messages) */}
                            {isMine && (
                              <button
                                onClick={() => setDeleteConfirm(msg.id)}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-neo-pink text-white border-2 border-neo-black flex items-center justify-center shadow-[1px_1px_0_0_#000]"
                                title="Apagar mensagem"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 px-0.5">
                            <span className="font-mono text-[9px] text-neo-black/40">
                              {formatMessageTime(msg.createdAt)}
                            </span>
                            {isMine && (
                              <span
                                className={`font-mono text-[9px] ${msg.read ? "text-neo-lime" : "text-neo-black/30"}`}
                                title={msg.read ? "Lida" : "Não lida"}
                              >
                                {msg.read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="border-t-4 border-neo-black bg-white p-3 flex gap-2 shrink-0"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Mensagem para ${conversation.partnerName}… (Enter para enviar)`}
          disabled={sending}
          rows={1}
          className="flex-1 resize-none px-3 py-2 font-mono text-sm border-[3px] border-neo-black focus:outline-none focus:shadow-none focus:translate-y-[1px] focus:translate-x-[1px] shadow-[3px_3px_0_0_#000] transition-all placeholder:text-neo-black/30 max-h-32 overflow-y-auto"
          style={{ height: "auto" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
          }}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="px-4 py-2 bg-neo-black text-neo-lime border-[3px] border-neo-black font-heading font-black uppercase text-xs shadow-[3px_3px_0_0_#B8FF29] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_#B8FF29] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[3px_3px_0_0_#B8FF29] flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          {sending ? "…" : "ENVIAR"}
        </button>
      </form>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neo-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-neo-black p-6 max-w-sm w-full shadow-[8px_8px_0_0_#000]"
            >
              <h3 className="font-heading font-black text-xl uppercase mb-2">Apagar mensagem?</h3>
              <p className="font-mono text-xs text-neo-black/60 mb-5">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border-[3px] border-neo-black bg-neo-bg font-heading font-black uppercase text-sm shadow-[3px_3px_0_0_#000] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await onDelete(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 py-2.5 border-[3px] border-neo-black bg-neo-pink text-white font-heading font-black uppercase text-sm shadow-[3px_3px_0_0_#000] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Apagar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
