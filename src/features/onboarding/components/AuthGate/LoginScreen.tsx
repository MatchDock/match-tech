import { ShieldCheck, Info } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

interface Props {
  signIn: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
}

export function LoginScreen({ signIn, sendMagicLink }: Props) {
  const [loading, setLoading] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = magicEmail.trim();
    if (!email) {
      setMagicLinkError("Digite seu email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMagicLinkError("Email inválido.");
      return;
    }

    setMagicLinkError(null);
    setMagicLinkLoading(true);
    try {
      await sendMagicLink(email);
    } catch (err) {
      setMagicLinkError(
        err instanceof Error ? err.message : "Erro ao enviar link. Tente novamente.",
      );
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neo-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[24px_24px]" />
      <motion.div
        animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-neo-pink/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neo-lime/20 rounded-full blur-3xl"
      />

      <Card
        variant="white"
        padding="none"
        className="max-w-md w-full border-8 border-neo-black overflow-hidden shadow-[20px_20px_0_0_#000] relative z-10"
      >
        {/* Header */}
        <div className="bg-neo-black p-8 text-center space-y-6">
          <div className="bg-neo-lime text-neo-black p-6 inline-block rounded-full neo-border border-4">
            <ShieldCheck className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-heading text-white uppercase tracking-tighter leading-none">
            ACESSO_RESTRITO
          </h1>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <p className="font-black uppercase text-sm leading-relaxed text-neo-black/70 text-center">
            O Protocolo de Segurança Tech Floripa exige autenticação de nível 1 antes do mapeamento
            de arsenal. Conecte sua identidade para prosseguir.
          </p>

          {/* Google */}
          <Button
            onClick={handleGoogleSignIn}
            variant="primary"
            size="xl"
            className="w-full text-lg"
            disabled={loading}
          >
            {loading ? "VALIDANDO..." : "AUTENTICAR VIA GOOGLE"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-0.75 bg-neo-black" />
            <span className="font-heading font-black text-sm uppercase text-neo-black/50">OU</span>
            <div className="flex-1 h-0.75 bg-neo-black" />
          </div>

          {/* Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <label className="font-heading font-bold text-xs uppercase tracking-wider text-neo-black/60 block">
              Login via Link Mágico
            </label>
            <input
              type="email"
              value={magicEmail}
              onChange={(e) => {
                setMagicEmail(e.target.value);
                setMagicLinkError(null);
              }}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-neo-bg font-mono font-bold text-sm border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#B8FF29] focus:outline-none transition-shadow placeholder:text-neo-black/30"
            />
            {magicLinkError && (
              <p className="text-neo-pink font-bold text-xs uppercase">{magicLinkError}</p>
            )}
            <Button
              type="submit"
              variant="accent-cyan"
              size="lg"
              className="w-full"
              disabled={magicLinkLoading}
            >
              {magicLinkLoading ? "ENVIANDO..." : "ENVIAR LINK MÁGICO ✉️"}
            </Button>
          </form>

          {/* Info box */}
          <div className="bg-neo-bg border-[3px] border-neo-black p-4 space-y-2 text-xs text-left shadow-[3px_3px_0_0_#000]">
            <h4 className="font-heading font-black uppercase text-neo-black flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5 text-neo-cyan" /> COMO FUNCIONA O ACESSO?
            </h4>
            <ul className="list-disc pl-4 space-y-1 font-bold text-neo-black/75">
              <li>
                <span className="text-neo-pink">Google:</span> Conexão instantânea de 1 clique.
              </li>
              <li>
                <span className="text-neo-cyan">Link Mágico:</span> Digite seu email, enviamos um
                link e você entra sem precisar lembrar de senhas.
              </li>
              <li className="text-neo-pink bg-neo-pink/10 px-1 py-0.5 rounded border border-neo-pink/20">
                ⚠️ <span className="underline">IMPORTANTE:</span> O link pode cair na pasta de{" "}
                <span className="underline">SPAM</span>. Verifique lá se atrasar!
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4 opacity-50 pt-1">
            <div className="w-2 h-2 bg-neo-black animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-neo-black animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-neo-black animate-bounce" />
          </div>
          <div className="font-mono text-[9px] opacity-40 uppercase tracking-widest text-center">
            Escolha seu protocolo de autenticação...
          </div>
        </div>
      </Card>
    </div>
  );
}
