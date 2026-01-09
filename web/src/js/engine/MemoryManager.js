// Memory manager for WASM memory operations
class MemoryManager {
    constructor(wasmModule) {
        this.wasm = wasmModule;
        this.allocatedPointers = new Set();
    }

    /**
     * Allocate memory in WASM heap
     * @param {number} size - Size in bytes
     * @returns {number} Pointer to allocated memory
     */
    malloc(size) {
        if (!this.wasm) {
            throw new Error('WASM module not initialized');
        }

        const ptr = this.wasm._malloc(size);
        if (ptr) {
            this.allocatedPointers.add(ptr);
        }
        return ptr;
    }

    /**
     * Free memory in WASM heap
     * @param {number} ptr - Pointer to free
     */
    free(ptr) {
        if (!this.wasm || !ptr) {
            return;
        }

        this.wasm._free(ptr);
        this.allocatedPointers.delete(ptr);
    }

    /**
     * Allocate and write string to WASM memory
     * @param {string} str - String to write
     * @returns {number} Pointer to string in WASM memory
     */
    allocString(str) {
        if (!this.wasm) {
            throw new Error('WASM module not initialized');
        }

        const length = this.wasm.lengthBytesUTF8(str) + 1;
        const ptr = this.malloc(length);

        if (ptr) {
            this.wasm.stringToUTF8(str, ptr, length);
        }

        return ptr;
    }

    /**
     * Read string from WASM memory
     * @param {number} ptr - Pointer to string
     * @returns {string} JavaScript string
     */
    readString(ptr) {
        if (!this.wasm || !ptr) {
            return '';
        }

        return this.wasm.UTF8ToString(ptr);
    }

    /**
     * Read string and free the memory
     * @param {number} ptr - Pointer to string
     * @returns {string} JavaScript string
     */
    readAndFreeString(ptr) {
        const str = this.readString(ptr);
        this.free(ptr);
        return str;
    }

    /**
     * Copy data from JavaScript array to WASM memory
     * @param {TypedArray} data - Data to copy
     * @returns {number} Pointer to data in WASM memory
     */
    copyToWasm(data) {
        if (!this.wasm) {
            throw new Error('WASM module not initialized');
        }

        const ptr = this.malloc(data.length * data.BYTES_PER_ELEMENT);
        if (ptr) {
            const heap = new Uint8Array(this.wasm.HEAPU8.buffer, ptr, data.length * data.BYTES_PER_ELEMENT);
            heap.set(new Uint8Array(data.buffer));
        }

        return ptr;
    }

    /**
     * Copy data from WASM memory to JavaScript array
     * @param {number} ptr - Pointer to data
     * @param {number} length - Length of data
     * @param {Function} TypedArrayConstructor - Constructor for typed array
     * @returns {TypedArray} JavaScript array with copied data
     */
    copyFromWasm(ptr, length, TypedArrayConstructor = Uint8Array) {
        if (!this.wasm || !ptr) {
            return new TypedArrayConstructor(0);
        }

        const data = new TypedArrayConstructor(length);
        const heap = new TypedArrayConstructor(this.wasm.HEAPU8.buffer, ptr, length);
        data.set(heap);

        return data;
    }

    /**
     * Free all allocated pointers
     */
    freeAll() {
        for (const ptr of this.allocatedPointers) {
            if (ptr) {
                this.wasm._free(ptr);
            }
        }
        this.allocatedPointers.clear();
    }

    /**
     * Get memory usage statistics
     * @returns {object} Memory statistics
     */
    getStats() {
        return {
            allocatedPointers: this.allocatedPointers.size,
            totalMemory: this.wasm ? this.wasm.HEAP8.length : 0
        };
    }

    /**
     * Check for memory leaks
     * @returns {boolean} True if there are potential leaks
     */
    checkLeaks() {
        const stats = this.getStats();
        if (stats.allocatedPointers > 0) {
            console.warn(`Potential memory leak: ${stats.allocatedPointers} pointers still allocated`);
            return true;
        }
        return false;
    }

    /**
     * Initialize memory manager with WASM module
     * @param {object} wasmModule - Emscripten module
     */
    init(wasmModule) {
        this.wasm = wasmModule;
        this.allocatedPointers.clear();
    }

    /**
     * Shutdown and cleanup
     */
    shutdown() {
        this.freeAll();
        this.wasm = null;
    }
}

// Global memory manager instance
const memoryManager = new MemoryManager(null);
