import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpenText, MessagesSquare, Menu, X, Feather } from "lucide-react";
import { useState, type ReactNode } from "react";
import { isAIConfigured } from "@/lib/ai";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpenText },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => n.to === path)?.label ?? "Workspace";

  return (
    <div className="flex min-h-screen w-full">
      {open && (
        <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-[var(--shadow-glow)]">
              <Feather className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">Quill</p>
              <p className="text-xs text-sidebar-muted">Workplace Assistant</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"}`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl bg-sidebar-accent/60 p-4 text-xs text-sidebar-muted">
          Nothing you type is saved. Refreshing the page clears your work.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold sm:text-base">{current}</h1>
          <span
            className={`ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isAIConfigured() ? "bg-accent text-accent-foreground" : "bg-warning-soft text-warning"}`}
          >
            <span className={`h-2 w-2 rounded-full ${isAIConfigured() ? "bg-primary" : "bg-warning"}`} />
            {isAIConfigured() ? "AI connected" : "AI not connected"}
          </span>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
