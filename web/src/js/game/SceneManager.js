// Scene manager
class SceneManager {
    constructor() {
        this.currentScene = null;
    }

    async loadScene(node) {
        if (!node) {
            return;
        }

        this.currentScene = node;

        // Load background
        if (node.background) {
            await backgroundRenderer.setBackground(`assets/images/backgrounds/${node.background}`);
        }

        // Load character
        if (node.character) {
            const characterPath = `assets/images/characters/${node.character}`;
            await characterRenderer.setCharacter(characterPath, node.expression);
        } else {
            characterRenderer.clear();
        }

        // Play BGM
        if (node.bgm) {
            await audioManager.playBGM(`assets/audio/bgm/${node.bgm}`, true);
        }

        // Play sound effect
        if (node.soundEffect) {
            await audioManager.playSE(`assets/audio/se/${node.soundEffect}`);
        }

        eventBus.emit('scene-loaded', node);
    }

    getCurrentScene() {
        return this.currentScene;
    }

    clear() {
        backgroundRenderer.clear();
        characterRenderer.clear();
        audioManager.stopBGM();
        this.currentScene = null;
    }
}

const sceneManager = new SceneManager();
