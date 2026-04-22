import Link from "next/link";

export const metadata = {
  title: "Simulator — MKTech PharmaSim",
};

interface ScenarioCard {
  href: string;
  title: string;
  subtitle: string;
  machine: string;
  duration: string;
  steps: number;
  grade?: string;
  criticality: "Critical" | "Major";
  status: "Ready" | "Coming soon";
  summary: string;
  tags: string[];
}

const scenarios: ScenarioCard[] = [
  {
    href: "/simulator/tablet-press",
    title: "Tablet Press Changeover",
    subtitle: "SOP-TP-001 · Product A → B",
    machine: "Cadmach CMD-4 D45",
    duration: "~35 min",
    steps: 9,
    criticality: "Critical",
    status: "Ready",
    summary:
      "Line clearance, tooling swap, cleaning verification, first-article inspection and QA release.",
    tags: ["OSD", "Formulations", "Aurobindo U8", "MSN Unit-IV"],
  },
  {
    href: "/simulator/aseptic",
    title: "Grade A Aseptic Intervention",
    subtitle: "SOP-AS-001 · Stalled vial removal",
    machine: "Bosch FLC-3080",
    duration: "~20 min",
    steps: 7,
    grade: "A / B",
    criticality: "Critical",
    status: "Ready",
    summary:
      "Gowning, airlock transit, approach, first-air safe intervention and documentation.",
    tags: ["Injectables", "Aseptic", "Aurobindo U7", "MSN Oncology"],
  },
  {
    href: "#",
    title: "Blister Line Changeover",
    subtitle: "SOP-BL-001 · Reel + cutter swap",
    machine: "Uhlmann UPS-4",
    duration: "~30 min",
    steps: 11,
    criticality: "Major",
    status: "Coming soon",
    summary:
      "Forming reel change, cutting tool swap, vision-system re-teach, line release.",
    tags: ["Packaging", "Aurobindo U8"],
  },
  {
    href: "#",
    title: "CIP / SIP Reactor Verification",
    subtitle: "SOP-CIP-001 · Cleaning validation",
    machine: "Reactor R-204",
    duration: "~40 min",
    steps: 14,
    criticality: "Critical",
    status: "Coming soon",
    summary:
      "Line isolation, rinse cycle, swab sampling, TOC check, e-sig release.",
    tags: ["API", "MSN Unit-II"],
  },
  {
    href: "#",
    title: "EHS — Solvent Fire Response",
    subtitle: "Emergency drill",
    machine: "Production floor",
    duration: "~10 min",
    steps: 6,
    criticality: "Critical",
    status: "Coming soon",
    summary:
      "Evacuation protocol, fire suppression, reporting, incident debrief.",
    tags: ["EHS", "All plants"],
  },
];

export default function ScenarioPicker() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Training scenarios
          </h1>
          <p className="text-sm text-slate-400">
            Pick a module. Each session ends with a scored xAPI record.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((s) => {
          const disabled = s.status === "Coming soon";
          const content = (
            <div
              className={`card h-full flex flex-col ${
                disabled
                  ? "opacity-60"
                  : "hover:border-pharma-accent/50 transition-colors"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-pharma-accent">
                    {s.subtitle}
                  </div>
                  <h3 className="mt-1 font-semibold text-white">{s.title}</h3>
                </div>
                <span
                  className={`badge border ${
                    s.status === "Ready"
                      ? "border-pharma-good/40 text-green-300"
                      : "border-pharma-border text-slate-400"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400 flex-1">{s.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="badge border border-pharma-border text-slate-400 text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500">
                <InfoCell label="Duration" value={s.duration} />
                <InfoCell label="Steps" value={s.steps.toString()} />
                <InfoCell
                  label="Criticality"
                  value={s.criticality}
                  color={s.criticality === "Critical" ? "text-red-300" : "text-amber-300"}
                />
              </dl>
              <div className="mt-4 text-[11px] text-slate-500 font-mono">
                {s.machine}
                {s.grade && ` · Grade ${s.grade}`}
              </div>
            </div>
          );
          return disabled ? (
            <div key={s.title}>{content}</div>
          ) : (
            <Link key={s.title} href={s.href}>
              {content}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 card">
        <h3 className="font-semibold text-white">How a scenario works</h3>
        <ol className="mt-3 text-sm text-slate-400 space-y-1 list-decimal list-inside">
          <li>Sign the e-signature form (21 CFR Part 11)</li>
          <li>Follow the highlighted SOP step in the 3D scene</li>
          <li>Out-of-sequence clicks are logged as deviations</li>
          <li>
            On completion, an xAPI statement is posted to the LRS and shows up
            in the{" "}
            <Link href="/portal/sessions" className="text-pharma-accent">
              portal
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <dt className="uppercase tracking-wide text-[10px]">{label}</dt>
      <dd className={`mt-0.5 font-medium ${color ?? "text-slate-300"}`}>{value}</dd>
    </div>
  );
}
