import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Sparkle, Check } from "lucide-react";
import { generateAI, emailPrompt, type Tone } from "@/lib/ai";
import { Button, Disclaimer, ErrorBox, Label, Loading, PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Quill" },
      { name: "description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
      { property: "og:title", content: "Smart Email Generator — Quill" },
      { property: "og:description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canGenerate = purpose.trim() && recipient.trim() && !loading;

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const p = emailPrompt({ purpose, recipient, instructions, tone });
      setOutput(await generateAI(p.system, [{ role: "user", content: p.user }]));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <PageHeader title="Smart Email Generator" description="Describe what you need — get a ready-to-edit email." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface space-y-4 p-6">
          <div>
            <Label>Purpose</Label>
            <input className="field" placeholder="e.g. Request a project deadline extension" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div>
            <Label>Recipient</Label>
            <input className="field" placeholder="e.g. My manager, Sarah" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div>
            <Label>Instructions & details</Label>
            <textarea className="field min-h-32" placeholder="Key points, dates, context…" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
          <div>
            <Label>Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${tone === t ? "border-primary bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generate} disabled={!canGenerate} className="w-full">
            <Sparkle className="h-4 w-4" /> Generate email
          </Button>
        </div>

        <div className="card-surface flex flex-col p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold">Your email</h3>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={generate} disabled={!canGenerate || !output}>
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button variant="ghost" onClick={copy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          {loading && <Loading label="Writing your email…" />}
          {error && <ErrorBox message={error} />}
          <textarea
            className="field mt-3 min-h-80 flex-1 leading-relaxed"
            placeholder="Your generated email will appear here. You can edit it freely."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
