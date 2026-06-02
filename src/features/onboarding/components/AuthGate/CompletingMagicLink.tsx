import { Terminal } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";

export function CompletingMagicLink() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neo-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[24px_24px]" />
      <Card
        variant="white"
        padding="none"
        className="max-w-md w-full border-8 border-neo-black overflow-hidden shadow-[20px_20px_0_0_#000] relative z-10"
      >
        <div className="bg-neo-black p-8 text-center space-y-6">
          <div className="bg-neo-lime text-neo-black p-6 inline-block rounded-full neo-border border-4 animate-pulse">
            <Terminal className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tighter leading-none">
            VALIDANDO LINK_
          </h1>
        </div>

        <div className="p-10 text-center space-y-6 bg-white">
          <div className="flex justify-center gap-4">
            <div className="w-3 h-3 bg-neo-lime animate-bounce [animation-delay:-0.3s]" />
            <div className="w-3 h-3 bg-neo-pink animate-bounce [animation-delay:-0.15s]" />
            <div className="w-3 h-3 bg-neo-cyan animate-bounce" />
          </div>
          <p className="font-black uppercase text-sm text-neo-black/70">
            Completando seu login via Magic Link...
          </p>
          <div className="font-mono text-[9px] opacity-40 uppercase tracking-widest">
            Decifrando credenciais criptografadas...
          </div>
        </div>
      </Card>
    </div>
  );
}
