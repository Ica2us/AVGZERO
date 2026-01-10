.PHONY: all build build-wasm build-web dev clean test deploy help

# Detect OS
ifeq ($(OS),Windows_NT)
    SCRIPT_EXT = .bat
    SCRIPT_PREFIX = call scripts\\
    RM = rmdir /s /q
    MKDIR = mkdir
else
    SCRIPT_EXT = .sh
    SCRIPT_PREFIX = bash scripts/
    RM = rm -rf
    MKDIR = mkdir -p
endif

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
	@echo "Platform: $(if $(findstring Windows_NT,$(OS)),Windows,Unix)"
	@echo ""

build:
	@echo "Building AVG Game Engine..."
	$(SCRIPT_PREFIX)build$(SCRIPT_EXT)

build-wasm:
	@echo "Building WASM engine..."
	$(SCRIPT_PREFIX)build_wasm$(SCRIPT_EXT)

build-web:
	@echo "Building web frontend..."
	$(SCRIPT_PREFIX)build_web$(SCRIPT_EXT)

dev:
	@echo "Starting development server..."
	$(SCRIPT_PREFIX)dev_server$(SCRIPT_EXT)

clean:
	@echo "Cleaning build artifacts..."
	$(SCRIPT_PREFIX)clean$(SCRIPT_EXT)

test:
	@echo "Running tests..."
	npm test

deploy:
	@echo "Deploying..."
	$(SCRIPT_PREFIX)deploy$(SCRIPT_EXT)

