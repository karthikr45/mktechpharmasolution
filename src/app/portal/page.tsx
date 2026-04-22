import Link from "next/link";
import { sessions, sopModules, trainees } from "@/lib/mock-data";

export default function PortalDashboard() {
  const totalTrainees = trainees.length;
  const completionRate =
    Math.round(
      (trainees.reduce((a, t) => a + t.sopsCompleted, 0) /
        trainees.reduce((a, t) => a + t.sopsAssigned, 0)) *
        100,
    ) || 0;
  const avgScore = Math.round(
    (trainees.reduce((a, t) => a + t.avgScore, 0) / trainees.length) * 100,
  );
  const openDeviations = sessions.reduce((a, s) => a + s.deviations, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Active trainees" value={totalTrainees.toString()} trend="+2 this week" />
        <KPI label="SOP completion" value={`${completionRate}%`} trend="+6% vs last mo" />
        <KPI label="Avg score" value={`${avgScore}%`} trend="+3%" />
        <KPI label="Deviations (30d)" value={openDeviations.toString()} trend="-5 vs prior" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent sessions</h3>
            <Link href="/portal/sessions" className="text-xs text-pharma-accent">
              View all →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-pharma-border">
            {sessions.slice(0, 5).map((s) => (
              <li key={s.id} className="py-2.5 flex items-center justify-between gap-2">
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
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">SOP library</h3>
            <span className="text-xs text-slate-500">{sopModules.length} modules</span>
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
          Launch the web simulator — no headset required.
        </p>
        <div className="mt-3">
          <Link href="/simulator/tablet-press" className="btn-primary">
            Open Tablet Press simulator →
          </Link>
        </div>
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-[11px] text-pharma-good">{trend}</div>
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
