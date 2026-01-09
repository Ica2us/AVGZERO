// Character renderer
class CharacterRenderer extends Renderer {
    constructor() {
        super('character-image');
        this.currentCharacter = '';
    }

    async setCharacter(imagePath, expression = '') {
        const fullPath = expression ? `${imagePath}/${expression}.png` : imagePath;

        if (!fullPath || fullPath === this.currentCharacter) {
            return;
        }

        try {
            const img = await assetLoader.loadImage(fullPath);

            if (this.currentCharacter) {
                await this.fadeOut(200);
            }

            this.element.src = fullPath;
            this.currentCharacter = fullPath;
            await this.fadeIn(200);
        } catch (error) {
            console.error('Failed to load character:', error);
        }
    }

    clear() {
        this.fadeOut(200).then(() => {
            this.element.src = '';
            this.currentCharacter = '';
        });
    }
}

const characterRenderer = new CharacterRenderer();
