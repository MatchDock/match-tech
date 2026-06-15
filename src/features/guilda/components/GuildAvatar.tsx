import { useMemo, useState } from "react";

import type { AvatarProps } from "../model/guilda.types";
import { getAvatarSources } from "../utils/guilda.formatters";

export function GuildAvatar({ member, currentUser, getGithubUrl }: AvatarProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const photoUrlToUse =
    member.photoURL ||
    (currentUser && currentUser.uid === member.id ? currentUser.photoURL || undefined : undefined);

  const sources = useMemo(
    () => getAvatarSources(photoUrlToUse, member.github, getGithubUrl),
    [photoUrlToUse, member.github, getGithubUrl],
  );

  const currentSrc = sources[imageIndex];

  if (!currentSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center font-black">
        {member.name?.[0] || "?"}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={member.name}
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setImageIndex((index) => index + 1)}
    />
  );
}
