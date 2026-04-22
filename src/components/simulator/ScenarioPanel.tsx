"use client";

import { useEffect, useState } from "react";
import type { ScenarioStep } from "@/lib/session-store";
import { useSessionStore } from "@/lib/session-store";
import { buildStatement } from "@/lib/xapi";
import ESignModal, { type ESignature } from "@/components/ESignModal";
import { getPlantClient } from "@/lib/tenant-client";

export interface ScenarioDefinition {
  id: string;
  title: string;
  subtitle: string;
  machineId: string;
  activityId: string;
  steps: ScenarioFullStep[];
}

export interface ScenarioFullStep extends ScenarioStep {
  instruction: string;
  hint: string;
  commonDeviation: string;
  grade?: "A" | "B" | "C";
}

export default function ScenarioPanel({
  scenario,
}: {
  scenario: ScenarioDefinition;
}) {
  const {
    scenarioId,
    identity,
    startedAt,
    currentIndex,
    completed,
    deviations,
    finished,
    start,
    reset,
    score,
  } = useSessionStore();

  const [elapsed, setElapsed] = useState(0);
  const [showSign, setShowSign] = useState(false);
  const [flash, setFlash] = useState<
    | null
    | { type: "ok" | "err"; text: string }
  >(null);
  const [submitted, setSubmitted] = useState(false);

  const isThisScenario = scenarioId === scenario.id;

  useEffect(() => {
    if (!startedAt || finished || !isThisScenario) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, finished, isThisScenario]);

  useEffect(() => {
    if (!isThisScenario || deviations.length === 0) return;
    const last = deviations[deviations.length - 1];
    setFlash({ type: "err", text: last.message });
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [deviations.length, isThisScenario]);

  useEffect(() => {
    if (!isThisScenario || completed.length === 0) return;
    const last = completed[completed.length - 1];
    const step = scenario.steps.find((s) => s.id === last);
    if (step) {
      setFlash({ type: "ok", text: `✓ ${step.title} — complete` });
      const t = setTimeout(() => setFlash(null), 2500);
      return () => clearTimeout(t);
    }
  }, [completed.length, isThisScenario, scenario.steps]);

  useEffect(() => {
    if (finished && isThisScenario && identity && !submitted) {
      setSubmitted(true);
      submitStatement({
        scenario,
        identity,
        scaled: score(),
        durationSec: elapsed,
        deviations: deviations.length,
      }).catch(() => undefined);
    }
  }, [finished, isThisScenario, identity, submitted, elapsed, deviations.length, scenario, score]);

  const currentStep = isThisScenario && !finished
    ? scenario.steps[currentIndex]
    : undefined;
  const progressPct = isThisScenario
    ? Math.round((completed.length / scenario.steps.length) * 100)
    : 0;

  if (!startedAt || !isThisScenario) {
    return (
      <>
        <div className="card">
          <h3 className="text-lg font-semibold text-white">
            Start a training session
          </h3>
          <p className="mt-1 text-sm text-slate-400">{scenario.subtitle}</p>
          <button
            className="btn-primary mt-4 w-full"
            onClick={() => setShowSign(true)}
          >
            Sign & begin
          </button>
          <ul className="mt-5 space-y-1 text-xs text-slate-500">
            <li>• Electronic signature required (21 CFR Part 11)</li>
            <li>• Every action recorded as xAPI statement</li>
            <li>• Out-of-sequence actions flagged as deviations</li>
          </ul>
        </div>

        {showSign && (
          <ESignModal
            title="Electronic signature required"
            scenarioName={scenario.title}
            onCancel={() => setShowSign(false)}
            onSign={(sig: ESignature) => {
              setShowSign(false);
              setSubmitted(false);
              start(scenario.id, scenario.steps, sig);
            }}
          />
        )}
      </>
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
            <div className="font-semibold text-white">
              {identity?.name ?? "—"}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {identity?.userId}
            </div>
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
            {completed.length} / {scenario.steps.length} steps
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge bg-pharma-accent/20 text-pharma-accent border border-pharma-accent/30">
              Step {currentStep.order} / {scenario.steps.length}
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
            {currentStep.grade && (
              <span className="badge border border-brand-700/40 text-brand-100 bg-brand-900/30">
                Grade {currentStep.grade}
              </span>
            )}
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
              Close session
            </button>
          </div>
        </div>
      )}

      <StepList scenario={scenario} />
    </div>
  );
}

function StepList({ scenario }: { scenario: ScenarioDefinition }) {
  const completed = useSessionStore((s) => s.completed);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const scenarioId = useSessionStore((s) => s.scenarioId);
  const isThisScenario = scenarioId === scenario.id;

  return (
    <div className="card">
      <h4 className="text-xs uppercase tracking-wide text-slate-400 mb-2">
        SOP steps
      </h4>
      <ol className="space-y-1.5">
        {scenario.steps.map((s, i) => {
          const done = isThisScenario && completed.includes(s.id);
          const current = isThisScenario && i === currentIndex;
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

async function submitStatement({
  scenario,
  identity,
  scaled,
  durationSec,
  deviations,
}: {
  scenario: ScenarioDefinition;
  identity: ESignature;
  scaled: number;
  durationSec: number;
  deviations: number;
}) {
  const plantId = getPlantClient();
  const statement = buildStatement({
    actorName: identity.name,
    actorId: identity.userId,
    verb: scaled >= 0.7 ? "passed" : "failed",
    activityId: scenario.activityId,
    activityName: scenario.title,
    machineId: scenario.machineId,
    sopId: scenario.id,
    success: scaled >= 0.7,
    scaled,
    durationSec,
    extensions: {
      "https://mktech.pharma/ext/deviations": deviations,
      "https://mktech.pharma/ext/plant-id": plantId,
      "https://mktech.pharma/ext/e-signature": {
        reason: identity.reason,
        signedAt: identity.signedAt,
      },
    },
  });

  await fetch("/api/xapi/statements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statement),
  });
}
