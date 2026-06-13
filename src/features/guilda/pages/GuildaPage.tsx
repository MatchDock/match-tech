import { AnimatePresence, motion } from "motion/react";

import { GuildHeader } from "../components/GuildHeader";
import { GuildMembersGrid } from "../components/GuildMembersGrid";
import { GuildRoastModal } from "../components/GuildRoastModal";
import { GuildAccessDeniedState, GuildLoadingState } from "../components/GuildStates";
import { useGuildMembersRealtime } from "../hooks/useGuildMembersRealtime";
import { useGuildRoast } from "../hooks/useGuildRoast";

import { useAuth } from "@/contexts/useAuth";

export default function GuildaPage() {
  const { user } = useAuth();
  const { members } = useGuildMembersRealtime(user?.uid);
  const roast = useGuildRoast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-12 px-6"
    >
      <GuildHeader totalMembers={members.length} />

      {!user ? (
        <GuildAccessDeniedState />
      ) : members.length === 0 ? (
        <GuildLoadingState />
      ) : (
        <GuildMembersGrid
          members={members}
          user={user}
          roastActiveMember={roast.roastActiveMember}
          roastStep={roast.roastStep}
          roastLogs={roast.roastLogs}
          onOpenRoastSelection={roast.openRoastSelection}
          onExecuteRoast={roast.executeRoast}
        />
      )}

      <AnimatePresence>
        {roast.selectedMember && (
          <GuildRoastModal
            selectedMember={roast.selectedMember}
            activePersonaView={roast.activePersonaView}
            onClose={roast.closeSelectedMember}
            onGeneratePersona={roast.executeRoast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
