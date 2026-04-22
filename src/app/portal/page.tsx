import Link from "next/link";
import { listStatementsByPlant } from "@/lib/lrs-store";
import { getPlant } from "@/lib/tenant-server";
import { computeKpis, rollupTrainees, toSessionRows } from "@/lib/analytics";
import { sopModules } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const plant = getPlant();
  const statements = await listStatementsByPlant(plant?.id ?? null, 400);
  const rows = toSessionRows(statements);
  const kpi = computeKpis(rows);
  const trainees = rollupTrainees(rows);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Active trainees" value={trainees.length.toString()} />
        <KPI label="Pass rate" value={`${kpi.passRate}%`} />
        <KPI label="Avg score" value={`${kpi.avgScore}%`} />
        <KPI label="Deviations (30d)" value={kpi.deviations.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent sessions</h3>
            <Link href="/portal/sessions" className="text-xs text-pharma-accent">
              View all →
            </Link>
          </div>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No sessions yet for this plant. Run one in the{" "}
              <Link href="/simulator" className="text-pharma-accent">
                simulator
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-pharma-border">
              {rows.slice(0, 6).map((s) => (
                <li
                  key={s.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{s.module}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {s.trainee} · {s.machine}
                    </div>
                  </div>
                  <StatusBadge status={s.status} score={s.score} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">SOP library</h3>
            <span className="text-xs text-slate-500">
              {sopModules.length} modules
            </span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {sopModules.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-md border border-pharma-border px-3 py-2"
              >
                <div>
                  <div className="text-sm text-white">{m.title}</div>
                  <div className="text-xs text-slate-500">
                    {m.machine} · {m.steps} steps · ~{m.durationMin} min
                  </div>
                </div>
                <span
                  className={`badge border ${
                    m.criticality === "Critical"
                      ? "border-pharma-bad/40 text-red-300"
                      : m.criticality === "Major"
                        ? "border-pharma-warn/40 text-amber-300"
                        : "border-pharma-border text-slate-300"
                  }`}
                >
                  {m.criticality}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-white">Ready to train?</h3>
        <p className="text-sm text-slate-400 mt-1">
          Pick a scenario — no headset required for the web version.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <Link href="/simulator" className="btn-primary">
            Browse scenarios →
          </Link>
          <Link href="/simulator/tablet-press" className="btn-ghost">
            Tablet press
          </Link>
          <Link href="/simulator/aseptic" className="btn-ghost">
            Aseptic intervention
          </Link>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function StatusBadge({ status, score }: { status: string; score: number }) {
  if (status === "in-progress") {
    return (
      <span className="badge border border-pharma-accent/40 text-pharma-accent">
        live
      </span>
    );
  }
  if (status === "passed") {
    return (
      <span className="badge border border-pharma-good/40 text-green-300">
        {Math.round(score * 100)}% pass
      </span>
    );
  }
  return (
    <span className="badge border border-pharma-bad/40 text-red-300">
      {Math.round(score * 100)}% fail
    </span>
  );
}
