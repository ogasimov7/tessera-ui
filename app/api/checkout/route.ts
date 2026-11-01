import { NextResponse } from "next/server";
import { createPendingPurchase, getSystem } from "@/lib/db";
import { PLANS, planFor } from "@/lib/plans";
import { getStripe, siteUrl } from "@/lib/stripe";
import { BASE_ID } from "@/lib/tokens";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { systemId } = (await req.json().catch(() => ({}))) as { systemId?: string };
  if (!systemId) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const system = await getSystem(systemId);
  if (!system) return NextResponse.json({ error: "Design system not found." }, { status: 404 });

  // The price follows the system: the base system is "base", anything generated is "custom".
  const plan = planFor(systemId);
  const priceId = plan === "custom" ? process.env.STRIPE_PRICE_CUSTOM : process.env.STRIPE_PRICE_BASE;
  const p = PLANS[plan];
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      priceId
        ? { price: priceId, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: p.amount,
              product_data: { name: plan === "base" ? `${system.name} design system` : `${system.name} design system · ${p.name}`, description: p.description },
            },
          },
    ],
    metadata: { systemId, plan },
    success_url: `${siteUrl()}/generate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: systemId === BASE_ID ? `${siteUrl()}/generate` : `${siteUrl()}/generate?system=${systemId}`,
  });
  await createPendingPurchase(systemId, plan, session.id);
  return NextResponse.json({ url: session.url });
}
