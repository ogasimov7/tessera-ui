import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSystem } from "@/lib/generate";
import { saveSystem } from "@/lib/db";
import { KEYS } from "@/lib/tokens";

export const runtime = "nodejs";
export const maxDuration = 120;

const palette = z.object(Object.fromEntries(KEYS.map((k) => [k, z.string()])) as Record<(typeof KEYS)[number], z.ZodString>);
const body = z.object({
  brief: z.string().max(2000).default(""),
  styles: z.array(z.string().max(40)).max(12).default([]),
  corners: z.enum(["auto", "sharp", "soft", "round"]).default("auto"),
  image: z.object({
    mediaType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
    data: z.string().max(7_000_000), // ~5 MB base64
  }).optional(),
  current: z.object({
    name: z.string(), tagline: z.string(), radius: z.number(), notes: z.array(z.string()),
    fonts: z.object({ heading: z.string(), body: z.string(), mono: z.string() }),
    light: palette, dark: palette,
  }).optional(),
  change: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const input = parsed.data;
  if (!input.current && !input.brief.trim() && !input.styles.length && !input.image) {
    return NextResponse.json({ error: "Add a brief, a style keyword or an image." }, { status: 400 });
  }
  if (input.current && !input.change?.trim()) {
    return NextResponse.json({ error: "Describe the change you want." }, { status: 400 });
  }
  try {
    const system = await generateSystem(input);
    const id = await saveSystem(system, input.change ?? input.brief);
    return NextResponse.json({ id, system });
  } catch (err) {
    console.error("generate failed", err);
    return NextResponse.json({ error: "Generation failed. Try again in a moment." }, { status: 502 });
  }
}
