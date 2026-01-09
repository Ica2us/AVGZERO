#!/bin/bash

echo "Building WASM engine..."

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "Error: Emscripten not found. Please install and activate emsdk."
    exit 1
fi

# Create build directory
mkdir -p build/wasm

# Build with CMake and Emscripten
cd build/wasm
emcmake cmake ../.. -DCMAKE_BUILD_TYPE=Release -DBUILD_WASM=ON
emmake make

# Check if build succeeded
if [ -f "avg_engine.wasm" ]; then
    echo "WASM build successful!"
else
    echo "WASM build failed!"
    exit 1
fi

cd ../..
