# Getting Started with AVG Game Engine

This tutorial will guide you through setting up and running your first AVG game.

## Prerequisites

- **Emscripten SDK** (for building WASM)
- **CMake 3.20+**
- **Node.js 16+**
- **Python 3.8+**
- Modern web browser with WASM support

## Installation

### 1. Install Emscripten

```bash
# Clone emsdk
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Install and activate latest version
./emsdk install latest
./emsdk activate latest

# Activate PATH (run this every time you open a new terminal)
source ./emsdk_env.sh
```

### 2. Clone the Project

```bash
git clone <your-repo-url>
cd avg-game
```

### 3. Install Dependencies

```bash
npm install
```

## Building the Engine

### Build Everything

```bash
make build
```

Or use npm:

```bash
npm run build
```

This will:
1. Compile C++ code to WASM
2. Copy web files to build directory
3. Prepare assets

### Build WASM Only

```bash
make build-wasm
```

### Build Web Only

```bash
make build-web
```

## Running the Game

### Development Server

```bash
make dev
```

Or:

```bash
npm run dev
```

This will:
1. Build the project
2. Start a local HTTP server
3. Open your browser to http://localhost:8080

### Manual Testing

If you prefer to use your own server:

```bash
cd build/web
python -m http.server 8080
```

## Project Structure

```
avg-game/
├── src/              # C++ source code
│   ├── core/         # Engine core
│   ├── utils/        # Utilities
│   └── exports/      # WASM exports
├── web/              # Web frontend
│   ├── src/          # HTML/CSS/JS
│   └── assets/       # Game assets
├── build/            # Build output
├── scripts/          # Build scripts
└── docs/             # Documentation
```

## Creating Your First Scene

Edit `web/assets/data/script.json`:

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "dialogue",
      "speaker": "Narrator",
      "text": "Hello, world!",
      "next": "end"
    },
    {
      "id": "end",
      "type": "end"
    }
  ]
}
```

Rebuild and refresh your browser!

## Adding Assets

### Background Images

Place images in `web/assets/images/backgrounds/`

Reference in script:
```json
{
  "background": "my_background.jpg"
}
```

### Character Sprites

Place sprites in `web/assets/images/characters/character_name/`

Reference in script:
```json
{
  "character": "character_name",
  "expression": "happy"
}
```

### Audio

- BGM: `web/assets/audio/bgm/`
- SE: `web/assets/audio/se/`

Reference in script:
```json
{
  "bgm": "my_music.mp3",
  "se": "sound_effect.mp3"
}
```

## Next Steps

- Read [Writing Game Scripts](writing_scripts.md)
- Learn about [Building for WASM](building_wasm.md)
- Explore the [API Reference](../api/)

## Troubleshooting

### WASM Not Loading

- Make sure Emscripten is activated in your terminal
- Check that `avg_engine.wasm` exists in `build/wasm/`
- Verify the path in `Game.js` matches your WASM location

### Assets Not Loading

- Check browser console for 404 errors
- Verify asset paths in your script.json
- Ensure files are in the correct directories

### Build Errors

- Update CMake to version 3.20+
- Make sure all source files are included in CMakeLists.txt
- Check that Emscripten is properly installed

## Getting Help

- Check the [documentation](../)
- Review example scripts in `web/assets/data/`
- Open an issue on GitHub
