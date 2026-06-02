import type { Member } from "@/domain/entities/Member";

export interface IAuthService {
  getCurrentUser(): Promise<Member | null>;
  signInWithMagicLink(email: string): Promise<void>;
  signOut(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}
