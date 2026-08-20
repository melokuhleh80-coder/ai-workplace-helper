import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, Mail, NotebookText, MessageCircle, Menu, X } from "lucide-react";

const navSections = [
  {
    label: "Dashboard",
    items: [{ to: "/", label: "Overview", icon: LayoutGrid }],
  },
  {
    label: "Tools",
    items: [
      { to: "/email", label: "Email Generator", icon: Mail },
      { to: "/notes", label: "Notes Summarizer", icon: NotebookText },
      { to: "/chat", label: "Chat Assistant", icon: MessageCircle },
    ],
  },
] as const;

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[9px] bg-[linear-gradient(135deg,var(--accent),var(--teal))] font-display font-extrabold text-accent-foreground ${className}`}
    >
      AI
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-35 bg-[rgba(15,16,35,0.45)] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar px-4 py-[22px] text-sidebar-foreground transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-[18px] flex items-center gap-2.5 border-b border-white/10 px-2.5 pt-1.5 pb-[22px]">
          <BrandMark className="h-[34px] w-[34px] text-[15px]" />
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] leading-tight font-bold text-sidebar-foreground-active">
              Workplace Assistant
            </div>
            <div className="font-mono text-[10px] tracking-[0.6px] text-faint uppercase">
              Capaciti Accelerator
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {navSections.map((section, i) => (
          <div key={section.label} className={i > 0 ? "mt-[18px]" : undefined}>
            <div className="mb-2 px-2.5 font-mono text-[10px] tracking-[1.2px] text-faint uppercase">
              {section.label}
            </div>
            <nav className="flex flex-col gap-[3px]">
              {section.items.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: to === "/" }}
                  className="flex items-center gap-[11px] rounded-sm px-3 py-2.5 text-[13.8px] font-medium transition-colors hover:bg-white/5 hover:text-sidebar-foreground-active"
                  activeProps={{
                    className:
                      "bg-sidebar-alt text-sidebar-foreground-active shadow-[inset_3px_0_0_var(--accent)]",
                  }}
                >
                  <Icon className="h-[17px] w-[17px] shrink-0 opacity-85" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}

        <div className="mt-auto border-t border-white/10 px-3 pt-3.5 pb-1 text-xs text-faint">
          Built by <b className="text-sidebar-foreground">M. M. Hadebe</b>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-[264px]">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface px-4 py-3.5 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-surface"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <BrandMark className="h-7 w-7 text-xs" />
          <div className="font-display text-[14.5px] font-bold">Workplace Assistant</div>
        </div>

        <main className="w-full max-w-[980px] px-5 pt-8 pb-15 sm:px-9">{children}</main>
      </div>
    </div>
  );
}
