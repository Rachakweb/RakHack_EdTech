# RakHack EdTech Platform: Build Log 

This document tracks all features, modules, and architecture upgrades implemented in the platform since inception.

---

## 📅 [March 25, 2026] - Mario Payload Logic Fix & Procedural Graphics
**Type:** Binary Payload Architecture & UI Assets
- **Description:** Completely refactored `mario.cpp` to correctly simulate a standard C-style binary for beginner reverse engineering.
- **Upgrades:**
  - Removed collision responses from the global game loop to explicitly expose `encounterGoomba()` and `encounterCoinBlock()` directly to the `.exe` symbol table, mirroring the assignment exactly.
  - Built procedural Raylib drawing routines (`DrawMario`, `DrawGoomba`, `DrawCoin`) to upgrade the visual aesthetics without needing external dependencies (PNG files), ensuring the assignment stays a single executable.

## 📅 [March 20, 2026] - Web Penetration Testing Module Integration
**Type:** Feature Add & Backend Architecture
- **Description:** Added the advanced "Web Penetration Testing" course curriculum to the platform.
- **Modules Added:**
  - MOD 00: Web Applications 101 (`web-intro-guide.md`)
  - MOD 01: SQL Injection (`sqli-guide.md`)
  - MOD 02: Cross-Site Scripting (*Placeholder initialized*)
- **Infrastructure Added:** Scaffolded a vulnerable local Node.js + Express backend running SQLite (`d:\EDTech\labs\sqli`) specifically for authentic SQLi assessments.
- **UI Architecture Upgrades:**
  - Created a One-Click `[ DEPLOY_TARGET ]` button. Built a custom Vite plugin (`vite.config.ts`) that spawns the Node.js server seamlessly without terminal access.
  - Built an internal `FlagSubmission` component nested inside the markdown structure to allow learners to verify `RakHack{...}` flags after exploiting labs.
  - Refactored `App.tsx` state to support switching between the `Reverse Engineering` and `Web Pentesting` courses simultaneously.

## 📅 [March 18, 2026] - Initial Core Module & Thematics
**Type:** Initial Setup & Aesthetics
- **Description:** Scaffolding the React/Vite platform with hacker-themed aesthetics (glitch animations, styling).
- **Modules Added (Reverse Engineering):**
  - MOD 00: Environment Prep (`tool-setup-guide.md`)
  - MOD 01: Ghidra Basics (`mario-re-guide.md`)
  - MOD 02: Engine Manipulation (`snake-re-guide.md`)
- **Payloads Added:** Compiled Windows binaries (`mario.exe`, `snake.exe`) placed into `public/` directory for direct learner download.

---

*(Future updates go here)*
