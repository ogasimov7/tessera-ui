// Builds the Community "Tessera Import" plugin into ./figma-plugin, ready to import in Figma and publish.
// Usage: npm run figma:build   (reads NEXT_PUBLIC_SITE_URL and FIGMA_PLUGIN_ID from the environment or .env.local)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = (f) => readFileSync(new URL(`../lib/figma-plugin/${f}`, import.meta.url), "utf8");
const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const id = process.env.FIGMA_PLUGIN_ID || "0000000000000000000"; // assigned by Figma when you create the plugin
const local = /^http:\/\/(localhost|127\.0\.0\.1)/.test(site);

const manifest = {
  name: "Tessera Import",
  id,
  api: "1.0.0",
  main: "code.js",
  ui: "ui.html",
  editorType: ["figma"],
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: local ? ["none"] : [site],
    devAllowedDomains: ["http://localhost:3000"],
    reasoning: "Fetches the design system that belongs to the code you enter.",
  },
};

const out = new URL("../figma-plugin/", import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("manifest.json", out), JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(new URL("code.js", out), src("builder.js") + "\n" + src("community.js").replaceAll("__TESSERA_API__", () => JSON.stringify(site)));
writeFileSync(new URL("ui.html", out), src("ui.html"));
console.log(`figma-plugin/ built for ${site}${id.startsWith("0000") ? " (set FIGMA_PLUGIN_ID before publishing)" : ""}`);
