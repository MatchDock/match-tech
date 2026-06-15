import { motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

interface Props {
  magicLinkEmail: string;
  sendMagicLink: (email: string) => Promise<void>;
  resetMagicLinkState: () => void;
}

export function MagicLinkSentScreen({ magicLinkEmail, sendMagicLink, resetMagicLinkState }: Props) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!magicLinkEmail) return;
    setLoading(true);
    try {
      await sendMagicLink(magicLinkEmail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neo-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[24px_24px]" />
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
        <div className="bg-neo-lime p-8 text-center space-y-4 border-b-4 border-neo-black">
          <div className="bg-white text-neo-black p-5 inline-block rounded-full neo-border border-4">
            <span className="text-5xl">📧</span>
          </div>
          <h1 className="text-3xl font-heading text-neo-black uppercase tracking-tighter leading-none">
            LINK ENVIADO_
          </h1>
        </div>

        <div className="p-8 text-center space-y-6 bg-white">
          <p className="font-bold text-base">Mandamos um link mágico para:</p>

          <div className="bg-neo-bg neo-border p-4 font-mono text-sm font-bold break-all">
            {magicLinkEmail}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-neo-black/70 font-bold">
              Abra seu email e clique no link para entrar.
            </p>
            <div className="bg-neo-pink/10 text-neo-black border-[3px] border-neo-black p-4 text-left space-y-1.5 shadow-[3px_3px_0_0_#000] -rotate-1">
              <p className="font-heading font-black text-xs uppercase text-neo-pink flex items-center gap-1">
                ⚠️ ATENÇÃO: VERIFIQUE O SPAM!
              </p>
              <p className="text-xs font-bold leading-normal">
                Como o link é enviado de forma automática, a mensagem pode ir direto para o seu{" "}
                <span className="bg-neo-pink text-white px-1 font-black">
                  SPAM ou Lixo Eletrônico
                </span>
                . Se não chegar em 1 minuto, procure lá!
              </p>
            </div>
          </div>

          <div className="border-t-[3px] border-neo-black pt-6 space-y-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "REENVIANDO..." : "REENVIAR LINK"}
            </Button>
            <button
              onClick={resetMagicLinkState}
              className="text-neo-pink font-heading font-bold text-sm uppercase underline underline-offset-4 hover:text-neo-black transition-colors"
            >
              ← VOLTAR E USAR OUTRO MÉTODO
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
