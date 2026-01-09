# AVG Game Engine

A lightweight Adventure/Visual Novel game engine built with WebAssembly and modern web technologies.

## Features

- **High Performance**: Core engine written in C++ and compiled to WebAssembly
- **Modern Web Stack**: HTML5, CSS3, and JavaScript frontend
- **Flexible Scripting**: JSON-based game script format
- **Rich Features**:
  - Dialogue system with choices
  - Character sprites and backgrounds
  - Audio support (BGM and sound effects)
  - Save/Load system
  - Localization support
  - Scene management

## Project Structure

- `src/` - C++ source code for the WASM engine
- `web/` - Web frontend (HTML, CSS, JavaScript)
- `build/` - Build output directory
- `scripts/` - Build and deployment scripts
- `*tools/` - Development tools (script editor, asset converter,now under development)
- `*tests/` - Unit tests (under dev too)
- `docs/` - Documentation

## Requirements

### Building WASM
- Emscripten SDK (emsdk)
- CMake 3.20+
- Python 3.8+

### Web Development
- Node.js 16+
- Modern web browser with WASM support

## Quick Start

### 1. Install Dependencies

```bash
# Install Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

# Install Node.js dependencies
npm install
```

### 2. Build the Project

```bash
# Build everything
make build

# Or build individually
make build-wasm    # Build WASM engine
make build-web     # Build web frontend
```

### 3. Run Development Server

```bash
make dev
# Open http://localhost:8080 in your browser
```

## Building from Source

### Build WASM Engine

```bash
mkdir build
cd build
emcmake cmake .. -DBUILD_WASM=ON
emmake make
```

### Build Web Frontend

```bash
cd web
npm install
npm run build
```

## Game Script Format

Game scripts are written in JSON format:

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "dialogue",
      "speaker": "Protagonist",
      "text": "Hello, world!",
      "next": "choice1"
    },
    {
      "id": "choice1",
      "type": "choice",
      "text": "What will you do?",
      "choices": [
        {"text": "Continue", "next": "end"},
        {"text": "Go back", "next": "start"}
      ]
    }
  ]
}
```

## Development

### Running Tests

```bash
make test
```

### Clean Build

```bash
make clean
```

### Deploy

```bash
make deploy
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api/)
- [Getting Started Tutorial](docs/tutorials/getting_started.md)
- [Writing Game Scripts](docs/tutorials/writing_scripts.md)

## License

MIT License

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
*have not done yet*
