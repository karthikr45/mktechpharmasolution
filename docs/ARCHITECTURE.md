# Architecture

## System overview

```
 ┌──────────────────────┐      ┌──────────────────────┐
 │  Web simulator       │      │  VR client (Quest 3) │
 │  (Next.js + R3F)     │      │  (Unity + OpenXR)    │
 └──────────┬───────────┘      └──────────┬───────────┘
            │                             │
            │           xAPI              │
            └──────────────┬──────────────┘
                           ▼
                 ┌──────────────────────┐
                 │  PharmaSim Portal    │  (Next.js server)
                 │  - SOP registry      │
                 │  - LRS (xAPI)        │
                 │  - Analytics         │
                 │  - e-signatures      │
                 └──────────┬───────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
   ┌─────────────────┐           ┌─────────────────────┐
   │  Postgres / S3  │           │  Plant OT (future)  │
   │  Audit log      │           │  OPC-UA / MQTT      │
   └─────────────────┘           └─────────────────────┘
```

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Web UI | Next.js 15 (App Router), TypeScript | Fast iteration, server actions, strong DX |
| 3D (web) | React Three Fiber + drei | Interop with React state, no Unity needed for demos |
| 3D (VR) | Unity 2023 LTS + Meta XR SDK | Best Quest 3 support, mature XR tooling |
| State | Zustand | Minimal, no boilerplate |
| Styling | Tailwind CSS | Consistent, no CSS regressions |
| Validation | Zod | Runtime-checked xAPI statements |
| Records | xAPI 1.0.3 | Industry-standard training records |
| Storage | In-mem (MVP) → Postgres + S3 | Replace `lrs-store.ts` for prod |

## MVP scope (this repo)

- Landing + roadmap
- Web-based **tablet press simulator** (SOP-TP-001 changeover)
- Training portal with mock data (trainees, sessions, analytics)
- xAPI POST/GET endpoint backed by an in-memory LRS
- Unity project placeholder (docs only)

## Non-goals (MVP)

- Real OPC-UA plant integration
- Production-grade auth (OIDC / SAML)
- Persistent database (Postgres)
- LMS (SCORM / SCORM 2004) export
- Multi-user collaborative VR

## Compliance considerations

- **21 CFR Part 11** — every action ends up as an immutable xAPI statement with
  a user identity, timestamp, and (in prod) an e-signature.
- **EU GMP Annex 11** — deviation capture is first-class; the engine records
  out-of-sequence actions automatically.
- **GAMP 5** — the simulator is a **Category 5** (configured/custom) system and
  will need IQ/OQ/PQ documentation before plant deployment.

## Data flow — completing a changeover

1. Trainee clicks `Begin SOP walkthrough` → `session-store` creates a session.
2. Each hotspot click is funnelled through `tryHotspot()`:
   - if it matches the expected step → mark complete, advance;
   - if not → record a **deviation** with message + timestamp.
3. When the final step is done, the panel POSTs an xAPI statement to
   `/api/xapi/statements`.
4. The statement is validated (Zod) and pushed into the in-memory LRS.
5. Analytics aggregate statements (mock for now; live once DB wired up).

## Security (prod cutover checklist)

- [ ] Replace in-memory LRS with Postgres + append-only audit log
- [ ] OIDC auth (Azure AD / Okta) with SSO to plant identity
- [ ] e-signature on session start (PIN + biometric in VR, password on web)
- [ ] Rate limit xAPI ingest
- [ ] TLS + signed JWTs between Unity client and portal
- [ ] Tamper-evident log chaining (hash-linked statements)

## Runtime

```bash
npm install
npm run dev       # http://localhost:3000
npm run typecheck
npm run build
```

## Folder map

```
src/
  app/
    page.tsx                       # landing
    simulator/tablet-press/        # interactive 3D scene
    portal/                        # trainees, sessions, analytics
    api/xapi/statements/           # LRS endpoint
  components/
    simulator/TabletPressScene.tsx # R3F scene (machine + hotspots)
    simulator/ChangeoverPanel.tsx  # SOP panel + scoring
  lib/
    xapi.ts                        # zod schemas + statement builder
    lrs-store.ts                   # in-memory store (MVP)
    session-store.ts               # zustand session state machine
    changeover-flow.ts             # SOP-TP-001 step definitions
    mock-data.ts                   # trainees/sessions/SOPs
unity/                             # Unity Quest 3 project placeholder
docs/
  ARCHITECTURE.md
  USE-CASES.md
  MVP-SCOPE.md
```
