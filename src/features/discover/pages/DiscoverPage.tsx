import { AnimatePresence, motion } from "motion/react";

import { AccessDeniedState } from "../components/AccessDeniedState";
import { DiscoverFilters } from "../components/DiscoverFilters";
import { DiscoverHeader } from "../components/DiscoverHeader";
import { DiscoverToast } from "../components/DiscoverToast";
import { ProfilesGrid } from "../components/ProfilesGrid";
import { RoastModal } from "../components/RoastModal";
import { useDiscoverFilters } from "../hooks/useDiscoverFilters";
import { useProfilesRealtime } from "../hooks/useProfilesRealtime";
import { useRoastProfile } from "../hooks/useRoastProfile";
import { useToast } from "../hooks/useToast";

import { useAuth } from "@/contexts/useAuth";

export default function DiscoverPage() {
  const { user } = useAuth();

  const { toast, showToast, hideToast } = useToast();
  const { profiles } = useProfilesRealtime(user?.uid);

  const filters = useDiscoverFilters(profiles);

  const roast = useRoastProfile({ showToast });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-12 px-6"
    >
      <AnimatePresence>
        {toast && <DiscoverToast toast={toast} onClose={hideToast} />}
      </AnimatePresence>

      <DiscoverHeader totalProfiles={filters.filteredProfiles.length} />

      {!user ? (
        <AccessDeniedState />
      ) : (
        <div className="space-y-8">
          <DiscoverFilters {...filters} />
          <ProfilesGrid profiles={filters.filteredProfiles} onProfileClick={roast.openProfile} />
        </div>
      )}

      <AnimatePresence>
        {roast.selectedProfile && (
          <RoastModal
            profile={roast.selectedProfile}
            activePersonaView={roast.activePersonaView}
            isGenerating={roast.isGenerating}
            onClose={roast.closeProfile}
            onSelectPersona={roast.setActivePersonaView}
            onGenerateRoast={roast.executeRoast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
