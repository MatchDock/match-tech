import { useEffect, useMemo, useRef, useState } from "react";

import { ROAST_LOGS_SEQUENCE } from "../constants/guilda.constants";
import type { GuildMember, RoastPersona, RoastStep } from "../model/guilda.types";
import { saveRoast } from "../services/guilda.repository";

import { requestRoast } from "@/shared/services/roast.service";

function getRoastByPersona(member: GuildMember, persona: RoastPersona) {
  return persona === "brutal" ? member.roastBrutal : member.roastMild;
}

export function useGuildRoast() {
  const [selectedMember, setSelectedMember] = useState<GuildMember | null>(null);
  const [roastActiveMember, setRoastActiveMember] = useState<string | null>(null);
  const [roastStep, setRoastStep] = useState<RoastStep>(null);
  const [roastLogs, setRoastLogs] = useState<string[]>([]);
  const [activePersonaView, setActivePersonaView] = useState<RoastPersona | null>(null);
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
    setRoastLogs([sequence[0]]);

    clearLogsInterval();
    logsIntervalRef.current = window.setInterval(() => {
      currentLog += 1;
      if (currentLog < sequence.length) {
        setRoastLogs((previous) => [...previous, sequence[currentLog]].slice(-3));
      }
    }, 1500);
  };

  const executeRoast = async (member: GuildMember, persona: RoastPersona) => {
    setActivePersonaView(persona);
    const existingRoast = getRoastByPersona(member, persona);

    if (existingRoast) {
      setSelectedMember(member);
      return;
    }

    setRoastStep("loading");
    startLogs(persona);

    try {
      const data = await requestRoast({
        memberId: member.id,
        memberData: member,
        persona,
      });

      if (!data.roast) {
        alert(`Erro no backend: ${JSON.stringify(data)}`);
        return;
      }

      let updateData: Partial<GuildMember> & { updatedAt?: Date } = {};
      try {
        updateData = await saveRoast(member.id, data.roast, persona);
      } catch (dbError) {
        console.error("Erro ao salvar sina no banco:", dbError);
      }

      setSelectedMember({ ...member, ...updateData });
    } catch (error) {
      console.error(error);
      alert("Erro ao chamar o roast.");
    } finally {
      clearLogsInterval();
      setRoastStep(null);
      setRoastActiveMember(null);
    }
  };

  const openRoastSelection = (memberId: string) => {
    setRoastActiveMember(memberId);
    setRoastStep("selecting");
  };

  const closeSelectedMember = () => {
    setSelectedMember(null);
  };

  const state = useMemo(
    () => ({
      selectedMember,
      roastActiveMember,
      roastStep,
      roastLogs,
      activePersonaView,
    }),
    [selectedMember, roastActiveMember, roastStep, roastLogs, activePersonaView],
  );

  return {
    ...state,
    setSelectedMember,
    setActivePersonaView,
    openRoastSelection,
    closeSelectedMember,
    executeRoast,
  };
}
