import { NextResponse } from "next/server";
import { systemForFigmaCode } from "@/lib/db";

export const runtime = "nodejs";

// Figma plugins call this from a sandbox with a "null" origin, so it has to allow any origin.
// The code itself is the credential; nothing here relies on cookies.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/** `{ code }` → the design system data the Figma plugin builds from. */
export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: unknown };
  if (typeof code !== "string" || !code.trim()) return NextResponse.json({ error: "Enter the code from your download." }, { status: 400, headers: CORS });

  const system = await systemForFigmaCode(code).catch((err) => {
    console.error("figma code lookup failed", err);
    return undefined;
  });
  if (system === undefined) return NextResponse.json({ error: "The server couldn't check the code. Try again in a minute." }, { status: 503, headers: CORS });
  if (!system) return NextResponse.json({ error: "That code isn't valid, or the payment hasn't been confirmed yet." }, { status: 404, headers: CORS });

  const { name, fonts, radius, light, dark } = system;
  return NextResponse.json({ name, fonts, radius, light, dark }, { headers: CORS });
}
