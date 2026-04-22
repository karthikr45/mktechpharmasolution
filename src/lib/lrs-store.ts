import type { XApiStatement } from "./xapi";

/**
 * In-memory LRS (Learning Record Store) for the MVP.
 * Replace with durable storage (Postgres / Veracity LRS / SCORM Cloud) for production.
 * The module-level cache survives within a single Node process; serverless deployments
 * should use a real database to avoid cold-start data loss.
 */
const globalAny = globalThis as unknown as { __lrs?: XApiStatement[] };
if (!globalAny.__lrs) {
  globalAny.__lrs = [];
}

export function listStatements(): XApiStatement[] {
  return globalAny.__lrs ?? [];
}

export function recordStatement(s: XApiStatement) {
  globalAny.__lrs!.unshift({
    ...s,
    id: s.id ?? crypto.randomUUID(),
    timestamp: s.timestamp ?? new Date().toISOString(),
  });
  // Cap the in-memory buffer so it never grows unbounded.
  if (globalAny.__lrs!.length > 500) {
    globalAny.__lrs!.length = 500;
  }
}
