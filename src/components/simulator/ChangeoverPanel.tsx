"use client";

import { useEffect, useState } from "react";
import { CHANGEOVER_STEPS } from "@/lib/changeover-flow";
import { useSessionStore } from "@/lib/session-store";
import { buildStatement } from "@/lib/xapi";

export default function ChangeoverPanel() {
  const {
    trainee,
    startedAt,
    currentIndex,
    completed,
    deviations,
    finished,
    start,
    reset,
    score,
  } = useSessionStore();
  const [name, setName] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [flash, setFlash] = useState<null | { type: "ok" | "err"; text: string }>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  // Listen for deviation changes to flash a warning.
  useEffect(() => {
    if (deviations.length === 0) return;
    const last = deviations[deviations.length - 1];
    setFlash({ type: "err", text: last.message });
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [deviations.length]);

  useEffect(() => {
    if (completed.length === 0) return;
    const last = completed[completed.length - 1];
    const step = CHANGEOVER_STEPS.find((s) => s.id === last);
    if (step) {
      setFlash({ type: "ok", text: `✓ ${step.title} — complete` });
      const t = setTimeout(() => setFlash(null), 2500);
      return () => clearTimeout(t);
    }
  }, [completed.length]);

  useEffect(() => {
    if (finished && trainee && !submitted) {
      setSubmitted(true);
      submitStatement(trainee, score(), elapsed, deviations.length).catch(
        () => undefined
      );
    }
  }, [finished, trainee, submitted, elapsed, deviations.length, score]);

  const currentStep = !finished ? CHANGEOVER_STEPS[currentIndex] : undefined;
  const progressPct = Math.round(
    (completed.length / CHANGEOVER_STEPS.length) * 100
  );

  if (!startedAt) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white">
          Start a training session
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          SOP-TP-001 — Tablet Press Changeover (Product A → B). ~35 min nominal.
        </p>
        <label className="mt-4 block text-xs uppercase tracking-wide text-slate-400">
          Trainee name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ramesh Kumar"
          className="mt-1 w-full rounded-md border border-pharma-border bg-pharma-bg px-3 py-2 text-sm text-white focus:border-pharma-accent focus:outline-none"
        />
        <button
          className="btn-primary mt-4 w-full"
          disabled={!name.trim()}
          onClick={() => start(name.trim())}
        >
          Begin SOP walkthrough
        </button>
        <ul className="mt-5 space-y-1 text-xs text-slate-500">
          <li>• All actions are recorded as xAPI statements.</li>
          <li>• Out-of-sequence actions are flagged as deviations.</li>
          <li>• Score = steps complete − deviation penalty.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Trainee
            </div>
            <div className="font-semibold text-white">{trainee}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Elapsed
            </div>
            <div className="font-mono text-pharma-accent">
              {formatDuration(elapsed)}
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-pharma-border/40">
          <div
            className="h-full bg-gradient-to-r from-pharma-accent to-brand-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>
            {completed.length} / {CHANGEOVER_STEPS.length} steps
          </span>
          <span>Deviations: {deviations.length}</span>
        </div>
      </div>

      {flash && (
        <div
          className={`rounded-lg border px-4 py-2 text-sm ${
            flash.type === "ok"
              ? "border-pharma-good/40 bg-pharma-good/10 text-green-300"
              : "border-pharma-bad/40 bg-pharma-bad/10 text-red-300"
          }`}
        >
          {flash.text}
        </div>
      )}

      {currentStep && (
        <div className="card">
          <div className="flex items-center gap-2">
            <span className="badge bg-pharma-accent/20 text-pharma-accent border border-pharma-accent/30">
              Step {currentStep.order} / {CHANGEOVER_STEPS.length}
            </span>
            <span
              className={`badge border ${
                currentStep.criticality === "Critical"
                  ? "border-pharma-bad/40 text-red-300"
                  : currentStep.criticality === "Major"
                    ? "border-pharma-warn/40 text-amber-300"
                    : "border-pharma-border text-slate-300"
              }`}
            >
              {currentStep.criticality}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {currentStep.title}
          </h3>
          <p className="mt-1 text-sm text-slate-300">{currentStep.instruction}</p>
          <p className="mt-3 text-xs text-slate-500">{currentStep.hint}</p>
          <div className="mt-3 rounded-md bg-pharma-bg/60 p-2 text-[11px] text-slate-500">
            <span className="font-mono text-pharma-warn">Common deviation:</span>{" "}
            {currentStep.commonDeviation}
          </div>
        </div>
      )}

      {finished && (
        <div className="card border-pharma-accent/40">
          <div className="text-xs uppercase tracking-wide text-pharma-accent">
            Session complete
          </div>
          <div className="mt-1 text-3xl font-bold text-white">
            {Math.round(score() * 100)}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {deviations.length} deviation{deviations.length === 1 ? "" : "s"} ·{" "}
            {formatDuration(elapsed)}
          </div>
          {submitted && (
            <div className="mt-2 text-[11px] text-pharma-good">
              ✓ xAPI statement submitted to LRS
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button className="btn-ghost flex-1" onClick={reset}>
              Start over
            </button>
          </div>
        </div>
      )}

      <StepList />
    </div>
  );
}

function StepList() {
  const completed = useSessionStore((s) => s.completed);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  return (
    <div className="card">
      <h4 className="text-xs uppercase tracking-wide text-slate-400 mb-2">
        SOP steps
      </h4>
      <ol className="space-y-1.5">
        {CHANGEOVER_STEPS.map((s, i) => {
          const done = completed.includes(s.id);
          const current = i === currentIndex;
          return (
            <li
              key={s.id}
              className={`flex items-start gap-2 text-xs ${
                done
                  ? "text-green-300"
                  : current
                    ? "text-white font-medium"
                    : "text-slate-500"
              }`}
            >
              <span className="w-4 font-mono text-[10px]">
                {done ? "✓" : current ? "▸" : s.order}
              </span>
              <span>{s.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

async function submitStatement(
  trainee: string,
  scaled: number,
  durationSec: number,
  deviations: number
) {
  const statement = buildStatement({
    actorName: trainee,
    actorId: trainee.toLowerCase().replace(/\s+/g, "."),
    verb: scaled >= 0.7 ? "passed" : "failed",
    verbDisplay: scaled >= 0.7 ? "passed" : "failed",
    activityId: "https://mktech.pharma/activities/sop-tp-001",
    activityName: "Tablet Press Changeover — Product A to B",
    machineId: "cadmach-cmd4-d45",
    sopId: "sop_tp_001",
    success: scaled >= 0.7,
    scaled,
    durationSec,
    extensions: {
      "https://mktech.pharma/ext/deviations": deviations,
    },
  });

  await fetch("/api/xapi/statements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statement),
  });
}
