import { sessions } from "@/lib/mock-data";

export default function SessionsPage() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold text-white">Training sessions</h3>
        <span className="text-xs text-slate-500">{sessions.length} recent</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pharma-bg/60 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2 text-left">Trainee</th>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Machine</th>
              <th className="px-4 py-2 text-left">Started</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Deviations</th>
              <th className="px-4 py-2 text-left">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharma-border">
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-pharma-border/20">
                <td className="px-4 py-3 text-white">{s.trainee}</td>
                <td className="px-4 py-3 text-slate-300">{s.module}</td>
                <td className="px-4 py-3 text-slate-300">{s.machine}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(s.startedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {s.durationMin > 0 ? `${s.durationMin} min` : "—"}
                </td>
                <td
                  className={`px-4 py-3 font-mono ${
                    s.deviations > 2
                      ? "text-red-300"
                      : s.deviations > 0
                        ? "text-amber-300"
                        : "text-slate-400"
                  }`}
                >
                  {s.deviations}
                </td>
                <td className="px-4 py-3">
                  {s.status === "passed" && (
                    <span className="badge border border-pharma-good/40 text-green-300">
                      Pass · {Math.round(s.score * 100)}%
                    </span>
                  )}
                  {s.status === "failed" && (
                    <span className="badge border border-pharma-bad/40 text-red-300">
                      Fail · {Math.round(s.score * 100)}%
                    </span>
                  )}
                  {s.status === "in-progress" && (
                    <span className="badge border border-pharma-accent/40 text-pharma-accent">
                      In progress
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
