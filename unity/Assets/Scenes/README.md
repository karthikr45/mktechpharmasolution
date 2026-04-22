# Scenes

Create the following scenes in Unity and reference each via a `Scenario`
ScriptableObject (menu: `Assets → Create → PharmaSim → Scenario`).

| Scene file | Scenario asset | SOP id |
|------------|---------------|--------|
| `ScenePressChangeover.unity` | `Scenario_TPressChangeover.asset` | `sop_tp_001` |
| `SceneAsepticIntervention.unity` | `Scenario_AsepticIntervention.asset` | `sop_as_001` |

## Per-scene setup (P0 MVP — tablet press)

1. **XR Rig**: `XR Origin (VR)` from XR Interaction Toolkit, two hand
   controllers with `XR Direct Interactor` or `XR Ray Interactor`.
2. **SessionManager**: empty GameObject with `SessionManager.cs`. Drag the
   `Scenario_TPressChangeover` asset into `scenario`.
3. **XApiClient**: empty GameObject with `XApiClient.cs`. Set `portalBaseUrl`
   to the staging portal (e.g. `https://pharmasim.mktech.dev`).
4. **Press geometry**: CAD import or primitive block-out (turret, hopper,
   HMI, status light). Match the hotspots in the web scene one-to-one so the
   flow feels identical across platforms.
5. **Hotspots**: add a sphere GameObject with `Hotspot.cs` at each interactive
   point. Set `hotspotKey` to exactly match the web's `changeover-flow.ts`
   value (e.g. `turret`, `hmi`, `hopper`).
6. **UI canvas** (world space, attached to the left hand): SOP step panel,
   timer, progress bar, deviation toasts.

## Shared contracts (with the web)

- **Step IDs** must match `src/lib/changeover-flow.ts` / `src/lib/aseptic-flow.ts`
- **Hotspot keys** must match
- **xAPI activity IRIs** must match

A mismatch breaks cross-platform analytics (the same trainee should be able
to do some reps on the web and some in VR, and aggregate.)
