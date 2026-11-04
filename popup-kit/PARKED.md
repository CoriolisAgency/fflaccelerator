# Pop-up parked (POPUP-PARK)

Paul, 2026-11-04 5:21 PM ET via Chief: "I want to disable the pop-ups we built from all of our websites... just "park" the code in case we want or need to use it later." FFLA confirmed in scope 6:08 PM ET.

What is off:
- `src/lib/popup-config.ts` `FFLA_POPUPS_ENABLED = false`: `BaseLayout.astro` does not render the `window.CORIOLIS_POPUP` config or the `/popup/coriolis-popup.v1.js` tag.
- `api/popup.ts` `POPUPS_ENABLED = false`: GET `/api/popup` reports `enabled: false`.

Everything else (kit, served copies, `/api/popup` POST, `/api/subscribe`) is kept.

To un-park: set both constants to `true` and update `scripts/test-popup-park.mjs`.
