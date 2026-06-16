import type { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  createdAt: Timestamp | null;
  read: boolean;
}

/**
 * A Conversation groups all messages exchanged between two users.
 * The id is deterministic: [uid1, uid2].sort().join('_')
 * This ensures both users see the same thread regardless of who initiated.
 */
export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: Timestamp | null;
  unreadCount: number;
  messages: Message[];
}
