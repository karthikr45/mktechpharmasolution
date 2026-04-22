# ProjectSettings

Populate this folder by creating a Unity 2023 LTS project inside the
`unity/` directory. Do **not** commit `unity/Library/`, `unity/Temp/` or
`unity/Logs/` — they are already excluded in the repo's `.gitignore`.

## Required settings for Meta Quest 3 standalone

- **Platform**: Android (switch via File → Build Settings)
- **Player Settings**:
  - Package Name: `com.mktech.pharmasim`
  - Minimum API Level: Android 10 (API 29)
  - Target Architecture: ARM64 only
  - Scripting Backend: IL2CPP
- **XR Plug-in Management → Android**:
  - Enable **OpenXR** + **Meta Quest feature group**
  - OR **Oculus XR Plugin** (legacy but more docs available)
- **Project Settings → XR Interaction Toolkit**:
  - Install v2.5+ via Package Manager
- **Graphics**:
  - Universal Render Pipeline (URP)
  - Target framerate: 72 Hz (Quest 3 can go 90/120 but 72 keeps thermal headroom)

## Build command (CI)

```bash
# Headless Quest APK build — wire this up once the project exists
Unity -quit -batchmode -projectPath unity \
  -buildTarget Android \
  -executeMethod PharmaSim.BuildPipeline.BuildQuestAPK \
  -logFile build.log
```
