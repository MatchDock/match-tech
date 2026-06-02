import type { GuildMember } from "../model/guilda.types";

import type { RoastPersona } from "@/domain/entities/Shared";
import { RoastModal as SharedRoastModal } from "@/shared/components/ui/RoastModal";

interface GuildRoastModalProps {
  selectedMember: GuildMember;
  activePersonaView: RoastPersona | null;
  onClose: () => void;
  onGeneratePersona: (member: GuildMember, persona: RoastPersona) => void;
}

export function GuildRoastModal({
  selectedMember,
  activePersonaView,
  onClose,
  onGeneratePersona,
}: GuildRoastModalProps) {
  const roastText =
    activePersonaView === "brutal"
      ? selectedMember.roastBrutal || selectedMember.roast
      : selectedMember.roastMild || selectedMember.roastBrutal || selectedMember.roast;

  return (
    <SharedRoastModal
      targetName={selectedMember.name}
      roastText={roastText}
      roastBrutal={selectedMember.roastBrutal}
      roastMild={selectedMember.roastMild}
      activePersonaView={activePersonaView}
      onClose={onClose}
      onGenerateBrutal={() => {
        onClose();
        onGeneratePersona(selectedMember, "brutal");
      }}
      onGenerateMild={() => {
        onClose();
        onGeneratePersona(selectedMember, "mild");
      }}
    />
  );
}
