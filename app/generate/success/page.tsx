import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSystem, markPaid, paidPurchase } from "@/lib/db";
import { PLANS, isPlan } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id) return <Message title="Missing checkout session" body="Open the link from your Stripe receipt, or start again from the generator." />;

  const session = await getStripe().checkout.sessions.retrieve(session_id).catch(() => null);
  if (!session) return <Message title="Checkout session not found" body="This link doesn't match a checkout. Open the link from your Stripe receipt, or start again from the generator." />;
  const systemId = session.metadata?.systemId;
  const plan = session.metadata?.plan;
  if (!systemId || !isPlan(plan)) return <Message title="Unknown purchase" body="This checkout session isn't linked to a design system." />;

  // The webhook normally records the payment; confirm here too so the download works immediately.
  if (session.payment_status === "paid") await markPaid(session.id, session.customer_details?.email ?? null);
  const paid = await paidPurchase(systemId, session.id);
  const system = await getSystem(systemId);

  if (!paid || !system) {
    return <Message title="Payment is processing" body="Your payment hasn't been confirmed yet. Refresh this page in a minute." />;
  }
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 py-20">
      <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment confirmed</span>
      <h1 className="text-5xl font-medium tracking-tighter">{system.name} is yours</h1>
      <p className="text-lg text-muted-foreground">{PLANS[paid.plan].description} Keep this page&apos;s link to download again later.</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="lg"><a href={`/api/download/${systemId}?session_id=${encodeURIComponent(session.id)}`}>Download .zip</a></Button>
        <Button asChild size="lg" variant="outline"><Link href="/docs/ai-systems">Setup guide</Link></Button>
      </div>
      <div className="grid w-full gap-2 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Figma plugin code</h2>
        <code className="w-fit rounded-md border bg-background px-3 py-1.5 font-mono text-lg tracking-wider select-all">{paid.figmaCode}</code>
        <p className="text-sm text-muted-foreground">
          In Figma, run the <b>Tessera Import</b> plugin
          {process.env.NEXT_PUBLIC_FIGMA_PLUGIN_URL && <> (<a className="underline" href={process.env.NEXT_PUBLIC_FIGMA_PLUGIN_URL}>open it here</a>)</>} and enter this code. It
          creates the variables, text styles and all 21 components. The same code is in <code className="font-mono">figma/README.md</code> in your download.
        </p>
      </div>
    </div>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 py-20">
      <h1 className="text-4xl font-medium tracking-tighter">{title}</h1>
      <p className="text-muted-foreground">{body}</p>
      <Button asChild variant="outline"><Link href="/generate">Back to the generator</Link></Button>
    </div>
  );
}
