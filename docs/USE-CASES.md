# Use cases

Prioritised by value delivered to Aurobindo / MSN, with an estimate of
time-to-MVP for each.

## P0 — Ship in Phase 1 (now)

### 1. Tablet Press Changeover (MVP implemented)
- **Machines**: Cadmach CMD-4 D45, Fette 1200i, Korsch XL 400
- **SOP**: Line clearance → tooling removal → cleaning → new tooling →
  torque check → parameter set → hopper fill → first-article → release
- **Scoring**: step completion − deviation penalty
- **Why first**: high downtime cost (~₹2–5 Cr/yr avoided per line), common
  across both Aurobindo OSD and MSN formulations plants

## P1 — Phase 2 (6–10 weeks)

### 2. Aseptic Intervention (Grade A/B)
- **Focus**: first-air, slow movement, intervention hierarchy
- **Scoring**: gaze + hand-path violations against Grade A envelope
- **Target**: Aurobindo Unit 7 injectables, MSN oncology block

### 3. Blister Line Changeover
- **Machine**: Uhlmann UPS-4 / IMA C80
- **Flow**: forming reel change, cutting tool swap, vision-system re-teach
- **Target**: Aurobindo packaging, MSN formulations

### 4. CIP / SIP Verification
- **Machine**: reactor / blender
- **Flow**: line isolation → rinse cycle → swab sampling → TOC check
- **Target**: MSN API, Aurobindo OSD

## P2 — Phase 3 (12–20 weeks)

### 5. EHS Emergency Drills
- Solvent fire, powder deflagration, chlorine leak, spill response
- Multi-trainee co-op VR

### 6. Capsule Filling Operator Training
- Bosch GKF, MG2 Planeta
- Changeover + weight-check troubleshooting

### 7. Granulation Troubleshooting
- Fluid-bed dryer (FBD), high-shear mixer (HSG)
- Simulated upset scenarios (pre-seeded faults)

## P3 — Digital Twin

### 8. Line Digital Twin
- OPC-UA / MQTT feed from plant floor
- Live 3D mirror with OEE, bottleneck prediction
- Predictive maintenance via sensor history

### 9. Facility BMS Twin
- HVAC, pressure cascades, cleanroom Grade monitoring
- What-if scenario planning (airlock fail, door held open)

## Deliverables per scenario

Every training scenario we ship includes:

1. **Web version** (browser) for classroom + QA review
2. **VR version** (Quest 3) for immersive practice
3. **SOP data file** — JSON spec, the same one both clients consume
4. **Scoring rubric** — agreed with plant QA
5. **xAPI statement schema** — for LRS / LMS integration
6. **IQ/OQ/PQ skeleton docs** — GAMP 5 aligned
