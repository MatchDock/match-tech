interface GuildHeaderProps {
  totalMembers: number;
}

export function GuildHeader({ totalMembers }: GuildHeaderProps) {
  return (
    <div className="mb-12 border-b-[6px] border-neo-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h1 className="text-5xl md:text-7xl font-heading mb-4 text-neo-black uppercase tracking-tighter">
          A Guilda_
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xl font-bold bg-white inline-block px-4 py-2 neo-border">
            Esquadrão Operacional Tech Floripa '26
          </p>
          <div className="bg-neo-black text-white px-4 py-2 text-sm font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-neo-lime rounded-full animate-pulse"></span>
            <span>STATUS: PRONTO PARA COMBATE</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="bg-neo-black text-neo-lime neo-border shadow-[4px_4px_0_0_#B8FF29] px-6 py-4 font-heading text-3xl flex items-center justify-between w-full md:w-auto min-w-[200px]">
          <span>OPERADORES</span>
          <span>[{totalMembers}]</span>
        </div>
      </div>
    </div>
  );
}
