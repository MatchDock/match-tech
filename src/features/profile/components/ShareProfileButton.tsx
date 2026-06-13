import { useRef } from "react";

import type { PublicMember } from "@/domain/entities/Member";

interface ShareProfileButtonProps {
  profile: PublicMember;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function ShareProfileButton({ profile }: ShareProfileButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background
    ctx.fillStyle = "#f5f5f0";
    ctx.fillRect(0, 0, 1200, 630);

    // Left accent bar
    ctx.fillStyle = "#B8FF29";
    ctx.fillRect(0, 0, 16, 630);

    // Black header strip
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(16, 0, 1184, 180);

    // Name
    ctx.font = "bold 64px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(profile.displayName, 60, 100, 700);

    // Role
    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = "#B8FF29";
    ctx.fillText(profile.role.toUpperCase(), 60, 148);

    // Secondary roles
    if (profile.secondaryRoles.length > 0) {
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(profile.secondaryRoles.slice(0, 2).join(" · "), 60, 175);
    }

    // Bio
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#374151";
    const bioWords = (profile.bio || "").split(" ");
    let line = "";
    let y = 240;
    for (const word of bioWords) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > 680 || y > 340) break;
      if (ctx.measureText(test).width > 680) {
        ctx.fillText(line, 60, y);
        line = word;
        y += 32;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, 60, y);

    // Tags section
    const loveTags = profile.tags?.filter((t) => t.sentiment === "love").slice(0, 4) ?? [];
    if (loveTags.length > 0) {
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("❤ INTERESSES", 60, 390);

      let tagX = 60;
      for (const tag of loveTags) {
        ctx.font = "bold 16px sans-serif";
        const tagW = ctx.measureText(tag.name).width + 24;
        drawRoundedRect(ctx, tagX, 402, tagW, 34, 4);
        ctx.fillStyle = "#0a0a0a";
        ctx.fill();
        ctx.fillStyle = "#B8FF29";
        ctx.fillText(tag.name, tagX + 12, 424);
        tagX += tagW + 10;
        if (tagX > 640) break;
      }
    }

    // Divider
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(60, 460, 580, 2);

    // Footer
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("matchtech-sooty.vercel.app", 60, 500);

    // Right side decorative block
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(780, 30, 360, 570);

    ctx.font = "bold 120px sans-serif";
    ctx.fillStyle = "#B8FF29";
    ctx.fillText("MT", 820, 220);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("MATCH_TECH", 820, 268);

    ctx.font = "14px monospace";
    ctx.fillStyle = "#374151";
    ctx.fillText("// conectando devs", 820, 320);

    // Download
    const link = document.createElement("a");
    link.download = `${profile.displayName.replace(/\s+/g, "-")}-match-tech.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />
      <button
        onClick={handleShare}
        className="px-6 py-3 bg-neo-black text-neo-lime font-heading font-bold uppercase border-[3px] border-neo-black shadow-[4px_4px_0_0_#B8FF29] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#B8FF29] active:translate-y-[1px] active:shadow-none transition-all"
      >
        COMPARTILHAR PERFIL ↗
      </button>
    </>
  );
}
