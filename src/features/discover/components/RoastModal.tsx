import { getDisplayedRoast } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";

import type { RoastPersona } from "@/domain/entities/Shared";
import { RoastModal as SharedRoastModal } from "@/shared/components/ui/RoastModal";

interface RoastModalProps {
  profile: Profile;
  activePersonaView: RoastPersona | null;
  isGenerating: boolean;
  onClose: () => void;
  onSelectPersona: (persona: RoastPersona) => void;
  onGenerateRoast: (profile: Profile, persona: RoastPersona) => Promise<void>;
}

export function RoastModal({
  profile,
  activePersonaView,
  isGenerating,
  onClose,
  onSelectPersona,
  onGenerateRoast,
}: RoastModalProps) {
  return (
    <SharedRoastModal
      targetName={profile.name}
      roastText={getDisplayedRoast(profile, activePersonaView)}
      roastBrutal={profile.roastBrutal}
      roastMild={profile.roastMild}
      activePersonaView={activePersonaView}
      isGenerating={isGenerating}
      onClose={onClose}
      onGenerateBrutal={() => {
        onSelectPersona("brutal");
        void onGenerateRoast(profile, "brutal");
      }}
      onGenerateMild={() => {
        onSelectPersona("mild");
        void onGenerateRoast(profile, "mild");
      }}
    />
  );
}
