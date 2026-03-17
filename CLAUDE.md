# CLAUDE.md

## Project Overview

Phaser 3 browser-based space shooter game built with ES6 modules, React, and Vite. Uses a hybrid architecture: React renders the start screen UI, and Phaser handles gameplay scenes.

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build to dist/
npm run preview  # Preview production build
npm test         # Run unit tests (Vitest)
npm run test:watch # Run tests in watch mode
npm run lint     # Check code style (ESLint)
npm run lint:fix # Auto-fix lint issues
```

## Documentation Sync Rules

Any code change — whether it's a new feature, bug fix, or refactor — **must update the corresponding documentation in the same commit**:

1. **README.md** must be updated whenever:
   - A new scene, object, or module file is added or removed → update **Project Structure**
   - A file is renamed, moved, or split into multiple files → update **Project Structure** paths
   - A user-facing feature is added, changed, or removed → update **Features** section
   - Game parameters change (speed, HP, fire rate, spawn rate, etc.) → update **Game Settings** table
   - A dependency version changes → update **Tech Stack** table
   - UI buttons or screens are added/removed → update **Screenshots** ASCII block

2. **src/i18n.js** must be updated whenever:
   - UI text is added or changed → add keys to **both** `en` and `zh`
   - A UI element is removed → remove the corresponding translation keys
   - A translation key is renamed during refactoring → update all `t('key')` call sites and both language entries
   - All user-facing strings must use `t('key')`, never hardcoded text

3. **src/profiles/aircraftProfiles.js** must be updated whenever:
   - A new enemy or player aircraft type is added → add a new profile entry
   - Aircraft appearance (texture, trail, colors) changes → update the corresponding profile
   - A profile key or textureKey is renamed → update all references in scene files

4. **Refactoring checklist** — when renaming, moving, or reorganizing code:
   - Verify all `import` paths still resolve correctly
   - Search for any hardcoded references to the old name/path (in code and docs)
   - Remove any exports, translation keys, or profile entries that become unused
   - Confirm no dead code or orphan files are left behind

5. **CHANGELOG.md** — follows [Keep a Changelog](https://keepachangelog.com/) format, must be updated whenever:
   - A user-facing feature is added → `### Added`
   - Existing behavior is changed or enhanced → `### Changed`
   - A bug is fixed → `### Fixed`
   - A feature or file is removed → `### Removed`
   - Refactoring or internal changes that don't affect users → no CHANGELOG entry needed
   - Group entries under an `## [Unreleased]` section; move them to a versioned section upon release

6. **Version number** (`package.json` version) — follows [Semantic Versioning](https://semver.org/):
   - **PATCH** (x.x.+1): bug fixes, typo corrections
   - **MINOR** (x.+1.0): new features, new game modes, new aircraft profiles (backwards-compatible)
   - **MAJOR** (+1.0.0): breaking changes (save format incompatibility, removed features, major architecture overhaul)
   - Bump version in `package.json` and create a matching `## [x.y.z]` section in CHANGELOG.md in the same commit

7. **CLAUDE.md** itself must be updated whenever:
   - Development commands change (new scripts, different package manager)
   - Code conventions change (e.g. adopting TypeScript, new base classes)
   - Project architecture changes introduce a new category of files that need sync rules
   - Existing sync rules become outdated or insufficient

## Code Conventions

- Language: vanilla JavaScript (ES6 modules) + JSX for React components, no TypeScript
- UI screens use React components (`.jsx` files in `src/components/`)
- Gameplay scenes extend `Phaser.Scene`, game objects extend `Phaser.Physics.Arcade.Image`
- Phaser is wrapped in `GameCanvas.jsx` and initialized on demand (create/destroy pattern)
- Scenes return to React via `this.game.events.emit('returnToMenu')`
- Textures are procedurally generated via `Phaser.GameObjects.Graphics` (no image assets)
- User preferences (high score, volume, mute, language) are persisted in `localStorage`
- Comments and variable names may be in Chinese or English
- Unit tests use [Vitest](https://vitest.dev/) and live in `src/__tests__/`
- Test files follow the `<module>.test.js` naming convention
- Code style is enforced by ESLint (flat config in `eslint.config.js`)
- ESLint rules: single quotes, semicolons required, 4-space indentation
