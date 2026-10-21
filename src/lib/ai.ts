/**
 * AI integration point. Every tool calls `generateAI()`, which runs a server
 * function (src/lib/ai.functions.ts) that talks to Lovable AI. The secret key
 * stays on the server — never in this browser code.
 */
import { generateAIServer } from "./ai.functions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const isAIConfigured = () => true;

export async function generateAI(system: string, messages: ChatMessage[]): Promise<string> {
  let res: { text: string; error?: string };
  try {
    res = await generateAIServer({ data: { system, messages } });
  } catch {
    throw new Error("Could not reach the AI service. Check your connection and try again.");
  }
  if (res.error) throw new Error(res.error);
  return res.text;
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
