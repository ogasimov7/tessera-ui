"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { SystemPreview } from "@/components/system-preview";
import { Eyebrow, Row } from "@/components/site-grid";
import { cssFor } from "@/lib/exporters";
import { presetSystem, type Mode } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { PresetSwatches } from "../preset-showcase";

const RADII = [0, 0.3, 0.5, 0.625, 0.75, 1];

function Seg<T extends string | number>({ items, value, onChange, label }: { items: T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="inline-flex gap-0.5 rounded-lg border p-0.5" role="group" aria-label={label}>
      {items.map((i) => (
        <button key={String(i)} type="button" aria-pressed={i === value} onClick={() => onChange(i)}
          className={cn("rounded-md px-2.5 py-1 font-mono text-[13px] text-muted-foreground", i === value && "bg-accent text-foreground")}>{String(i)}</button>
      ))}
    </div>
  );
}

export default function ThemesPage() {
  const [preset, setPreset] = useState("graphite");
  const [radius, setRadius] = useState(0.625);
  const [mode, setMode] = useState<Mode>("light");
  const [showCode, setShowCode] = useState(false);
  const sys = presetSystem(preset, radius);
  return (
    <div className="flex flex-col gap-6 pt-16">
      <div className="flex flex-col">
        <Row className="py-3"><Eyebrow>Themes</Eyebrow></Row>
        <Row><h1 className="py-1 text-5xl font-medium tracking-tighter sm:text-6xl">Pick a preset, tune the radius.</h1></Row>
        <Row><p className="max-w-[62ch] py-2 text-lg text-muted-foreground">Hand-picked presets built on the same tokens. Choose one, adjust the radius, and copy the CSS into your <code className="font-mono text-site-accent">globals.css</code>.</p></Row>
      </div>
      <div className="flex flex-wrap items-end gap-x-7 gap-y-5">
        <div className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preset</span><PresetSwatches value={preset} onChange={setPreset} /></div>
        <div className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Radius</span><Seg items={RADII} value={radius} onChange={setRadius} label="Radius" /></div>
        <div className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode</span><Seg items={["light", "dark"] as Mode[]} value={mode} onChange={setMode} label="Mode" /></div>
        <button type="button" onClick={() => setShowCode((v) => !v)} className="ml-auto h-9 rounded-full border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent">{showCode ? "Hide code" : "Copy code"}</button>
      </div>
      {showCode && <CodeBlock name="app/globals.css" code={cssFor(sys)} />}
      <SystemPreview system={sys} mode={mode} />
    </div>
  );
}
