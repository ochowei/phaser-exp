# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2026-03-17

### Added
- ESLint integration with flat config format for code style enforcement
- `npm run lint` and `npm run lint:fix` scripts
- Enforced rules: single quotes, semicolons, 4-space indentation, unused variable warnings

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
