import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({ eyebrow, title, description, align = "center", className }: SectionHeaderProps) => (
  <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
    {eyebrow && (
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-3">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-primary text-balance">{title}</h2>
    {description && (
      <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed text-balance">{description}</p>
    )}
  </div>
);
