import Anthropic from "@anthropic-ai/sdk";
import { BASE_SYSTEM, FONTS, KEYS, MONOS, normalizeSystem, type DesignSystem } from "./tokens";

export interface GenerateInput {
  brief: string;
  styles: string[];
  corners: "auto" | "sharp" | "soft" | "round";
  image?: { mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif"; data: string }; // base64
  /** When refining: the current system and the requested change. */
  current?: DesignSystem;
  change?: string;
}

const SCHEMA = `{"name": string (1-2 words, a product-like name), "tagline": string (one sentence), "fonts": {"heading": string, "body": string, "mono": string}, "radius": number (rem, 0 to 1.5), "light": {TOKENS}, "dark": {TOKENS}, "notes": [3-4 short sentences explaining the key decisions]}`;

const RULES = `TOKENS must contain exactly these keys, each a 6-digit hex color: ${KEYS.join(", ")}.
Heading and body fonts must be chosen from: ${Object.keys(FONTS).join(", ")}. Mono from: ${Object.keys(MONOS).join(", ")}.
Requirements:
- Follow shadcn/ui token semantics: primary = main action fill, secondary = low-emphasis fill, muted = subtle fill with muted-foreground for secondary text, accent = hover fill, border/input = hairlines, ring = focus ring. The status colors (destructive, success, warning, info and their foregrounds) and chart-1..5 are fixed Tessera standards: copy them unchanged from the base system (they are enforced afterwards).
- Every text/surface pair must reach WCAG AA 4.5:1: foreground/background, card-foreground/card, primary-foreground/primary, secondary-foreground/secondary, muted-foreground/background, accent-foreground/accent, destructive-foreground/destructive.
- Neutrals should carry a slight bias toward the brand hue instead of pure grey.
- Primary must stay clearly distinguishable from the fixed destructive red: avoid a red primary unless the brief demands it; for red, pink or orange brands lean the primary toward pink, magenta or a bright orange instead.
- Dark mode is a designed counterpart, not an inversion: lift saturated colors so they still read on dark surfaces.
- Avoid generic choices (default Inter + purple, beige + terracotta) unless the brief asks for them.`;

export function buildPrompt(input: GenerateInput) {
  if (input.current) {
    return `You are refining an existing design system in the shadcn/ui token format.
Current system JSON:
${JSON.stringify(input.current)}

Change request from the user: """${input.change ?? ""}"""

Apply the change and keep everything else consistent. Keep the name unless the user asks to change it. Update notes to describe what changed.
${RULES}
Reply with only one JSON object of this shape: ${SCHEMA}`;
  }
  const corners = input.corners === "auto"
    ? "choose what fits the brief"
    : `${input.corners} (sharp ≈ 0-0.2rem, soft ≈ 0.4-0.6rem, round ≈ 0.9-1.25rem)`;
  return `You are a senior product designer adapting the Tessera design system to a customer's brand.
Tessera is the base system below, in the shadcn/ui token format. Keep its structure, token semantics and quality bar
(tinted neutrals, clear hierarchy, AA contrast, a designed dark mode), and change its colors, fonts and radius so the result
feels like it was made for the customer's reference. Do not keep Tessera's graphite look unless the reference calls for it.
Base system JSON:
${JSON.stringify(BASE_SYSTEM)}

Customer brief: """${input.brief || "(no brief given; work from the style keywords and reference image)"}"""
Style keywords: ${input.styles.join(", ") || "none"}
Corner preference: ${corners}
${input.image ? "The customer's reference image is attached. Take its dominant and accent colors, contrast level, corner shapes and typographic mood, and follow it closely." : ""}
Give the adapted system its own name (not "Tessera"). Notes should explain what changed from Tessera and why.
${RULES}
Reply with only one JSON object of this shape: ${SCHEMA}`;
}

/** Pull the first JSON object out of a model reply (tolerates a code fence or a stray sentence). */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in model reply");
  return JSON.parse(body.slice(start, end + 1));
}

const anthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSystem(input: GenerateInput): Promise<DesignSystem> {
  const content: Anthropic.ContentBlockParam[] = [];
  if (input.image && !input.current) {
    content.push({ type: "image", source: { type: "base64", media_type: input.image.mediaType, data: input.image.data } });
  }
  content.push({ type: "text", text: buildPrompt(input) });

  const res = await anthropic().messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
    max_tokens: 4000,
    messages: [{ role: "user", content }],
  });
  const text = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return normalizeSystem(extractJson(text), input.current?.name);
}
