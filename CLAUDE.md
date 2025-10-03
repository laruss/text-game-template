# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**

- `bun dev` - Start the development server (runs on http://localhost:5173)
- `bun run build` - Build the project (runs TypeScript compiler and Vite build)
- `bun run typecheck` - Type-check without emitting files
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build
- `bun run prettify` - Format code with Prettier
- `bun run check:fix` - Run lint fix, prettify, and typecheck in sequence

**Runtime:** This project uses Bun as the runtime and package manager. Always use `bun` commands instead of `npm`.

## Architecture

### Core Engine Pattern

The engine uses a **passage-based** architecture where game content flows through different "passages" (scenes/screens). The key architectural patterns:

1. **Separation of Engine and Game Logic:**
    - `src/engine/` - Core game engine (framework code)
    - `src/game/` - Game-specific content (stories, maps, entities)
    - Engine code should be reusable across different games

2. **State Management:**
    - **Valtio** for game state (reactive proxies)
    - **TanStack Query** for UI-related data and caching
    - **Dexie** (IndexedDB wrapper) for persistent save/load functionality
    - Entities are **auto-registered** in their `BaseGameObject` constructor
    - Use `useGameEntity(entity)` hook to observe changes to game objects in React components
    - Use `useOptions()` hook to access game-wide options (isDevMode, etc.)

3. **Entity Registration System:**
    - Entities extend `BaseGameObject` and **auto-register** when instantiated
    - Passages **auto-register** in their constructor (Story, InteractiveMap)
    - Registration creates Valtio proxies for reactive state updates
    - **No manual registration needed** - just create entities and passages, they register themselves

4. **Save/Load System:**
    - **Session Storage**: Auto-save functionality stores game state in sessionStorage with debouncing (500ms)
    - **IndexedDB**: Persistent storage using Dexie for manual saves (in `src/app/db.ts`)
    - **System Save**: Initial game state is stored as a system save (used for game restart)
    - Uses JSONPath for state queries and updates via `Storage` class
    - Game state is stored in a flat object structure
    - `BaseGameObject` handles automatic save/load of entity variables
    - System paths (prefixed with `STORAGE_SYSTEM_PATH`) are protected from direct modification
    - Key methods:
        - `Game.init()` - Initializes game and creates/updates system save
        - `Game.enableAutoSave()` - Enables auto-save to session storage
        - `Game.loadFromSessionStorage()` - Loads auto-saved state
        - `Game.clearAutoSave()` - Clears auto-saved state
        - `Game.getState()` / `Game.setState()` - Get/set complete game state

### Passage Types

**Story Passages** (`src/engine/passages/story/`):

- Display narrative content using components: text, headers, images, videos, actions, conversations
- Created with factory functions: `newStory()`, `newText()`, `newHeader()`, `newImage()`, `newVideo()`, `newActions()`, `newConversation()`
- **Auto-register** when created - no need to call `Game.registerPassage()`
- Example: `src/game/stories/test.ts`

**Interactive Maps** (`src/engine/passages/interactiveMap/`):

- Display images with clickable hotspots
- Hotspot types: labels, images, side elements, menus
- Created with factory functions: `newInteractiveMap()`, `newMapLabelHotspot()`, `newMapImageHotspot()`, `newMapMenu()`
- **Auto-register** when created - no need to call `Game.registerPassage()`
- Example: `src/game/maps/test.ts`

**Widget Passages** (`src/engine/passages/widget.ts`):

- Display custom React components as passages
- Used for system UI like menus, HUD overlays, or special screens
- Created with factory function: `newWidget(id, reactNode)`
- **Auto-register** when created - no need to call `Game.registerPassage()`
- System passages like the start menu use widgets (see `SYSTEM_PASSAGE_NAMES.START`)
- Example: `newWidget(SYSTEM_PASSAGE_NAMES.START, <MainMenu />)`

### System Passages and Constants

**System Passages** (`src/engine/constants.ts`):

- `SYSTEM_PASSAGE_NAMES.START` - The starting passage/menu (value: "start-passage")
- System passages can be re-registered (unlike regular passages)
- Use for main menu, pause screens, or other system-level UI

**System Storage Path**:

- `STORAGE_SYSTEM_PATH` - Path prefix for system-related storage (`$._system`)
- Used internally by the engine for game state management

### Path Aliases

TypeScript path aliases are configured in `tsconfig.app.json`:

- `@/*` → `src/*`
- `@engine/*` → `src/engine/*`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@game/*` → `src/game/*`

Always use these aliases for imports instead of relative paths.

### Navigation

- `Game.jumpTo(passageId)` or `Game.jumpTo(passage)` - Navigate to a passage
- `Game.setCurrent(passageId)` or `Game.setCurrent(passage)` - Set current passage without triggering navigation effects
- `Game.currentPassage` - Get the currently active passage
- `Game.getPassageById(id)` - Retrieve a specific passage by ID

### Component Factory Pattern

Both stories and maps use a factory pattern for creating components/hotspots. Factories accept either:

- Direct values (e.g., string for simple text)
- Configuration objects
- Functions that return configurations (for dynamic content)

This allows content to be static or computed at runtime.

### Working with Game Entities

**Creating entities:**

```typescript
// src/game/entities/player.ts
import { BaseGameObject } from "@engine/baseGameObject";

class Player extends BaseGameObject<{ health: number; name: string }> {
    get health() {
        return this.variables.health;
    }

    takeDamage(amount: number) {
        this.variables.health -= amount;
    }
}

// Auto-registers when instantiated
export const player = new Player({
    id: "player",
    variables: { health: 100, name: "Hero" },
});
```

**Using entities in React components:**

```typescript
import { useGameEntity } from "@app/hooks";
import { player } from "@game/entities/player";

function HealthBar() {
    const p = useGameEntity(player);
    return <div>Health: {p.variables.health}</div>;
}
```

**Important notes:**

- Entities **auto-register** in `BaseGameObject` constructor
- Always use `useGameEntity()` in React components to enable reactivity
- Mutate `variables` properties directly - Valtio handles reactivity
- Never use `any` or `unknown` types
- For testing, use bun:test module, for component testing use react-testing-library

### Available Hooks

**Game-related hooks** (`src/app/hooks/`):

- `useGameEntity(entity)` - Subscribe to entity changes in React components (required for reactivity)
- `useCurrentPassage()` - Get the current passage
- `useGameIsStarted()` - Check if game has started (not on start menu)
- `useRestartGame()` - Hook that returns a function to restart the game to initial state
- `useGetLastLoadGame()` - Get the last loaded game save
- `useLocalStorage(key, defaultValue)` - Persist state in localStorage
- `useWindowHeight()` - Get current window height (updates on resize)
- `useWindowDimensions()` - Get window width and height

**Context hooks:**

- `useOptions()` - Access game-wide options (isDevMode, etc.) from `OptionsProvider`
- `useSaveLoadModal()` - Control save/load modal visibility
- `useConfirmationDialog()` - Show confirmation dialogs

### UI Library

This project uses **HeroUI** (based on NextUI) for UI components:

- Import from `@heroui/react`
- Tailwind CSS v4 for styling
- Components wrapped in `HeroUIProvider` and `ToastProvider`

### Database Operations

**Save/Load functions** (`src/app/db.ts`):

- `saveGame(name, gameData, description?, screenshot?)` - Save game to IndexedDB
- `loadGame(id)` - Load game by ID
- `loadGameByName(name)` - Load game by name
- `getAllSaves()` - Get all user saves (excludes system save)
- `deleteSave(id)` - Delete a save
- `getSystemSave()` - Get the system save (initial state)
- `createOrUpdateSystemSave(gameData)` - Create/update system save
- `setSetting(key, value)` / `getSetting(key, defaultValue)` - Manage settings
- `getAllSettings()` - Get all settings
- `deleteSetting(key)` - Delete a setting

### Game Options

**Game configuration** (`src/game/options.ts`):

```typescript
export const options = {
    gameName: "Test Game",
    gameId: "testGame", // Used for database name
    description: "This is a test game.",
    gameVersion: "1.0.0",
    author: "Your Name",
} as const;
```

This configuration is used throughout the app for game metadata and database naming.
