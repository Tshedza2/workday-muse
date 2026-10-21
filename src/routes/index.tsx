import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpenText, MessagesSquare, ArrowRight, Plug } from "lucide-react";
import { isAIConfigured } from "@/lib/ai";
import { Disclaimer } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Quill AI Workplace Assistant" },
      { name: "description", content: "Write emails, summarise research and chat with an AI workplace assistant." },
      { property: "og:title", content: "Quill — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Write emails, summarise research and chat with an AI workplace assistant." },
    ],
  }),
  component: Index,
});

const tools = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft clear, on-tone emails in Formal, Friendly or Persuasive style.", icon: Mail },
  { to: "/research", title: "AI Research Assistant", desc: "Summarise topics, articles and web pages into key points and next steps.", icon: BookOpenText },
  { to: "/chat", title: "AI Chatbot", desc: "Brainstorm, write and solve workplace problems in a conversation.", icon: MessagesSquare },
] as const;

function Index() {
  return (
    <div>
      <section className="card-surface relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-soft" />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Your workday, lighter</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight">
            Get more done with three focused AI tools.
          </h2>
          <p className="mt-3 text-muted-foreground">Pick a tool from the sidebar or below to start.</p>
        </div>
      </section>

      {!isAIConfigured() && (
        <div className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-5 text-sm">
          <Plug className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="font-semibold text-warning">Live AI isn't connected</p>
            <p className="mt-1 text-foreground/80">
              This is a frontend-only app, so it can't safely hold an AI key. All tools are ready to use, but they
              will show a clear message instead of fake answers until an AI service URL is added
              (<code className="rounded bg-card px-1">VITE_AI_ENDPOINT</code>).
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="card-surface group flex flex-col p-6 transition hover:-translate-y-0.5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{t.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
