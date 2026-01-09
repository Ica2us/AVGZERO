.PHONY: all build build-wasm build-web dev clean test deploy help

all: build

help:
	@echo "AVG Game Engine - Build Commands"
	@echo ""
	@echo "  make build       - Build everything (WASM + Web)"
	@echo "  make build-wasm  - Build WASM engine only"
	@echo "  make build-web   - Build web frontend only"
	@echo "  make dev         - Start development server"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make test        - Run tests"
	@echo "  make deploy      - Deploy to production"
	@echo ""

build:
	@echo "Building AVG Game Engine..."
	bash scripts/build.sh

build-wasm:
	@echo "Building WASM engine..."
	bash scripts/build_wasm.sh

build-web:
	@echo "Building web frontend..."
	bash scripts/build_web.sh

dev:
	@echo "Starting development server..."
	bash scripts/dev_server.sh

clean:
	@echo "Cleaning build artifacts..."
	bash scripts/clean.sh

test:
	@echo "Running tests..."
	npm test

deploy:
	@echo "Deploying..."
	bash scripts/deploy.sh
