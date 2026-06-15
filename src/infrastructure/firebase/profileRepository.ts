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
function mapFirestoreToMemberData(
  id: string,
  data: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!data) return data;

  const mapped = { ...data };

  // Map identification fields
  mapped.uid = (data.uid ?? data.userId ?? id) as string;
  mapped.displayName = (data.displayName ?? data.name ?? "") as string;

  // Map role
  mapped.role = (data.role ?? data.primaryRole ?? "") as string;

  // Map squad status
  mapped.squadStatus = (data.squadStatus ?? data.status ?? "open") as string;

  // Map tags from canvas if tags is not present
  if (!mapped.tags) {
    const tags: { name: string; sentiment: "love" | "ok" | "veto" }[] = [];
    const canvas = data.canvas as
      | { loves?: string[]; comfort?: string[]; veto?: string[] }
      | undefined;
    if (canvas) {
      if (canvas.loves && Array.isArray(canvas.loves)) {
        canvas.loves.forEach((name: string) => {
          if (name) tags.push({ name, sentiment: "love" });
        });
      }
      if (canvas.comfort && Array.isArray(canvas.comfort)) {
        canvas.comfort.forEach((name: string) => {
          if (name) tags.push({ name, sentiment: "ok" });
        });
      }
      if (canvas.veto && Array.isArray(canvas.veto)) {
        canvas.veto.forEach((name: string) => {
          if (name) tags.push({ name, sentiment: "veto" });
        });
      }
    }
    mapped.tags = tags;
  }

  return mapped;
}

export class FirebaseProfileRepository implements IProfileRepository {
  private collectionName = "profiles";

  async getProfile(uid: string): Promise<Member> {
    try {
      const docRef = doc(this.getCollection(), uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new AppError("PROFILE_NOT_FOUND", uid);
      }

      const data = docSnap.data();
      const mappedData = mapFirestoreToMemberData(uid, data);
      return MemberSchema.parse(mappedData);
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

      const mappedData = mapFirestoreToMemberData(uid, data);
      return PublicMemberSchema.parse(mappedData);
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

      const dbData: Record<string, unknown> = { ...data } as Record<string, unknown>;

      if (data.displayName !== undefined) {
        dbData.name = data.displayName;
        delete dbData.displayName;
      }
      if (data.role !== undefined) {
        dbData.primaryRole = data.role;
        delete dbData.role;
      }
      if (data.squadStatus !== undefined) {
        dbData.status = data.squadStatus;
        delete dbData.squadStatus;
      }
      if (data.tags !== undefined) {
        const loves = data.tags.filter((t) => t.sentiment === "love").map((t) => t.name);
        const comfort = data.tags.filter((t) => t.sentiment === "ok").map((t) => t.name);
        const veto = data.tags.filter((t) => t.sentiment === "veto").map((t) => t.name);
        dbData.canvas = { loves, comfort, veto };
        delete dbData.tags;
      }
      if (data.uid !== undefined) {
        dbData.userId = data.uid;
        delete dbData.uid;
      }

      const updateData = {
        ...dbData,
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
        constraints.push(where("primaryRole", "==", filters.role));
      }

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);

      const profiles: Member[] = [];
      querySnapshot.forEach((docSnap) => {
        try {
          const mappedData = mapFirestoreToMemberData(docSnap.id, docSnap.data());
          const parsed = MemberSchema.parse(mappedData);
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
