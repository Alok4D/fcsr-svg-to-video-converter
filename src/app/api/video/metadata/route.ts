import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { presetName, svgCode } = await request.json();

    const apiKey = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[API Error] No valid API keys found (GROK_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY are all missing).");
      return NextResponse.json(
        { error: "No configured AI API key (Grok, OpenAI, or Gemini) was found on the server." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Adobe Stock Video Metadata and Search Optimization Specialist.
Analyze the following details of an animated SVG template:
Preset Name: ${presetName || "Custom SVG"}
SVG Code Content:
${svgCode || ""}

Your task is to analyze the details carefully and generate accurate, commercially useful, highly searchable Adobe Stock metadata.
The goal is to generate the MOST ACCURATE, RELEVANT and SEARCHABLE metadata based ONLY on what is actually visible and clearly supported by the video.

STEP 1 — ANALYZE THE VISUALS
Identify:
1. Asset type: stock footage, animation, motion graphic, abstract animation, vector animation, background, overlay, icon/logo animation.
2. Motion characteristics and important visual elements (e.g., rotating, pulsing, flowing, looping).
3. Composition, background, and visual style (e.g., minimal, flat vector, neon, glowing).

STEP 2 — TITLE GENERATION
Generate ONE concise, factual, buyer-friendly title.
Maximum length: 70 characters.
- Put the main subject near the beginning.
- Describe the visual movement, colors, and subject of the animation.
- Do NOT use generic adjectives like "amazing", "beautiful", "stunning", "masterpiece".
- Avoid brands, trademarks, or unsupported concepts.

STEP 3 — KEYWORD GENERATION
Generate exactly 40 unique, highly relevant keywords separated by commas.
Rank keywords from MOST IMPORTANT to LEAST IMPORTANT. The first 10 keywords are the highest priority.
Tiers to include:
- Primary search terms (subject, action).
- Specific visual characteristics (colors, shapes, objects, lighting).
- Motion and animation terms (rotating, flowing, glowing, looping, seamless loop).
- Background and composition (isolated, minimal, black background, white background).
- Style and visual category (motion graphics, vector animation, abstract animation, neon).
- Conceptual keywords (technology, loading, energy) only when strongly supported.

Do not use "loop" or "seamless loop" unless the SVG code shows looping animations.
Do not use "transparent background" or "alpha channel" unless the SVG background is transparent.

You MUST respond with a single valid JSON object containing exactly these two keys: "title" and "keywords".
Example JSON Response:
{
  "title": "Abstract Cyberpunk Grid Matrix Loop, Glowing Neon Motion Graphics",
  "keywords": "cyberpunk, hud, neon, portal, technology, loop, abstract, virtual reality, sci-fi"
}

Do not wrap your response in markdown code blocks like \`\`\`json. Return ONLY the raw JSON string.`;

    let generatedText = "";

    if (process.env.GROK_API_KEY) {
      console.log("[Metadata API] Generating using Grok API...");
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.TEXT_MODEL_BASIC || "grok-2-1212",
          messages: [
            {
              role: "user",
              content: systemPrompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grok API returned error: ${errorText}`);
      }

      const data = await response.json();
      generatedText = data.choices?.[0]?.message?.content || "";
    } else if (process.env.OPENAI_API_KEY) {
      console.log("[Metadata API] Generating using OpenAI API...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: systemPrompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API returned error: ${errorText}`);
      }

      const data = await response.json();
      generatedText = data.choices?.[0]?.message?.content || "";
    } else if (process.env.GEMINI_API_KEY) {
      console.log("[Metadata API] Generating using Gemini API...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned error: ${errorText}`);
      }

      const data = await response.json();
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!generatedText) {
      return NextResponse.json(
        { error: "No response text generated by the AI model." },
        { status: 500 }
      );
    }

    // Clean up any markdown helper wrappers if the LLM returned it
    let cleanText = generatedText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const result = JSON.parse(cleanText);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in metadata generation route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate metadata." },
      { status: 500 }
    );
  }
}
