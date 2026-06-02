import { cn } from "../../lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "lime" | "pink" | "yellow" | "cyan" | "white";
  padding?: "none" | "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-neo-bg-alt",
    white: "bg-white",
    lime: "bg-neo-lime",
    pink: "bg-neo-pink text-white",
    yellow: "bg-neo-yellow",
    cyan: "bg-neo-cyan",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  };

  return (
    <div
      className={cn(
        "neo-border neo-shadow overflow-hidden",
        variants[variant],
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
