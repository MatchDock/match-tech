import { Zap } from "lucide-react";
import { AccessDeniedState as SharedAccessDeniedState } from "../../../shared/components/states/AccessDeniedState";

export function GuildAccessDeniedState() {
  return (
    <SharedAccessDeniedState message="Protocolo de segurança exige que você se cadastre no Onboarding primeiro." />
  );
}

export function GuildLoadingState() {
  return (
    <div className="text-center p-16 bg-white neo-border border-[6px] shadow-[12px_12px_0_0_#000]">
      <h2 className="text-4xl font-heading text-neo-black uppercase animate-pulse flex items-center justify-center gap-4">
        <Zap className="w-10 h-10 text-neo-yellow" /> AGUARDANDO OPERADORES...
      </h2>
    </div>
  );
}
