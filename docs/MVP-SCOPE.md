# MVP scope

This MVP is the Phase-1 deliverable: a demoable, end-to-end vertical slice
of the platform that can be put in front of Aurobindo / MSN decision-makers.

## In scope

- [x] Marketing landing page with product pitch
- [x] Interactive 3D tablet-press simulator (web)
- [x] Changeover SOP walkthrough with deviation capture
- [x] Session scoring (steps done − deviation penalty)
- [x] xAPI statement submission on completion
- [x] Training portal with mock trainees / sessions / analytics
- [x] Roadmap and use-case documentation

## Out of scope (deliberately)

- Real database persistence (LRS is in-memory)
- Authentication / authorisation
- Multi-tenant isolation (per-plant, per-site)
- Unity VR build (scaffolded in `unity/` but not implemented)
- LMS (SCORM / xAPI) handshake with customer system
- Live plant integration (OPC-UA, MQTT)

## Success criteria for a customer demo

1. Demo runs on a laptop browser with no setup
2. Changeover flow can be completed in under 3 minutes (demo speed)
3. Deviations trigger visible feedback
4. A completed session shows up as a session record / statement
5. Analytics page renders with plausible KPIs

## Effort to go from MVP to pilot

| Work item | Est. (weeks) |
|-----------|-------------|
| Postgres + real LRS | 1 |
| OIDC / SSO | 1 |
| e-signature on session start/end | 0.5 |
| Per-plant multi-tenant | 1 |
| Unity Quest 3 build (one scene) | 4 |
| Second scenario (aseptic or CIP) | 3 |
| Pilot validation docs (IQ/OQ/PQ skeletons) | 1 |

**Total**: ~12 weeks to a validated pilot in one plant.
