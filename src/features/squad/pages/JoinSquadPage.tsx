import { Users, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import type { Squad } from "@/domain/entities/Squad";
import { useRepositories } from "@/shared/context/RepositoryContext";

export default function JoinSquadPage() {
  const squad = useLoaderData() as Squad;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { squadRepo } = useRepositories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFull = squad.members.length >= squad.maxMembers;
  const alreadyMember = user ? squad.members.some((m) => m.uid === user.uid) : false;

  async function handleAccept() {
    if (!user) {
      // Save intent so LoginPage can redirect back after auth
      sessionStorage.setItem("pendingJoin", squad.id);
      navigate("/onboarding");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await squadRepo.addMemberToSquad(squad.id, user.uid);
      navigate("/guilda");
    } catch {
      setError("Não foi possível entrar no squad. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-neo-bg flex flex-col items-center py-16 px-6"
    >
      <div className="w-full max-w-lg space-y-8">
        {/* Invite badge */}
        <div className="text-center">
          <div className="inline-block bg-neo-pink text-white border-[3px] border-neo-black px-4 py-2 font-heading font-black uppercase text-sm shadow-[4px_4px_0_0_#000] rotate-[-1deg]">
            CONVITE DE SQUAD ⚡
          </div>
        </div>

        {/* Squad card */}
        <div className="bg-white border-[4px] border-neo-black shadow-[8px_8px_0_0_#000]">
          <div className="bg-neo-black p-8">
            <h1 className="font-heading font-black text-4xl text-neo-lime uppercase tracking-tighter">
              {squad.name}
            </h1>
            <p className="text-white/70 font-bold text-sm mt-2">{squad.description}</p>
          </div>

          <div className="p-6 border-b-[3px] border-neo-black">
            <div className="flex items-center gap-2 text-neo-black/70 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>
                {squad.members.length} / {squad.maxMembers} membros
              </span>
              {isFull && (
                <span className="ml-2 px-2 py-0.5 bg-neo-pink text-white text-xs font-black uppercase border border-neo-black">
                  CHEIO
                </span>
              )}
            </div>
          </div>

          {squad.members.length > 0 && (
            <div className="p-6">
              <p className="font-heading font-bold text-xs uppercase tracking-widest text-neo-black/50 mb-4">
                Membros atuais
              </p>
              <div className="space-y-3">
                {squad.members.map((member) => (
                  <div key={member.uid} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-neo-black bg-neo-bg flex items-center justify-center shrink-0 overflow-hidden">
                      {member.photoURL ? (
                        <img
                          src={member.photoURL}
                          alt={member.displayName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserRound className="w-5 h-5 text-neo-black" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neo-black">{member.displayName}</p>
                      <p className="text-neo-black/50 text-xs font-mono">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        {error && <p className="text-neo-pink font-bold text-sm uppercase text-center">{error}</p>}

        {alreadyMember ? (
          <p className="text-center font-bold text-neo-black/60 uppercase text-sm">
            Você já é membro deste squad.
          </p>
        ) : (
          <button
            onClick={() => void handleAccept()}
            disabled={isFull || loading}
            className="w-full py-4 bg-neo-lime text-neo-black font-heading font-bold uppercase border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#000] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[4px_4px_0_0_#000]"
          >
            {loading
              ? "ENTRANDO..."
              : isFull
                ? "SQUAD CHEIO"
                : user
                  ? "ACEITAR CONVITE →"
                  : "ENTRAR PARA ACEITAR →"}
          </button>
        )}

        {!user && !alreadyMember && (
          <p className="text-center text-neo-black/50 font-bold text-xs uppercase tracking-wide">
            Você será redirecionado para criar sua conta antes de entrar no squad.
          </p>
        )}
      </div>
    </motion.div>
  );
}
