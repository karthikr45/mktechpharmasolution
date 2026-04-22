# MKTech PharmaSim

**VR training, machine simulation & digital-twin platform for pharma
manufacturing.**

Built for Aurobindo, MSN and other tier-1 Indian formulations players.
Start with one machine, scale to the whole plant.

---

## What's in this build

1. **Landing page** — product pitch, use cases, roadmap
2. **Scenario picker** at `/simulator` — Tablet Press (ready), Aseptic
   Intervention (ready), Blister / CIP-SIP / EHS (coming soon)
3. **3D simulator — Tablet Press** (Cadmach CMD-4, SOP-TP-001 changeover,
   9 steps)
4. **3D simulator — Aseptic Intervention** (Grade A intervention at a filling
   line under LAF, SOP-AS-001, 7 steps)
5. **21 CFR Part 11 e-signature** before every session
6. **File-backed xAPI LRS** (`/api/xapi/statements`) with seeded history
7. **Multi-tenant plant selector** (Aurobindo U7/U8, MSN II/IV) — all portal
   views filter by the selected plant
8. **Training portal** — dashboard, trainees, sessions, analytics, all
   reading live xAPI data
9. **Unity Quest 3 scaffold** — C# scripts ready for a fresh Unity project
10. **Docker + compose** — persistent `.data` volume for pilot deployments

> See [`docs/MVP-SCOPE.md`](docs/MVP-SCOPE.md),
> [`docs/USE-CASES.md`](docs/USE-CASES.md),
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
> [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires **Node.js 20+**.

### Key URLs

```
/                             landing
/simulator                    scenario picker
/simulator/tablet-press       Cadmach press + SOP-TP-001
/simulator/aseptic            Bosch FLC-3080 + SOP-AS-001
/portal                       dashboard (live xAPI data)
/portal/trainees              trainee roll-up
/portal/sessions              session log
/portal/analytics             pass-rate + deviation hotspots
/api/xapi/statements          LRS endpoint (GET + POST)
```

### Docker

```bash
docker compose up -d       # http://localhost:3000
```

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **React Three Fiber** + **drei** for 3D scenes
- **Tailwind CSS** for styling
- **Zustand** for session state
- **Zod** for xAPI validation
- **File-backed JSON LRS** for dev / **Postgres** for pilot (see
  `docs/DEPLOYMENT.md`)
- **Unity 2023 LTS + Meta XR SDK** for the Quest 3 VR build

## Project structure

```
src/
  app/
    page.tsx                         # landing
    simulator/
      page.tsx                       # scenario picker
      tablet-press/page.tsx
      aseptic/page.tsx
    portal/
      page.tsx                       # dashboard (live data)
      {trainees,sessions,analytics}/
    api/xapi/statements/route.ts     # LRS endpoint
    actions.ts                       # server action: select plant
  components/
    PlantSelector.tsx
    ESignModal.tsx
    simulator/
      TabletPressScene.tsx           # R3F — Cadmach press
      AsepticScene.tsx               # R3F — cleanroom + LAF line
      ScenarioPanel.tsx              # shared SOP panel + scoring
  lib/
    xapi.ts                          # zod schemas + builder
    lrs-store.ts                     # file-backed LRS w/ seeding
    session-store.ts                 # generic session state machine
    analytics.ts                     # LRS → session rows / KPIs
    tenant.ts                        # plant definitions + cookie
    tenant-client.ts                 # client-side plant lookup
    changeover-flow.ts               # SOP-TP-001 steps
    aseptic-flow.ts                  # SOP-AS-001 steps
    mock-data.ts                     # SOP library + trainee display data
unity/
  Assets/Scripts/                    # SOPStep, Scenario, Hotspot,
  Assets/Scenes/                     # SessionManager, XApiClient
  ProjectSettings/
docs/
  ARCHITECTURE.md
  USE-CASES.md
  MVP-SCOPE.md
  DEPLOYMENT.md
Dockerfile
docker-compose.yml
```

## Demo script (~2 min)

1. Open `/` — show pitch, clients, roadmap
2. Click **Browse training scenarios** → `/simulator`
3. Pick **Grade A Aseptic Intervention** (it's the differentiator)
4. Sign the e-signature form → **Sign & begin**
5. Follow the glowing hotspot through gowning → airlock → line
6. Deliberately click the wrong hotspot → red deviation banner
7. Complete all 7 steps → final score + "xAPI statement submitted"
8. Change plant in top-right → `/portal/sessions` → see new record

## License

Proprietary — MKTech PharmaSim. All rights reserved.
