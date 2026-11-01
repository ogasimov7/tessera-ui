import postgres from "postgres";
import { BASE_ID, BASE_SYSTEM, type DesignSystem } from "./tokens";
import type { PlanId } from "./plans";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

function client() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  globalThis.__sql ??= postgres(process.env.DATABASE_URL, { max: 5 });
  return globalThis.__sql;
}

export const newId = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

// No 0/O, 1/I/L, so codes survive being read aloud or retyped from a screenshot.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
/** A Figma import code like TSR-7KQ4-M2XD-9PWA (60 bits of randomness). */
export function newFigmaCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `TSR-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`;
}
export const normalizeFigmaCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^TSR/, "");

export async function saveSystem(sys: DesignSystem, brief: string) {
  const id = newId("ds");
  const sql = client();
  await sql`insert into design_systems (id, name, data, brief) values (${id}, ${sys.name}, ${sql.json(sys as never)}, ${brief})`;
  return id;
}

export async function getSystem(id: string): Promise<DesignSystem | null> {
  if (id === BASE_ID) return BASE_SYSTEM;
  const rows = await client()<{ data: DesignSystem }[]>`select data from design_systems where id = ${id}`;
  return rows[0]?.data ?? null;
}

export async function createPendingPurchase(systemId: string, plan: PlanId, stripeSessionId: string) {
  await client()`insert into purchases (id, system_id, plan, stripe_session_id, figma_code)
    values (${newId("pur")}, ${systemId}, ${plan}, ${stripeSessionId}, ${newFigmaCode()})
    on conflict (stripe_session_id) do nothing`;
}

export async function markPaid(stripeSessionId: string, email: string | null) {
  await client()`update purchases set status = 'paid', email = coalesce(${email}, email) where stripe_session_id = ${stripeSessionId}`;
}

/** The paid purchase of this system with this checkout session, or null. */
export async function paidPurchase(systemId: string, stripeSessionId: string): Promise<{ plan: PlanId; figmaCode: string } | null> {
  const rows = await client()<{ plan: PlanId; figma_code: string }[]>`
    select plan, figma_code from purchases where system_id = ${systemId} and stripe_session_id = ${stripeSessionId} and status = 'paid'`;
  return rows[0] ? { plan: rows[0].plan, figmaCode: rows[0].figma_code } : null;
}

/** The system a paid Figma code unlocks, or null. Dashes and case are ignored. */
export async function systemForFigmaCode(code: string): Promise<DesignSystem | null> {
  const key = normalizeFigmaCode(code);
  if (key.length !== 12) return null;
  const formatted = `TSR-${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(8)}`;
  const rows = await client()<{ system_id: string }[]>`
    select system_id from purchases where figma_code = ${formatted} and status = 'paid'`;
  return rows[0] ? getSystem(rows[0].system_id) : null;
}
