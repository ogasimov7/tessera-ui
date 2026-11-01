import { ArrowRight, Braces, FileCode2, FileText, PenTool, Palette, Scale } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Annotation, Eyebrow, Row, Token } from "@/components/site-grid";
import { Button } from "@/components/ui/button";
import { cssFor } from "@/lib/exporters";
import { PLANS, price } from "@/lib/plans";
import { BASE_SYSTEM } from "@/lib/tokens";
import { BrandExamples } from "./landing/brand-examples";
import { ComponentGrid } from "./landing/component-grid";
import { TokenFeatures } from "./landing/token-features";
import { PresetShowcase } from "./preset-showcase";

const STEPS = [
  ["01", "Show us your brand", "Upload a screenshot, moodboard or brand sheet and describe your product in a sentence or two."],
  ["02", "See Tessera, adapted", "Colors, type and radius are applied to real components in light and dark, with every pair checked against WCAG AA."],
  ["03", "Take it home", "Pay once and download the CSS variables, tokens, React components, Figma plugin and style guide."],
];

const KIT = [
  [Palette, "CSS variables", "app/globals.css for Tailwind v4 and shadcn/ui, light and dark."],
  [Braces, "Design tokens", "tokens.json in the W3C format for Style Dictionary and Tokens Studio."],
  [FileCode2, "23 React components", "Accessible, Radix-based sources you copy in and own."],
  [PenTool, "Figma plugin", "Variables, text styles and 21 components, built from a code."],
  [FileText, "Style guide", "One HTML page with colors, contrast, type and usage rules."],
  [Scale, "Commercial license", "Unlimited projects, for yourself or your clients."],
] as const;

const css = cssFor(BASE_SYSTEM).split("\n");
const CSS_EXCERPT = [...css.slice(0, 1), "", ...css.slice(css.indexOf(":root {"), css.indexOf(":root {") + 12), "  …", "}"].join("\n");

function Spacer() {
  return <div className="h-16 sm:h-24" />;
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Spacer />
      <Annotation>font-heading · text-foreground · tracking-tighter</Annotation>
      <Row>
        <h1 className="max-w-[16ch] py-2 text-[clamp(44px,7.4vw,104px)] font-medium leading-[0.98] tracking-[-0.045em] text-balance">
          A design system tuned to your brand.
        </h1>
      </Row>
      <Annotation className="mt-6">text-lg · text-muted-foreground</Annotation>
      <Row>
        <p className="max-w-[62ch] py-2 text-lg leading-relaxed text-muted-foreground">
          Tessera is a complete design system: tokens like <Token>--primary</Token> and <Token>--radius</Token>, 23 accessible React
          components and a Figma kit. Buy it as it is, or upload a reference and get it adapted to your brand.
        </p>
      </Row>
      <div className="h-10" />
      <Row className="flex flex-wrap gap-3 py-3">
        <Button asChild size="lg" className="rounded-full px-5"><Link href="/generate">Adapt to my brand · {price("custom")}</Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-5"><Link href="/generate">Get Tessera · {price("base")}</Link></Button>
      </Row>

      {/* Live tokens */}
      <Spacer />
      <Row className="grid gap-2 py-3"><Eyebrow>Theming</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">Change the tokens. Everything follows.</h2></Row>
      <Row><p className="max-w-[62ch] py-2 text-muted-foreground">Every color, radius and font comes from a small set of CSS variables. Pick a preset to repaint every component below.</p></Row>
      <div className="h-8" />
      <PresetShowcase />

      {/* Built into every token */}
      <Spacer />
      <Row className="py-3"><Eyebrow>Design tokens</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">Built into every token.</h2></Row>
      <Row><p className="max-w-[62ch] py-2 text-muted-foreground">Color, dark mode, radius, contrast and type are decided once, in tokens, and every component and Figma layer inherits them. Everything below is live.</p></Row>
      <div className="h-8" />
      <TokenFeatures />

      {/* Components */}
      <Spacer />
      <Row className="py-3"><Eyebrow>Components</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">23 components, ready to ship.</h2></Row>
      <Row className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <p className="max-w-[62ch] text-muted-foreground">Accessible Radix primitives styled only through tokens. Copy the source into your app and own it. Try them: they all work.</p>
        <Link href="/docs/accordion" className="inline-flex items-center gap-1 text-sm font-medium text-site-accent hover:underline">Browse all components <ArrowRight className="size-4" /></Link>
      </Row>
      <div className="h-8" />
      <ComponentGrid />

      {/* Same system, any brand */}
      <Spacer />
      <Row className="py-3"><Eyebrow>Adaptation</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">Same system. Any brand.</h2></Row>
      <Row><p className="max-w-[62ch] py-2 text-muted-foreground">Upload a reference and Tessera is adapted to it: palette, fonts and corners change, the structure and quality stay. A few examples of where it can go:</p></Row>
      <div className="h-8" />
      <BrandExamples />

      {/* How it works */}
      <Spacer />
      <Row className="py-3"><Eyebrow>How it works</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">From reference to kit in minutes.</h2></Row>
      <div className="h-8" />
      <Row className="grid gap-px bg-[var(--grid-line)] md:grid-cols-3">
        {STEPS.map(([n, t, d]) => (
          <div key={n} className="flex flex-col gap-3 bg-background p-6 sm:p-8">
            <span className="w-fit rounded-md border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{n}</span>
            <h3 className="text-xl font-medium tracking-tight">{t}</h3>
            <p className="text-muted-foreground">{d}</p>
          </div>
        ))}
      </Row>

      {/* What's in the kit */}
      <Spacer />
      <Row className="py-3"><Eyebrow>What you get</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">One download, for design and code.</h2></Row>
      <div className="h-8" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Row className="grid gap-px bg-[var(--grid-line)] sm:grid-cols-2">
          {KIT.map(([Icon, t, d]) => (
            <div key={t} className="flex flex-col gap-2 bg-background p-6">
              <Icon className="size-5 text-site-accent" />
              <h3 className="font-medium">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </Row>
        <CodeBlock name="app/globals.css" code={CSS_EXCERPT} />
      </div>

      {/* Pricing */}
      <Spacer />
      <Row className="py-3"><Eyebrow>Pricing</Eyebrow></Row>
      <Row><h2 className="py-1 text-4xl font-medium tracking-tighter sm:text-5xl">Pay once. Own it.</h2></Row>
      <div className="h-8" />
      <Row className="grid gap-px bg-[var(--grid-line)] md:grid-cols-2">
        {(["base", "custom"] as const).map((id) => (
          <div key={id} className="flex flex-col gap-4 bg-background p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight">{PLANS[id].name}</h3>
              <span className="text-4xl font-medium tracking-tighter tabular-nums">{price(id)}</span>
            </div>
            <p className="text-muted-foreground">{PLANS[id].description}</p>
            <Button asChild variant={id === "custom" ? "default" : "outline"} className="mt-auto w-fit rounded-full px-5">
              <Link href="/generate">{id === "custom" ? "Upload a reference" : "Get Tessera"} <ArrowRight /></Link>
            </Button>
          </div>
        ))}
      </Row>

      {/* Closing call to action */}
      <Spacer />
      <Annotation>text-6xl · tracking-tighter</Annotation>
      <Row><h2 className="max-w-[18ch] py-2 text-5xl font-medium leading-[1.02] tracking-[-0.04em] text-balance sm:text-7xl">Your brand. Our system. Ready today.</h2></Row>
      <div className="h-8" />
      <Row className="flex flex-wrap gap-3 py-3">
        <Button asChild size="lg" className="rounded-full px-5"><Link href="/generate">Adapt to my brand · {price("custom")}</Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-5"><Link href="/docs">Read the docs</Link></Button>
      </Row>
    </>
  );
}
