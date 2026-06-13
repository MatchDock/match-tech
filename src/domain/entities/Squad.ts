export interface SquadMember {
  uid: string;
  displayName: string;
  photoURL?: string;
  role: string;
  joinedAt: Record<string, unknown>;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: SquadMember[];
  maxMembers: number;
  createdAt: Record<string, unknown>;
  updatedAt: Record<string, unknown>;
}
