/**
 * Tablet-press changeover SOP, encoded as a linear state machine for the MVP.
 * Each step maps to an interactive hotspot in the 3D scene.
 */

export type StepId =
  | "line-clearance"
  | "remove-tooling"
  | "clean-turret"
  | "install-new-tooling"
  | "torque-check"
  | "set-parameters"
  | "fill-hopper"
  | "first-article"
  | "release";

export interface ChangeoverStep {
  id: StepId;
  order: number;
  title: string;
  instruction: string;
  hint: string;
  hotspot: string; // key of 3D part the user must click
  expectedDurationSec: number;
  criticality: "Critical" | "Major" | "Minor";
  commonDeviation: string;
}

export const CHANGEOVER_STEPS: ChangeoverStep[] = [
  {
    id: "line-clearance",
    order: 1,
    title: "Line Clearance",
    instruction:
      "Verify no residual tablets, powder or documents from previous batch (Product A).",
    hint: "Inspect the turret bed and discharge chute. Click the status light.",
    hotspot: "statusLight",
    expectedDurationSec: 120,
    criticality: "Critical",
    commonDeviation: "Missed residual tablets in discharge chute",
  },
  {
    id: "remove-tooling",
    order: 2,
    title: "Remove Existing Tooling",
    instruction:
      "Unload upper and lower punches and the die set used for Product A.",
    hint: "Click the turret to open the tooling panel.",
    hotspot: "turret",
    expectedDurationSec: 300,
    criticality: "Major",
    commonDeviation: "Tooling placed in non-designated tray",
  },
  {
    id: "clean-turret",
    order: 3,
    title: "Clean Turret & Contact Parts",
    instruction:
      "Perform Type-B cleaning per SOP-CLN-014. No residue above 10 ppm.",
    hint: "Click the cleaning cart.",
    hotspot: "cleaningCart",
    expectedDurationSec: 420,
    criticality: "Critical",
    commonDeviation: "Cleaning solvent concentration out of spec",
  },
  {
    id: "install-new-tooling",
    order: 4,
    title: "Install New Tooling (Product B)",
    instruction: "Load D-tooling set for 9mm round tablets.",
    hint: "Click the turret.",
    hotspot: "turret",
    expectedDurationSec: 360,
    criticality: "Major",
    commonDeviation: "Punch not fully seated",
  },
  {
    id: "torque-check",
    order: 5,
    title: "Torque & Seating Verification",
    instruction: "Verify punch retention torque. Log value in the HMI.",
    hint: "Click the HMI panel.",
    hotspot: "hmi",
    expectedDurationSec: 180,
    criticality: "Critical",
    commonDeviation: "Torque value not recorded",
  },
  {
    id: "set-parameters",
    order: 6,
    title: "Set Compression Parameters",
    instruction:
      "Main compression: 12 kN. Pre-compression: 3 kN. Turret speed: 45 rpm.",
    hint: "Use the HMI panel.",
    hotspot: "hmi",
    expectedDurationSec: 180,
    criticality: "Major",
    commonDeviation: "Parameters entered outside tolerance",
  },
  {
    id: "fill-hopper",
    order: 7,
    title: "Fill Hopper — Product B Blend",
    instruction: "Confirm material label matches batch record before charging.",
    hint: "Click the hopper.",
    hotspot: "hopper",
    expectedDurationSec: 240,
    criticality: "Critical",
    commonDeviation: "Label check bypassed",
  },
  {
    id: "first-article",
    order: 8,
    title: "First-Article Inspection",
    instruction:
      "Collect 20 tablets. Check weight, hardness, thickness, friability.",
    hint: "Click the discharge chute.",
    hotspot: "dischargeChute",
    expectedDurationSec: 300,
    criticality: "Critical",
    commonDeviation: "Only weight checked, hardness skipped",
  },
  {
    id: "release",
    order: 9,
    title: "Line Release to QA",
    instruction: "Sign the batch changeover record and release to QA.",
    hint: "Click the HMI to sign-off.",
    hotspot: "hmi",
    expectedDurationSec: 120,
    criticality: "Major",
    commonDeviation: "Electronic signature not captured",
  },
];

export function stepByHotspot(hotspot: string): ChangeoverStep | undefined {
  return CHANGEOVER_STEPS.find((s) => s.hotspot === hotspot);
}
