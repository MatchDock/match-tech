import { UserRound } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLoaderData } from "react-router-dom";

import { ShareProfileButton } from "../components/ShareProfileButton";

import type { PublicMember } from "@/domain/entities/Member";

export default function PublicProfilePage() {
  const profile = useLoaderData() as PublicMember;

  const loveTags = profile.tags?.filter((t) => t.sentiment === "love") ?? [];
  const okTags = profile.tags?.filter((t) => t.sentiment === "ok") ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-neo-bg flex flex-col items-center py-16 px-6"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Profile card */}
        <div className="bg-white border-[4px] border-neo-black shadow-[8px_8px_0_0_#000]">
          {/* Header */}
          <div className="bg-neo-black p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-[3px] border-neo-lime bg-neo-bg flex items-center justify-center shrink-0 overflow-hidden">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserRound className="w-10 h-10 text-neo-black" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-black text-3xl text-white uppercase tracking-tighter truncate">
                {profile.displayName}
              </h1>
              <p className="font-bold text-neo-lime uppercase tracking-wider text-sm mt-1">
                {profile.role}
              </p>
              {profile.secondaryRoles.length > 0 && (
                <p className="text-white/50 text-xs font-mono mt-1 truncate">
                  {profile.secondaryRoles.join(" · ")}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="px-8 pt-6 pb-4 border-b-[3px] border-neo-black">
              <p className="font-bold text-neo-black/80 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Tags */}
          {(loveTags.length > 0 || okTags.length > 0) && (
            <div className="px-8 py-6 space-y-4">
              {loveTags.length > 0 && (
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-widest text-neo-black/50 mb-3">
                    ❤ Interesses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {loveTags.map((tag) => (
                      <span
                        key={tag.name}
                        className="px-3 py-1 bg-neo-black text-neo-lime text-xs font-black uppercase border-2 border-neo-black"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {okTags.length > 0 && (
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-widest text-neo-black/50 mb-3">
                    ✓ Confortável com
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {okTags.map((tag) => (
                      <span
                        key={tag.name}
                        className="px-3 py-1 bg-neo-bg text-neo-black text-xs font-black uppercase border-2 border-neo-black"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/onboarding"
            className="flex-1 py-4 text-center bg-neo-lime text-neo-black font-heading font-bold uppercase border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#000] active:translate-y-[1px] active:shadow-none transition-all"
          >
            ENTRAR PARA CONECTAR →
          </Link>
          <ShareProfileButton profile={profile} />
        </div>

        <p className="text-center font-mono text-xs text-neo-black/40 uppercase tracking-widest">
          matchtech-sooty.vercel.app · Tech Floripa 2026
        </p>
      </div>
    </motion.div>
  );
}
