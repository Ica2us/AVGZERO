// Background renderer
class BackgroundRenderer extends Renderer {
    constructor() {
        super('background-image');
        this.currentBackground = '';
    }

    async setBackground(imagePath) {
        if (!imagePath || imagePath === this.currentBackground) {
            return;
        }

        try {
            const img = await assetLoader.loadImage(imagePath);

            await this.fadeOut(300);
            this.element.src = imagePath;
            this.currentBackground = imagePath;
            await this.fadeIn(300);
        } catch (error) {
            console.error('Failed to load background:', error);
        }
    }

    clear() {
        this.element.src = '';
        this.currentBackground = '';
        this.hide();
    }
}

const backgroundRenderer = new BackgroundRenderer();
