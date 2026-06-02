import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t-4 border-neo-black bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-neo-black p-2">
            <Zap className="text-neo-lime w-5 h-5" />
          </div>
          <span className="font-heading font-black text-lg uppercase tracking-tighter">MATCH_TECH</span>
        </div>
        <p className="font-mono text-xs font-bold text-center md:text-right">
          Feito com ☕ por Tony Max & Squad • Hackathon Tech Floripa 2026
        </p>
      </div>
    </footer>
  );
}
