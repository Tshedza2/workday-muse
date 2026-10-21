/**
 * AI integration point.
 *
 * This app is frontend-only, so it has NO AI built in. Every tool calls
 * `generateAI()`, which sends a request to the URL in VITE_AI_ENDPOINT.
 * Until you set that variable, the app shows a clear "AI not connected" message
 * instead of fake answers.
 *
 * Expected endpoint contract (you build this service yourself):
 *   POST { system: string, messages: {role:"user"|"assistant", content:string}[] }
 *   -> 200 { text: string }
 * Never put a secret AI key in frontend code — keep it inside your endpoint.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export class AINotConfiguredError extends Error {
  constructor() {
    super(
      "AI is not connected yet. This is a frontend-only app — set VITE_AI_ENDPOINT to your own AI service URL to enable live generation.",
    );
  }
}

export const AI_ENDPOINT: string | undefined = import.meta.env["VITE_AI_ENDPOINT"];
export const isAIConfigured = () => Boolean(AI_ENDPOINT);

export async function generateAI(system: string, messages: ChatMessage[]): Promise<string> {
  if (!AI_ENDPOINT) throw new AINotConfiguredError();
  let res: Response;
  try {
    res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages }),
    });
  } catch {
    throw new Error("Could not reach the AI service. Check your connection and the endpoint URL.");
  }
  if (res.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
  if (!res.ok) throw new Error(`The AI service returned an error (${res.status}).`);
  const data = (await res.json().catch(() => null)) as { text?: string } | null;
  if (!data?.text) throw new Error("The AI service returned an empty response.");
  return data.text;
}

/* ---------- Structured prompts for each tool ---------- */

export type Tone = "Formal" | "Friendly" | "Persuasive";

export function emailPrompt(i: { purpose: string; recipient: string; instructions: string; tone: Tone }) {
  return {
    system:
      "You are an expert business writer. Write one complete, ready-to-send email. Include a 'Subject:' line first, then greeting, body, and sign-off. Be specific to the details given; never use placeholder filler unless a detail is genuinely missing (then use [brackets]).",
    user: `Purpose: ${i.purpose}\nRecipient: ${i.recipient}\nTone: ${i.tone}\nInstructions/details:\n${i.instructions}`,
  };
}

export type ResearchMode = "topic" | "article" | "url";

export function researchPrompt(mode: ResearchMode, input: string) {
  const base =
    "You are a careful research analyst. Respond in Markdown with these sections: ## Summary, ## Key Points, ## Insights, ## Recommendations. Be specific and cite details from the provided content. If you are unsure, say so.";
  if (mode === "url")
    return {
      system:
        base +
        " The user gives a URL. If you cannot actually access the page's content, start your reply with 'URL CONTENT NOT ACCESSIBLE:' and explain, then offer only general guidance clearly labelled as not based on the page.",
      user: `URL: ${input}`,
    };
  if (mode === "article") return { system: base, user: `Analyse this article:\n\n${input}` };
  return { system: base, user: `Research topic: ${input}` };
}

export const CHAT_SYSTEM =
  "You are a helpful workplace productivity assistant. Help with brainstorming, writing, explanations, and workplace problem-solving. Use the conversation context. Be concise, practical, and ask a clarifying question when the request is ambiguous.";
