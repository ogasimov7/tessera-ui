import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { Eyebrow } from "@/components/site-grid";
import { Button } from "@/components/ui/button";
import { cssFor } from "@/lib/exporters";
import { presetSystem } from "@/lib/tokens";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { COMPONENTS, GUIDES } from "../content";
import { Demo } from "../demos";
import { DemoTabs } from "./demo-tabs";

const ALL = [...GUIDES, ...COMPONENTS];
const REGISTRY = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

export function generateStaticParams() {
  return ALL.map((p) => ({ slug: p.id ? [p.id] : [] }));
}

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const id = slug?.[0] ?? "";
  const index = ALL.findIndex((p) => p.id === id);
  if (index < 0 || (slug?.length ?? 0) > 1) notFound();
  const comp = COMPONENTS.find((c) => c.id === id);
  const prev = ALL[index - 1], next = ALL[index + 1];
  const href = (p: { id: string }) => (p.id ? `/docs/${p.id}` : "/docs");

  return (
    <div className="grid md:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="-mx-2 flex gap-1 overflow-x-auto border-b border-[var(--grid-line)] px-2 py-3 md:sticky md:top-14 md:mx-0 md:h-[calc(100dvh-3.5rem)] md:flex-col md:gap-8 md:self-start md:overflow-y-auto md:border-r md:border-b-0 md:px-0 md:py-10 md:pr-6">
        {[["Getting started", GUIDES], ["Components", COMPONENTS]].map(([title, items]) => (
          <div key={title as string} className="contents md:block">
            <h4 className="mb-3 hidden font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">{title as string}</h4>
            <ul className="contents md:block md:border-l md:border-[var(--grid-line)]">
              {(items as typeof ALL).map((p) => (
                <li key={p.id} className="contents md:block">
                  <Link href={href(p)} aria-current={p.id === id ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-full border px-3 py-1 text-sm text-foreground/70 hover:text-foreground",
                      "md:-ml-px md:rounded-none md:border-0 md:border-l md:border-transparent md:py-1.5 md:pl-4 md:hover:border-foreground/40",
                      p.id === id && "border-site-accent font-medium text-site-accent hover:text-site-accent md:border-site-accent md:hover:border-site-accent",
                    )}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <article className="flex min-w-0 max-w-[860px] flex-col gap-6 pt-10 md:pl-10">
        <Eyebrow>{comp ? "Components" : "Getting started"}</Eyebrow>
        {comp ? (
          <>
            <h1 className="-mt-3 text-4xl font-medium tracking-tighter">{comp.name}</h1>
            <p className="text-lg text-muted-foreground">{comp.desc}</p>
            <DemoTabs preview={<Demo id={comp.id} />} code={<CodeBlock name={`${comp.id}-demo.tsx`} code={comp.code} />} />
            <h2 className="mt-4 text-xl font-medium tracking-tight">Installation</h2>
            <CodeBlock name="terminal" code={`npx shadcn@latest add ${REGISTRY}/r/${comp.id}.json`} />
          </>
        ) : id === "installation" ? (
          <>
            <h1 className="-mt-3 text-4xl font-medium tracking-tighter">Installation</h1>
            <p className="text-lg text-muted-foreground">Components ship in the shadcn registry format, so the shadcn CLI installs them as source files you own.</p>
            <CodeBlock name="terminal" code={"npx create-next-app@latest my-app --typescript --tailwind\nnpx shadcn@latest init"} />
            <CodeBlock name="terminal" code={`npx shadcn@latest add ${REGISTRY}/r/button.json ${REGISTRY}/r/card.json`} />
          </>
        ) : id === "theming" ? (
          <>
            <h1 className="-mt-3 text-4xl font-medium tracking-tighter">Theming</h1>
            <p className="text-lg text-muted-foreground">Every component reads from CSS variables. Change the variables and the whole system follows, in light and dark.</p>
            <p className="max-w-[66ch]">Tokens come in pairs: a surface (<code className="font-mono text-site-accent">--primary</code>) and the text on it (<code className="font-mono text-site-accent">--primary-foreground</code>). Keep each pair at 4.5:1 contrast or better.</p>
            <CodeBlock name="app/globals.css" code={cssFor(presetSystem("graphite"))} />
          </>
        ) : id === "ai-systems" ? (
          <>
            <h1 className="-mt-3 text-4xl font-medium tracking-tighter">AI design systems</h1>
            <p className="text-lg text-muted-foreground">Upload a reference (a screenshot, moodboard or brand sheet), describe your product and pick style keywords. Claude adapts the Tessera system to it: a full token set, a type pairing and a radius, rendered on real components.</p>
            <ul className="grid max-w-[66ch] list-disc gap-1.5 pl-5">
              {Object.values(PLANS).map((p) => <li key={p.name}><b>{p.name} · ${(p.amount / 100).toFixed(0)}:</b> {p.description}</li>)}
            </ul>
            <Button asChild className="w-fit rounded-full px-5"><Link href="/generate">Adapt Tessera</Link></Button>
          </>
        ) : (
          <>
            <h1 className="-mt-3 text-4xl font-medium tracking-tighter">Introduction</h1>
            <p className="text-lg text-muted-foreground">Components you copy into your app and own. Built on Radix primitives and Tailwind, styled entirely through design tokens.</p>
            <p className="max-w-[66ch]">Every color, radius and font comes from a small set of CSS variables, so a new brand is a new token file, not a rewrite. Use the default Graphite theme, pick a preset on <Link className="underline" href="/themes">Themes</Link>, or <Link className="underline" href="/generate">generate</Link> a system from your own brief.</p>
          </>
        )}
        <div className="mt-6 flex justify-between gap-3 border-t border-[var(--grid-line)] pt-6">
          {prev ? <Button asChild variant="outline" className="rounded-full"><Link href={href(prev)}>← {prev.name}</Link></Button> : <span />}
          {next && <Button asChild variant="outline" className="rounded-full"><Link href={href(next)}>{next.name} →</Link></Button>}
        </div>
      </article>
    </div>
  );
}
