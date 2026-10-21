import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };

/** Server-only AI call through Lovable AI. The key never reaches the browser. */
export const generateAIServer = createServerFn({ method: "POST" })
  .inputValidator((input: { system: string; messages: Msg[] }) => {
    if (typeof input?.system !== "string" || !Array.isArray(input.messages)) throw new Error("Invalid input");
    const messages = input.messages
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-30)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 20000) }));
    return { system: input.system.slice(0, 4000), messages };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { text: "", error: "AI is not configured on the server." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const openai = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    let failure: unknown;
    try {
      const result = streamText({
        model: openai.responses("openai/gpt-6-astra"),
        system: data.system,
        messages: data.messages,
        maxRetries: 0,
        onError: ({ error }) => {
          failure = error;
        },
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      if (failure) throw failure;
      if (!text.trim()) return { text: "", error: "The AI returned an empty response." };
      return { text };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      console.error("AI request failed", status, e);
      if (status === 429) return { text: "", error: "Too many requests. Please wait a moment and try again." };
      if (status === 402) return { text: "", error: "AI credits have run out. Add credits in your Lovable workspace to continue." };
      if (status === 403) return { text: "", error: "AI access is blocked for this workspace (usage limit or permissions)." };
      return { text: "", error: "The AI service had a problem. Please try again." };
    }
  });
