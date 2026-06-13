import { Zap } from "lucide-react";

export function EmptyProfilesState() {
  return (
    <div className="text-center p-16 bg-white neo-border border-[6px] shadow-[12px_12px_0_0_#000] space-y-4">
      <Zap className="w-12 h-12 text-neo-yellow mx-auto animate-pulse" />
      <h2 className="text-3xl font-heading text-neo-black uppercase tracking-tighter">
        NENHUM OPERADOR COMPATÍVEL
      </h2>
      <p className="font-bold text-gray-500 max-w-md mx-auto">
        Tente ajustar seus filtros de busca para encontrar perfis correspondentes.
      </p>
    </div>
  );
}