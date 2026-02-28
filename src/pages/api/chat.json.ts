// src/pages/api/chat.json.ts
import type { APIRoute } from "astro";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

const SYSTEM_PROMPT = (
  instrumentName?: string,
  instrumentOrigin?: string,
  pageContext?: string
) => {
  const contextLines: string[] = [];

  if (instrumentName) {
    contextLines.push(`The visitor is currently viewing the page for the "${instrumentName}".`);
  }
  if (instrumentOrigin) {
    contextLines.push(`This instrument originates from: ${instrumentOrigin}.`);
  }
  if (pageContext) {
    contextLines.push(`Page context: ${pageContext}`);
  }

  const contextBlock =
    contextLines.length > 0
      ? `\n\nCURRENT PAGE CONTEXT:\n${contextLines.join("\n")}\n\nUse this context to give more specific, relevant answers when appropriate. Do not mention that you were given this context — just use it naturally.`
      : "";

  return `You are an educational assistant embedded on soundbeyondborders.com, the website of Hunter Eastland — a world and folk multi-instrumentalist who performs as Tradscendence in Richmond, VA.

Your ONLY purpose is to answer questions about:
- World and folk musical instruments (origins, history, construction, playing technique, cultural context)
- Ethnomusicology and organology
- The cultural history, geography, and traditions connected to instruments
- Musical genres and styles associated with these instruments (e.g. maqam, raga, Turkish folk, Armenian folk, Hindustani classical, etc.)
- The emotional qualities, moods, and sonic character of instruments
- How instruments relate to one another across cultures

You may briefly mention Hunter Eastland / Tradscendence if directly relevant (e.g. if asked who plays this instrument on this site).

STRICTLY DO NOT:
- Answer questions about unrelated topics (politics, current events, general science, entertainment, etc.)
- Provide booking quotes, pricing, or scheduling information (direct those questions to the contact page)
- Discuss anything outside world/folk music education

If a question falls outside your scope, respond warmly and redirect: "That's a bit outside my area — I'm here to talk about world instruments, their history, and the music they carry. Is there something along those lines I can help with?"

Keep responses warm, curious, and educational — matching the tone of a knowledgeable musician who loves sharing the stories behind their instruments. Responses should be concise (2–5 sentences typically) unless a topic genuinely warrants more depth. Use plain text, no markdown formatting.${contextBlock}`;
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(415, { error: "Content-Type must be application/json" });
  }

  let body: {
    message?: string;
    history?: { role: "user" | "model"; text: string }[];
    instrumentName?: string;
    instrumentOrigin?: string;
    pageContext?: string;
  };

  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { message, history = [], instrumentName, instrumentOrigin, pageContext } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return json(400, { error: "message is required" });
  }

  if (message.trim().length > 500) {
    return json(400, { error: "Message too long (max 500 characters)" });
  }

  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set");
    return json(500, { error: "Chat service unavailable" });
  }

  // Build Gemini contents array from history + new message
  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    {
      role: "user",
      parts: [{ text: message.trim() }],
    },
  ];

  const geminiBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT(instrumentName, instrumentOrigin, pageContext) }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7,
    },
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);

      if (res.status === 429) {
        return json(429, { error: "Too many requests — please wait a moment and try again." });
      }
      return json(502, { error: "Chat service temporarily unavailable" });
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!reply) {
      return json(502, { error: "No response from chat service" });
    }

    return json(200, { reply });
  } catch (err) {
    console.error("Gemini fetch error:", err);
    return json(502, { error: "Chat service temporarily unavailable" });
  }
};