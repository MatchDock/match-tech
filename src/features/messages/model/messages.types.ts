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
