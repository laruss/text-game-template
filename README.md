# Text Adventure Game Engine

This project is a framework for creating interactive text-based adventure games with a modern web interface. It allows developers to define game narratives through different types of "passages," including story displays and interactive maps with clickable hotspots.

## Overview

The engine is built with React and TypeScript, utilizing Vite for fast development and Bun as the runtime and package manager. It features a modular design where game content (stories, maps, entities) is separated from the core engine logic. The UI is constructed using Heroui components and styled with Tailwind CSS. State management for the game logic is handled by Valtio, while TanStack Query is used for UI-related data management.

## Features

- **Passage-Based Navigation**: Game flow is organized into passages, which can be of various types (e.g., story narratives, interactive maps).
- **Interactive Maps**:
    - Display images as maps with optional background images.
    - Support for clickable hotspots (labels, images) positioned on the map.
    - Hotspots can trigger actions, such as navigating to other passages or executing custom logic.
    - Support for side-aligned hotspots and context menus on maps.
- **Story Passages**:
    - Render rich story content including text, headers, images, and videos.
    - Display interactive elements like action buttons and conversation bubbles.
- **State Management**: Robust game state management using Valtio, allowing for reactive updates to the UI.
- **Save/Load System**: Built-in functionality for saving and loading game progress.
- **Modern UI**:
    - Clean and responsive user interface built with React and Heroui.
    - Styled with Tailwind CSS.
    - Smooth transitions and animations powered by Framer Motion.
- **Developer Friendly**:
    - Written in TypeScript for type safety.
    - Uses Vite for a fast development experience.
    - Bun for efficient package management and runtime.

## Tech Stack

- **Runtime & Package Manager**: Bun
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Framework**: React
- **UI Library**: Heroui (`@heroui/react`)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Game State Management**: Valtio
- **UI Data Management**: TanStack Query (`@tanstack/react-query`)

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

### Running the Project

To start the development server:

```bash
bun dev
```

This will typically start the application on `http://localhost:5173`.

## Key Concepts

- **Game (`src/engine/game.ts`)**: The central class for managing game state, passages, and entities.
- **Passage (`src/engine/passages/passage.ts`)**: The base class for different types of game screens or scenes.
    - **InteractiveMap (`src/engine/passages/interactiveMap/interactiveMap.ts`)**: A passage type for displaying maps with interactive hotspots. Game-specific maps are defined in `src/game/maps/`.
    - **Story (`src/engine/passages/story/story.ts`)**: A passage type for displaying narrative content, actions, and dialogues. Game-specific stories are defined in `src/game/stories/`.
- **Hotspots**: Interactive elements on an `InteractiveMap` that can trigger game events or navigation.
- **Components (`src/components/`)**: Reusable React components that make up the game's UI.
- **Entities (`src/game/entities/`)**: Game objects or characters that can hold state and interact within the game world.

This README provides a basic guide to the project. Explore the `src/engine` and `src/game` directories to understand the core mechanics and how to define your own game content.
