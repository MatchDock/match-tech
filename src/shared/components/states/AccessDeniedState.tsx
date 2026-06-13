import { FileWarning } from "lucide-react";

interface AccessDeniedStateProps {
  message: string;
}

export function AccessDeniedState({ message }: AccessDeniedStateProps) {
  return (
    <div className="text-center p-16 bg-white neo-border border-[6px] shadow-[12px_12px_0_0_#FF2E93]">
      <div className="w-24 h-24 bg-neo-pink neo-border rotate-12 flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0_0_#000]">
        <FileWarning className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-heading text-neo-black uppercase mb-4 tracking-tighter">
        ACESSO NEGADO
      </h2>
      <p className="font-bold text-xl text-gray-700 bg-neo-bg inline-block px-6 py-4 neo-border">
        {message}
      </p>
    </div>
  );
}
