"use client";

import { useTransition } from "react";
import { selectPlant } from "@/app/actions";
import { PLANTS, type PlantId } from "@/lib/tenant";

export default function PlantSelector({
  currentId,
}: {
  currentId: PlantId | null;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500 hidden sm:inline">Plant:</span>
      <select
        className="rounded-md border border-pharma-border bg-pharma-bg px-2 py-1 text-slate-200 focus:border-pharma-accent focus:outline-none"
        value={currentId ?? ""}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(async () => {
            await selectPlant(next);
          });
        }}
      >
        <option value="" disabled>
          Select a plant…
        </option>
        {PLANTS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
