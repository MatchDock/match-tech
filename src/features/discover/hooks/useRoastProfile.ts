import { useState } from "react";

import { getInitialPersona } from "../model/discover.selectors";
import type { Profile, RoastPersona } from "../model/discover.types";
import { updateProfile } from "../services/discover.repository";

import { firestoreLog, apiLog } from "@/shared/lib/logger/logger";
import { requestRoast } from "@/shared/services/roast.service";

interface UseRoastProfileParams {
  showToast: (message: string, type?: "error" | "info") => void;
}

export function useRoastProfile({ showToast }: UseRoastProfileParams) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activePersonaView, setActivePersonaView] = useState<RoastPersona | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  function openProfile(profile: Profile) {
    setSelectedProfile(profile);
    setActivePersonaView(getInitialPersona(profile));
  }

  function closeProfile() {
    setSelectedProfile(null);
  }

  async function executeRoast(profile: Profile, persona: RoastPersona) {
    setActivePersonaView(persona);

    const existingField = persona === "brutal" ? profile.roastBrutal : profile.roastMild;

    if (existingField) {
      setSelectedProfile(profile);
      return;
    }

    setIsGenerating(true);

    try {
      const data = await requestRoast({ memberId: profile.id, memberData: profile, persona });

      if (!data.roast) {
        showToast(`Erro ao gerar a Sina: ${data.error || "Resposta inesperada do servidor."}`);
        return;
      }

      const updateData =
        persona === "brutal"
          ? { roastBrutal: data.roast, updatedAt: new Date() }
          : { roastMild: data.roast, updatedAt: new Date() };

      try {
        await updateProfile(profile.id, updateData);
      } catch (dbError) {
        firestoreLog.error("Erro ao salvar sina no banco:", dbError);
      }

      setSelectedProfile({
        ...profile,
        ...updateData,
      });
    } catch (error) {
      apiLog.error("Erro ao chamar o roast:", error);
      showToast("Sem conexão com o servidor de IA. Verifique sua rede e tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    selectedProfile,
    activePersonaView,
    isGenerating,
    openProfile,
    closeProfile,
    executeRoast,
    setActivePersonaView,
  };
}
