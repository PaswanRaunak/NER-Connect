# NER-Connect | Android (Kotlin + Jetpack Compose)

Native Android companion of the NER-Connect web prototype. Single-activity
Compose app, three screens, mock data — no network permission needed.

## Screens

1. **Corridor Status** — live corridor list with IMD 4-tier chips
   (NH-27 clear, NH-10 watch, NH-29 delay, NH-37 clear).
2. **Route Planner** — Siliguri to Gangtok card, ORS-validated metrics
   (1 hr 30 min, 114 km), slow-zone pill, IMD advisory, Start Safe
   Navigation action.
3. **Report Disruption** — 2x2 hazard classification, IMD severity tiers,
   verified chainage, submit with dispatch confirmation.

Design tokens mirror DESIGN.md (primary #002B2F / #004349, IMD tiers,
Inter-style hierarchy via the system font).

## Build

```bash
# JAVA_HOME must point to a JDK 17+ (build uses the local Gradle 8.14.3)
set JAVA_HOME=C:\Users\Rounak\.jdks\temurin-24.0.2
gradle -p android assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`
(also copied to `android/apk/NER-Connect-v1.0-debug.apk`).

## Install on a phone

1. Copy `apk/NER-Connect-v1.0-debug.apk` to the device.
2. Tap it, allow "install unknown apps" when prompted.
3. It is signed with the debug keystore — for Play Store distribution,
   create a release keystore and run `gradle -p android assembleRelease`.

## Emulator

No AVD exists on this machine. Create one in Android Studio Device Manager
(or let the android-emulator plugin do it after accepting SDK licenses),
then: `gradle -p android installDebug`.
