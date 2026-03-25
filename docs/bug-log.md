# RakHack EdTech Platform: Bug Log

This document tracks encountered bugs, system errors, and the exact steps taken to resolve them.

---

## 🛑 Bug: EADDRINUSE Port 4000 Conflict (SQLi Lab)
**Date:** March 20, 2026
- **Error Description:** Executing `npm start` in `d:\EDTech\labs\sqli` returned `Error: listen EADDRINUSE: address already in use :::4000`.
- **Root Cause:** A background Node task was already running and had bound strictly to port 4000 without termination.
- **Resolution:** Terminated the background Node.js server to free the port. *Long-term fix:* Created the Vite `LabRunner` component so learners no longer need to manually execute `npm start` in their terminal, as the middleware natively handles process spawning and preventing duplicate server clones.

## 🛑 Bug: Unused TypeScript Variable TS6133
**Date:** March 20, 2026
- **Error Description:** Vite Build (`npm run build`) failed during compilation.
- **Root Cause:** The `req` parameter was declared inside the `configureServer` (Vite middleware inside `vite.config.ts`) but was never accessed.
- **Resolution:** Prefixed the unused parameters with an underscore (`_req`) in `vite.config.ts` to instruct the TypeScript compiler to ignore them, successfully passing the build check.

## 🛑 Bug: PostCSS / TailwindCSS v4 Conflict
**Date:** March 20, 2026
- **Error Description:** Attempting to build the frontend returned `Error: [postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin.`
- **Root Cause:** Tailwind V4 switched exclusively to `@tailwindcss/vite`, but legacy PostCSS configurations / dependencies were lingering in the project initialization.
- **Resolution:** Switched `@import "tailwindcss";` syntax to exclusively use the brand new Vite wrapper, entirely bypassing PostCSS.

---

*(Future bugs and resolutions to be logged here)*

## ?? Bug: Mario Coin Stuck on Screen
**Date:** March 25, 2026
- **Error Description:** The golden coin was stuck in a static position until the player physically touched it.
- **Root Cause:** The coin's X coordinate logic was missing a horizontal velocity operator.
- **Resolution:** Added `coin.x -= 2.0f;` so the coin naturally scrolls left along with the Goomba to mimic environment movement. Added conditional logic for the coin to randomly respawn its Y-height after traveling off-screen.

## 🛑 Bug: Snake Game Speed Too Fast for Playability
**Date:** March 25, 2026
- **Error Description:** The `snake.exe` payload was initially set to an overly-high 15 FPS, rendering the game needlessly difficult to analyze or dynamically play.
- **Root Cause:** Hardcoded `SetTargetFPS(15)` was too fast for a classic grid-based snake payload.
- **Resolution:** Modified the initialization parameter to `SetTargetFPS(8);` to provide a classic, manageable snake feel, recompiling and deploying a new 1.83 MB binary payload.
