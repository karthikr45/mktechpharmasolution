"use client";

import { create } from "zustand";
import { CHANGEOVER_STEPS, type ChangeoverStep } from "./changeover-flow";

export interface Deviation {
  stepId: string;
  at: number;
  message: string;
}

interface SessionState {
  trainee: string;
  startedAt: number | null;
  currentIndex: number;
  completed: string[];
  deviations: Deviation[];
  finished: boolean;
  start: (trainee: string) => void;
  reset: () => void;
  completeStep: (stepId: string) => void;
  tryHotspot: (hotspot: string) => {
    ok: boolean;
    step?: ChangeoverStep;
    reason?: string;
  };
  score: () => number;
  elapsedSec: () => number;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  trainee: "",
  startedAt: null,
  currentIndex: 0,
  completed: [],
  deviations: [],
  finished: false,

  start: (trainee) =>
    set({
      trainee,
      startedAt: Date.now(),
      currentIndex: 0,
      completed: [],
      deviations: [],
      finished: false,
    }),

  reset: () =>
    set({
      trainee: "",
      startedAt: null,
      currentIndex: 0,
      completed: [],
      deviations: [],
      finished: false,
    }),

  completeStep: (stepId) => {
    const { currentIndex, completed } = get();
    const nextIndex = currentIndex + 1;
    const finished = nextIndex >= CHANGEOVER_STEPS.length;
    set({
      completed: [...completed, stepId],
      currentIndex: nextIndex,
      finished,
    });
  },

  tryHotspot: (hotspot) => {
    const { currentIndex, deviations, startedAt } = get();
    const expected = CHANGEOVER_STEPS[currentIndex];
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
    get().completeStep(expected.id);
    return { ok: true, step: expected };
  },

  score: () => {
    const { completed, deviations } = get();
    const base = completed.length / CHANGEOVER_STEPS.length;
    const penalty = Math.min(0.4, deviations.length * 0.05);
    return Math.max(0, Math.min(1, base - penalty));
  },

  elapsedSec: () => {
    const { startedAt } = get();
    return startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
  },
}));
