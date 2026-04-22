import { sessions, trainees } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const byPlant = trainees.reduce<Record<string, { total: number; done: number }>>(
    (acc, t) => {
      acc[t.plant] = acc[t.plant] ?? { total: 0, done: 0 };
      acc[t.plant].total += t.sopsAssigned;
      acc[t.plant].done += t.sopsCompleted;
      return acc;
    },
    {},
  );
  const byDept = trainees.reduce<Record<string, number[]>>((acc, t) => {
    acc[t.department] = acc[t.department] ?? [];
    acc[t.department].push(t.avgScore);
    return acc;
  }, {});

  const totalDeviations = sessions.reduce((a, s) => a + s.deviations, 0);
  const passedSessions = sessions.filter((s) => s.status === "passed").length;
  const failedSessions = sessions.filter((s) => s.status === "failed").length;
  const totalComplete = passedSessions + failedSessions;
  const passRate = totalComplete
    ? Math.round((passedSessions / totalComplete) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Pass rate" value={`${passRate}%`} />
        <KPI label="Deviations" value={totalDeviations.toString()} />
        <KPI label="Sessions (live + done)" value={sessions.length.toString()} />
        <KPI label="Active plants" value={Object.keys(byPlant).length.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white">SOP completion by plant</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byPlant).map(([plant, v]) => {
              const pct = Math.round((v.done / v.total) * 100);
              return (
                <div key={plant}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{plant}</span>
                    <span className="text-slate-400 font-mono">{pct}%</span>
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
          <h3 className="font-semibold text-white">Avg. score by department</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byDept).map(([dept, scores]) => {
              const avg = Math.round(
                (scores.reduce((a, b) => a + b, 0) / scores.length) * 100,
              );
              const color =
                avg >= 90 ? "#22c55e" : avg >= 75 ? "#f59e0b" : "#ef4444";
              return (
                <div key={dept}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{dept}</span>
                    <span className="text-slate-400 font-mono">{avg}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-pharma-border/50">
                    <div
                      className="h-full"
                      style={{ width: `${avg}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-white">Deviation heatmap — top SOP steps</h3>
        <p className="text-xs text-slate-500 mt-1">
          Indicative data. Populated from live xAPI once sessions are recorded.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { step: "Line clearance", count: 8 },
            { step: "Cleaning verification", count: 12 },
            { step: "Torque check", count: 5 },
            { step: "First-article inspection", count: 9 },
            { step: "Parameter entry", count: 3 },
            { step: "E-signature capture", count: 6 },
          ].map((row) => {
            const intensity = Math.min(1, row.count / 12);
            return (
              <div
                key={row.step}
                className="rounded-md border border-pharma-border p-3 text-sm"
                style={{
                  background: `rgba(239,68,68,${intensity * 0.35})`,
                }}
              >
                <div className="text-white">{row.step}</div>
                <div className="text-xs text-slate-400">{row.count} events</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
