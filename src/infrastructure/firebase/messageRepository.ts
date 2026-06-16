import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import type { Conversation, Message } from "@/features/messages/model/messages.types";
import { db } from "@/shared/lib/firebase/firebase.client";

/**
 * Returns a deterministic conversation ID for two users.
 * The IDs are sorted so that both users derive the same key.
 */
export function makeConversationId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join("_");
}

function getMessageTime(createdAt: unknown): number {
  if (!createdAt) return Date.now();
  if (createdAt instanceof Date) {
    return createdAt.getTime();
  }
  if (typeof createdAt === "number") {
    return createdAt;
  }
  if (typeof createdAt === "string") {
    const parsed = Date.parse(createdAt);
    return isNaN(parsed) ? 0 : parsed;
  }
  const val = createdAt as Record<string, unknown>;
  if (typeof val.toMillis === "function") {
    return (val.toMillis as () => number)();
  }
  if (typeof val.toDate === "function") {
    return (val.toDate as () => Date)().getTime();
  }
  if (typeof val.seconds === "number") {
    return val.seconds * 1000;
  }
  return 0;
}

export class FirebaseMessageRepository {
  private collectionName = "messages";

  /**
   * Send a message to another user.
   * Stores the conversationId alongside the message for efficient querying.
   */
  async sendMessage(params: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    text: string;
  }): Promise<void> {
    const msgCol = this.getCollection();
    const docRef = doc(msgCol);

    const conversationId = makeConversationId(params.senderId, params.receiverId);

    const newMessage: Omit<Message, "id" | "createdAt"> & {
      createdAt: unknown;
      conversationId: string;
    } = {
      senderId: params.senderId,
      senderName: params.senderName,
      receiverId: params.receiverId,
      receiverName: params.receiverName,
      text: params.text,
      createdAt: serverTimestamp(),
      read: false,
      conversationId,
    };

    await setDoc(docRef, newMessage);
  }

  /**
   * Subscribe to all conversations for a user in real-time.
   * Runs two parallel Firestore queries (sent + received) and merges them
   * locally into grouped Conversation objects.
   */
  subscribeToConversations(
    userId: string,
    onUpdate: (conversations: Conversation[]) => void,
    onError?: (error: Error) => void,
  ) {
    // We maintain two independent snapshots and merge on every update.
    let sentMessages: Message[] = [];
    let receivedMessages: Message[] = [];

    const rebuild = () => {
      const allMessages = [...sentMessages, ...receivedMessages];
      const convMap = new Map<string, Conversation>();

      for (const msg of allMessages) {
        const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const partnerName = msg.senderId === userId ? msg.receiverName : msg.senderName;
        const convId = makeConversationId(userId, partnerId);

        if (!convMap.has(convId)) {
          convMap.set(convId, {
            id: convId,
            partnerId,
            partnerName,
            lastMessage: "",
            lastMessageAt: null,
            unreadCount: 0,
            messages: [],
          });
        }

        const conv = convMap.get(convId)!;
        conv.messages.push(msg);
        if (msg.receiverId === userId && !msg.read) {
          conv.unreadCount += 1;
        }
      }

      // Sort messages inside each conversation and compute last message
      const conversations: Conversation[] = [];
      for (const conv of convMap.values()) {
        conv.messages.sort((a, b) => getMessageTime(a.createdAt) - getMessageTime(b.createdAt));
        const last = conv.messages[conv.messages.length - 1];
        conv.lastMessage = last?.text ?? "";
        conv.lastMessageAt = last?.createdAt ?? null;
        conversations.push(conv);
      }

      // Sort conversations by most recent message
      conversations.sort(
        (a, b) => getMessageTime(b.lastMessageAt) - getMessageTime(a.lastMessageAt),
      );

      onUpdate(conversations);
    };

    const sentQuery = query(this.getCollection(), where("senderId", "==", userId));

    const receivedQuery = query(this.getCollection(), where("receiverId", "==", userId));

    const unsubSent = onSnapshot(
      sentQuery,
      (snapshot) => {
        sentMessages = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }) }) as Message,
        );
        rebuild();
      },
      (err) => onError?.(err),
    );

    const unsubReceived = onSnapshot(
      receivedQuery,
      (snapshot) => {
        receivedMessages = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }) }) as Message,
        );
        rebuild();
      },
      (err) => onError?.(err),
    );

    return () => {
      unsubSent();
      unsubReceived();
    };
  }

  /**
   * Subscribe to messages in a specific conversation thread in real-time.
   */
  subscribeToThread(
    conversationId: string,
    onUpdate: (messages: Message[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(this.getCollection(), where("conversationId", "==", conversationId));

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data({ serverTimestamps: "estimate" }),
        })) as Message[];
        messages.sort((a, b) => getMessageTime(a.createdAt) - getMessageTime(b.createdAt));
        onUpdate(messages);
      },
      (err) => onError?.(err),
    );
  }

  /**
   * Mark all unread messages in a conversation as read (only those addressed to userId).
   */
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const q = query(
      this.getCollection(),
      where("conversationId", "==", conversationId),
      where("receiverId", "==", userId),
      where("read", "==", false),
    );

    const { getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    const CHUNK_SIZE = 450;
    for (let i = 0; i < snapshot.docs.length; i += CHUNK_SIZE) {
      const batch = writeBatch(db);
      for (const d of snapshot.docs.slice(i, i + CHUNK_SIZE)) {
        batch.update(d.ref, { read: true });
      }
      await batch.commit();
    }
  }

  /**
   * Mark all unread messages for a user as read.
   */
  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      this.getCollection(),
      where("receiverId", "==", userId),
      where("read", "==", false),
    );

    const { getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    const CHUNK_SIZE = 450;
    for (let i = 0; i < snapshot.docs.length; i += CHUNK_SIZE) {
      const batch = writeBatch(db);
      for (const d of snapshot.docs.slice(i, i + CHUNK_SIZE)) {
        batch.update(d.ref, { read: true });
      }
      await batch.commit();
    }
  }

  /**
   * Subscribe to inbox (legacy — kept for backwards compat with RootLayout unread badge).
   */
  subscribeToInbox(
    userId: string,
    onUpdate: (messages: Message[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(this.getCollection(), where("receiverId", "==", userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data({ serverTimestamps: "estimate" }),
        })) as Message[];
        messages.sort((a, b) => getMessageTime(b.createdAt) - getMessageTime(a.createdAt));
        onUpdate(messages);
      },
      (err) => {
        if (onError) onError(err);
      },
    );
  }

  /**
   * Subscribe to unread messages count in real-time (used by nav badge).
   */
  subscribeToUnreadCount(userId: string, onUpdate: (count: number) => void) {
    const q = query(
      this.getCollection(),
      where("receiverId", "==", userId),
      where("read", "==", false),
    );

    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.size);
    });
  }

  /**
   * Mark a single message as read.
   */
  async markAsRead(messageId: string): Promise<void> {
    const docRef = doc(this.getCollection(), messageId);
    await updateDoc(docRef, { read: true });
  }

  /**
   * Delete a message.
   */
  async deleteMessage(messageId: string): Promise<void> {
    const docRef = doc(this.getCollection(), messageId);
    await deleteDoc(docRef);
  }

  private getCollection() {
    return collection(db, this.collectionName);
  }
}

export const messageRepository = new FirebaseMessageRepository();
