import { KEYS, contrastReport, fontStack, googleFontsHref, type DesignSystem, type Palette, type TokenKey } from "./tokens";
import type { PlanId } from "./plans";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const GROUPS: [string, string, TokenKey[]][] = [
  ["Surfaces", "Page, card and popover backgrounds with the text that sits on them.", ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"]],
  ["Actions", "Primary is the one main action per view; secondary and accent are quieter fills.", ["primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground"]],
  ["Subtle", "Muted for low-emphasis areas and secondary text.", ["muted", "muted-foreground"]],
  ["Status", "Standard and fixed: the same in every Tessera system, whatever the brand, so their meaning never shifts. Use them only for state (destructive for errors and irreversible actions), always with an icon or label.", ["destructive", "destructive-foreground", "success", "success-foreground", "warning", "warning-foreground", "info", "info-foreground"]],
  ["Lines", "Hairlines, form borders and the focus ring.", ["border", "input", "ring"]],
  ["Charts", "A fixed, colorblind-validated data palette. Assign series in this order (never cycle it), keep text in text colors, and label slots 3–5 directly in light mode: they sit under 3:1 on white.", ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]],
];

const TYPE: [string, "heading" | "body" | "mono", number, number, string][] = [
  ["Heading/H1", "heading", 36, 700, "The quick brown fox"],
  ["Heading/H2", "heading", 28, 700, "Jumps over the lazy dog"],
  ["Heading/H3", "heading", 20, 700, "Design tokens keep every screen consistent"],
  ["Body/Large", "body", 18, 400, "Body copy for introductions and short marketing text."],
  ["Body/Default", "body", 14, 400, "Default body text for interfaces, forms, tables and descriptions."],
  ["Body/Small", "body", 12, 400, "Captions, helper text and metadata."],
  ["Label/Default", "body", 14, 500, "Form labels and button text"],
  ["Mono", "mono", 13, 400, "const radius = \"0.625rem\";"],
];

const vars = (t: Palette) => KEYS.map((k) => `--${k}:${t[k]}`).join(";");

/** A single self-contained HTML page documenting the system, for designers, developers and stakeholders. */
export function styleGuide(sys: DesignSystem, plan: PlanId) {
  const r = sys.radius * 16;
  const radii: [string, number][] = [["sm", Math.max(0, r - 4)], ["md", Math.max(0, r - 2)], ["lg", r], ["xl", r + 4]];
  const report = contrastReport(sys);
  const swatch = (k: TokenKey) => `<div class="sw"><i style="background:var(--${k})"></i><b>${k}</b><code>${sys.light[k]} <span>/ ${sys.dark[k]}</span></code></div>`;
  const pass = (ratio: number) => (ratio >= 7 ? `<span class="ok">AAA</span>` : ratio >= 4.5 ? `<span class="ok">AA</span>` : `<span class="low">Below AA</span>`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(sys.name)} · Style guide</title>
<link rel="stylesheet" href="${googleFontsHref([sys.fonts.heading, sys.fonts.body, sys.fonts.mono])}">
<style>
:root{${vars(sys.light)};--radius:${sys.radius}rem;--font-sans:${fontStack(sys.fonts.body)};--font-heading:${fontStack(sys.fonts.heading)};--font-mono:${fontStack(sys.fonts.mono, "mono")};color-scheme:light}
:root.dark{${vars(sys.dark)};color-scheme:dark}
*{box-sizing:border-box;margin:0}
body{background:var(--background);color:var(--foreground);font:14px/1.55 var(--font-sans);-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:var(--font-heading);letter-spacing:-.02em;line-height:1.15}
code{font-family:var(--font-mono);font-size:12px}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
header{border-bottom:1px solid var(--border);padding:48px 0 32px}
header .wrap{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:end}
header h1{font-size:44px}
header p{color:var(--muted-foreground);font-size:17px;max-width:60ch;margin-top:8px}
.kicker{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted-foreground)}
nav{position:sticky;top:0;z-index:2;background:var(--background);border-bottom:1px solid var(--border)}
nav .wrap{display:flex;gap:4px;overflow-x:auto;padding-top:8px;padding-bottom:8px}
nav a{color:var(--muted-foreground);text-decoration:none;padding:6px 10px;border-radius:calc(var(--radius) - 2px);white-space:nowrap;font-weight:500}
nav a:hover{background:var(--accent);color:var(--accent-foreground)}
section{padding:48px 0;border-bottom:1px solid var(--border)}
section>h2{font-size:28px;margin-bottom:6px}
section>.lead{color:var(--muted-foreground);margin-bottom:28px;max-width:70ch}
h3{font-size:16px;margin:28px 0 4px}
h3+p{color:var(--muted-foreground);margin-bottom:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.sw{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--card)}
.sw i{display:block;height:64px;border-bottom:1px solid var(--border)}
.sw b{display:block;padding:8px 10px 0;font-weight:500;font-size:13px}
.sw code{display:block;padding:0 10px 10px;color:var(--muted-foreground)}
.sw code span{opacity:.7}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--border)}
th{color:var(--muted-foreground);font-weight:500}
td.num{font-variant-numeric:tabular-nums}
.pair{display:inline-grid;place-items:center;width:44px;height:26px;border-radius:calc(var(--radius) - 4px);border:1px solid var(--border);font-weight:700;font-size:12px}
.ok,.low{font-weight:600}.ok{color:var(--foreground)}.ok::before{content:"✓ "}.low{color:color-mix(in oklab,var(--destructive) 60%,var(--foreground))}
.type{display:grid;grid-template-columns:160px 1fr;gap:8px 24px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--border)}
.type small{color:var(--muted-foreground);font-size:12px}
.radii{display:flex;flex-wrap:wrap;gap:16px}
.radii div{width:120px;height:88px;border:1px solid var(--border);background:var(--muted);display:grid;place-items:center;font-size:12px;color:var(--muted-foreground)}
.demo{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.panel{border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);background:var(--card);color:var(--card-foreground);padding:20px;display:flex;flex-direction:column;gap:14px}
.panel>.kicker{margin-bottom:-4px}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:calc(var(--radius) - 2px);font:500 14px var(--font-sans);border:0;cursor:pointer}
.btn.default{background:var(--primary);color:var(--primary-foreground);box-shadow:inset 0 1px 0 rgb(255 255 255/.18),0 0 0 1px var(--primary),0 1px 3px rgb(0 0 0/.14)}
.btn.secondary{background:var(--secondary);color:var(--secondary-foreground);box-shadow:0 0 0 1px var(--border)}
.btn.outline{background:var(--background);color:var(--foreground);box-shadow:0 0 0 1px var(--input),0 1px 2px rgb(0 0 0/.06)}
.btn.ghost{background:none;color:var(--foreground)}
.btn.destructive{background:var(--destructive);color:var(--destructive-foreground);box-shadow:inset 0 1px 0 rgb(255 255 255/.2),0 0 0 1px var(--destructive),0 1px 3px rgb(0 0 0/.14)}
.btn.link{background:none;color:var(--primary);text-decoration:underline;text-underline-offset:4px}
.badge{display:inline-flex;padding:2px 8px;border-radius:max(3px,calc(var(--radius) - 4px));font-size:11px;line-height:16px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;border:1px solid transparent}
.badge.default{background:var(--primary);color:var(--primary-foreground)}
.badge.secondary{background:var(--secondary);color:var(--secondary-foreground);border-color:var(--border)}
.badge.outline{border-color:var(--border)}
.badge.destructive{background:var(--destructive);color:var(--destructive-foreground)}
.badge.success{background:var(--success);color:var(--success-foreground)}.badge.warning{background:var(--warning);color:var(--warning-foreground)}.badge.info{background:var(--info);color:var(--info-foreground)}
label{font-weight:500;font-size:14px}
.field{display:grid;gap:6px}
.input{height:36px;border:1px solid var(--input);border-radius:calc(var(--radius) - 2px);padding:0 12px;display:flex;align-items:center;justify-content:space-between;color:var(--muted-foreground);background:color-mix(in srgb,var(--muted) 50%,var(--background))}
.input.focus{border-color:var(--ring);background:var(--background);box-shadow:0 0 0 4px color-mix(in srgb,var(--ring) 15%,transparent);color:var(--foreground)}
.check{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:max(3px,calc(var(--radius) - 6px));border:1px solid var(--input);background:color-mix(in srgb,var(--muted) 50%,var(--background))}
.check.on{background:var(--primary);border-color:var(--primary);color:var(--primary-foreground);font-size:11px;font-weight:700}
.radio{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--input)}
.radio.on{border-color:var(--primary);background:var(--primary)}.radio.on::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--primary-foreground)}
.switch{width:36px;height:20px;border-radius:max(4px,calc(var(--radius) - 2px));background:var(--input);padding:2px;display:inline-flex;box-shadow:inset 0 1px 2px rgb(0 0 0/.12)}
.switch::after{content:"";width:16px;height:16px;border-radius:max(3px,calc(var(--radius) - 4px));background:var(--background);box-shadow:0 1px 2px rgb(0 0 0/.2)}
.switch.on{background:var(--primary);justify-content:flex-end}
.alert{border:1px solid var(--border);border-left:3px solid var(--primary);border-radius:var(--radius);padding:12px 16px}
.alert b{display:block;font-weight:600}.alert p{color:var(--muted-foreground)}
.alert.destructive{--tone:var(--destructive)}.alert.success{--tone:var(--success)}.alert.warning{--tone:var(--warning)}.alert.info{--tone:var(--info)}
.alert.destructive,.alert.success,.alert.warning,.alert.info{border-color:color-mix(in oklab,var(--tone) 25%,transparent);border-left-color:var(--tone);background:color-mix(in oklab,var(--tone) 5%,var(--card));color:color-mix(in oklab,var(--tone) 60%,var(--foreground))}
.alert.destructive p,.alert.success p,.alert.warning p,.alert.info p{color:inherit}
.progress{height:8px;border-radius:max(2px,calc(var(--radius) - 6px));background:color-mix(in srgb,var(--primary) 12%,transparent);overflow:hidden}
.progress i{display:block;height:100%;width:66%;background:var(--primary);border-radius:inherit}
.tabs{display:inline-flex;gap:20px;color:var(--muted-foreground);box-shadow:inset 0 -1px 0 var(--border);width:fit-content}
.tabs span{padding:6px 2px;font-weight:500}
.tabs span.on{color:var(--foreground);box-shadow:inset 0 -2px 0 var(--primary)}
.bars{display:flex;align-items:end;gap:6px;height:80px}.bars i{flex:1;border-radius:4px 4px 0 0;background:var(--chart-1)}
.series{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--muted-foreground)}.series span{display:inline-flex;align-items:center;gap:6px}.series i{width:10px;height:10px;border-radius:3px}
.muted{color:var(--muted-foreground)}
ul.rules{display:grid;gap:8px;padding-left:20px;max-width:75ch}
footer{padding:32px 0 48px;color:var(--muted-foreground);font-size:13px}
@media (max-width:640px){header h1{font-size:34px}.type{grid-template-columns:1fr}}
</style>
</head>
<body>
<header><div class="wrap">
  <div><p class="kicker">${plan === "custom" ? "Adapted from Tessera" : "Tessera UI"} · Style guide</p><h1>${esc(sys.name)}</h1><p>${esc(sys.tagline)}</p></div>
  <button class="btn outline" id="mode" type="button">Dark mode</button>
</div></header>
<nav><div class="wrap"><a href="#colors">Colors</a><a href="#contrast">Contrast</a><a href="#type">Typography</a><a href="#radius">Radius</a><a href="#components">Components</a><a href="#usage">Usage</a></div></nav>
<main class="wrap">

<section id="colors">
  <h2>Colors</h2>
  <p class="lead">Every color is a token. Values are listed as light / dark; the swatches follow the mode toggle above. Use tokens by name (<code>bg-primary</code>, <code>var(--primary)</code>), never raw hex values.</p>
  ${GROUPS.map(([title, desc, keys]) => `<h3>${title}</h3><p>${desc}</p><div class="grid">${keys.map(swatch).join("")}</div>`).join("\n  ")}
</section>

<section id="contrast">
  <h2>Contrast</h2>
  <p class="lead">Text and surface pairs checked against WCAG 2.2: 4.5:1 is AA for body text, 7:1 is AAA.</p>
  <table><thead><tr><th>Mode</th><th>Sample</th><th>Pair</th><th>Ratio</th><th>Result</th></tr></thead><tbody>
  ${report.map((c) => `<tr><td>${c.mode}</td><td><span class="pair" style="background:${sys[c.mode][c.bg]};color:${sys[c.mode][c.fg]}">Aa</span></td><td>${c.fg} on ${c.bg}</td><td class="num">${c.ratio.toFixed(2)}:1</td><td>${pass(c.ratio)}</td></tr>`).join("\n  ")}
  </tbody></table>
</section>

<section id="type">
  <h2>Typography</h2>
  <p class="lead">Headings use <b>${esc(sys.fonts.heading)}</b>, body text uses <b>${esc(sys.fonts.body)}</b> and code uses <b>${esc(sys.fonts.mono)}</b>. The same scale exists as text styles in the Figma kit.</p>
  ${TYPE.map(([name, kind, size, weight, sample]) => `<div class="type"><small>${name} · ${size}px / ${weight}</small><div style="font-family:var(--font-${kind === "body" ? "sans" : kind});font-size:${size}px;font-weight:${weight};letter-spacing:${kind === "heading" ? "-0.02em" : "0"}">${esc(sample)}</div></div>`).join("\n  ")}
</section>

<section id="radius">
  <h2>Radius</h2>
  <p class="lead">One base radius (${sys.radius}rem) drives four steps. Inputs and buttons use md, cards use xl.</p>
  <div class="radii">${radii.map(([n, px]) => `<div style="border-radius:${px}px">${n} · ${px}px</div>`).join("")}</div>
</section>

<section id="components">
  <h2>Components</h2>
  <p class="lead">A sample of the kit rendered with these tokens. The React sources are in <code>components/ui</code>; the Figma importer builds the same set.</p>
  <div class="demo">
    <div class="panel"><p class="kicker">Button</p><div class="row"><span class="btn default">Primary</span><span class="btn secondary">Secondary</span><span class="btn outline">Outline</span></div><div class="row"><span class="btn ghost">Ghost</span><span class="btn destructive">Delete</span><span class="btn link">Link</span></div></div>
    <div class="panel"><p class="kicker">Badge</p><div class="row"><span class="badge default">Badge</span><span class="badge secondary">Secondary</span><span class="badge outline">Outline</span></div>
      <div class="row"><span class="badge success">Paid</span><span class="badge warning">Pending</span><span class="badge destructive">Failed</span><span class="badge info">New</span></div>
      <p class="kicker">Tabs</p><div class="tabs"><span class="on">Account</span><span>Password</span></div></div>
    <div class="panel"><p class="kicker">Inputs</p><div class="field"><label>Email</label><div class="input">name@example.com</div></div><div class="field"><label>Focused</label><div class="input focus">leyla@studio.az</div></div><div class="field"><label>Select</label><div class="input">Select a plan <span>▾</span></div></div></div>
    <div class="panel"><p class="kicker">Selection</p><div class="row"><span class="check on">✓</span> Accept terms</div><div class="row"><span class="check"></span> Send me the newsletter</div><div class="row"><span class="radio on"></span> Comfortable <span class="radio" style="margin-left:12px"></span> Compact</div><div class="row"><span class="switch on"></span> Notifications <span class="switch" style="margin-left:12px"></span> Digest</div></div>
    <div class="panel"><p class="kicker">Feedback</p><div class="alert"><b>Heads up</b><p>You can add components with the CLI.</p></div><div class="alert success"><b>Payment received</b><p>Your receipt is on its way.</p></div><div class="alert warning"><b>Card expires soon</b><p>Update it before the 30th.</p></div><div class="alert destructive"><b>Payment failed</b><p>Check your card details and try again.</p></div><div class="progress"><i></i></div></div>
    <div class="panel"><p class="kicker">Card &amp; charts</p><div><p class="muted">Total revenue</p><p style="font:600 28px var(--font-heading);letter-spacing:-.02em">$45,231.89</p></div><div class="bars">${[42, 64, 38, 80, 56, 92, 70, 48, 86, 60].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
      <p class="kicker">Data palette</p><div class="series">${["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"].map((n, i) => `<span><i style="background:var(--chart-${i + 1})"></i>${n}</span>`).join("")}</div></div>
  </div>
</section>

<section id="usage">
  <h2>Usage</h2>
  <p class="lead">Rules that keep products built with ${esc(sys.name)} consistent.</p>
  <ul class="rules">
    <li>Use one <b>primary</b> button per view for the main action; use secondary, outline or ghost for the rest.</li>
    <li>Reserve <b>destructive</b> for actions that delete or cannot be undone, and for error messages.</li>
    <li>Always pair a surface with its foreground token (<code>primary</code> with <code>primary-foreground</code>, <code>card</code> with <code>card-foreground</code>).</li>
    <li>Use <b>muted-foreground</b> only for secondary text on <code>background</code>, <code>card</code> or <code>muted</code>.</li>
    <li>Keep the focus <b>ring</b> visible on every interactive element; never remove outlines without a replacement.</li>
    <li>Change the system by editing tokens, not by overriding colors inside components.</li>
  </ul>
  ${sys.notes.length ? `<h3>Design notes</h3><ul class="rules">${sys.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
</section>
</main>
<footer class="wrap">${esc(sys.name)} design system · Tessera UI · See LICENSE.md for usage terms.</footer>
<script>
(function(){var root=document.documentElement,btn=document.getElementById("mode");
function set(d){root.classList.toggle("dark",d);btn.textContent=d?"Light mode":"Dark mode"}
set(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);
btn.addEventListener("click",function(){set(!root.classList.contains("dark"))})})();
</script>
</body>
</html>
`;
}
