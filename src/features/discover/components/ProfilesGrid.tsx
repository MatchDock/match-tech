import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { Profile } from "../model/discover.types";

import { EmptyProfilesState } from "./EmptyProfilesState";

import ProfileCard from "@/shared/components/ui/ProfileCard";

interface ProfilesGridProps {
  profiles: Profile[];
  onProfileClick: (profile: Profile) => void;
}

export function ProfilesGrid({ profiles, onProfileClick }: ProfilesGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: profiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  if (profiles.length === 0) {
    return <EmptyProfilesState />;
  }

  return (
    <div ref={parentRef} className="overflow-auto" style={{ height: "70vh" }}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{ position: "absolute", top: item.start, width: "100%" }}
          >
            <div className="pb-8">
              <ProfileCard
                profile={profiles[item.index]}
                colorIndex={item.index}
                onClick={() => onProfileClick(profiles[item.index])}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
