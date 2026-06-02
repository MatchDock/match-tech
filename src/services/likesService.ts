import { 
  doc, 
  onSnapshot, 
  writeBatch,
  increment,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "../shared/lib/firebase/firebase.client";
import { firestoreLog } from "../shared/lib/logger/logger";

export async function toggleLike(postId: string, userId: string, isLiked: boolean) {
  const postRef = doc(db, "posts", postId);
  const likeRef = doc(db, "posts", postId, "likes", userId);
  
  const batch = writeBatch(db);

  try {
    // Check if post metadata exists first simply using a normal get if we want
    // But since batch operations with merge:true on set handle creation dynamically, 
    // it's much faster.
    
    // We enforce structure via set with merge
    if (isLiked) {
      batch.delete(likeRef);
      batch.set(postRef, {
        postId,
        likesCount: increment(-1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      batch.set(likeRef, {
        userId,
        createdAt: serverTimestamp()
      });
      batch.set(postRef, {
        postId,
        likesCount: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    
    await batch.commit();
  } catch (error) {
    firestoreLog.error("Error toggling like:", error);
    throw error;
  }
}

export function subscribeToLikes(postId: string, callback: (likesCount: number) => void) {
  return onSnapshot(doc(db, "posts", postId), (docSnap) => {
    if (docSnap.exists() && typeof docSnap.data().likesCount === 'number') {
      callback(Math.max(0, docSnap.data().likesCount));
    } else {
      callback(0);
    }
  });
}

export function subscribeToUserLike(postId: string, userId: string, callback: (isLiked: boolean) => void) {
  return onSnapshot(doc(db, "posts", postId, "likes", userId), (docSnap) => {
    callback(docSnap.exists());
  });
}

