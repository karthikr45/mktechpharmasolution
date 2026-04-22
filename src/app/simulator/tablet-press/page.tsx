import dynamic from "next/dynamic";
import ChangeoverPanel from "@/components/simulator/ChangeoverPanel";

const TabletPressScene = dynamic(
  () => import("@/components/simulator/TabletPressScene"),
  { ssr: false, loading: () => <SceneFallback /> },
);

export const metadata = {
  title: "Tablet Press Simulator — MKTech PharmaSim",
};

export default function TabletPressSimulatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Tablet Press Simulator
          </h1>
          <p className="text-sm text-slate-400">
            Cadmach CMD-4 D45 · SOP-TP-001 Changeover
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-pharma-good animate-pulse" />
          Simulation mode
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="card p-0 overflow-hidden h-[560px]">
          <TabletPressScene />
        </div>
        <div>
          <ChangeoverPanel />
        </div>
      </div>
    </div>
  );
}

function SceneFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
      Loading 3D scene...
    </div>
  );
}
