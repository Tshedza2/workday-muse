import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Feather } from "lucide-react";
import { generateAI, CHAT_SYSTEM, type ChatMessage } from "@/lib/ai";
import { Button, Disclaimer, ErrorBox, Loading, PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Quill" },
      { name: "description", content: "Chat with a workplace assistant for brainstorming, writing and problem-solving." },
      { property: "og:title", content: "AI Chatbot — Quill" },
      { property: "og:description", content: "Chat with a workplace assistant for brainstorming, writing and problem-solving." },
    ],
  }),
  component: ChatPage,
});

const starters = [
  "Brainstorm 5 ideas for a team-building event",
  "Explain OKRs in simple terms",
  "Help me prepare for a difficult conversation with a colleague",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const reply = await generateAI(CHAT_SYSTEM, next); // full history = conversation context
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="AI Chatbot" description="Your workplace thinking partner. Context is kept for this conversation only." />
        <Button variant="ghost" onClick={() => { setMessages([]); setError(""); }} disabled={!messages.length}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>

      <div className="card-surface flex h-[60vh] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <Feather className="h-6 w-6" />
                </div>
                <p className="mt-3 font-semibold">How can I help today?</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {starters.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1.5 text-xs hover:bg-accent">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <Loading label="Thinking…" />}
          {error && <ErrorBox message={error} />}
          <div ref={endRef} />
        </div>
        <form
          className="flex gap-2 border-t p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            className="field max-h-32 min-h-11 resize-none"
            rows={1}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <Button type="submit" disabled={!input.trim() || loading} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <Disclaimer />
    </div>
  );
}
