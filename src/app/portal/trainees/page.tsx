import { trainees } from "@/lib/mock-data";

export default function TraineesPage() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold text-white">Trainees</h3>
        <span className="text-xs text-slate-500">{trainees.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pharma-bg/60 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Plant</th>
              <th className="px-4 py-2 text-left">Dept.</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Avg. Score</th>
              <th className="px-4 py-2 text-left">Last session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharma-border">
            {trainees.map((t) => {
              const pct = Math.round((t.sopsCompleted / t.sopsAssigned) * 100);
              return (
                <tr key={t.id} className="hover:bg-pharma-border/20">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{t.plant}</td>
                  <td className="px-4 py-3 text-slate-300">{t.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-pharma-border/50">
                        <div
                          className="h-full bg-pharma-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {t.sopsCompleted}/{t.sopsAssigned}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 font-mono text-sm ${
                      t.avgScore >= 0.9
                        ? "text-green-300"
                        : t.avgScore >= 0.75
                          ? "text-amber-300"
                          : "text-red-300"
                    }`}
                  >
                    {Math.round(t.avgScore * 100)}%
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(t.lastSessionAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
