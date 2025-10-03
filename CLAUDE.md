# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**

- `bun dev` - Start the development server (runs on http://localhost:5173)
- `bun run build` - Build the project (runs TypeScript compiler and Vite build)
- `bun run typecheck` - Type-check without emitting files
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

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
    - **TanStack Query** for UI-related data
    - Entities are **auto-registered** in their `BaseGameObject` constructor
    - Use `useGameEntity(entity)` hook to observe changes to game objects in React components

3. **Entity Registration System:**
    - Entities extend `BaseGameObject` and **auto-register** when instantiated
    - Passages **auto-register** in their constructor (Story, InteractiveMap)
    - Registration creates Valtio proxies for reactive state updates
    - **No manual registration needed** - just create entities and passages, they register themselves

4. **Save/Load System:**
    - Uses JSONPath for state queries and updates via `Storage` class
    - Game state is stored in a flat object structure
    - `BaseGameObject` handles automatic save/load of entity variables
    - System paths (prefixed with `STORAGE_SYSTEM_PATH`) are protected from direct modification

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
