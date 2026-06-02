import { cn } from "../../lib/utils/cn";

interface StatusBadgeProps {
  status: "looking" | "open" | "complete";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    looking: {
      text: "BUSCANDO EQUIPE",
      dotColor: "bg-neo-lime",
      bgColor: "bg-white",
      borderColor: "border-neo-black",
      textColor: "text-neo-black",
      pulse: true,
    },
    open: {
      text: "ABERTO A PROPOSTAS",
      dotColor: "bg-neo-yellow",
      bgColor: "bg-white",
      borderColor: "border-neo-black",
      textColor: "text-neo-black",
      pulse: false,
    },
    complete: {
      text: "EQUIPE FORMADA",
      dotColor: "bg-neo-bg-alt",
      bgColor: "bg-neo-bg-alt",
      borderColor: "border-neo-black",
      textColor: "text-neo-black/60",
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig.looking;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 border-2 font-heading font-black text-xs uppercase select-none shadow-[2px_2px_0_0_#000]",
        config.bgColor,
        config.borderColor,
        config.textColor,
        className,
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {config.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.dotColor,
            )}
          ></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", config.dotColor)}></span>
      </span>
      <span className="leading-none tracking-wider">{config.text}</span>
    </div>
  );
}
