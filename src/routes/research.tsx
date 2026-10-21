import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Search, AlertTriangle } from "lucide-react";
import { generateAI, researchPrompt, type ResearchMode } from "@/lib/ai";
import { Button, Disclaimer, ErrorBox, Label, Loading, PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Quill" },
      { name: "description", content: "Summarise topics, articles and URLs into key points, insights and recommendations." },
      { property: "og:title", content: "AI Research Assistant — Quill" },
      { property: "og:description", content: "Summarise topics, articles and URLs into key points, insights and recommendations." },
    ],
  }),
  component: ResearchPage,
});

const modes: { id: ResearchMode; label: string; placeholder: string }[] = [
  { id: "topic", label: "Topic", placeholder: "e.g. Benefits of a four-day work week" },
  { id: "article", label: "Paste article", placeholder: "Paste the full article text here…" },
  { id: "url", label: "Website URL", placeholder: "https://example.com/article" },
];

const NOT_ACCESSIBLE = "URL CONTENT NOT ACCESSIBLE:";

function ResearchPage() {
  const [mode, setMode] = useState<ResearchMode>("topic");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = modes.find((m) => m.id === mode)!;
  const urlInvalid = mode === "url" && input.trim() !== "" && !/^https?:\/\/\S+\.\S+/.test(input.trim());
  const urlBlocked = output.trim().startsWith(NOT_ACCESSIBLE);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const p = researchPrompt(mode, input.trim());
      setOutput(await generateAI(p.system, [{ role: "user", content: p.user }]));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="AI Research Assistant" description="Turn topics, articles or web pages into clear, actionable notes." />
      <div className="card-surface space-y-4 p-6">
        <div className="inline-flex rounded-lg bg-muted p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${mode === m.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div>
          <Label>{current.label}</Label>
          {mode === "article" ? (
            <textarea className="field min-h-48" placeholder={current.placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
          ) : (
            <input className="field" placeholder={current.placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
          )}
          {urlInvalid && <p className="mt-1.5 text-xs text-destructive">Please enter a full URL starting with http:// or https://</p>}
          {mode === "url" && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Some sites block automated access. If the page can't be read, you'll see a clear notice — then paste the text instead.
            </p>
          )}
        </div>
        <Button onClick={run} disabled={!input.trim() || urlInvalid || loading}>
          <Search className="h-4 w-4" /> Analyse
        </Button>
      </div>

      <div className="card-surface mt-6 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Findings</h3>
          <Button variant="ghost" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
        {loading && <Loading label="Analysing content…" />}
        {error && <ErrorBox message={error} />}
        {urlBlocked && (
          <div className="mb-3 flex gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" /> The URL's content could not be accessed. The notes below are not based on that page.
          </div>
        )}
        <textarea
          className="field min-h-72 leading-relaxed"
          placeholder="Summary, key points, insights and recommendations will appear here. You can edit them."
          value={output}
          onChange={(e) => setOutput(e.target.value)}
        />
      </div>
      <Disclaimer />
    </div>
  );
}
