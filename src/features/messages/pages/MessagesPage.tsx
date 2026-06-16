import { CheckCheck } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ChatThread } from "../components/ChatThread";
import { ConversationList } from "../components/ConversationList";
import { EmptyChat } from "../components/EmptyChat";
import type { Conversation } from "../model/messages.types";

import { useAuth } from "@/contexts/useAuth";
import { makeConversationId, messageRepository } from "@/infrastructure/firebase/messageRepository";

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // On mobile, when a conversation is selected we hide the list.
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  // Read ?with=userId from URL to pre-select a conversation (used by SendMessageModal redirect)
  const withUserId = searchParams.get("with");

  // Subscribe to all conversations in real-time
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsub = messageRepository.subscribeToConversations(
      user.uid,
      (convs) => {
        setConversations(convs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching conversations:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  // When URL has ?with=userId, open that conversation automatically
  useEffect(() => {
    if (!user || !withUserId) return;
    const convId = makeConversationId(user.uid, withUserId);
    setActiveConversationId(convId);
    setMobileView("thread");
  }, [user, withUserId]);

  // Mark conversation as read when it's opened or when new messages arrive
  useEffect(() => {
    if (!user || !activeConversationId) return;
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (activeConv && activeConv.unreadCount > 0) {
      messageRepository.markConversationAsRead(activeConversationId, user.uid).catch(console.error);
    }
  }, [user, activeConversationId, conversations]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const handleSelectConversation = useCallback(
    (conv: Conversation) => {
      setActiveConversationId(conv.id);
      setMobileView("thread");
      if (user && conv.unreadCount > 0) {
        messageRepository.markConversationAsRead(conv.id, user.uid).catch(console.error);
      }
    },
    [user],
  );

  const handleBack = useCallback(() => {
    setMobileView("list");
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!user || !activeConversation) return;
      if (activeConversation.unreadCount > 0) {
        messageRepository
          .markConversationAsRead(activeConversationId!, user.uid)
          .catch(console.error);
      }
      await messageRepository.sendMessage({
        senderId: user.uid,
        senderName: user.displayName ?? "Operador Anônimo",
        receiverId: activeConversation.partnerId,
        receiverName: activeConversation.partnerName,
        text,
      });
    },
    [user, activeConversation, activeConversationId],
  );

  const handleDelete = useCallback(async (messageId: string) => {
    await messageRepository.deleteMessage(messageId);
  }, []);

  const totalUnreadCount = useMemo(
    () => conversations.reduce((acc, c) => acc + c.unreadCount, 0),
    [conversations],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await messageRepository.markAllAsRead(user.uid);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-8 px-4 md:px-6"
    >
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none">
            Mensagens_
          </h1>
          <p className="font-mono text-xs text-neo-black/50 mt-1">
            {conversations.length > 0
              ? `${conversations.length} conversa${conversations.length !== 1 ? "s" : ""} ativa${conversations.length !== 1 ? "s" : ""}`
              : "Nenhuma conversa ainda"}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-end">
          {totalUnreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-neo-lime hover:bg-white text-neo-black font-mono text-xs px-3 py-1.5 border-2 border-neo-black font-bold flex items-center gap-2 shadow-[2px_2px_0_0_#000] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          )}
          <div className="bg-neo-black text-neo-lime font-mono text-xs px-3 py-1.5 border-2 border-neo-black font-bold flex items-center gap-2 shadow-[2px_2px_0_0_#000] shrink-0">
            {totalUnreadCount} não lidas
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div
        className="border-4 border-neo-black bg-white shadow-[8px_8px_0_0_#000] overflow-hidden"
        style={{ height: "calc(100vh - 220px)", minHeight: "480px" }}
      >
        <div className="flex h-full">
          {/* LEFT PANEL — Conversation List */}
          {/* Desktop: always visible. Mobile: visible only when mobileView === 'list' */}
          <div
            className={`
              w-full md:w-72 lg:w-80 shrink-0
              border-r-0 md:border-r-4 border-neo-black
              flex flex-col
              ${mobileView === "thread" ? "hidden md:flex" : "flex"}
            `}
          >
            {/* Panel Header */}
            <div className="border-b-4 border-neo-black px-4 py-3 bg-neo-bg">
              <h2 className="font-heading font-black text-sm uppercase tracking-wider">
                Conversas
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={handleSelectConversation}
                loading={loading}
              />
            </div>
          </div>

          {/* RIGHT PANEL — Chat Thread or Empty State */}
          <div
            className={`
              flex-1 flex flex-col min-w-0
              ${mobileView === "list" ? "hidden md:flex" : "flex"}
            `}
          >
            {activeConversation ? (
              <ChatThread
                conversation={activeConversation}
                currentUserId={user!.uid}
                onSend={handleSend}
                onDelete={handleDelete}
                onBack={handleBack}
              />
            ) : (
              <EmptyChat />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
