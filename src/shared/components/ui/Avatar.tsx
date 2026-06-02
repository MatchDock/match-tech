import { cn } from "@/src/shared/lib/utils/cn";
import React, { useState, useEffect } from "react";

interface AvatarProps {
  user: {
    photoURL?: string | null;
    github?: string | null;
    name?: string | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ user, size = "md", className }: AvatarProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const { photoURL, github, name } = user;

  // Re-clean Github handle to construct standard raw image URL
  const getGithubAvatarUrl = (handle: string) => {
    const clean = handle
      .trim()
      .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, "")
      .replace(/\/$/, "")
      .replace(/^@/, "");
    return `https://github.com/${clean}.png`;
  };

  const sources: string[] = [];

  if (photoURL) {
    let photo = photoURL;
    if (photo.includes("googleusercontent.com")) {
      if (photo.includes("=s96-c")) {
        photo = photo.replace("=s96-c", "=s400-c");
      } else if (!photo.includes("=")) {
        photo = `${photo}=s400-c`;
      }
    }
    sources.push(photo);
  }

  if (github) {
    sources.push(getGithubAvatarUrl(github));
  }

  // Reset error fallback index if inputs change
  useEffect(() => {
    setImageIndex(0);
  }, [photoURL, github]);

  const sizeClasses = {
    sm: "w-10 h-10 text-sm border-2 shadow-[2px_2px_0_0_#000]",
    md: "w-16 h-16 text-xl border-[3px] shadow-[4px_4px_0_0_#000]",
    lg: "w-32 h-32 text-4xl border-[4px] shadow-[6px_6px_0_0_#000]",
    xl: "w-40 h-40 text-5xl border-[5px] shadow-[8px_8px_0_0_#000]",
  };

  const currentSrc = sources[imageIndex];

  return (
    <div
      className={cn(
        "rounded-none border-neo-black bg-white flex items-center justify-center font-heading font-black uppercase text-neo-black overflow-hidden select-none shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={name || "Operador"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageIndex((prev) => prev + 1)}
        />
      ) : (
        <span>{name?.[0] || "?"}</span>
      )}
    </div>
  );
}
