import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-[26px]">
      <span className="eyebrow mb-1.5 block text-accent">{eyebrow}</span>
      <h1 className="mb-1.5 text-[23px] font-bold">{title}</h1>
      {children ? (
        <p className="max-w-[600px] text-sm leading-relaxed text-muted-foreground">{children}</p>
      ) : null}
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-border bg-surface p-6 shadow-panel ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="field-label mb-[7px] block text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-sm border border-border bg-background px-[13px] py-[11px] text-sm text-foreground transition-colors placeholder:text-faint focus:border-accent focus:ring-3 focus:ring-accent-soft focus:outline-none";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const base =
    "inline-flex items-center gap-2 rounded-sm px-5 py-[11px] text-[13.5px] font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
      : "border border-border bg-surface text-muted-foreground hover:bg-background hover:text-foreground";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/35 border-t-white" />
  );
}

export function ErrorBox({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mt-4 rounded-sm border border-destructive bg-destructive-soft px-3.5 py-3 text-[13px] text-destructive-foreground">
      {message}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[22px] flex items-start gap-2.5 rounded-sm border border-border bg-surface px-4 py-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
      <span>{children}</span>
    </div>
  );
}

export function OutputLabel({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between font-mono text-[10.5px] tracking-[0.8px] text-faint uppercase">
      <span>{children}</span>
      {action}
    </div>
  );
}
