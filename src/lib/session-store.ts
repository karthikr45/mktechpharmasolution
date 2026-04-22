"use client";

import { create } from "zustand";

export interface ScenarioStep {
  id: string;
  order: number;
  title: string;
  hotspot: string;
  criticality: "Critical" | "Major" | "Minor";
}

export interface Deviation {
  stepId: string;
  at: number;
  message: string;
}

export interface SignedIdentity {
  name: string;
  userId: string;
  reason: string;
  signedAt: string;
}

interface SessionState {
  scenarioId: string | null;
  steps: ScenarioStep[];
  identity: SignedIdentity | null;
  startedAt: number | null;
  currentIndex: number;
  completed: string[];
  deviations: Deviation[];
  finished: boolean;

  start: (scenarioId: string, steps: ScenarioStep[], identity: SignedIdentity) => void;
  reset: () => void;
  tryHotspot: (hotspot: string) => {
    ok: boolean;
    step?: ScenarioStep;
    reason?: string;
  };
  score: () => number;
  elapsedSec: () => number;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  scenarioId: null,
  steps: [],
  identity: null,
  startedAt: null,
  currentIndex: 0,
  completed: [],
  deviations: [],
  finished: false,

  start: (scenarioId, steps, identity) =>
    set({
      scenarioId,
      steps,
      identity,
      startedAt: Date.now(),
      currentIndex: 0,
      completed: [],
      deviations: [],
      finished: false,
    }),

  reset: () =>
    set({
      scenarioId: null,
      steps: [],
      identity: null,
      startedAt: null,
      currentIndex: 0,
      completed: [],
      deviations: [],
      finished: false,
    }),

  tryHotspot: (hotspot) => {
    const { currentIndex, deviations, startedAt, steps, completed } = get();
    const expected = steps[currentIndex];
    if (!expected) return { ok: false, reason: "Session already finished" };

    if (expected.hotspot !== hotspot) {
      set({
        deviations: [
          ...deviations,
          {
            stepId: expected.id,
            at: startedAt ? Date.now() - startedAt : 0,
            message: `Out-of-sequence action on "${hotspot}" — expected "${expected.hotspot}" (${expected.title})`,
          },
        ],
      });
      return {
        ok: false,
        step: expected,
        reason: `Out-of-sequence — this is not the next SOP action.`,
      };
    }

    const nextIndex = currentIndex + 1;
    const finished = nextIndex >= steps.length;
    set({
      completed: [...completed, expected.id],
      currentIndex: nextIndex,
      finished,
    });
    return { ok: true, step: expected };
  },

  score: () => {
    const { completed, deviations, steps } = get();
    if (steps.length === 0) return 0;
    const base = completed.length / steps.length;
    const penalty = Math.min(0.4, deviations.length * 0.05);
    return Math.max(0, Math.min(1, base - penalty));
  },

  elapsedSec: () => {
    const { startedAt } = get();
    return startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
  },
}));
