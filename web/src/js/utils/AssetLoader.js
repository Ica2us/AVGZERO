// Asset loader for images, audio, etc.
class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
    }

    async loadImage(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.loading.has(url)) {
            return this.loading.get(url);
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, img);
                this.loading.delete(url);
                resolve(img);
            };
            img.onerror = () => {
                this.loading.delete(url);
                reject(new Error(`Failed to load image: ${url}`));
            };
            img.src = url;
        });

        this.loading.set(url, promise);
        return promise;
    }

    async loadAudio(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.loading.has(url)) {
            return this.loading.get(url);
        }

        const promise = new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.cache.set(url, audio);
                this.loading.delete(url);
                resolve(audio);
            };
            audio.onerror = () => {
                this.loading.delete(url);
                reject(new Error(`Failed to load audio: ${url}`));
            };
            audio.src = url;
        });

        this.loading.set(url, promise);
        return promise;
    }

    async loadJSON(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.loading.has(url)) {
            return this.loading.get(url);
        }

        const promise = fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.cache.set(url, data);
                this.loading.delete(url);
                return data;
            })
            .catch(error => {
                this.loading.delete(url);
                throw error;
            });

        this.loading.set(url, promise);
        return promise;
    }

    get(url) {
        return this.cache.get(url);
    }

    has(url) {
        return this.cache.has(url);
    }

    clear() {
        this.cache.clear();
        this.loading.clear();
    }
}

// Global asset loader instance
const assetLoader = new AssetLoader();
