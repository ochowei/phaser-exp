# CLAUDE.md

## Project Overview

Phaser 3 browser-based space shooter game built with ES6 modules and Vite.

## Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:5173)
npm run build  # Build to dist/
npm run preview # Preview production build
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

## Code Conventions

- Language: vanilla JavaScript (ES6 modules), no TypeScript
- All scenes extend `Phaser.Scene`, all game objects extend `Phaser.Physics.Arcade.Image`
- Textures are procedurally generated via `Phaser.GameObjects.Graphics` (no image assets)
- User preferences (high score, volume, mute, language) are persisted in `localStorage`
- Comments and variable names may be in Chinese or English
