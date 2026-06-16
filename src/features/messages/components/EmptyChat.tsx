import { MessageSquare, Zap } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 bg-neo-bg/30">
      {/* Icon block */}
      <div className="relative">
        <div className="bg-white border-4 border-neo-black p-8 shadow-[8px_8px_0_0_#000] rotate-[-2deg]">
          <MessageSquare className="w-14 h-14 text-neo-black/20" />
        </div>
        <div className="absolute -top-3 -right-3 bg-neo-lime border-[3px] border-neo-black p-1.5 shadow-[3px_3px_0_0_#000] rotate-6">
          <Zap className="w-4 h-4 text-neo-black" />
        </div>
      </div>

      <div className="text-center max-w-xs">
        <h3 className="font-heading font-black text-2xl uppercase tracking-tighter text-neo-black mb-2">
          Selecione uma conversa
        </h3>
        <p className="font-mono text-xs text-neo-black/50 leading-relaxed">
          Escolha uma conversa à esquerda para ver o histórico, ou vá para{" "}
          <a
            href="/discover"
            className="font-bold underline decoration-neo-lime hover:text-neo-pink transition-colors"
          >
            Descobrir
          </a>{" "}
          para iniciar uma nova.
        </p>
      </div>

      {/* Decorative tag */}
      <div className="bg-neo-black text-neo-lime font-mono text-[9px] px-3 py-1.5 tracking-widest border-2 border-neo-black">
        SISTEMA DE COMUNICAÇÃO MATCH_TECH © 2026
      </div>
    </div>
  );
}
