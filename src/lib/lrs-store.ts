import { promises as fs } from "node:fs";
import path from "node:path";
import type { XApiStatement } from "./xapi";
import { buildStatement } from "./xapi";

/**
 * File-backed LRS.  Durable across dev restarts; append-only.
 * Production: swap for Postgres with hash-chained rows for 21 CFR Part 11
 * tamper evidence. See docs/ARCHITECTURE.md#security-prod-cutover-checklist.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const LRS_FILE = path.join(DATA_DIR, "lrs.json");
const SEED_SENTINEL = path.join(DATA_DIR, ".seeded");

type DiskState = {
  version: 1;
  statements: XApiStatement[];
};

let cache: DiskState | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureLoaded(): Promise<DiskState> {
  if (cache) return cache;
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(LRS_FILE, "utf8");
    cache = JSON.parse(raw) as DiskState;
  } catch {
    cache = { version: 1, statements: [] };
    await flush();
  }
  await seedIfNeeded();
  return cache!;
}

async function flush() {
  const snapshot = JSON.stringify(cache, null, 2);
  writeQueue = writeQueue.then(() =>
    fs.writeFile(LRS_FILE, snapshot, "utf8").catch(() => undefined),
  );
  await writeQueue;
}

async function seedIfNeeded() {
  try {
    await fs.access(SEED_SENTINEL);
    return;
  } catch {
    /* not seeded yet */
  }
  if (!cache) return;
  const seeds = generateSeedStatements();
  cache.statements = [...seeds, ...cache.statements];
  await flush();
  await fs.writeFile(SEED_SENTINEL, new Date().toISOString(), "utf8");
}

function generateSeedStatements(): XApiStatement[] {
  const trainees = [
    { id: "ramesh.kumar", name: "Ramesh Kumar", plant: "aurobindo-u7" },
    { id: "priya.nair", name: "Priya Nair", plant: "aurobindo-u7" },
    { id: "venkatesh.rao", name: "Venkatesh Rao", plant: "msn-unit2" },
    { id: "sana.khan", name: "Sana Khan", plant: "msn-unit4" },
    { id: "anand.reddy", name: "Anand Reddy", plant: "aurobindo-u8" },
    { id: "lakshmi.iyer", name: "Lakshmi Iyer", plant: "msn-unit2" },
  ];
  const activities = [
    {
      id: "https://mktech.pharma/activities/sop-tp-001",
      name: "Tablet Press Changeover — Product A to B",
      machine: "cadmach-cmd4-d45",
      sop: "sop_tp_001",
    },
    {
      id: "https://mktech.pharma/activities/sop-as-001",
      name: "Grade A Aseptic Intervention",
      machine: "bosch-flc-3080",
      sop: "sop_as_001",
    },
    {
      id: "https://mktech.pharma/activities/sop-bl-001",
      name: "Blister Line Product Changeover",
      machine: "uhlmann-ups-4",
      sop: "sop_bl_001",
    },
  ];
  const now = Date.now();
  const statements: XApiStatement[] = [];
  for (let i = 0; i < 32; i++) {
    const t = trainees[i % trainees.length];
    const a = activities[i % activities.length];
    const scaled = 0.6 + Math.random() * 0.4;
    const daysAgo = Math.floor(Math.random() * 28);
    const ts = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const s = buildStatement({
      actorName: t.name,
      actorId: t.id,
      verb: scaled >= 0.7 ? "passed" : "failed",
      activityId: a.id,
      activityName: a.name,
      machineId: a.machine,
      sopId: a.sop,
      success: scaled >= 0.7,
      scaled,
      durationSec: 600 + Math.floor(Math.random() * 1800),
      extensions: {
        "https://mktech.pharma/ext/deviations": Math.floor(Math.random() * 5),
        "https://mktech.pharma/ext/plant-id": t.plant,
      },
    });
    statements.push({
      ...s,
      id: crypto.randomUUID(),
      timestamp: ts,
    });
  }
  statements.sort((a, b) =>
    (b.timestamp ?? "").localeCompare(a.timestamp ?? ""),
  );
  return statements;
}

export async function listStatements(limit = 200): Promise<XApiStatement[]> {
  const state = await ensureLoaded();
  return state.statements.slice(0, limit);
}

export async function listStatementsByPlant(
  plantId: string | null,
  limit = 200,
): Promise<XApiStatement[]> {
  const all = await listStatements(1000);
  if (!plantId) return all.slice(0, limit);
  const filtered = all.filter((s) => {
    const ext = s.context?.extensions as
      | Record<string, unknown>
      | undefined;
    return ext?.["https://mktech.pharma/ext/plant-id"] === plantId;
  });
  return filtered.slice(0, limit);
}

export async function recordStatement(s: XApiStatement): Promise<void> {
  const state = await ensureLoaded();
  const stamped: XApiStatement = {
    ...s,
    id: s.id ?? crypto.randomUUID(),
    timestamp: s.timestamp ?? new Date().toISOString(),
  };
  state.statements.unshift(stamped);
  if (state.statements.length > 2000) {
    state.statements.length = 2000;
  }
  await flush();
}
