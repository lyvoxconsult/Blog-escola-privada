import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  showText?: boolean;
}

export const Logo = ({ className, variant = "default", showText = true }: LogoProps) => {
  const textColor = variant === "white" ? "text-primary-foreground" : "text-primary";

  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5 group", className)} aria-label="Lumina English Academy">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent shadow-soft transition-transform group-hover:scale-105">
        <svg viewBox="0 0 32 32" className="h-5 w-5 text-primary-foreground" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 7v18h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="16" cy="16" rx="11" ry="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display font-bold text-lg tracking-tight", textColor)}>Lumina</span>
          <span className={cn("text-[10px] font-medium uppercase tracking-[0.18em]", variant === "white" ? "text-primary-foreground/70" : "text-muted-foreground")}>English Academy</span>
        </span>
      )}
    </Link>
  );
};
