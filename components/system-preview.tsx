"use client";

import type { CSSProperties } from "react";
import { Showcase } from "@/components/showcase";
import { googleFontsHref, scopeStyle, type DesignSystem, type Mode } from "@/lib/tokens";

/** Renders the showcase with a design system's tokens applied to an isolated scope. */
export function SystemPreview({ system, mode }: { system: DesignSystem; mode: Mode }) {
  const href = googleFontsHref([system.fonts.heading, system.fonts.body, system.fonts.mono]);
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="ds-scope rounded-2xl border p-3 sm:p-5" style={scopeStyle(system, mode) as CSSProperties}>
        <Showcase />
      </div>
    </>
  );
}
