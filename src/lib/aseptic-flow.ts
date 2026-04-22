/**
 * Grade A Aseptic Intervention — SOP-AS-001
 *
 * Simulates an operator intervention at an isolator / RABS filling line:
 * a stalled vial must be removed without contaminating the first-air
 * envelope under the laminar flow (LAF) hood.
 */

export type AsepticHotspot =
  | "mirror"
  | "gownCheck"
  | "airlock"
  | "lineApproach"
  | "intervention"
  | "withdrawal"
  | "documentation";

export interface AsepticStep {
  id: string;
  order: number;
  title: string;
  instruction: string;
  hint: string;
  hotspot: AsepticHotspot;
  criticality: "Critical" | "Major" | "Minor";
  commonDeviation: string;
  /** Cleanroom grade where the step occurs. */
  grade: "A" | "B" | "C";
}

export const ASEPTIC_STEPS: AsepticStep[] = [
  {
    id: "mirror-check",
    order: 1,
    title: "Gowning mirror check",
    instruction:
      "Verify gown integrity — sleeve cuffs, goggles seal, hair fully covered.",
    hint: "Click the mirror in the gowning zone.",
    hotspot: "mirror",
    criticality: "Critical",
    commonDeviation: "Hair visible below hood",
    grade: "C",
  },
  {
    id: "gown-inspection",
    order: 2,
    title: "Gown particulate inspection",
    instruction:
      "Inspect gown under black-light for fibres or particulate shedding.",
    hint: "Click the gown-check station.",
    hotspot: "gownCheck",
    criticality: "Major",
    commonDeviation: "Shedding fibres not flagged",
    grade: "C",
  },
  {
    id: "airlock-entry",
    order: 3,
    title: "Grade B airlock entry",
    instruction:
      "Transit the airlock. Respect pressure cascade — do not both-doors-open.",
    hint: "Click the airlock panel.",
    hotspot: "airlock",
    criticality: "Critical",
    commonDeviation: "Both airlock doors opened",
    grade: "B",
  },
  {
    id: "line-approach",
    order: 4,
    title: "Approach the filling line (slow, lateral)",
    instruction:
      "Move slowly and laterally toward the LAF zone. Never break first-air.",
    hint: "Click the approach marker on the floor.",
    hotspot: "lineApproach",
    criticality: "Critical",
    commonDeviation: "Straight approach disrupts first-air",
    grade: "B",
  },
  {
    id: "intervention",
    order: 5,
    title: "Remove stalled vial",
    instruction:
      "Use long-handle forceps. Keep hands below product path. Never hover over open vials.",
    hint: "Click the intervention zone.",
    hotspot: "intervention",
    criticality: "Critical",
    commonDeviation: "Hands pass above open vials",
    grade: "A",
  },
  {
    id: "withdrawal",
    order: 6,
    title: "Withdraw slowly",
    instruction:
      "Withdraw laterally, at the same slow pace. Dispose of the vial in the reject chute.",
    hint: "Click the reject chute.",
    hotspot: "withdrawal",
    criticality: "Major",
    commonDeviation: "Rapid withdrawal disturbs airflow",
    grade: "A",
  },
  {
    id: "documentation",
    order: 7,
    title: "Document the intervention",
    instruction:
      "Log the intervention in the batch record with batch ID, timestamp and reason.",
    hint: "Click the documentation tablet.",
    hotspot: "documentation",
    criticality: "Major",
    commonDeviation: "Intervention not logged in batch record",
    grade: "B",
  },
];
