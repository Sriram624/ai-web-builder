import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    const groq = new Groq({ apiKey });
    const { prompt } = await req.json();

    const SYSTEM_PROMPT = `
    You are an expert UI/UX Designer. Generate a JSON website structure based on the user's request.

    CRITICAL RULES:
    1. **Visuals:** Use distinct, professional Tailwind colors. Do NOT just use white/black.
       - For dark themes, use 'bg-slate-900', 'bg-zinc-900', or 'bg-indigo-950'.
       - For light themes, use 'bg-white', 'bg-blue-50', or 'bg-slate-50'.
       - Buttons should have strong contrast (e.g., 'bg-blue-600', 'bg-emerald-600').
    2. **Content:** Do NOT use generic text like "My Brand" or "Lorem Ipsum". Write real, engaging marketing copy.
    3. **Navigation:** Generate 4-5 specific navigation links relevant to the site (e.g. "Menu", "Reservations" for a restaurant).

    JSON Structure:
    {
      "theme": "light" | "dark",
      "sections": [
        {
          "id": "nav_1",
          "type": "Navbar",
          "content": {
             "title": "Brand Name",
             "items": [ { "title": "Link 1" }, { "title": "Link 2" } ]
          },
          "styles": { "backgroundColor": "...", "textColor": "..." }
        },
        {
          "id": "hero_1",
          "type": "Hero",
          "content": { "title": "...", "subtitle": "...", "primaryAction": "..." },
          "styles": { "backgroundColor": "...", "textColor": "..." }
        },
        {
          "id": "feat_1",
          "type": "Features",
          "content": {
             "title": "...",
             "items": [ { "title": "...", "description": "..." } ]
          },
          "styles": { "backgroundColor": "...", "textColor": "..." }
        },
        {
          "id": "footer_1",
          "type": "Footer",
          "content": { "title": "...", "subtitle": "..." },
          "styles": { "backgroundColor": "...", "textColor": "..." }
        }
      ]
    }
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a website for: ${prompt}` },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response");

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}