import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { getInitialPersona } from "../model/discover.selectors";
import type { Profile, RoastPersona } from "../model/discover.types";

import { apiLog } from "@/shared/lib/logger/logger";
import { deleteRoast, requestRoast } from "@/shared/services/roast.service";

interface UseRoastProfileParams {
  showToast: (message: string, type?: "error" | "info") => void;
  onDeleteSuccess?: () => void;
}

export function useRoastProfile({ showToast, onDeleteSuccess }: UseRoastProfileParams) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activePersonaView, setActivePersonaView] = useState<RoastPersona | null>(null);
  const [streamingText, setStreamingText] = useState<string>("");

  const roastMutation = useMutation({
    mutationFn: ({ profile, persona }: { profile: Profile; persona: RoastPersona }) =>
      requestRoast({ memberId: profile.id, memberData: profile, persona }, (chunk) =>
        setStreamingText((prev) => prev + chunk),
      ),
    onMutate: () => {
      setStreamingText("");
    },
    onSuccess: (data, { profile, persona }) => {
      const field = persona === "brutal" ? "roastBrutal" : "roastMild";
      setSelectedProfile({ ...profile, [field]: data.roast, updatedAt: new Date() });
      setStreamingText("");
    },
    onError: (error) => {
      apiLog.error("Erro ao chamar o roast:", error);
      showToast("Sem conexão com o servidor de IA. Verifique sua rede e tente novamente.");
      setStreamingText("");
    },
  });

  const deleteRoastMutation = useMutation({
    mutationFn: ({ memberId, persona }: { memberId: string; persona: RoastPersona }) =>
      deleteRoast(memberId, persona),
    onSuccess: (_, { persona }) => {
      const field = persona === "brutal" ? "roastBrutal" : "roastMild";
      setSelectedProfile((prev) => (prev ? { ...prev, [field]: undefined } : null));
      onDeleteSuccess?.();
    },
    onError: () => {
      showToast("Erro ao apagar veredito. Tente novamente.");
    },
  });

  function openProfile(profile: Profile) {
    setSelectedProfile(profile);
    setActivePersonaView(getInitialPersona(profile));
  }

  function executeRoast(profile: Profile, persona: RoastPersona) {
    setActivePersonaView(persona);
    const existingField = persona === "brutal" ? profile.roastBrutal : profile.roastMild;
    if (existingField) {
      setSelectedProfile(profile);
      return;
    }
    roastMutation.mutate({ profile, persona });
  }

  function executeDeleteRoast(persona: RoastPersona) {
    if (!selectedProfile) return;
    deleteRoastMutation.mutate({ memberId: selectedProfile.id, persona });
  }

  return {
    selectedProfile,
    activePersonaView,
    streamingText,
    isGenerating: roastMutation.isPending,
    isDeleting: deleteRoastMutation.isPending,
    openProfile,
    closeProfile: () => setSelectedProfile(null),
    executeRoast,
    executeDeleteRoast,
    setActivePersonaView,
  };
}
