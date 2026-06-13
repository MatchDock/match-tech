import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { ROAST_LOGS_SEQUENCE } from "../constants/guilda.constants";
import type { GuildMember, RoastPersona } from "../model/guilda.types";
import { saveRoast } from "../services/guilda.repository";
import { useGuildRoastStore } from "../store/guildRoast";

import { requestRoast } from "@/shared/services/roast.service";

function getRoastByPersona(member: GuildMember, persona: RoastPersona) {
  return persona === "brutal" ? member.roastBrutal : member.roastMild;
}

export function useGuildRoast() {
  const store = useGuildRoastStore();
  const logsIntervalRef = useRef<number | null>(null);

  const clearLogsInterval = () => {
    if (logsIntervalRef.current) {
      window.clearInterval(logsIntervalRef.current);
      logsIntervalRef.current = null;
    }
  };

  useEffect(() => clearLogsInterval, []);

  const startLogs = (persona: RoastPersona) => {
    const sequence = [`Selecionando persona: ${persona.toUpperCase()}...`, ...ROAST_LOGS_SEQUENCE];
    let currentLog = 0;
    store.setRoastLogs([sequence[0]]);
    clearLogsInterval();
    logsIntervalRef.current = window.setInterval(() => {
      currentLog += 1;
      if (currentLog < sequence.length) {
        store.appendRoastLog(sequence[currentLog]);
      }
    }, 1500);
  };

  const roastMutation = useMutation({
    mutationFn: ({ member, persona }: { member: GuildMember; persona: RoastPersona }) =>
      requestRoast({ memberId: member.id, memberData: member, persona }),
    onMutate: ({ persona }) => {
      startLogs(persona);
    },
    onSuccess: async (data, { member, persona }) => {
      if (!data.roast) {
        console.error("Erro no backend:", data);
        return;
      }
      let updateData: Partial<GuildMember> & { updatedAt?: Date } = {};
      try {
        updateData = await saveRoast(member.id, data.roast, persona);
      } catch (dbError) {
        console.error("Erro ao salvar sina no banco:", dbError);
      }
      store.setSelectedMember({ ...member, ...updateData });
    },
    onError: (error) => {
      console.error("Erro ao chamar o roast:", error);
    },
    onSettled: () => {
      clearLogsInterval();
      store.setRoastStep(null);
      store.setRoastActiveMember(null);
    },
  });

  function executeRoast(member: GuildMember, persona: RoastPersona) {
    store.setActivePersonaView(persona);
    const existingRoast = getRoastByPersona(member, persona);
    if (existingRoast) {
      store.setSelectedMember(member);
      return;
    }
    store.setRoastStep("loading");
    roastMutation.mutate({ member, persona });
  }

  return {
    ...store,
    executeRoast,
  };
}
