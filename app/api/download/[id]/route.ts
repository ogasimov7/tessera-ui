import { NextResponse } from "next/server";
import { getSystem, paidPurchase } from "@/lib/db";
import { kitZip } from "@/lib/kit";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing session_id." }, { status: 400 });

  const purchase = await paidPurchase(id, sessionId);
  if (!purchase) return NextResponse.json({ error: "No completed payment for this design system." }, { status: 402 });
  const system = await getSystem(id);
  if (!system) return NextResponse.json({ error: "Design system not found." }, { status: 404 });

  return kitZip(system, purchase.plan, purchase.figmaCode);
}
