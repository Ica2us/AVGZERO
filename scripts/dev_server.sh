#!/bin/bash

echo "Starting development server..."

# Install http-server if not present
if ! command -v http-server &> /dev/null; then
    echo "Installing http-server..."
    npm install -g http-server
fi

# Build first
bash scripts/build.sh

# Start server
cd build/web
echo "Server running at http://localhost:8080"
http-server -p 8080 -c-1
