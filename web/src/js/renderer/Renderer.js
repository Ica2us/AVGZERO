// Base renderer class
class Renderer {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.warn(`Element with id "${elementId}" not found`);
        }
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    setOpacity(opacity) {
        if (this.element) {
            this.element.style.opacity = opacity;
        }
    }

    fadeIn(duration = 500) {
        if (!this.element) return Promise.resolve();

        return new Promise(resolve => {
            this.element.style.opacity = '0';
            this.show();

            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;

                this.element.style.opacity = Math.min(progress, 1);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    fadeOut(duration = 500) {
        if (!this.element) return Promise.resolve();

        return new Promise(resolve => {
            const startOpacity = parseFloat(this.element.style.opacity) || 1;
            let start = null;

            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;

                this.element.style.opacity = startOpacity * (1 - Math.min(progress, 1));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.hide();
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    clear() {
        // Override in subclass
    }
}
