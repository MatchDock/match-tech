import type { Profile } from "../model/discover.types";

import { EmptyProfilesState } from "./EmptyProfilesState";

import ProfileCard from "@/shared/components/ui/ProfileCard";

interface ProfilesGridProps {
  profiles: Profile[];
  onProfileClick: (profile: Profile) => void;
}

export function ProfilesGrid({ profiles, onProfileClick }: ProfilesGridProps) {
  if (profiles.length === 0) {
    return <EmptyProfilesState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {profiles.map((p, idx) => (
        <ProfileCard key={p.id} profile={p} colorIndex={idx} onClick={() => onProfileClick(p)} />
      ))}
    </div>
  );
}
