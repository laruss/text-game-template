# Text Adventure Game Engine

A modern, TypeScript-based framework for creating interactive text-based adventure games with a rich web interface. Build immersive narratives through a passage-based system that supports story content, interactive maps with clickable hotspots, and custom React widgets.

## Overview

The engine is built with React and TypeScript, utilizing Vite for fast development and Bun as the runtime and package manager. It features a modular design with strict separation between the reusable game engine (`src/engine/`) and game-specific content (`src/game/`). The architecture emphasizes developer experience with auto-registration of entities and passages, reactive state management via Valtio, and a comprehensive save/load system using both session storage and IndexedDB.

## Features

### Core Engine

- **Passage-Based Architecture**: Game flow organized into three passage types:
    - **Story Passages**: Rich narrative content with text, headers, images, videos, actions, and conversations
    - **Interactive Maps**: Clickable hotspots (labels, images, menus) on background images
    - **Widget Passages**: Custom React components for system UI (menus, HUD, overlays)
- **Auto-Registration System**: Entities and passages automatically register themselves on instantiation - no manual setup required
- **Reactive State Management**:
    - Valtio proxies for game state with automatic UI updates
    - `useGameEntity()` hook for React component reactivity
    - TanStack Query for UI-related data and caching
- **Comprehensive Save/Load System**:
    - **Auto-save**: Debounced session storage saves (500ms)
    - **Manual saves**: IndexedDB persistence with Dexie
    - **System save**: Initial game state for restart functionality
    - JSONPath-based state queries and updates

### Interactive Maps

- Position hotspots with pixel-perfect coordinates or percentages
- Support for multiple hotspot types: labels, images, side elements, menus
- Dynamic hotspot content based on game state
- Responsive scaling and positioning
- Context menus and nested interaction patterns

### Story Passages

- Component-based content system with factory functions
- Support for text blocks, headers, images, and videos
- Interactive action buttons with custom handlers
- Conversation/dialogue systems
- Dynamic content generation based on game state

### Developer Experience

- **TypeScript-first**: Full type safety throughout the codebase
- **Path aliases**: Clean imports with `@engine/`, `@game/`, `@components/`, etc.
- **Hot reload**: Instant feedback during development with Vite HMR
- **Factory pattern**: Intuitive API for creating game content
- **Separation of concerns**: Engine code is reusable across different games
- **React hooks**: Custom hooks for game state, passages, and UI management

### Modern UI

- Clean, responsive interface with HeroUI components
- Tailwind CSS v4 for styling
- Built-in save/load modal
- Confirmation dialogs
- Toast notifications
- Developer mode with state inspection
- Customizable sidebar layout

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Build Tool**: [Vite](https://vitejs.dev/) 7.x
- **Language**: TypeScript 5.9.x
- **UI Framework**: [React](https://react.dev/) 19.2.x
- **UI Library**: [HeroUI](https://www.heroui.com/) (`@heroui/react`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Game State Management**: [Valtio](https://valtio.pmnd.rs/) (reactive proxies)
- **UI Data Management**: [TanStack Query](https://tanstack.com/query) v5
- **Database**: [Dexie](https://dexie.org/) (IndexedDB wrapper)
- **State Query**: JSONPath
- **Icons**: React Icons
- **Testing**: Bun test + React Testing Library + Happy DOM

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system.

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies using Bun:

    ```bash
    bun install
    ```

### Available Commands

```bash
# Start development server (http://localhost:5173)
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run typecheck

# Linting
bun run lint

# Format code with Prettier
bun run prettify

# Run all checks and fixes
bun run check:fix
```

## Architecture

### Directory Structure

```
src/
├── engine/              # Reusable game engine (framework code)
│   ├── passages/       # Passage types (Story, InteractiveMap, Widget)
│   ├── game.ts         # Core Game class
│   ├── baseGameObject.ts  # Base class for game entities
│   ├── storage.ts      # State management and persistence
│   └── constants.ts    # System constants
├── game/               # Game-specific content
│   ├── stories/        # Story passage definitions
│   ├── maps/           # Interactive map definitions
│   ├── entities/       # Game entities (player, NPCs, etc.)
│   └── options.ts      # Game configuration
├── app/                # Application utilities
│   ├── hooks/          # Custom React hooks
│   └── db.ts           # Database operations
├── components/         # React UI components
└── main.tsx            # Application entry point
```

### Core Concepts

#### Game Class (`src/engine/game.ts`)

The central singleton managing the entire game system:

```typescript
// Navigation
Game.jumpTo(passageId)              // Navigate to a passage
Game.setCurrent(passage)             // Set current without effects
Game.currentPassage                  // Get current passage
Game.getPassageById(id)              // Get specific passage
Game.getAllPassages()                // Get all passages

// State Management
Game.getState()                      // Get complete game state
Game.setState(state)                 // Restore game state
Game.init()                          // Initialize (create system save)

// Auto-save
Game.enableAutoSave()                // Enable session storage auto-save
Game.disableAutoSave()               // Disable auto-save
Game.loadFromSessionStorage()        // Load auto-saved state
Game.clearAutoSave()                 // Clear auto-save

// Registration (automatic via constructors)
Game.registerEntity(entity)          // Register game entity
Game.registerPassage(passage)        // Register passage
```

#### Passages

Three passage types for different content:

1. **Story Passages** - Narrative content with rich media
2. **Interactive Maps** - Clickable hotspot-based exploration
3. **Widget Passages** - Custom React components

#### Entities (`BaseGameObject`)

Game objects that hold state and auto-register:

- Extend `BaseGameObject<VariablesType>`
- Define typed variables for state
- Auto-save/load support via Storage class
- Reactive updates with Valtio proxies

#### Storage System

- **Session Storage**: Auto-save with 500ms debouncing
- **IndexedDB**: Manual saves via Dexie
- **JSONPath**: Query and update state with path syntax
- **System Save**: Initial state for game restart

## Examples

### Creating a Game Entity

```typescript
// src/game/entities/player.ts
import { BaseGameObject } from "@engine/baseGameObject";

type PlayerVariables = {
    health: number;
    name: string;
    inventory: string[];
};

class Player extends BaseGameObject<PlayerVariables> {
    get health() {
        return this.variables.health;
    }

    takeDamage(amount: number) {
        this.variables.health -= amount;
        if (this.variables.health < 0) {
            this.variables.health = 0;
        }
    }

    addItem(item: string) {
        this.variables.inventory.push(item);
    }

    hasItem(item: string): boolean {
        return this.variables.inventory.includes(item);
    }
}

// Auto-registers when instantiated
export const player = new Player({
    id: "player",
    variables: {
        health: 100,
        name: "Hero",
        inventory: [],
    },
});
```

### Creating a Story Passage

```typescript
// src/game/stories/chapter1.ts
import { newStory } from "@engine/passages/story";
import { player } from "@game/entities/player";
import { Game } from "@engine/game";

export const chapter1 = newStory(
    "chapter1",
    () => [
        newHeader("Chapter 1: The Beginning"),
        newText("You wake up in a dark room..."),
        newImage("/images/dark-room.jpg"),
        newActions([
            {
                text: "Look around",
                onClick: () => {
                    Game.jumpTo("chapter1-explore");
                },
            },
            {
                text: "Call for help",
                onClick: () => {
                    player.takeDamage(10);
                    Game.jumpTo("chapter1-help");
                },
                // Conditional display
                condition: () => player.health > 50,
            },
        ]),
    ]
);
```

### Creating an Interactive Map

```typescript
// src/game/maps/town.ts
import { newInteractiveMap } from "@engine/passages/interactiveMap";
import { newMapLabelHotspot, newMapImageHotspot } from "@engine/passages/interactiveMap/fabric";
import { Game } from "@engine/game";
import { player } from "@game/entities/player";

export const townMap = newInteractiveMap("town-square", {
    background: "/images/town-square.jpg",
    hotspots: [
        newMapLabelHotspot({
            id: "tavern-entrance",
            text: "The Rusty Sword Tavern",
            position: { x: 30, y: 45 }, // Percentage-based
            onClick: () => Game.jumpTo("tavern-interior"),
        }),
        newMapImageHotspot({
            id: "merchant",
            image: "/images/merchant-icon.png",
            position: { x: 60, y: 50 },
            width: 50,
            height: 50,
            onClick: () => {
                if (player.hasItem("gold")) {
                    Game.jumpTo("merchant-shop");
                } else {
                    Game.jumpTo("merchant-no-gold");
                }
            },
        }),
    ],
});
```

### Creating a Widget Passage

```tsx
// src/components/MainMenu/MainMenu.tsx
import { newWidget } from "@engine/passages/widget";
import { SYSTEM_PASSAGE_NAMES } from "@engine/constants";
import { Game } from "@engine/game";
import { Button } from "@heroui/react";

const MainMenuContent = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1>My Adventure Game</h1>
            <Button onClick={() => Game.jumpTo("intro")}>
                New Game
            </Button>
            <Button onClick={() => {/* Open load modal */}}>
                Load Game
            </Button>
        </div>
    );
};

export const mainMenu = newWidget(
    SYSTEM_PASSAGE_NAMES.START,
    <MainMenuContent />
);
```

### Using Entities in React Components

```tsx
import { useGameEntity } from "@app/hooks";
import { player } from "@game/entities/player";

function HealthBar() {
    // IMPORTANT: Must use useGameEntity for reactivity
    const p = useGameEntity(player);

    return (
        <div className="health-bar">
            <div>Health: {p.variables.health}</div>
            <div>Items: {p.variables.inventory.length}</div>
        </div>
    );
}
```

### Save/Load Operations

```typescript
import { saveGame, loadGame, getAllSaves } from "@app/db";
import { Game } from "@engine/game";

// Save current game state
async function saveCurrentGame() {
    const state = Game.getState();
    await saveGame(
        "My Save",
        state,
        "Chapter 3, outside the castle",
        screenshotBase64 // Optional
    );
}

// Load a saved game
async function loadSavedGame(saveId: number) {
    const save = await loadGame(saveId);
    if (save) {
        Game.setState(save.gameData);
    }
}

// List all saves
async function listSaves() {
    const saves = await getAllSaves();
    saves.forEach(save => {
        console.log(`${save.name} - ${save.timestamp}`);
    });
}
```

## Best Practices

### Entity Design

✅ **DO:**
- Keep entity logic in the entity class
- Use getters/setters for computed properties
- Mutate `variables` directly (Valtio tracks changes)
- Use typed variable definitions
- Export a single instance if it's a singleton (like `player`)

❌ **DON'T:**
- Use `any` or `unknown` types
- Mutate entities outside their methods (prefer methods for complex logic)
- Create entities inside React components

### Passage Organization

✅ **DO:**
- Group related passages in the same file
- Use factory functions for dynamic content
- Leverage conditional rendering based on game state
- Keep passage IDs descriptive and unique

❌ **DON'T:**
- Hard-code passage IDs as strings everywhere (use constants)
- Create circular dependencies between passages
- Put game logic in passage definitions (use entities)

### State Management

✅ **DO:**
- Always use `useGameEntity()` in React components
- Enable auto-save in production
- Use the system save for restart functionality
- Store complex state in entities, not passages

❌ **DON'T:**
- Access entity properties directly in components without `useGameEntity()`
- Modify system storage paths directly
- Store UI state in game entities

### Component Development

✅ **DO:**
- Use path aliases (`@engine/`, `@game/`, etc.)
- Keep components pure and reusable
- Use HeroUI components for consistency
- Implement loading and error states

❌ **DON'T:**
- Import from relative paths when aliases exist
- Mix game logic with UI logic
- Create tightly coupled components

### Performance

✅ **DO:**
- Use dynamic imports for large passage collections
- Implement code splitting for better load times
- Use React.memo for expensive render components
- Debounce frequent state updates

❌ **DON'T:**
- Create new entity instances on every render
- Subscribe to entities you don't use
- Load all game assets upfront

## Project Structure Guidelines

### Engine (`src/engine/`)

The engine should be **game-agnostic** and reusable. It contains:
- Core game mechanics
- Passage type definitions
- State management utilities
- Base classes for entities

**Never** put game-specific content in the engine.

### Game (`src/game/`)

Game-specific content including:
- Story definitions
- Map layouts
- Game entities
- Game configuration

**Always** put game content here, not in the engine.

### App (`src/app/`)

Application utilities that bridge the engine and UI:
- Custom hooks
- Database operations
- Utility functions

## Configuration

Edit `src/game/options.ts` to configure your game:

```typescript
export const options = {
    gameName: "Your Game Title",
    gameId: "unique-game-id",        // Used for database naming
    description: "Game description",
    gameVersion: "1.0.0",
    author: "Your Name",
} as const;
```

## TODO

### High Priority

- [ ] **Separate HeroUI from core engine**: Move `@heroui/react` to a separate optional UI library to make the core engine UI-agnostic
- [ ] **Extract core to standalone package**: Create a separate npm package for the game engine that can be reused across projects
- [ ] **Write comprehensive tests**: Add test coverage for core functionality including:
    - Game state management
    - Entity registration and lifecycle
    - Save/load system
    - Passage navigation
    - Storage operations
- [ ] **Create full documentation**: Develop comprehensive docs covering:
    - API reference for all core classes
    - Advanced usage patterns
    - Migration guides
    - Plugin system documentation

### Medium Priority

- [ ] Add TypeScript strict mode throughout
- [ ] Implement passage transitions and animations API
- [ ] Create CLI tool for scaffolding new games
- [ ] Add built-in debugging tools and state inspector
- [ ] Support for audio/music management
- [ ] Implement achievement system
- [ ] Add localization/i18n support

### Low Priority

- [ ] Create example games/templates
- [ ] Add story script language (DSL) support
- [ ] Implement cloud save functionality
- [ ] Build visual passage editor
- [ ] Add analytics integration hooks

## Contributing

Contributions are welcome! Please ensure:
- TypeScript strict mode compliance
- ESLint and Prettier formatting
- Test coverage for new features
- Documentation updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For detailed development guidance, see [CLAUDE.md](./CLAUDE.md).
