import { BASE_ID } from "./tokens";

export type PlanId = "base" | "custom";

/** Both editions ship the same kit; "custom" is the base system adapted to the buyer's reference. */
export const KIT_FILES = [
  "app/globals.css",
  "tokens.json",
  "components/ui/*.tsx (23)",
  "figma/README.md (plugin code)",
  "figma/offline-plugin/",
  "style-guide.html",
  "README.md",
  "LICENSE.md",
];

export const PLANS: Record<PlanId, { name: string; amount: number; description: string }> = {
  base: {
    name: "Tessera system",
    amount: 4900,
    description: "The Tessera design system as shown on this site: CSS variables, tokens, React components and the Figma importer.",
  },
  custom: {
    name: "Adapted system",
    amount: 7900,
    description: "Tessera adapted to your reference: your colors, type and corners, with the same code and Figma kit.",
  },
};

export const isPlan = (v: unknown): v is PlanId => v === "base" || v === "custom";

/** The base system sells as "base"; every generated system sells as "custom". */
export const planFor = (systemId: string): PlanId => (systemId === BASE_ID ? "base" : "custom");

export const price = (plan: PlanId) => `$${PLANS[plan].amount / 100}`;
