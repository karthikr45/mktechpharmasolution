# Unity VR Project (Meta Quest 3)

This folder is a placeholder for the **Unity 2023 LTS** project that produces
the standalone VR build for Meta Quest 3.  It is not auto-initialised here
because Unity projects include binary caches and a license check is required.

## Target

- **Headset**: Meta Quest 3 (standalone, Android APK)
- **Unity**: 2023 LTS + OpenXR + Meta XR All-in-One SDK
- **Render pipeline**: URP
- **Input**: XR Interaction Toolkit 2.x

## Modules (planned)

| Scene | Description | Status |
|-------|-------------|--------|
| `ScenePressChangeover` | Mirrors the web simulator's SOP-TP-001 changeover | P0 (MVP) |
| `SceneAsepticIntervention` | Grade A/B intervention w/ first-air scoring | P1 |
| `SceneCIPVerification` | Reactor cleaning + swab sampling | P1 |
| `SceneEHSFireDrill` | Solvent fire response | P2 |

## Shared contracts

- **SOP flow**: mirrors `src/lib/changeover-flow.ts` — keep step IDs in sync.
- **xAPI**: POST to `/api/xapi/statements` on the web portal.
  See `src/lib/xapi.ts` for the accepted schema.
- **Auth**: bearer token issued by the portal; 21 CFR Part 11 e-signature
  captured pre-session.

## Initialization (manual)

```bash
# From the Unity Hub:
# 1. Create a new 3D (URP) project inside this folder
# 2. Install packages:
#    - com.meta.xr.sdk.all  (Meta XR All-in-One SDK)
#    - com.unity.xr.interaction.toolkit
#    - com.unity.xr.openxr
# 3. Enable: Meta Quest Support + Oculus XR Plugin
# 4. Player settings -> Android -> IL2CPP + ARM64
```

## Build

```bash
# Quest 3 standalone APK
unity -quit -batchmode -projectPath . -executeMethod BuildPipeline.BuildQuestAPK
```

## Integration tests

Scenes that call into the web portal's xAPI endpoint should run against a
staging deployment. See `docs/ARCHITECTURE.md`.
