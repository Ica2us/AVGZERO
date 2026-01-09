// WASM loader for AVG Engine
class WasmLoader {
    constructor() {
        this.module = null;
        this.isLoaded = false;
    }

    async load(wasmPath) {
        try {
            // Load the WASM module
            if (typeof AVGEngineModule === 'undefined') {
                throw new Error('AVGEngineModule not found. Make sure the WASM JS file is loaded.');
            }

            this.module = await AVGEngineModule({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) {
                        return wasmPath;
                    }
                    return path;
                }
            });

            this.isLoaded = true;
            return this.module;
        } catch (error) {
            console.error('Failed to load WASM module:', error);
            throw error;
        }
    }

    getModule() {
        if (!this.isLoaded) {
            throw new Error('WASM module not loaded. Call load() first.');
        }
        return this.module;
    }

    // Helper to create wrapped WASM function
    // Usage: wrapFunction('func_name', 'number', ['string', 'number'])
    wrapFunction(functionName, returnType = null, argTypes = []) {
        if (!this.isLoaded) {
            throw new Error('WASM module not loaded.');
        }

        const func = this.module.cwrap(functionName, returnType, argTypes);
        if (!func) {
            throw new Error(`Function ${functionName} not found in WASM module.`);
        }

        return func;
    }

    // Helper to read string from WASM memory
    readString(ptr) {
        if (!ptr) {
            return '';
        }
        return this.module.UTF8ToString(ptr);
    }

    // Helper to write string to WASM memory
    writeString(str) {
        const length = this.module.lengthBytesUTF8(str) + 1;
        const ptr = this.module._malloc(length);
        this.module.stringToUTF8(str, ptr, length);
        return ptr;
    }

    // Free memory allocated by WASM
    free(ptr) {
        if (ptr) {
            this.module._free(ptr);
        }
    }
}

// Global WASM loader instance
const wasmLoader = new WasmLoader();
