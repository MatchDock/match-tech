import React from "react";
import { cn } from "../../lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent-lime" | "accent-pink" | "accent-cyan" | "accent-yellow";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-neo-black text-white neo-shadow-hover hover:text-neo-lime",
      secondary: "bg-white text-neo-black neo-shadow-hover",
      "accent-lime": "bg-neo-lime text-neo-black neo-shadow-hover",
      "accent-pink": "bg-neo-pink text-white neo-shadow-hover",
      "accent-cyan": "bg-neo-cyan text-neo-black neo-shadow-hover",
      "accent-yellow": "bg-neo-yellow text-neo-black neo-shadow-hover",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-12 py-6 text-2xl font-bold tracking-tight",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "neo-border font-heading font-bold uppercase transition-all duration-200 outline-none focus:ring-4 focus:ring-neo-black focus:ring-opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
