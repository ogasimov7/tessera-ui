"use client";

import { Contrast, MoonStar, Palette, PenTool, SquareRoundCorner, Type } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { BASE_SYSTEM, contrastReport, googleFontsHref, scopeStyle, type Mode, type TokenKey } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { useSystemMode } from "../preset-showcase";
import { FeatureCard } from "./feature-card";

const SYS = BASE_SYSTEM;
const fontsHref = googleFontsHref([SYS.fonts.heading, SYS.fonts.body, SYS.fonts.mono]);
const scope = (mode: Mode, extra?: Record<string, string>) => ({ ...scopeStyle(SYS, mode), ...extra }) as CSSProperties;

const PALETTE: TokenKey[] = [
  "background", "foreground", "card", "primary", "secondary", "muted", "muted-foreground", "accent",
  "border", "input", "ring", "destructive", "success", "warning", "info", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
];

function ColorsDemo() {
  return (
    <div className="w-full overflow-x-auto">
      {/* Right padding leaves room for the last rotated label. */}
      <div className="grid min-w-[600px] grid-cols-[44px_repeat(20,minmax(0,1fr))] gap-x-1.5 gap-y-1.5 pr-12">
        <span />
        {PALETTE.map((k) => (
          <span key={k} className="flex h-20 items-end justify-center pb-1">
            <span className="origin-bottom-left translate-x-1/2 -rotate-45 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{k}</span>
          </span>
        ))}
        {(["light", "dark"] as const).map((mode) => (
          <div key={mode} className="contents">
            <span className="self-center font-mono text-[11px] text-muted-foreground">{mode}</span>
            {PALETTE.map((k) => (
              <span key={k} title={`--${k}: ${SYS[mode][k]}`} className="aspect-square rounded-md ring-1 ring-inset ring-black/10 dark:ring-white/10" style={{ background: SYS[mode][k] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingCard() {
  return (
    <Card className="w-full max-w-[340px] gap-4 py-5">
      <CardHeader className="flex flex-row items-center gap-3 px-5">
        <Avatar className="size-10"><AvatarFallback>SF</AvatarFallback></Avatar>
        <div className="grid flex-1 gap-0.5"><CardTitle>Studio Flow</CardTitle><CardDescription>Tomorrow · 7:30</CardDescription></div>
        <Badge variant="secondary">Yoga</Badge>
      </CardHeader>
      <CardContent className="grid gap-2 px-5">
        <div className="flex justify-between text-sm"><span>Spots taken</span><span className="tabular-nums text-muted-foreground">8 / 12</span></div>
        <Progress value={66} aria-label="Spots taken" />
        <div className="mt-2 flex items-center justify-between text-sm"><span>Remind me</span><Switch defaultChecked aria-label="Remind me" /></div>
      </CardContent>
      <CardFooter className="gap-2 px-5"><Button variant="outline" className="flex-1">Details</Button><Button className="flex-1">Reserve</Button></CardFooter>
    </Card>
  );
}

/** The same card in both modes; dragging the divider reveals more of either. */
function DarkModeDemo() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="ds-scope grid place-items-center px-4 py-8" style={scope("light")}><BookingCard /></div>
      <div className="ds-scope absolute inset-0 grid place-items-center px-4 py-8" style={{ ...scope("dark"), clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden><BookingCard /></div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-site-accent" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-8 -translate-1/2 place-items-center rounded-full bg-site-accent font-mono text-xs text-white shadow-md">↔</span>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare light and dark mode"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0" />
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px] text-[#0c0e13]">light</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#f2f3f6]">dark</span>
    </div>
  );
}

function RadiusDemo({ mode }: { mode: Mode }) {
  const [radius, setRadius] = useState(SYS.radius);
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-4">
        <Slider value={[radius]} min={0} max={1.25} step={0.125} onValueChange={([v]) => setRadius(v)} aria-label="Radius" />
        <code className="w-36 shrink-0 text-right font-mono text-xs text-site-accent">--radius: {radius}rem</code>
      </div>
      <div className="ds-scope grid gap-3 rounded-lg p-4" style={scope(mode, { "--radius": `${radius}rem` })}>
        <div className="flex gap-2"><Input placeholder="name@studio.az" aria-label="Email" /><Button>Join</Button></div>
        <div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm">Outline</Button><Button variant="secondary" size="sm">Secondary</Button><Badge>New</Badge></div>
        <Card className="gap-1 py-4">
          <CardHeader className="px-4"><CardTitle>Weekly digest</CardTitle><CardDescription>Every Monday at 9:00</CardDescription></CardHeader>
        </Card>
      </div>
    </div>
  );
}

const PAIR_LABEL: Record<string, string> = { foreground: "Text", "card-foreground": "Card text", "primary-foreground": "Primary", "secondary-foreground": "Secondary", "muted-foreground": "Muted text", "accent-foreground": "Accent", "destructive-foreground": "Destructive", "success-foreground": "Success", "warning-foreground": "Warning", "info-foreground": "Info" };

function ContrastDemo() {
  const report = contrastReport(SYS);
  const light = report.filter((r) => r.mode === "light");
  const grade = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "Low");
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left font-mono text-[11px] text-muted-foreground"><th className="pb-2 font-normal">pair</th><th className="pb-2 font-normal">light</th><th className="pb-2 font-normal">dark</th></tr></thead>
      <tbody>
        {light.map((l) => {
          const d = report.find((r) => r.mode === "dark" && r.fg === l.fg)!;
          return (
            <tr key={l.fg} className="border-t border-[var(--grid-line)]">
              <td className="py-2">{PAIR_LABEL[l.fg] ?? l.fg}</td>
              {[l, d].map((r) => (
                <td key={r.mode} className="py-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-6 w-8 place-items-center rounded text-[11px] font-bold ring-1 ring-inset ring-black/10 dark:ring-white/10" style={{ background: SYS[r.mode][r.bg], color: SYS[r.mode][r.fg] }}>Aa</span>
                    <span className="font-mono text-xs tabular-nums">{r.ratio.toFixed(1)}</span>
                    <span className={cn("rounded px-1 font-mono text-[10px] font-semibold", grade(r.ratio) === "Low" ? "bg-destructive/10 text-[color-mix(in_oklab,var(--destructive)_60%,var(--foreground))]" : "bg-muted text-foreground")}>{grade(r.ratio)}</span>
                  </span>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const TYPE_SCALE = [["Heading/H1", 36, 600, "-0.03em"], ["Heading/H2", 28, 600, "-0.02em"], ["Heading/H3", 20, 600, "-0.01em"], ["Body/Default", 14, 400, "0"], ["Label/Default", 14, 500, "0"]] as const;

function TypeDemo() {
  return (
    <div className="grid gap-4">
      <div className="flex items-end gap-4 border-b border-[var(--grid-line)] pb-4">
        <span className="text-7xl font-medium leading-none tracking-tighter">Aa</span>
        <div className="grid gap-0.5 pb-1 font-mono text-[11px] text-muted-foreground"><span>--font-heading: {SYS.fonts.heading}</span><span>--font-sans: {SYS.fonts.body}</span><span>--font-mono: {SYS.fonts.mono}</span></div>
      </div>
      {TYPE_SCALE.map(([name, size, weight, tracking]) => (
        <div key={name} className="grid grid-cols-[104px_minmax(0,1fr)] items-baseline gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">{name}</span>
          <span className="truncate" style={{ fontSize: size, fontWeight: weight, letterSpacing: tracking, lineHeight: 1.2 }}>Book your next class</span>
        </div>
      ))}
    </div>
  );
}

const FIGMA_ROWS: TokenKey[] = ["background", "foreground", "primary", "primary-foreground", "muted", "border", "ring", "chart-1"];

function FigmaDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--grid-line)] bg-card text-[13px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--grid-line)] px-4 py-2.5">
        <span className="font-medium">Local variables</span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{SYS.name} · 38 variables</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-[var(--grid-line)] px-4 py-2 text-xs text-muted-foreground"><span>Name</span><span>Light</span><span>Dark</span></div>
      {FIGMA_ROWS.map((k) => (
        <div key={k} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center px-4 py-1.5">
          <span className="truncate"><span className="text-muted-foreground">color/</span>{k}</span>
          {(["light", "dark"] as const).map((m) => (
            <span key={m} className="flex min-w-0 items-center gap-2 font-mono text-xs">
              <i className="size-4 shrink-0 rounded ring-1 ring-inset ring-black/10 dark:ring-white/10" style={{ background: SYS[m][k] }} />
              <span className="truncate">{SYS[m][k].slice(1).toUpperCase()}</span>
            </span>
          ))}
        </div>
      ))}
      <div className="border-t border-[var(--grid-line)] px-4 py-2 text-xs text-muted-foreground">+ 26 colors · radius/sm, md, lg, xl</div>
    </div>
  );
}

/** "Built into every token": a bento of live demos running on the base system. */
export function TokenFeatures() {
  const mode = useSystemMode();
  return (
    <div className="grid gap-3 lg:grid-cols-12">
      <link rel="stylesheet" href={fontsHref} precedence="default" />
      <FeatureCard icon={Palette} title="A complete color system" desc="30 semantic tokens: brand colors that adapt, plus standard status and data colors that never do. Hover a swatch for its hex." className="lg:col-span-7" demoClassName="flex items-center">
        <ColorsDemo />
      </FeatureCard>
      <FeatureCard icon={MoonStar} title="Dark mode, designed" desc="Not an inversion. Drag the divider to compare the same card in both modes." className="lg:col-span-5" demoClassName="p-2 sm:p-2">
        <DarkModeDemo />
      </FeatureCard>
      <FeatureCard icon={SquareRoundCorner} title="One radius, everywhere" desc="Every corner derives from a single variable. Drag to reshape the whole kit." className="lg:col-span-5">
        <RadiusDemo mode={mode} />
      </FeatureCard>
      <FeatureCard icon={Contrast} title="Accessible by default" desc="Every text and surface pair is checked against WCAG 2.2 in both modes." className="lg:col-span-7">
        <ContrastDemo />
      </FeatureCard>
      <FeatureCard icon={Type} title="A considered type scale" desc="Heading, body and mono fonts with matching text styles in code and Figma." className="lg:col-span-5">
        <TypeDemo />
      </FeatureCard>
      <FeatureCard icon={PenTool} title="Real Figma variables" desc="The plugin creates a variable collection with Light and Dark modes, not just color styles." className="lg:col-span-7">
        <FigmaDemo />
      </FeatureCard>
    </div>
  );
}
