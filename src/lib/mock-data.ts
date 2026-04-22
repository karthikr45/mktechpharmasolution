export type Trainee = {
  id: string;
  name: string;
  role: string;
  plant: "Aurobindo U7" | "Aurobindo U8" | "MSN Unit-II" | "MSN Unit-IV";
  department: "Formulations" | "Injectables" | "API" | "Packaging" | "QA";
  sopsCompleted: number;
  sopsAssigned: number;
  avgScore: number;
  lastSessionAt: string;
};

export type TrainingSession = {
  id: string;
  trainee: string;
  module: string;
  machine: string;
  startedAt: string;
  durationMin: number;
  score: number;
  deviations: number;
  status: "passed" | "failed" | "in-progress";
};

export type SopModule = {
  id: string;
  title: string;
  machine: string;
  durationMin: number;
  steps: number;
  criticality: "Critical" | "Major" | "Minor";
};

export const trainees: Trainee[] = [
  {
    id: "u_001",
    name: "Ramesh Kumar",
    role: "Sr. Production Operator",
    plant: "Aurobindo U7",
    department: "Formulations",
    sopsCompleted: 12,
    sopsAssigned: 14,
    avgScore: 0.92,
    lastSessionAt: "2026-04-21T09:20:00Z",
  },
  {
    id: "u_002",
    name: "Priya Nair",
    role: "Aseptic Technician",
    plant: "Aurobindo U7",
    department: "Injectables",
    sopsCompleted: 8,
    sopsAssigned: 10,
    avgScore: 0.88,
    lastSessionAt: "2026-04-22T06:45:00Z",
  },
  {
    id: "u_003",
    name: "Venkatesh Rao",
    role: "Shift Supervisor",
    plant: "MSN Unit-II",
    department: "API",
    sopsCompleted: 18,
    sopsAssigned: 18,
    avgScore: 0.96,
    lastSessionAt: "2026-04-20T14:10:00Z",
  },
  {
    id: "u_004",
    name: "Sana Khan",
    role: "Jr. Operator",
    plant: "MSN Unit-IV",
    department: "Formulations",
    sopsCompleted: 4,
    sopsAssigned: 12,
    avgScore: 0.71,
    lastSessionAt: "2026-04-22T10:02:00Z",
  },
  {
    id: "u_005",
    name: "Anand Reddy",
    role: "QA Officer",
    plant: "Aurobindo U8",
    department: "QA",
    sopsCompleted: 15,
    sopsAssigned: 16,
    avgScore: 0.94,
    lastSessionAt: "2026-04-19T11:30:00Z",
  },
  {
    id: "u_006",
    name: "Lakshmi Iyer",
    role: "Packaging Operator",
    plant: "MSN Unit-II",
    department: "Packaging",
    sopsCompleted: 6,
    sopsAssigned: 9,
    avgScore: 0.82,
    lastSessionAt: "2026-04-22T07:55:00Z",
  },
];

export const sessions: TrainingSession[] = [
  {
    id: "s_1001",
    trainee: "Ramesh Kumar",
    module: "Tablet Press Changeover A→B",
    machine: "Cadmach CMD-4 D45",
    startedAt: "2026-04-22T08:10:00Z",
    durationMin: 34,
    score: 0.94,
    deviations: 1,
    status: "passed",
  },
  {
    id: "s_1002",
    trainee: "Priya Nair",
    module: "Aseptic Intervention — Grade A",
    machine: "Bosch FLC-3080",
    startedAt: "2026-04-22T06:45:00Z",
    durationMin: 22,
    score: 0.88,
    deviations: 2,
    status: "passed",
  },
  {
    id: "s_1003",
    trainee: "Sana Khan",
    module: "Tablet Press Setup & Tooling",
    machine: "Cadmach CMD-4 D45",
    startedAt: "2026-04-22T10:02:00Z",
    durationMin: 18,
    score: 0.64,
    deviations: 4,
    status: "failed",
  },
  {
    id: "s_1004",
    trainee: "Lakshmi Iyer",
    module: "Blister Line Changeover",
    machine: "Uhlmann UPS-4",
    startedAt: "2026-04-22T07:55:00Z",
    durationMin: 28,
    score: 0.82,
    deviations: 2,
    status: "passed",
  },
  {
    id: "s_1005",
    trainee: "Venkatesh Rao",
    module: "CIP/SIP Verification",
    machine: "Reactor R-204",
    startedAt: "2026-04-22T11:30:00Z",
    durationMin: 0,
    score: 0,
    deviations: 0,
    status: "in-progress",
  },
];

export const sopModules: SopModule[] = [
  {
    id: "sop_tp_001",
    title: "Tablet Press Changeover — Product A to B",
    machine: "Cadmach CMD-4 D45",
    durationMin: 35,
    steps: 12,
    criticality: "Critical",
  },
  {
    id: "sop_tp_002",
    title: "Tablet Press — Tooling Installation & Torque",
    machine: "Cadmach CMD-4 D45",
    durationMin: 25,
    steps: 9,
    criticality: "Major",
  },
  {
    id: "sop_as_001",
    title: "Grade A Aseptic Intervention",
    machine: "Bosch FLC-3080",
    durationMin: 20,
    steps: 8,
    criticality: "Critical",
  },
  {
    id: "sop_bl_001",
    title: "Blister Line Product Changeover",
    machine: "Uhlmann UPS-4",
    durationMin: 30,
    steps: 11,
    criticality: "Major",
  },
  {
    id: "sop_cip_001",
    title: "CIP / SIP — Reactor Cleaning Verification",
    machine: "Reactor R-204",
    durationMin: 40,
    steps: 14,
    criticality: "Critical",
  },
];
