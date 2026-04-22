import { listStatementsByPlant } from "@/lib/lrs-store";
import { getPlant } from "@/lib/tenant-server";
import { rollupTrainees, toSessionRows } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function TraineesPage() {
  const plant = getPlant();
  const statements = await listStatementsByPlant(plant?.id ?? null, 1000);
  const rows = toSessionRows(statements);
  const trainees = rollupTrainees(rows);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold text-white">Trainees</h3>
        <span className="text-xs text-slate-500">
          {trainees.length} active
          {plant && ` · ${plant.label}`}
        </span>
      </div>
      {trainees.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">No trainees yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pharma-bg/60 text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Sessions</th>
                <th className="px-4 py-2 text-left">Pass / Fail</th>
                <th className="px-4 py-2 text-left">Avg. Score</th>
                <th className="px-4 py-2 text-left">Deviations</th>
                <th className="px-4 py-2 text-left">Last session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pharma-border">
              {trainees.map((t) => (
                <tr key={t.id} className="hover:bg-pharma-border/20">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {t.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{t.sessions}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="text-green-300">{t.passed}</span>
                    <span className="text-slate-600"> / </span>
                    <span className="text-red-300">{t.failed}</span>
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
                  <td className="px-4 py-3 text-slate-400 font-mono">
                    {t.totalDeviations}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(t.lastSessionAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
