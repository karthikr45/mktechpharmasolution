import type { XApiStatement } from "./xapi";

export interface SessionRow {
  id: string;
  trainee: string;
  traineeId: string;
  module: string;
  machine: string;
  startedAt: string;
  durationMin: number;
  score: number;
  deviations: number;
  plantId: string | null;
  status: "passed" | "failed" | "in-progress";
}

export interface TraineeRollup {
  id: string;
  name: string;
  plantId: string | null;
  sessions: number;
  passed: number;
  failed: number;
  avgScore: number;
  lastSessionAt: string;
  totalDeviations: number;
}

function parseDuration(iso?: string): number {
  if (!iso) return 0;
  const m = /^PT(\d+)S$/.exec(iso);
  return m ? parseInt(m[1], 10) : 0;
}

function readExt<T = unknown>(s: XApiStatement, key: string): T | undefined {
  const ext = s.context?.extensions as Record<string, unknown> | undefined;
  return ext?.[key] as T | undefined;
}

export function toSessionRows(statements: XApiStatement[]): SessionRow[] {
  return statements.map((s) => {
    const passed = s.verb.id.endsWith("/passed");
    const failed = s.verb.id.endsWith("/failed");
    const score = s.result?.score?.scaled ?? 0;
    const durSec = parseDuration(s.result?.duration);
    const deviations =
      (readExt<number>(s, "https://mktech.pharma/ext/deviations") ?? 0) | 0;
    const plantId =
      readExt<string>(s, "https://mktech.pharma/ext/plant-id") ?? null;
    return {
      id: s.id ?? crypto.randomUUID(),
      trainee: s.actor.name,
      traineeId: s.actor.account.name,
      module:
        s.object.definition.name["en-US"] ??
        Object.values(s.object.definition.name)[0] ??
        "Unknown module",
      machine:
        (readExt<string>(s, "https://mktech.pharma/ext/machine-id") ?? "—"),
      startedAt: s.timestamp ?? new Date().toISOString(),
      durationMin: Math.round(durSec / 60),
      score,
      deviations,
      plantId,
      status: passed ? "passed" : failed ? "failed" : "in-progress",
    };
  });
}

export function rollupTrainees(rows: SessionRow[]): TraineeRollup[] {
  const by = new Map<string, TraineeRollup>();
  for (const r of rows) {
    const cur = by.get(r.traineeId) ?? {
      id: r.traineeId,
      name: r.trainee,
      plantId: r.plantId,
      sessions: 0,
      passed: 0,
      failed: 0,
      avgScore: 0,
      lastSessionAt: r.startedAt,
      totalDeviations: 0,
    };
    cur.sessions += 1;
    if (r.status === "passed") cur.passed += 1;
    if (r.status === "failed") cur.failed += 1;
    cur.totalDeviations += r.deviations;
    cur.avgScore =
      (cur.avgScore * (cur.sessions - 1) + r.score) / cur.sessions;
    if (r.startedAt > cur.lastSessionAt) cur.lastSessionAt = r.startedAt;
    by.set(r.traineeId, cur);
  }
  return Array.from(by.values()).sort((a, b) =>
    b.lastSessionAt.localeCompare(a.lastSessionAt),
  );
}

export function computeKpis(rows: SessionRow[]) {
  const completed = rows.filter((r) => r.status !== "in-progress");
  const passed = completed.filter((r) => r.status === "passed").length;
  const passRate = completed.length
    ? Math.round((passed / completed.length) * 100)
    : 0;
  const avgScore = completed.length
    ? Math.round(
        (completed.reduce((a, r) => a + r.score, 0) / completed.length) * 100,
      )
    : 0;
  const deviations = rows.reduce((a, r) => a + r.deviations, 0);
  const trainees = new Set(rows.map((r) => r.traineeId)).size;
  return {
    sessions: rows.length,
    passRate,
    avgScore,
    deviations,
    trainees,
  };
}
