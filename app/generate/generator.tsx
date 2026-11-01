"use client";

import { ImageIcon, Lock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { SystemPreview } from "@/components/system-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cssFor } from "@/lib/exporters";
import { KIT_FILES, PLANS, planFor, price } from "@/lib/plans";
import { BASE_ID, BASE_SYSTEM, KEYS, contrastReport, fontStack, primaryNearDestructive, type DesignSystem, type Mode } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// Under `next dev`, Buy downloads the kit directly (see app/api/test-download) so the flow can be tried without Stripe.
const TEST_MODE = process.env.NODE_ENV === "development";

const STYLES = ["Minimal", "Warm", "Playful", "Editorial", "Corporate", "Brutalist", "Luxury", "Technical", "Calm", "Bold", "Retro", "High contrast"];
const CORNERS = ["auto", "sharp", "soft", "round"] as const;

/** Downscale to at most 1568px on the long side and re-encode as JPEG, so uploads stay well under the 4.5 MB request limit. */
async function imageToBase64(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1568 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // transparent PNGs would otherwise turn black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const url = canvas.toDataURL("image/jpeg", 0.9);
  return { mediaType: "image/jpeg" as const, data: url.slice(url.indexOf(",") + 1) };
}

export function Generator() {
  const [brief, setBrief] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [corners, setCorners] = useState<(typeof CORNERS)[number]>("auto");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [system, setSystem] = useState<DesignSystem>(BASE_SYSTEM);
  const [systemId, setSystemId] = useState(BASE_ID);
  const [mode, setMode] = useState<Mode>("light");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [change, setChange] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Returning from a cancelled checkout: reload the saved system.
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("system");
    if (!id) return;
    fetch(`/api/system?id=${encodeURIComponent(id)}`).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (d?.system) { setSystem(d.system); setSystemId(d.id); }
    });
  }, []);

  // Start the preview in the site's current theme; the Light/Dark switch takes over from there.
  useEffect(() => setMode(document.documentElement.classList.contains("dark") ? "dark" : "light"), []);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function call(payload: object) {
    setBusy(true);
    setStatus(payload && "change" in payload ? "Applying your change…" : file ? "Reading your reference and drafting the system…" : "Drafting palette, type and radius…");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setSystem(data.system); setSystemId(data.id);
      const low = contrastReport(data.system).filter((p) => p.ratio < 4.5).length;
      // Status colors are fixed, so a primary close to the error red stays as the brand chose; we only flag it.
      const nearRed = primaryNearDestructive(data.system).length > 0;
      setStatus([
        low ? `Done. ${low} contrast pair${low > 1 ? "s" : ""} fall below AA; see Tokens.` : "Done. All checked pairs pass WCAG AA.",
        nearRed ? "Heads up: the primary is close to the standard error red, so destructive buttons should keep their icon and label." : "",
      ].filter(Boolean).join(" "));
      return true;
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Generation failed.");
      return false;
    } finally { setBusy(false); }
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!brief.trim() && !styles.length && !file) return setStatus("Add a brief, a style keyword or an image to start.");
    let image;
    try { image = file ? await imageToBase64(file) : undefined; } catch { return setStatus("That image couldn't be read. Try a PNG or JPG."); }
    await call({ brief, styles, corners, image });
  }
  async function onRefine(e: React.FormEvent) {
    e.preventDefault();
    if (systemId === BASE_ID) return setStatus("Adapt the system to your reference first, then refine it.");
    if (await call({ current: system, change })) setChange("");
  }
  async function onCheckout() {
    if (TEST_MODE) {
      location.href = `/api/test-download?system=${encodeURIComponent(systemId)}`;
      return setStatus("Test mode: downloading the zip without payment.");
    }
    setBusy(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ systemId }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) location.href = data.url;
    else { setBusy(false); setStatus(data.error ?? "Checkout is unavailable right now."); }
  }

  const isBase = systemId === BASE_ID;
  const plan = planFor(systemId);
  const cssPreview = useMemo(() => cssFor(system).split("\n").slice(0, 14).join("\n"), [system]);
  const palette = system[mode];
  const checks = contrastReport(system).filter((c) => c.mode === mode);

  return (
    <div className="grid items-start gap-7 pt-7 lg:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={onGenerate} className="flex flex-col gap-5 lg:sticky lg:top-[76px]">
        <div className="grid gap-2"><p className="font-mono text-xs font-semibold uppercase tracking-widest text-site-accent">Generate</p><h1 className="text-3xl font-medium tracking-tighter">Adapt Tessera to your brand</h1><p className="text-muted-foreground">Upload a screenshot, moodboard or brand sheet you like and describe your product. We adapt the Tessera system to it: colors, type and corners.</p></div>
        <div className="grid gap-2"><Label htmlFor="brief">Brief</Label>
          <Textarea id="brief" rows={5} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="A booking app for independent yoga studios. Calm and warm, but still precise." /></div>
        <div className="grid gap-2"><Label>Style</Label>
          <div className="flex flex-wrap gap-1.5">{STYLES.map((s) => {
            const on = styles.includes(s);
            return <button key={s} type="button" aria-pressed={on} onClick={() => setStyles(on ? styles.filter((x) => x !== s) : [...styles, s])}
              className={cn("rounded-full border px-3 py-1 text-[12.5px] font-medium", on ? "border-primary bg-primary text-primary-foreground" : "bg-background")}>{s}</button>;
          })}</div></div>
        <div className="grid gap-2"><Label>Corners</Label>
          <div className="inline-flex w-fit gap-0.5 rounded-lg border p-0.5">{CORNERS.map((c) => (
            <button key={c} type="button" aria-pressed={c === corners} onClick={() => setCorners(c)} className={cn("rounded-md px-2.5 py-1 font-mono text-[13px] capitalize text-muted-foreground", c === corners && "bg-accent text-foreground")}>{c}</button>
          ))}</div></div>
        <div className="grid gap-2"><Label>Reference image <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setFile(f); }}
            className="flex items-center gap-3 rounded-lg border border-dashed bg-card p-3.5 text-left">
            {preview ? <img src={preview} alt="Reference" className="size-13 rounded-md object-cover" /> : <span className="grid size-13 place-items-center rounded-md bg-muted text-muted-foreground"><ImageIcon className="size-5" /></span>}
            <span className="grid gap-0.5"><b className="font-medium">{file?.name ?? "Drop a screenshot or moodboard"}</b><span className="text-[12.5px] text-muted-foreground">PNG, JPG or WebP</span></span>
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Working…" : "Adapt the system"}</Button>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">{status}</p>
      </form>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-1.5">
            <span className="w-fit rounded-full border border-dashed px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isBase ? "Base system" : "Adapted for you"}</span>
            <h2 className="text-4xl font-medium tracking-tighter">{system.name}</h2>
            <p className="text-muted-foreground">{system.tagline}</p>
          </div>
          <div className="inline-flex gap-0.5 rounded-lg border p-0.5">{(["light", "dark"] as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={m === mode} onClick={() => setMode(m)} className={cn("rounded-md px-2.5 py-1 font-mono text-[13px] capitalize text-muted-foreground", m === mode && "bg-accent text-foreground")}>{m}</button>
          ))}</div>
        </div>

        <Tabs defaultValue="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="tokens">Tokens</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview"><SystemPreview system={system} mode={mode} /></TabsContent>
          <TabsContent value="tokens" className="flex flex-col gap-5">
            <div className="grid gap-2.5 sm:grid-cols-3">{([["Heading", system.fonts.heading, "sans"], ["Body", system.fonts.body, "sans"], ["Mono", system.fonts.mono, "mono"]] as const).map(([l, f, k]) => (
              <div key={l} className="min-w-0 rounded-lg border bg-card p-3"><small className="text-xs text-muted-foreground">{l}</small><p className="truncate text-2xl" style={{ fontFamily: fontStack(f, k) }}>Aa Bb 123</p><small className="text-xs text-muted-foreground">{f} · radius {system.radius}rem</small></div>
            ))}</div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-2.5">{KEYS.map((k) => (
              <div key={k} className="min-w-0 overflow-hidden rounded-lg border bg-card"><i className="block h-11" style={{ background: palette[k] }} /><div className="px-2 py-1.5 text-[11.5px]"><b className="block truncate font-medium">{k}</b><span className="font-mono text-muted-foreground">{palette[k]}</span></div></div>
            ))}</div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{checks.map((c) => (
              <div key={c.fg} className="flex items-center gap-2.5 rounded-lg border bg-card px-2.5 py-2 text-[12.5px]">
                <span className="grid h-6 w-9 shrink-0 place-items-center rounded-md border text-xs font-bold" style={{ background: palette[c.bg], color: palette[c.fg] }}>Aa</span>
                <span className="min-w-0 flex-1 truncate">{c.fg} / {c.bg}</span>
                <span className={cn("font-semibold tabular-nums", c.ratio >= 4.5 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>{c.ratio.toFixed(2)} {c.ratio >= 4.5 ? "AA" : "Low"}</span>
              </div>
            ))}</div>
            <ul className="grid max-w-[72ch] list-disc gap-1 pl-5 text-muted-foreground">{system.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </TabsContent>
          <TabsContent value="code" className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">{KIT_FILES.map((f) => (
              <span key={f} className="rounded-md border px-2 py-0.5 font-mono text-xs text-muted-foreground">{f}</span>
            ))}</div>
            <div className="dark relative">
              <CodeBlock name="app/globals.css" code={cssPreview} copyable={false} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-card" />
              <p className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm font-medium"><Lock className="size-4" /> Full files unlock after purchase</p>
            </div>
          </TabsContent>
        </Tabs>

        <form onSubmit={onRefine} className="grid items-end gap-3 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-2"><Label htmlFor="refine">Refine</Label><Input id="refine" value={change} onChange={(e) => setChange(e.target.value)} placeholder="Make the primary warmer and the corners tighter" /></div>
          <Button type="submit" variant="outline" disabled={busy || isBase || !change.trim()}>Apply</Button>
        </form>

        <div className="grid items-center gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-1">
            <h3 className="font-semibold">{PLANS[plan].name} · <span className="tabular-nums">{price(plan)}</span></h3>
            <p className="text-sm text-muted-foreground">{PLANS[plan].description}</p>
            {isBase ? (
              <p className="text-sm text-muted-foreground">Want it in your brand? Upload a reference on the left to get an adapted version for {price("custom")}.</p>
            ) : (
              <button type="button" className="w-fit text-sm underline underline-offset-4" onClick={() => { setSystem(BASE_SYSTEM); setSystemId(BASE_ID); setStatus(""); }}>
                Back to the base system ({price("base")})
              </button>
            )}
          </div>
          <div className="grid justify-items-center gap-1.5">
            <Button size="lg" onClick={onCheckout} disabled={busy} className="rounded-full px-6">Buy for {price(plan)}</Button>
            {TEST_MODE && <span className="rounded-full border border-dashed px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Test mode · no payment</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
