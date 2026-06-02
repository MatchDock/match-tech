import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";

import type { Member, PublicMember } from "@/domain/entities/Member";
import type { IProfileRepository, ProfileFilters } from "@/domain/ports/IProfileRepository";
import { MemberSchema, PublicMemberSchema } from "@/infrastructure/firebase/schemas";
import { AppError } from "@/shared/lib/AppError";
import { db } from "@/shared/lib/firebase/firebase.client";

/**
 * Firebase implementation of the Profile Repository interface
 * Handles all Firestore operations related to member profiles
 * Uses Zod for runtime validation
 */
export class FirebaseProfileRepository implements IProfileRepository {
  private collectionName = "members";

  async getProfile(uid: string): Promise<Member> {
    try {
      const docRef = doc(this.getCollection(), uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new AppError("PROFILE_NOT_FOUND", uid);
      }

      const data = docSnap.data();
      return MemberSchema.parse(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof Error) {
        throw new AppError("FIRESTORE_UNAVAILABLE", error.message);
      }
      throw new AppError("FIRESTORE_UNAVAILABLE");
    }
  }

  async getPublicProfile(uid: string): Promise<PublicMember> {
    try {
      const docRef = doc(this.getCollection(), uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new AppError("PROFILE_NOT_FOUND", uid);
      }

      const data = docSnap.data();
      if (data.visibility !== "public") {
        throw new AppError("UNAUTHORIZED", `Profile ${uid} is not public`);
      }

      return PublicMemberSchema.parse(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof Error) {
        throw new AppError("FIRESTORE_UNAVAILABLE", error.message);
      }
      throw new AppError("FIRESTORE_UNAVAILABLE");
    }
  }

  async updateProfile(uid: string, data: Partial<Member>): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), uid);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async listPublicProfiles(filters?: ProfileFilters): Promise<Member[]> {
    try {
      const constraints = [where("visibility", "==", "public")];

      if (filters?.role) {
        constraints.push(where("role", "==", filters.role));
      }

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);

      const profiles: Member[] = [];
      querySnapshot.forEach((doc) => {
        try {
          const parsed = MemberSchema.parse(doc.data());
          profiles.push(parsed);
        } catch {
          // Skip profiles that fail validation
        }
      });

      return profiles;
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async deleteProfile(uid: string): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), uid);
      await deleteDoc(docRef);
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  private getCollection() {
    return collection(db, this.collectionName);
  }
}

// Singleton instance
export const profileRepository = new FirebaseProfileRepository();
