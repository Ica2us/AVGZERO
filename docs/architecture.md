# AVG Game Engine Architecture

## Overview

The AVG Game Engine is a lightweight visual novel/adventure game engine built with C++/WebAssembly for the core logic and JavaScript for the frontend. This document describes the architecture and design decisions.

## System Architecture

```
┌─────────────────────────────────────────┐
│         Web Frontend (JavaScript)       │
│  ┌────────────┐  ┌──────────────────┐  │
│  │ Game UI    │  │ Renderer System  │  │
│  │ - Dialogue │  │ - Background     │  │
│  │ - Choices  │  │ - Character      │  │
│  │ - Menu     │  │ - Text           │  │
│  └────────────┘  └──────────────────┘  │
│  ┌────────────────────────────────────┐ │
│  │     Asset & Audio Management       │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
              ↕ (JavaScript API)
┌─────────────────────────────────────────┐
│      WASM Module (C++)                   │
│  ┌────────────────────────────────────┐ │
│  │     AVG Engine Core                │ │
│  │  ┌──────────────┐  ┌────────────┐ │ │
│  │  │ Game State   │  │  Dialogue  │ │ │
│  │  │ Management   │  │  System    │ │ │
│  │  └──────────────┘  └────────────┘ │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │     Utilities (JSON, Strings)      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Core Components

### 1. C++ Engine (WASM)

#### AVGEngine
- Main engine class that manages the game lifecycle
- Handles initialization, script loading, and game state
- Provides high-level API for navigation and interaction

#### GameState
- Manages the current game state
- Stores dialogue nodes, variables, and history
- Handles save/load state serialization

#### DialogueNode
- Represents a single node in the game graph
- Contains dialogue text, speaker, choices, and scene data
- Supports different node types (dialogue, choice, scene, end)

### 2. JavaScript Frontend

#### Game Controller
- Main game loop and flow control
- Coordinates between engine and UI components
- Handles user input and keyboard shortcuts

#### Renderer System
- **BackgroundRenderer**: Manages background images with transitions
- **CharacterRenderer**: Displays character sprites with expressions
- **TextRenderer**: Typewriter effect for dialogue text

#### UI Components
- **DialogueUI**: Dialogue box display and interaction
- **ChoiceUI**: Choice selection interface
- **SaveSystem**: Save/load game state to localStorage

#### Utilities
- **EventBus**: Event system for inter-component communication
- **AssetLoader**: Caching and loading of images, audio, JSON
- **AudioManager**: BGM and sound effect playback

### 3. WASM Interface

The C++ engine exposes functions to JavaScript via Emscripten:

- Engine lifecycle: `avg_init()`, `avg_shutdown()`
- Navigation: `avg_goto_node()`, `avg_select_choice()`, `avg_go_back()`
- Data access: `avg_get_text()`, `avg_get_speaker()`, `avg_get_choice_count()`
- State management: `avg_save_state()`, `avg_load_state()`

## Data Flow

1. **Initialization**
   - Load WASM module
   - Initialize engine
   - Load game script JSON

2. **Game Loop**
   - Get current node from engine
   - Load scene assets (background, character, audio)
   - Display dialogue or choices
   - Wait for user input
   - Advance to next node
   - Repeat

3. **Save/Load**
   - Engine serializes state to JSON string
   - JavaScript stores in localStorage
   - On load, deserialize and restore state

## Script Format

Game scripts are written in JSON:

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "dialogue",
      "speaker": "Character Name",
      "text": "Dialogue text",
      "background": "bg_image.jpg",
      "character": "char_sprite",
      "expression": "happy",
      "bgm": "music.mp3",
      "next": "next_node_id"
    },
    {
      "id": "choice_node",
      "type": "choice",
      "text": "Question?",
      "choices": [
        {"text": "Option 1", "next": "node1"},
        {"text": "Option 2", "next": "node2"}
      ]
    }
  ]
}
```

## Performance Considerations

1. **WASM Optimization**
   - Compiled with `-O3` for release builds
   - No exceptions or RTTI for smaller binary
   - Memory growth allowed for flexibility

2. **Asset Management**
   - Assets cached after first load
   - Lazy loading - only load when needed
   - Preloading option for critical assets

3. **Rendering**
   - CSS transitions for smooth effects
   - RequestAnimationFrame for animations
   - Minimal DOM manipulation

## Build System

- **CMake**: C++ build configuration
- **Emscripten**: WASM compilation toolchain
- **Bash scripts**: Build automation
- **npm**: Package management for web tools

## Future Enhancements

- Voice acting support
- Video playback
- Animated character sprites
- Complex branching with conditions
- Multiple save slots UI
- Settings panel (volume, speed, etc.)
- Skip/Auto mode implementation
- History/backlog viewer
- CG gallery
- Achievement system
