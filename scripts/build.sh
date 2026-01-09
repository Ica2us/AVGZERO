#!/bin/bash

echo "========================================="
echo "AVG Game Engine - Build Script"
echo "========================================="

# Build WASM
echo "Building WASM engine..."
bash scripts/build_wasm.sh

# Build Web
echo "Building web frontend..."
bash scripts/build_web.sh

echo "========================================="
echo "Build complete!"
echo "========================================="
