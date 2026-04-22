import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative">
      <Hero />
      <UseCases />
      <Clients />
      <Roadmap />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,0.18) 0%, rgba(10,15,30,0) 60%), radial-gradient(40% 40% at 80% 20%, rgba(37,99,235,0.25) 0%, rgba(10,15,30,0) 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <span className="badge bg-pharma-border/50 text-pharma-accent border border-pharma-accent/30">
            Pharma 4.0 · GxP-ready
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            VR training, machine simulation &{" "}
            <span className="text-pharma-accent">digital twins</span> for pharma
            manufacturing.
          </h1>
          <p className="mt-5 text-lg text-slate-300">
            Train operators on tablet presses, blister lines and aseptic suites
            without taking a production line offline. Capture every action as a
            21 CFR Part 11 audit trail. Plug into the real plant via OPC-UA when
            you're ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/simulator" className="btn-primary">
              Browse training scenarios →
            </Link>
            <Link href="/portal" className="btn-ghost">
              Open training portal
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Stat value="₹2–5 Cr" label="avg. line downtime avoided / yr" />
            <Stat value="60%" label="faster operator ramp-up" />
            <Stat value="0" label="real product wasted in training" />
            <Stat value="100%" label="actions audit-logged" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function UseCases() {
  const cases = [
    {
      title: "Tablet Press Operator Training",
      body: "Cadmach / Fette / Korsch changeover, tooling, parameter set-up and first-article inspection — fully virtual.",
      tag: "OSD",
    },
    {
      title: "Aseptic & Gowning Simulator",
      body: "Grade A/B interventions, first-air discipline. Every violation tracked, scored and reported to QA.",
      tag: "Injectables",
    },
    {
      title: "SOP Walkthrough with Deviation Capture",
      body: "Convert your SOPs into immersive scenarios. Mistakes become teaching moments, not batch failures.",
      tag: "GMP",
    },
    {
      title: "CIP / SIP & Changeover",
      body: "Practice cleaning validation, line clearance and product-to-product changeover with timers and scoring.",
      tag: "OSD / API",
    },
    {
      title: "EHS Emergency Drills",
      body: "Solvent fires, powder explosions, cross-contamination response. Immersive retention beats classroom.",
      tag: "EHS",
    },
    {
      title: "Digital Twin of the Line",
      body: "Real-time 3D mirror of the production line fed by OPC-UA / MQTT. OEE, bottlenecks, predictive alerts.",
      tag: "Phase 2",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white">
        Built for the plant floor.
      </h2>
      <p className="mt-2 max-w-2xl text-slate-400">
        Modular platform — start with one machine, scale to a whole plant.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((c) => (
          <div key={c.title} className="card hover:border-pharma-accent/40 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{c.title}</h3>
              <span className="badge bg-brand-900/40 text-brand-100 border border-brand-700/40">
                {c.tag}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Clients() {
  return (
    <section className="border-y border-pharma-border bg-pharma-panel/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Designed for
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-4">
          <ClientLogo name="Aurobindo Pharma" subtitle="Unit 7 · formulations · injectables" />
          <ClientLogo name="MSN Laboratories" subtitle="API · formulations · oncology" />
          <ClientLogo name="+ other tier-1 CDMOs" subtitle="Hyderabad pharma cluster" />
        </div>
      </div>
    </section>
  );
}

function ClientLogo({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-md border border-pharma-border bg-pharma-bg flex items-center justify-center font-mono text-xs text-pharma-accent">
        {name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div>
        <div className="text-sm font-medium text-white">{name}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}

function Roadmap() {
  const phases = [
    {
      phase: "Phase 1 · MVP (Now)",
      items: [
        "Web-based tablet-press simulator (this build)",
        "Training portal with xAPI statements",
        "Changeover SOP walkthrough",
      ],
    },
    {
      phase: "Phase 2 · VR (6–8 wks)",
      items: [
        "Unity build for Meta Quest 3 standalone",
        "Aseptic / gowning module",
        "LMS (SCORM / xAPI) handshake",
      ],
    },
    {
      phase: "Phase 3 · Digital Twin",
      items: [
        "OPC-UA / MQTT ingestion",
        "Live line 3D twin with OEE",
        "Predictive maintenance hooks",
      ],
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white">Roadmap</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {phases.map((p) => (
          <div key={p.phase} className="card">
            <div className="text-sm font-semibold text-pharma-accent">{p.phase}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-pharma-accent">▸</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Try the web simulator now.
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            No headset required. Runs in any modern browser.
          </p>
        </div>
        <Link href="/simulator" className="btn-primary whitespace-nowrap">
          Browse scenarios →
        </Link>
      </div>
    </section>
  );
}
