import { z } from "zod";

/** shadcn/ui token names, in export order. */
export const KEYS = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "destructive", "destructive-foreground",
  "success", "success-foreground", "warning", "warning-foreground", "info", "info-foreground",
  "border", "input", "ring", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
] as const;
export type TokenKey = (typeof KEYS)[number];
export type Palette = Record<TokenKey, string>;
export type Mode = "light" | "dark";

/** Google Fonts the generator may choose from, with the CSS2 API family spec. */
export const FONTS: Record<string, string> = {
  Geist: "Geist:wght@400;500;600;700", Inter: "Inter:wght@400;500;600;700", "DM Sans": "DM+Sans:wght@400;500;600;700",
  Manrope: "Manrope:wght@400;500;600;700", "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
  "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700", "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
  Sora: "Sora:wght@400;500;600;700", Outfit: "Outfit:wght@400;500;600;700", Figtree: "Figtree:wght@400;500;600;700",
  "Work Sans": "Work+Sans:wght@400;500;600;700", Nunito: "Nunito:wght@400;500;600;700", Rubik: "Rubik:wght@400;500;600;700",
  Archivo: "Archivo:wght@400;500;600;700", "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700",
  Fraunces: "Fraunces:wght@400;500;600;700", "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  "Instrument Serif": "Instrument+Serif", "Libre Baskerville": "Libre+Baskerville:wght@400;700",
  Newsreader: "Newsreader:wght@400;500;600;700", Lora: "Lora:wght@400;500;600;700", Syne: "Syne:wght@400;500;600;700",
  Unbounded: "Unbounded:wght@400;500;600;700",
};
export const MONOS: Record<string, string> = {
  "Geist Mono": "Geist+Mono:wght@400;500", "JetBrains Mono": "JetBrains+Mono:wght@400;500",
  "IBM Plex Mono": "IBM+Plex+Mono:wght@400;500", "DM Mono": "DM+Mono:wght@400;500",
  "Space Mono": "Space+Mono:wght@400;700", "Fira Code": "Fira+Code:wght@400;500",
};
const SERIFS = new Set(["Fraunces", "Playfair Display", "Instrument Serif", "Libre Baskerville", "Newsreader", "Lora"]);

export function fontStack(name: string, kind: "sans" | "mono" = "sans") {
  if (kind === "mono") return `"${name}", ui-monospace, Menlo, monospace`;
  return `"${name}", ${SERIFS.has(name) ? "Georgia, serif" : "ui-sans-serif, system-ui, sans-serif"}`;
}
export function googleFontsHref(names: string[]) {
  const specs = [...new Set(names)].map((n) => FONTS[n] ?? MONOS[n]).filter(Boolean);
  return `https://fonts.googleapis.com/css2?${specs.map((s) => "family=" + s).join("&")}&display=swap`;
}

export interface DesignSystem {
  name: string;
  tagline: string;
  fonts: { heading: string; body: string; mono: string };
  radius: number; // rem
  light: Palette;
  dark: Palette;
  notes: string[];
}

/* ---------------- color math ---------------- */
export function hsl(h: number, s: number, l: number) {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; })
    .reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const onColor = (bg: string) => (contrast(bg, "#ffffff") >= contrast(bg, "#111318") ? "#ffffff" : "#111318");

function oklab(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
/** Perceptual color distance: Euclidean distance in OKLab, ×100. */
export function deltaE(a: string, b: string) {
  const [x, y] = [oklab(a), oklab(b)];
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/**
 * Status colors are standard and fixed: the same in every Tessera system, whatever the brand, so "red means
 * danger" holds across products. Brands, presets and the generator never change them.
 */
export const STATUS: Record<Mode, Record<"destructive" | "destructive-foreground" | "success" | "success-foreground" | "warning" | "warning-foreground" | "info" | "info-foreground", string>> = {
  light: {
    destructive: "#d92d20", "destructive-foreground": "#ffffff", success: "#15803d", "success-foreground": "#ffffff",
    warning: "#f59e0b", "warning-foreground": "#111318", info: "#2563eb", "info-foreground": "#ffffff",
  },
  dark: {
    destructive: "#d13a2e", "destructive-foreground": "#ffffff", success: "#15803d", "success-foreground": "#ffffff",
    warning: "#f59e0b", "warning-foreground": "#111318", info: "#2563eb", "info-foreground": "#ffffff",
  },
};

/** Below this ΔE a primary can be mistaken for the error red (the normal-vision floor used for charts). */
export const MIN_PRIMARY_DESTRUCTIVE_DISTANCE = 15;
/** Modes in which the primary sits too close to the fixed destructive red; the brand keeps it, the UI warns. */
export function primaryNearDestructive(sys: DesignSystem): Mode[] {
  return (["light", "dark"] as const).filter((m) => deltaE(sys[m].primary, sys[m].destructive) < MIN_PRIMARY_DESTRUCTIVE_DISTANCE);
}

export const CONTRAST_PAIRS: [TokenKey, TokenKey][] = [
  ["foreground", "background"], ["card-foreground", "card"], ["primary-foreground", "primary"], ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"], ["accent-foreground", "accent"], ["destructive-foreground", "destructive"],
  ["success-foreground", "success"], ["warning-foreground", "warning"], ["info-foreground", "info"],
];
export function contrastReport(sys: DesignSystem) {
  return (["light", "dark"] as Mode[]).flatMap((mode) =>
    CONTRAST_PAIRS.map(([fg, bg]) => ({ mode, fg, bg, ratio: contrast(sys[mode][fg], sys[mode][bg]) })),
  );
}

/**
 * The data palette every Tessera system ships with, in a fixed order: blue, orange, aqua, yellow, magenta.
 * Validated for protanopia/deuteranopia separation (adjacent ΔE ≥ 8.4), normal-vision separation (≥ 19.3)
 * and the OKLCH lightness band of each mode. Light slots 3–5 are under 3:1 on white, so charts that use
 * them need visible labels or a table. Brand colors stay out of it: chart colors encode data, not identity.
 */
export const CHART_PALETTE: Record<Mode, string[]> = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"],
};
const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;
const charts = (mode: Mode) => Object.fromEntries(CHART_KEYS.map((k, i) => [k, CHART_PALETTE[mode][i]])) as Record<(typeof CHART_KEYS)[number], string>;

/** Derive a full light/dark palette from a hue, neutral tint and optional primary colors. */
export function makeTheme(h: number, s: number, pLight?: string, pDark?: string): { light: Palette; dark: Palette } {
  const light = {
    background: hsl(h, s * 0.5, 99.4), foreground: hsl(h, s * 1.8, 6),
    card: "#ffffff", "card-foreground": hsl(h, s * 1.8, 6), popover: "#ffffff", "popover-foreground": hsl(h, s * 1.8, 6),
    primary: pLight ?? hsl(h, s * 1.4, 10), "primary-foreground": "",
    secondary: hsl(h, s * 1.3, 95.3), "secondary-foreground": hsl(h, s * 1.6, 10),
    muted: hsl(h, s * 1.3, 95.3), "muted-foreground": hsl(h, s * 1.2, 41),
    accent: hsl(h, s * 1.4, 93.2), "accent-foreground": hsl(h, s * 1.6, 10),
    ...STATUS.light,
    border: hsl(h, s * 1.2, 89.5), input: hsl(h, s * 1.2, 87), ring: pLight ?? hsl(h, s, 64),
    ...charts("light"),
  } satisfies Palette;
  light["primary-foreground"] = onColor(light.primary);
  const dark = {
    background: hsl(h, s * 1.4, 4.8), foreground: hsl(h, s * 0.6, 96),
    card: hsl(h, s * 1.4, 7.2), "card-foreground": hsl(h, s * 0.6, 96), popover: hsl(h, s * 1.4, 7.2), "popover-foreground": hsl(h, s * 0.6, 96),
    primary: pDark ?? hsl(h, s * 0.6, 96), "primary-foreground": "",
    secondary: hsl(h, s * 1.4, 12.5), "secondary-foreground": hsl(h, s * 0.6, 96),
    muted: hsl(h, s * 1.4, 12.5), "muted-foreground": hsl(h, s * 1.1, 63),
    accent: hsl(h, s * 1.4, 15.5), "accent-foreground": hsl(h, s * 0.6, 96),
    ...STATUS.dark,
    border: hsl(h, s * 1.4, 15.5), input: hsl(h, s * 1.4, 18.5), ring: pDark ?? hsl(h, s, 42),
    ...charts("dark"),
  } satisfies Palette;
  dark["primary-foreground"] = onColor(dark.primary);
  return { light, dark };
}

export const PRESETS = [
  { id: "graphite", name: "Graphite", hue: 222, sat: 7 },
  { id: "harbor", name: "Harbor", hue: 220, sat: 10, p: "#1f56d6", pd: "#6b93ff" },
  { id: "moss", name: "Moss", hue: 140, sat: 8, p: "#2c7a4b", pd: "#5cc489" },
  { id: "ember", name: "Ember", hue: 22, sat: 9, p: "#ee8545", pd: "#ee8545" },
  { id: "plum", name: "Plum", hue: 270, sat: 9, p: "#6e35d6", pd: "#a07cf5" },
  { id: "rose", name: "Rose", hue: 345, sat: 8, p: "#bb2d8c", pd: "#e96cad" },
].map((p) => ({ id: p.id, name: p.name, ...makeTheme(p.hue, p.sat, p.p, p.pd) }));

/** The system this site is built with (app/globals.css), sold as-is and used as the starting point for adaptations. */
export const BASE_ID = "tessera";
export const BASE_SYSTEM: DesignSystem = {
  name: "Tessera",
  tagline: "A calm graphite system with tinted neutrals, a near-black primary and crisp 10px corners.",
  fonts: { heading: "Geist", body: "Geist", mono: "Geist Mono" },
  radius: 0.625,
  light: {
    background: "#fcfcfd", foreground: "#0c0e13", card: "#ffffff", "card-foreground": "#0c0e13", popover: "#ffffff", "popover-foreground": "#0c0e13",
    primary: "#15171d", "primary-foreground": "#fafafb", secondary: "#f1f2f5", "secondary-foreground": "#15171d",
    muted: "#f1f2f5", "muted-foreground": "#626979", accent: "#eceef3", "accent-foreground": "#15171d",
    ...STATUS.light, border: "#e3e5ea", input: "#dcdfe5", ring: "#9aa1b0",
    ...charts("light"),
  },
  dark: {
    background: "#0b0c10", foreground: "#f2f3f6", card: "#111318", "card-foreground": "#f2f3f6", popover: "#111318", "popover-foreground": "#f2f3f6",
    primary: "#f2f3f6", "primary-foreground": "#15171d", secondary: "#1b1e25", "secondary-foreground": "#f2f3f6",
    muted: "#1b1e25", "muted-foreground": "#959cab", accent: "#21252d", "accent-foreground": "#f2f3f6",
    ...STATUS.dark, border: "#23272f", input: "#2b3039", ring: "#5b6272",
    ...charts("dark"),
  },
  notes: [
    "Neutrals carry a faint blue-grey tint so surfaces feel considered rather than flat grey.",
    "The primary is near-black in light mode and near-white in dark mode, so actions read clearly in both.",
    "Geist keeps dense interfaces legible; Geist Mono matches it for code and figures.",
  ],
};

export function presetSystem(id: string, radius = 0.625): DesignSystem {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0];
  return { name: p.name, tagline: "", fonts: { heading: "Geist", body: "Geist", mono: "Geist Mono" }, radius, light: p.light, dark: p.dark, notes: [] };
}

/* ---------------- validation of model output ---------------- */
const HEX = /^#[0-9a-fA-F]{6}$/;
const looseSystem = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  fonts: z.object({ heading: z.string(), body: z.string(), mono: z.string() }).partial().optional(),
  radius: z.coerce.number().optional(),
  light: z.record(z.string(), z.unknown()).optional(),
  dark: z.record(z.string(), z.unknown()).optional(),
  notes: z.array(z.string()).optional(),
});

/** Coerce whatever the model returned into a complete, safe DesignSystem. */
export function normalizeSystem(raw: unknown, fallbackName = "Untitled"): DesignSystem {
  const parsed = looseSystem.safeParse(raw);
  const r = parsed.success ? parsed.data : {};
  const base = makeTheme(222, 7);
  const fix = (t: Record<string, unknown> | undefined, b: Palette) =>
    Object.fromEntries(KEYS.map((k) => {
      const v = typeof t?.[k] === "string" ? (t[k] as string).trim() : "";
      return [k, HEX.test(v) ? v.toLowerCase() : b[k]];
    })) as Palette;
  const f = r.fonts ?? {};
  return {
    name: (r.name || fallbackName).slice(0, 32),
    tagline: (r.tagline || "").slice(0, 180),
    fonts: {
      heading: f.heading && FONTS[f.heading] ? f.heading : "Geist",
      body: f.body && FONTS[f.body] ? f.body : "Geist",
      mono: f.mono && MONOS[f.mono] ? f.mono : "Geist Mono",
    },
    radius: Math.max(0, Math.min(1.5, Number.isFinite(r.radius) ? Number(r.radius) : 0.5)),
    // Status and chart colors are fixed, whatever the model returned.
    light: { ...fix(r.light, base.light), ...STATUS.light, ...charts("light") },
    dark: { ...fix(r.dark, base.dark), ...STATUS.dark, ...charts("dark") },
    notes: (r.notes ?? []).slice(0, 5),
  };
}

/** CSS custom properties for rendering a system inside a scoped preview element. */
export function scopeStyle(sys: DesignSystem, mode: Mode): Record<string, string> {
  const style: Record<string, string> = {};
  for (const k of KEYS) style["--" + k] = sys[mode][k];
  style["--radius"] = sys.radius + "rem";
  style["--font-sans"] = fontStack(sys.fonts.body);
  style["--font-heading"] = fontStack(sys.fonts.heading);
  style["--font-mono"] = fontStack(sys.fonts.mono, "mono");
  style.colorScheme = mode;
  return style;
}
