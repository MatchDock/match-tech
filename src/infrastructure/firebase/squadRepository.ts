import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";

import type { Squad } from "@/domain/entities/Squad";
import type { ISquadRepository } from "@/domain/ports/ISquadRepository";
import { SquadSchema } from "@/infrastructure/firebase/schemas";
import { AppError } from "@/shared/lib/AppError";
import { db } from "@/shared/lib/firebase/firebase.client";

/**
 * Firebase implementation of the Squad Repository interface
 * Handles all Firestore operations related to squads
 * Uses Zod for runtime validation
 */
export class FirebaseSquadRepository implements ISquadRepository {
  private collectionName = "squads";

  async getSquad(squadId: string): Promise<Squad> {
    try {
      const docRef = doc(this.getCollection(), squadId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new AppError("SQUAD_NOT_FOUND", squadId);
      }

      const data = docSnap.data();
      return SquadSchema.parse(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async getSquadsByUserId(userId: string): Promise<Squad[]> {
    try {
      const q = query(this.getCollection(), where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);

      const squads: Squad[] = [];
      querySnapshot.forEach((doc) => {
        try {
          const parsed = SquadSchema.parse(doc.data());
          squads.push(parsed);
        } catch {
          // Skip squads that fail validation
        }
      });

      return squads;
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async createSquad(data: Omit<Squad, "id" | "createdAt" | "updatedAt">): Promise<Squad> {
    try {
      const squadId = doc(this.getCollection()).id;
      const now = serverTimestamp();

      const squadData = {
        ...data,
        id: squadId,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = doc(this.getCollection(), squadId);
      await setDoc(docRef, squadData);

      return squadData as unknown as Squad;
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async updateSquad(squadId: string, data: Partial<Squad>): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), squadId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async deleteSquad(squadId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), squadId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async addMemberToSquad(squadId: string, memberId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), squadId);
      const squadSnap = await getDoc(docRef);

      if (!squadSnap.exists()) {
        throw new AppError("SQUAD_NOT_FOUND", squadId);
      }

      const squad = squadSnap.data() as Squad;
      if (squad.members.length >= squad.maxMembers) {
        throw new AppError("INVALID_INPUT", "Squad is full");
      }

      // Add member to squad (simplified - assumes member exists)
      await updateDoc(docRef, {
        members: arrayUnion({
          uid: memberId,
          displayName: "", // Should be populated from member profile
          role: "",
          joinedAt: serverTimestamp(),
        }),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "FIRESTORE_UNAVAILABLE",
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  async removeMemberFromSquad(squadId: string, memberId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollection(), squadId);
      const squadSnap = await getDoc(docRef);

      if (!squadSnap.exists()) {
        throw new AppError("SQUAD_NOT_FOUND", squadId);
      }

      const squad = squadSnap.data() as Squad;
      const memberToRemove = squad.members.find((m) => m.uid === memberId);

      if (memberToRemove) {
        await updateDoc(docRef, {
          members: arrayRemove(memberToRemove),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
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
export const squadRepository = new FirebaseSquadRepository();
