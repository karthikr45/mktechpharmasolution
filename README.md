# MKTech PharmaSim

**VR training, machine simulation & digital-twin platform for pharma
manufacturing.**

Built for Aurobindo, MSN and other tier-1 Indian formulations players.
Start with one machine, scale to the whole plant.

---

## What's in this MVP

1. **Landing page** — product pitch, use cases, roadmap
2. **Web simulator** — interactive 3D **tablet press** with a full SOP
   changeover walkthrough, scoring, and deviation capture
3. **Training portal** — dashboard, trainees, sessions, analytics
4. **xAPI endpoint** — `/api/xapi/statements` for training records
5. **Unity VR project placeholder** — for the Meta Quest 3 build

> Read [`docs/MVP-SCOPE.md`](docs/MVP-SCOPE.md),
> [`docs/USE-CASES.md`](docs/USE-CASES.md) and
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for more.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
#    - /                          marketing landing
#    - /simulator/tablet-press    3D changeover simulator
#    - /portal                    training portal dashboard
#    - /portal/analytics          analytics
```

Requires **Node.js 20+**.

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **React Three Fiber** + **drei** for the 3D scene
- **Tailwind CSS** for styling
- **Zustand** for session state
- **Zod** for xAPI statement validation
- **Unity 2023 LTS** (placeholder) for the Meta Quest 3 VR build

## Project structure

```
src/
  app/               # Next.js routes (landing, simulator, portal, api)
  components/
    simulator/       # R3F scene + SOP panel
  lib/
    xapi.ts          # xAPI schema + builder
    lrs-store.ts     # in-memory LRS (swap for DB in prod)
    session-store.ts # client-side session state machine
    changeover-flow.ts
    mock-data.ts
unity/               # Meta Quest 3 project (placeholder)
docs/                # architecture, use cases, MVP scope
```

## What to demo

1. Open `/simulator/tablet-press`
2. Enter a trainee name → **Begin SOP walkthrough**
3. Click hotspots in the 3D scene following the on-screen step
4. Try clicking the wrong hotspot → see a **deviation** logged
5. Finish all 9 steps → session score + xAPI statement posted
6. Open `/portal/sessions` to show the records view

## Next steps (not in this MVP)

See [`docs/MVP-SCOPE.md`](docs/MVP-SCOPE.md) — ~12 weeks to a validated
single-plant pilot.

## License

Proprietary — MKTech PharmaSim. All rights reserved.
