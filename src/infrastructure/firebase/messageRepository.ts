import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import type { Message } from "@/features/messages/model/messages.types";
import { db } from "@/shared/lib/firebase/firebase.client";

export class FirebaseMessageRepository {
  private collectionName = "messages";

  /**
   * Send a message to another user
   */
  async sendMessage(params: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    text: string;
  }): Promise<void> {
    const msgCol = this.getCollection();
    // Pre-generate a doc reference to get the ID, which is valid and secure
    const docRef = doc(msgCol);

    const newMessage: Omit<Message, "id" | "createdAt"> & { createdAt: unknown } = {
      senderId: params.senderId,
      senderName: params.senderName,
      receiverId: params.receiverId,
      receiverName: params.receiverName,
      text: params.text,
      createdAt: serverTimestamp(),
      read: false,
    };

    await setDoc(docRef, newMessage);
  }

  /**
   * Subscribe to messages received by the user in real-time
   */
  subscribeToInbox(
    userId: string,
    onUpdate: (messages: Message[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(
      this.getCollection(),
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          messages.push({
            id: docSnap.id,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverId: data.receiverId,
            receiverName: data.receiverName,
            text: data.text,
            createdAt: data.createdAt,
            read: data.read,
          });
        });
        onUpdate(messages);
      },
      (error) => {
        if (onError) onError(error);
      },
    );
  }

  /**
   * Subscribe to unread messages count in real-time
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
   * Mark a message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    const docRef = doc(this.getCollection(), messageId);
    await updateDoc(docRef, { read: true });
  }

  /**
   * Delete a message
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
