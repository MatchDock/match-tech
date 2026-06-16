import { Send, Trash2, ArrowLeft, Smile, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { Conversation, Message } from "../model/messages.types";

import { sendEmailNotification } from "@/shared/services/notification.service";

interface ChatThreadProps {
  conversation: Conversation;
  currentUserId: string;
  currentUserName?: string;
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
const EMOJI_LIST = [
  // Linha 1: Expressões clássicas
  "😂",
  "🤣",
  "😊",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "🥳",
  // Linha 2: Expressões extras
  "😅",
  "😏",
  "🙄",
  "🤨",
  "😐",
  "😢",
  "😭",
  "😱",
  // Linha 3: Gestos / Mãos
  "👍",
  "👎",
  "👊",
  "✌️",
  "👌",
  "👋",
  "🙌",
  "👏",
  // Linha 4: Gestos extras
  "🙏",
  "🤝",
  "💪",
  "✍️",
  "🤞",
  "✊",
  "❤️",
  "💖",
  // Linha 5: Tech / Dev
  "🚀",
  "💻",
  "💡",
  "🛠️",
  "🔧",
  "✨",
  "🔥",
  "💯",
  // Linha 6: Objetos / Trabalho
  "🎯",
  "🎉",
  "🎈",
  "👀",
  "🧠",
  "💼",
  "📅",
  "📝",
  // Linha 7: Comida & Bebida
  "🍕",
  "🍔",
  "🍟",
  "🍿",
  "🍪",
  "🍩",
  "🍦",
  "🍫",
  // Linha 8: Bebidas / Social
  "☕",
  "🍵",
  "🍺",
  "🍻",
  "🍹",
  "🍷",
  "🥤",
  "🧉",
];

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
  currentUserName,
  onSend,
  onDelete,
  onBack,
}: ChatThreadProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Email notification states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailText, setEmailText] = useState(
    "Olá! Te mandei mensagens no chat da Match Tech, mas parece que você está offline. Vamos conversar?",
  );
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error";
    msg: string;
    previewUrl?: string;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendEmailNotification = async () => {
    if (!emailText.trim() || emailSending) return;
    setEmailSending(true);
    setEmailStatus(null);
    try {
      const response = await sendEmailNotification({
        senderName: currentUserName || "Um operador",
        receiverId: conversation.partnerId,
        messageText: emailText.trim(),
      });

      setEmailStatus({
        type: "success",
        msg: "Notificação enviada com sucesso!",
        previewUrl: response.previewUrl,
      });

      if (response.previewUrl) {
        console.log(`[ETHEREAL MAIL PREVIEW]: ${response.previewUrl}`);
      }

      // Close modal after a slightly longer delay if there is a preview URL, otherwise 3s
      setTimeout(() => {
        if (!response.previewUrl) {
          setShowEmailModal(false);
          setEmailStatus(null);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setEmailStatus({
        type: "error",
        msg: err instanceof Error ? err.message : "Erro ao enviar e-mail. Tente novamente.",
      });
    } finally {
      setEmailSending(false);
    }
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // Clear and focus instantly to feel smooth like WhatsApp/Slack
    setText("");
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
    setSending(true);

    try {
      await onSend(trimmed);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Restore text if send failed
      setText(trimmed);
    } finally {
      setSending(false);
      // Refocus in next macro-task to make sure disabled state does not block it
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = text;
    const newText = currentText.substring(0, start) + emoji + currentText.substring(end);
    setText(newText);

    const newCursorPos = start + emoji.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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

        <button
          onClick={() => {
            setEmailStatus(null);
            setShowEmailModal(true);
          }}
          className="p-2 bg-neo-lime hover:bg-white text-neo-black border-[3px] border-neo-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2.5px_2.5px_0_0_#000] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          title="Enviar notificação por e-mail"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Chamar no E-mail</span>
        </button>
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
        className="relative border-t-4 border-neo-black bg-white p-3 flex gap-2 shrink-0 items-end"
      >
        {showEmojiPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)} />
            <div className="absolute bottom-full left-3 mb-2 bg-white border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] p-3 w-72 z-20">
              <p className="font-heading font-black text-[10px] uppercase tracking-wider text-neo-black/40 mb-2 select-none">
                Reações & Emojis
              </p>
              <div className="grid grid-cols-8 gap-1.5">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="w-6.5 h-6.5 text-base flex items-center justify-center hover:bg-neo-lime/30 active:bg-neo-lime/50 border border-transparent hover:border-neo-black transition-all cursor-pointer select-none rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-white border-[3px] border-neo-black shadow-[2px_2px_0_0_#000] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_#000] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all shrink-0 h-10 w-10 flex items-center justify-center cursor-pointer mb-0.5"
          title="Escolher emoji"
        >
          <Smile className="w-5 h-5 text-neo-black" />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Mensagem para ${conversation.partnerName}… (Enter para enviar)`}
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
          className="px-4 py-2 bg-neo-black text-neo-lime border-[3px] border-neo-black font-heading font-black uppercase text-xs shadow-[3px_3px_0_0_#B8FF29] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_#B8FF29] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[3px_3px_0_0_#B8FF29] flex items-center gap-1.5 shrink-0 h-10 mb-0.5"
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

      {/* Email Notification Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neo-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!emailSending && (!emailStatus || emailStatus.type !== "success")) {
                setShowEmailModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, rotate: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-neo-black p-6 max-w-md w-full shadow-[8px_8px_0_0_#000] flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 border-b-4 border-neo-black pb-3 bg-neo-cyan/20 -mx-6 -mt-6 p-6">
                <Mail className="w-6 h-6 text-neo-black" />
                <h3 className="font-heading font-black text-lg sm:text-xl uppercase m-0">
                  Notificar por E-mail_
                </h3>
              </div>

              {emailStatus ? (
                <div className="flex flex-col gap-3 py-4 text-center">
                  <div
                    className={`p-4 border-4 border-neo-black shadow-[4px_4px_0_0_#000] font-mono text-sm font-bold ${
                      emailStatus.type === "success"
                        ? "bg-neo-lime text-neo-black"
                        : "bg-neo-pink text-white"
                    }`}
                  >
                    {emailStatus.msg}
                  </div>
                  {emailStatus.previewUrl && (
                    <div className="mt-2 text-left">
                      <p className="font-mono text-[10px] text-neo-black/60 mb-1">
                        [MODO TESTE HACKATHON] O e-mail foi interceptado. Clique no link abaixo para
                        visualizá-lo:
                      </p>
                      <a
                        href={emailStatus.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center p-2.5 bg-neo-cyan text-neo-black border-[3px] border-neo-black font-mono text-xs font-black uppercase shadow-[3px_3px_0_0_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] active:translate-y-0 active:shadow-none transition-all cursor-pointer break-all"
                      >
                        Abrir E-mail Enviado ✉️
                      </a>
                    </div>
                  )}
                  {emailStatus.type === "success" && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailModal(false);
                        setEmailStatus(null);
                      }}
                      className="mt-4 py-2 border-[3px] border-neo-black bg-neo-black text-neo-lime font-heading font-black uppercase text-xs shadow-[3px_3px_0_0_#B8FF29] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      Fechar Janela
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-mono text-xs text-neo-black/70 leading-relaxed">
                    Enviar um e-mail de alerta para o endereço cadastrado de{" "}
                    <strong>{conversation.partnerName}</strong>. Isso é útil caso a pessoa esteja
                    offline e você precise de um retorno rápido.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neo-black/40">
                      Mensagem de Alerta (Opcional)
                    </label>
                    <textarea
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      disabled={emailSending}
                      className="w-full h-24 p-2.5 font-mono text-xs border-3 border-neo-black shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-y-[1px] focus:translate-x-[1px] outline-none resize-none transition-all"
                      maxLength={500}
                    />
                    <span className="text-[8px] text-right font-mono text-neo-black/40">
                      {emailText.length}/500 caracteres
                    </span>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      disabled={emailSending}
                      className="flex-1 py-2.5 border-[3px] border-neo-black bg-white font-heading font-black uppercase text-xs shadow-[3px_3px_0_0_#000] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSendEmailNotification}
                      disabled={emailSending || !emailText.trim()}
                      className="flex-1 py-2.5 border-[3px] border-neo-black bg-neo-lime text-neo-black font-heading font-black uppercase text-xs shadow-[3px_3px_0_0_#000] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      {emailSending ? "Enviando..." : "Enviar Alerta ⚡"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
