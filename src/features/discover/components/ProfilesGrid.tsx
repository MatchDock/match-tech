import ProfileCard from "@/src/shared/components/ui/ProfileCard";
import { EmptyProfilesState } from "./EmptyProfilesState";
import type { Profile } from "../model/discover.types";

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
      {profiles.map((profile, index) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          colorIndex={index}
          onClick={() => onProfileClick(profile)}
        />
      ))}
    </div>
  );
}