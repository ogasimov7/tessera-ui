import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { buildFiles } from "./exporters";
import type { PlanId } from "./plans";
import type { DesignSystem } from "./tokens";
import { slug } from "./utils";

/** The download zip for a system: same contents for paid and test downloads. Server-only (reads from disk). */
export async function kitZip(system: DesignSystem, plan: PlanId, figmaCode: string) {
  const pluginDir = path.join(process.cwd(), "lib/figma-plugin");
  const plugin = (await readFile(path.join(pluginDir, "builder.js"), "utf8")) + "\n" + (await readFile(path.join(pluginDir, "offline.js"), "utf8"));
  // The shipped components are the ones this site renders, read from components/ui.
  const uiDir = path.join(process.cwd(), "components/ui");
  const names = (await readdir(uiDir)).filter((f) => f.endsWith(".tsx")).sort();
  const components = Object.fromEntries(await Promise.all(names.map(async (f) => [`components/ui/${f}`, await readFile(path.join(uiDir, f), "utf8")])));
  const files = buildFiles(system, plan, components, {
    code: figmaCode,
    plugin,
    pluginUrl: process.env.NEXT_PUBLIC_FIGMA_PLUGIN_URL || undefined,
  });

  const root = `${slug(system.name)}-design-system/`;
  const zip = new JSZip();
  for (const [p, content] of Object.entries(files)) zip.file(root + p, content);
  return new Response((await zip.generateAsync({ type: "uint8array" })) as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug(system.name)}-design-system.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
