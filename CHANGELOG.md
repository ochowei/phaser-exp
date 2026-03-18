# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.10.0] - 2026-03-18

### Changed
- Converted game from horizontal scrolling to vertical scrolling (top-down shooter)
- Player now spawns at bottom center and shoots upward
- Enemies spawn from the top and move downward
- Parallax background scrolls vertically (top to bottom)
- All aircraft textures redrawn to face up (player) or down (enemies)
- Enemy sinusoidal movement changed from vertical to horizontal oscillation
- Boss scatter pattern fires downward instead of leftward
- CSS starfield animations on menu screens changed to vertical scrolling
- Powerups drift downward instead of leftward
- Pause menu "Main Menu" button now returns to Start Screen instead of Mode Selection / Stage Selection screen

## [1.9.0] - 2026-03-18

### Changed
- Options screen (`OptionScene`) migrated from Phaser to React component (`OptionsScreen`); clicking "Options" no longer initialises the full Phaser engine
- Stage select screen (`StageSelectScene`) migrated from Phaser to React component (`StageSelectScreen`); stage selection now handled entirely in React before Phaser starts
- Removed dead Phaser scene `StartScene` (already superseded by React `StartScreen` in v1.7.0)
- `StageScene` game-over and stage-clear "Stage Select" buttons now emit `returnToMenu` (returning to React `StageSelectScreen`) instead of starting `StageSelectScene`
- `StageScene` pause menu "Main Menu" button now emits `returnToMenu` (consistent with endless mode)
- `GameCanvas` accepts a `gameData` prop to pass initial scene data (e.g. `stageId`) into Phaser via the game registry

## [1.8.0] - 2026-03-18

### Changed
- Mode select screen converted from Phaser scene (`ModeSelectScene`) to React component (`ModeSelectScreen`), matching the StartScreen architecture
- Selecting "Start Game" now shows a React-based mode select screen instead of initializing Phaser
- Game exit (`returnToMenu`) now returns to mode select screen instead of start screen
- StageSelectScene back button now exits to React mode select screen

## [1.7.0] - 2026-03-17

### Added
- React integration for StartScene — start screen is now a React component with CSS-animated starfield background
- Phaser + React hybrid architecture: React manages the start screen, Phaser initializes on demand for gameplay
- `GameCanvas` wrapper component for on-demand Phaser lifecycle management (create/destroy)
- Vite React plugin (`@vitejs/plugin-react`) for JSX support

### Changed
- Entry point migrated from `src/main.js` to `src/main.jsx` (React root)
- "Return to menu" navigation in ModeSelectScene, MainScene, OptionScene, and pause system now uses `game.events.emit('returnToMenu')` to communicate with the React layer
- BGM on start screen now uses `HTMLAudioElement` instead of Phaser's sound system

### Fixed
- Smooth fade-out transition when navigating from React start screen to Phaser scenes (no more black flash)
- BGM now plays continuously during React→Phaser transition, stopping only when Phaser is ready (no more audio gap)
- Menu star textures and BGM now self-initialize in ModeSelectScene, OptionScene, and StageSelectScene (no longer depend on StartScene)

## [1.6.1] - 2026-03-17

### Added
- HTML loading indicator shown while the browser downloads and initializes the Phaser bundle, with i18n support (en/zh)

## [1.6.0] - 2026-03-17

### Added
- Stage Mode with 3 playable stages, each featuring mixed wave-based enemy spawning and a unique boss fight
- Stage Select screen with unlock progression (localStorage persistence) and replay support
- 3 new boss profiles: Crimson Commander (aimed shots, 20 HP), Violet Overlord (scatter shots, 30 HP), Emerald Tyrant (tracking bullets, 40 HP)
- Wave Manager system for controlling enemy wave spawning, rest periods, and boss phase transitions
- Boss HP bar displayed at the top center of the screen during boss fights
- Wave indicator HUD showing current wave progress
- Stage clear screen with score summary and next stage / stage select options
- New i18n keys for stage mode UI in both English and Chinese
- Unit tests for stage data structure validation
- Shared scene helper utilities extracted from MainScene for code reuse

### Changed
- Refactored MainScene to use shared utility functions from sceneHelpers.js
- ModeSelectScene Stage Mode button now navigates to Stage Select (previously showed "Under Construction")

## [1.5.0] - 2026-03-17

### Changed
- Different enemy types now have distinct HP values: EN_RED (1 HP), EN_PURPLE (3 HP), EN_BOSS_GREEN (10 HP)
- Health bars now appear on all enemies with HP > 1 (previously only on bosses)
- Boss HP increased from 5 to 10

## [1.4.0] - 2026-03-17

### Added
- Mini-boss enemy (G-50 Leviathan) spawns every 30 seconds in endless mode
- Enemy HP system with visual health bar for multi-hit enemies
- Mini-boss fires red bullets at the player every 1.5 seconds
- Boss incoming warning notification (i18n: en/zh)
- New aircraft profile: EN_BOSS_GREEN (48×48 green armored fighter)

## [1.3.1] - 2026-03-17

### Changed
- Reduced player bullet fire rate from 180ms to 380ms interval
- Reduced player bullet size from radius 8 (16×16 texture) to radius 5 (10×10 texture)

## [1.3.0] - 2026-03-17

### Added
- ESLint integration with flat config format for code style enforcement
- `npm run lint` and `npm run lint:fix` scripts
- Enforced rules: single quotes, semicolons, 4-space indentation, unused variable warnings
- Lint step in GitHub Actions CI workflow

## [1.2.0] - 2026-03-17

### Added
- GitHub Actions CI workflow: runs tests and build on pull requests to main

## [1.1.0] - 2026-03-17

### Added
- Unit testing infrastructure with Vitest
- Unit tests for `i18n.js` module (translation lookup, language switching, localStorage persistence)
- Unit tests for `aircraftProfiles.js` module (profile lookup, fallback behavior, data validation)
- `npm test` and `npm run test:watch` scripts

## [1.0.0] - 2026-03-17

### Added
- Core gameplay: player ship, enemies, bullets, powerup system
- Parallax starfield background (3-layer) on StartScene and MainScene
- Two game modes: Endless Mode (playable) and Stage Mode (placeholder)
- HP system with 3 lives and post-damage invincibility
- Triple-shot powerup (10-second duration, +50 score bonus)
- Pause/resume via P / ESC key or on-screen button, with return-to-menu option
- Virtual joystick for mobile touch controls
- Background music for menu and gameplay (WAV format)
- Options screen with BGM volume slider and mute toggle
- Multi-language support (English / Chinese) with language selector
- High score persistence via localStorage
- Aircraft profile system for modular ship appearance definitions
- Player aircraft: S-63 Hornet Plus (S63HP)
- Enemy aircraft: R-71 Crimson (normal) and X-99 Phantom (special, 20% spawn rate)
- Fade transitions between scenes
- Camera shake and flash effects on hit/pickup
- Game over screen with restart and main menu buttons
- Scale mode FIT for mobile screen compatibility
