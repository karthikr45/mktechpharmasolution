import dynamic from "next/dynamic";
import ScenarioPanel, {
  type ScenarioDefinition,
} from "@/components/simulator/ScenarioPanel";
import { ASEPTIC_STEPS } from "@/lib/aseptic-flow";

const AsepticScene = dynamic(
  () => import("@/components/simulator/AsepticScene"),
  { ssr: false, loading: () => <SceneFallback /> },
);

export const metadata = {
  title: "Aseptic Intervention Simulator — MKTech PharmaSim",
};

const SCENARIO: ScenarioDefinition = {
  id: "sop_as_001",
  title: "Grade A Aseptic Intervention",
  subtitle: "SOP-AS-001 · Bosch FLC-3080 · ~20 min nominal",
  machineId: "bosch-flc-3080",
  activityId: "https://mktech.pharma/activities/sop-as-001",
  steps: ASEPTIC_STEPS.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    hotspot: s.hotspot,
    criticality: s.criticality,
    instruction: s.instruction,
    hint: s.hint,
    commonDeviation: s.commonDeviation,
    grade: s.grade,
  })),
};

export default function AsepticSimulatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Aseptic Intervention Simulator
          </h1>
          <p className="text-sm text-slate-400">
            Bosch FLC-3080 · SOP-AS-001 · Grade A under LAF
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-pharma-good animate-pulse" />
          Simulation mode · Grade A envelope
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="card p-0 overflow-hidden h-[560px]">
          <AsepticScene />
        </div>
        <div>
          <ScenarioPanel scenario={SCENARIO} />
        </div>
      </div>
    </div>
  );
}

function SceneFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
      Loading 3D cleanroom...
    </div>
  );
}
