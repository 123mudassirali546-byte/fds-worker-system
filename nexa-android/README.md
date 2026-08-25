# NEXA Android App

This folder is the Android app/release layer for NEXA. The web app and Supabase backend remain unchanged.

## Update flow
- The Android app should read the version manifest from `https://123mudassirali546-byte.github.io/fds-worker-system/nexa-update.json`.
- If `versionCode` is newer, show **Update NEXA**.
- The APK URL is provided by `apkUrl`.
- Android installs the downloaded APK as an update over the existing NEXA app; users do not need to uninstall the old version.

Native APK code is intentionally kept separate from the web app so future app updates do not overwrite the existing NEXA web/chat system.
