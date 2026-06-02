import { create } from "zustand";

import type { GuildMember, RoastPersona, RoastStep } from "../model/guilda.types";

interface GuildRoastState {
  selectedMember: GuildMember | null;
  roastActiveMember: string | null;
  roastStep: RoastStep;
  roastLogs: string[];
  activePersonaView: RoastPersona | null;
  setSelectedMember: (member: GuildMember | null) => void;
  setRoastActiveMember: (id: string | null) => void;
  setRoastStep: (step: RoastStep) => void;
  appendRoastLog: (log: string) => void;
  setRoastLogs: (logs: string[]) => void;
  setActivePersonaView: (persona: RoastPersona | null) => void;
  closeSelectedMember: () => void;
  openRoastSelection: (memberId: string) => void;
}

export const useGuildRoastStore = create<GuildRoastState>((set) => ({
  selectedMember: null,
  roastActiveMember: null,
  roastStep: null,
  roastLogs: [],
  activePersonaView: null,
  setSelectedMember: (selectedMember) => set({ selectedMember }),
  setRoastActiveMember: (roastActiveMember) => set({ roastActiveMember }),
  setRoastStep: (roastStep) => set({ roastStep }),
  setRoastLogs: (roastLogs) => set({ roastLogs }),
  appendRoastLog: (log) => set((state) => ({ roastLogs: [...state.roastLogs, log].slice(-3) })),
  setActivePersonaView: (activePersonaView) => set({ activePersonaView }),
  closeSelectedMember: () => set({ selectedMember: null }),
  openRoastSelection: (roastActiveMember) => set({ roastActiveMember, roastStep: "selecting" }),
}));
