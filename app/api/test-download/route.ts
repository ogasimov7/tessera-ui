import { NextResponse } from "next/server";
import { getSystem } from "@/lib/db";
import { kitZip } from "@/lib/kit";
import { planFor } from "@/lib/plans";

export const runtime = "nodejs";

/** Test mode: the kit without payment. Exists only under `next dev`; production builds answer 404. */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Not found." }, { status: 404 });
  const id = new URL(req.url).searchParams.get("system");
  let system;
  try {
    system = id ? await getSystem(id) : null;
  } catch {
    return NextResponse.json({ error: "Generated systems are loaded from the database; set DATABASE_URL to test them." }, { status: 503 });
  }
  if (!id || !system) return NextResponse.json({ error: "Design system not found." }, { status: 404 });
  // A placeholder code: the Community plugin will reject it, the offline plugin in the zip works as usual.
  return kitZip(system, planFor(id), "TSR-TEST-TEST-TEST");
}
