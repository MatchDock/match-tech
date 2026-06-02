import { useState } from "react";
import { Card } from "@/src/shared/components/ui/Card";

interface Props {
  confirmMagicLinkEmail: (email: string) => Promise<void>;
  resetMagicLinkState: () => void;
}

export function MagicLinkConfirmScreen({ confirmMagicLinkEmail, resetMagicLinkState }: Props) {
  const [magicEmail, setMagicEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await confirmMagicLinkEmail(magicEmail.trim());
    } catch {
      setError("Email inválido ou link expirado. Solicite um novo link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neo-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[24px_24px]" />
      <Card
        variant="white"
        padding="none"
        className="max-w-md w-full border-8 border-neo-black overflow-hidden shadow-[20px_20px_0_0_#000] relative z-10"
      >
        <div className="bg-neo-cyan p-8 text-center space-y-4 border-b-4 border-neo-black">
          <div className="bg-white text-neo-black p-5 inline-block rounded-full neo-border border-4">
            <span className="text-5xl">📱</span>
          </div>
          <h1 className="text-3xl font-heading text-neo-black uppercase tracking-tighter leading-none">
            NOVO DISPOSITIVO_
          </h1>
        </div>

        <div className="p-8 space-y-5 bg-white">
          <p className="font-bold text-sm text-neo-black/70">
            Parece que você abriu o link em um dispositivo diferente. Para sua segurança,
            confirme seu email para concluir o login.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={magicEmail}
              onChange={(e) => { setMagicEmail(e.target.value); setError(null); }}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-neo-bg font-mono font-bold text-sm border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#00E5FF] focus:outline-none transition-shadow"
              autoFocus
            />
            {error && (
              <p className="text-neo-pink font-bold text-xs uppercase">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !magicEmail.trim()}
              className="w-full py-3 font-heading font-bold uppercase bg-neo-cyan text-neo-black border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "VERIFICANDO..." : "CONFIRMAR E ENTRAR →"}
            </button>
          </form>

          <button
            onClick={resetMagicLinkState}
            className="text-neo-pink font-heading font-bold text-sm uppercase underline underline-offset-4 hover:text-neo-black transition-colors w-full text-center"
          >
            ← SOLICITAR NOVO LINK
          </button>
        </div>
      </Card>
    </div>
  );
}
