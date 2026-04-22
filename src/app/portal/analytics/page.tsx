import { listStatementsByPlant, listStatements } from "@/lib/lrs-store";
import { getPlant } from "@/lib/tenant-server";
import { toSessionRows, computeKpis } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const plant = getPlant();
  const scoped = await listStatementsByPlant(plant?.id ?? null, 1000);
  const allRows = toSessionRows(scoped);
  const kpi = computeKpis(allRows);

  // Plant-wide cross-section (always global for this panel).
  const globalRows = toSessionRows(await listStatements(1000));
  const byPlant = new Map<string, { sessions: number; passed: number }>();
  for (const r of globalRows) {
    const key = r.plantId ?? "unknown";
    const cur = byPlant.get(key) ?? { sessions: 0, passed: 0 };
    cur.sessions += 1;
    if (r.status === "passed") cur.passed += 1;
    byPlant.set(key, cur);
  }

  const byModule = new Map<
    string,
    { sessions: number; passed: number; deviations: number }
  >();
  for (const r of allRows) {
    const cur = byModule.get(r.module) ?? {
      sessions: 0,
      passed: 0,
      deviations: 0,
    };
    cur.sessions += 1;
    if (r.status === "passed") cur.passed += 1;
    cur.deviations += r.deviations;
    byModule.set(r.module, cur);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Sessions" value={kpi.sessions.toString()} />
        <KPI label="Pass rate" value={`${kpi.passRate}%`} />
        <KPI label="Avg score" value={`${kpi.avgScore}%`} />
        <KPI label="Deviations" value={kpi.deviations.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white">Pass rate — by plant</h3>
          <p className="text-xs text-slate-500 mt-1">
            Compares all plants regardless of current filter.
          </p>
          <div className="mt-4 space-y-3">
            {Array.from(byPlant.entries())
              .sort((a, b) => b[1].sessions - a[1].sessions)
              .map(([pid, v]) => {
                const pct = v.sessions
                  ? Math.round((v.passed / v.sessions) * 100)
                  : 0;
                return (
                  <div key={pid}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-mono">{pid}</span>
                      <span className="text-slate-400 font-mono">
                        {pct}% ({v.passed}/{v.sessions})
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-pharma-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-pharma-accent to-brand-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-white">Deviations — by module</h3>
          <p className="text-xs text-slate-500 mt-1">
            Hotspot for remediation. Higher bars = more deviations.
          </p>
          <div className="mt-4 space-y-3">
            {Array.from(byModule.entries())
              .sort((a, b) => b[1].deviations - a[1].deviations)
              .slice(0, 8)
              .map(([mod, v]) => {
                const max = Math.max(
                  1,
                  ...Array.from(byModule.values()).map((x) => x.deviations),
                );
                const pct = Math.round((v.deviations / max) * 100);
                return (
                  <div key={mod}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 truncate pr-2">
                        {mod}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {v.deviations}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-pharma-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-pharma-warn to-pharma-bad"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
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
