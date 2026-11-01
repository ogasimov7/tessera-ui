"use client";

import { useEffect, useState } from "react";
import { Row } from "@/components/site-grid";
import { SystemPreview } from "@/components/system-preview";
import { PRESETS, presetSystem, type Mode } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export function useSystemMode(): Mode {
  const [mode, setMode] = useState<Mode>("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return mode;
}

export function PresetSwatches({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preset">
      {PRESETS.map((p) => (
        <button key={p.id} type="button" aria-pressed={p.id === value} onClick={() => onChange(p.id)}
          className={cn("inline-flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-3 text-sm font-medium", p.id === value && "border-foreground ring-1 ring-foreground")}>
          <i className="size-[18px] rounded-full" style={{ background: p.light.primary }} />{p.name}
        </button>
      ))}
    </div>
  );
}

export function PresetShowcase() {
  const [preset, setPreset] = useState("graphite");
  const mode = useSystemMode();
  return (
    <section className="flex flex-col gap-4">
      <Row className="py-3"><PresetSwatches value={preset} onChange={setPreset} /></Row>
      <SystemPreview system={presetSystem(preset)} mode={mode} />
    </section>
  );
}
