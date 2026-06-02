import React from "react";
import { cn } from "../../lib/utils/cn";

interface TagBadgeProps {
  tag: string;
  sentiment: "love" | "comfort" | "veto" | "neutral";
  className?: string;
}

export default function TagBadge({ tag, sentiment, className }: TagBadgeProps) {
  const sentimentClasses = {
    love: "bg-neo-lime text-neo-black border-neo-black shadow-[2px_2px_0_0_#000]",
    comfort: "bg-neo-yellow text-neo-black border-neo-black shadow-[2px_2px_0_0_#000]",
    veto: "bg-neo-pink text-white border-neo-black shadow-[2px_2px_0_0_#000]",
    neutral: "bg-neo-bg-alt text-neo-black border-neo-black shadow-[1px_1px_0_0_#000]",
  };

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[10px] font-heading font-black uppercase border-2 tracking-wide select-none rotate-[0.5deg]",
        sentimentClasses[sentiment],
        className
      )}
    >
      {sentiment === "love" && "❤️ "}
      {sentiment === "veto" && "🚫 "}
      {tag}
    </span>
  );
}
