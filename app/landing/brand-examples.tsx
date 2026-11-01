"use client";

import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PRESETS, googleFontsHref, scopeStyle, type DesignSystem } from "@/lib/tokens";
import { useSystemMode } from "../preset-showcase";

// Fictional brands showing how far one adaptation can move: palette, fonts and radius all change.
const BRANDS: { preset: string; name: string; what: string; heading: string; body: string; radius: number }[] = [
  { preset: "harbor", name: "Harbor", what: "Invoicing for small shops", heading: "Manrope", body: "Manrope", radius: 0.5 },
  { preset: "moss", name: "Moss", what: "A neighbourhood plant shop", heading: "Fraunces", body: "DM Sans", radius: 1 },
  { preset: "ember", name: "Ember", what: "Coffee roaster subscriptions", heading: "Space Grotesk", body: "Space Grotesk", radius: 0.25 },
  { preset: "plum", name: "Plum", what: "An independent design studio", heading: "Bricolage Grotesque", body: "Figtree", radius: 0.75 },
];

const systems: DesignSystem[] = BRANDS.map((b) => {
  const p = PRESETS.find((x) => x.id === b.preset)!;
  return { name: b.name, tagline: b.what, fonts: { heading: b.heading, body: b.body, mono: "JetBrains Mono" }, radius: b.radius, light: p.light, dark: p.dark, notes: [] };
});

/** Four adaptations of the same system, rendered on real components in the site's current mode. */
export function BrandExamples() {
  const mode = useSystemMode();
  return (
    <div className="grid-row grid gap-px bg-[var(--grid-line)] sm:grid-cols-2 lg:grid-cols-4">
      <link rel="stylesheet" href={googleFontsHref(BRANDS.flatMap((b) => [b.heading, b.body]))} precedence="default" />
      {systems.map((sys) => (
        <div key={sys.name} className="flex flex-col bg-background">
          <div className="ds-scope flex flex-1 flex-col gap-4 p-6" style={scopeStyle(sys, mode) as CSSProperties}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{sys.name}</span>
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{sys.tagline}</p>
            <div className="flex gap-1.5">{(["primary", "secondary", "accent", "muted", "foreground"] as const).map((k) => <i key={k} className="h-6 flex-1 rounded-[calc(var(--radius)-2px)] ring-1 ring-inset ring-black/10" style={{ background: sys[mode][k] }} />)}</div>
            <Input placeholder="Email address" aria-label={`${sys.name} email`} />
            <div className="flex items-center justify-between gap-2"><Button size="sm">Get started</Button><Switch defaultChecked aria-label={`${sys.name} setting`} /></div>
          </div>
          <div className="grid gap-0.5 border-t border-[var(--grid-line)] px-6 py-3 font-mono text-[11px] text-muted-foreground">
            <span>--primary: {sys[mode].primary}</span>
            <span>--radius: {sys.radius}rem · {sys.fonts.heading}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
