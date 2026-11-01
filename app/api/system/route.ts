import { NextResponse } from "next/server";
import { getSystem } from "@/lib/db";

export const runtime = "nodejs";

/** Reload a saved system (used when returning from a cancelled checkout). */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const system = id ? await getSystem(id) : null;
  if (!system) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ id, system });
}
