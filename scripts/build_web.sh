#!/bin/bash

echo "Building web frontend..."

# Create build web directory
mkdir -p build/web

# Copy web files
cp -r web/src/* build/web/
cp -r web/assets build/web/ 2>/dev/null || echo "No assets directory found"

# Copy WASM files
mkdir -p build/web/build/wasm
cp build/wasm/avg_engine.wasm build/web/build/wasm/ 2>/dev/null || echo "WASM not built yet"
cp build/wasm/avg_engine.js build/web/build/wasm/ 2>/dev/null || echo "WASM JS not found"

echo "Web build complete!"
