// Main game controller
class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.autoMode = false;
        this.skipMode = false;
    }

    async init() {
        try {
            // Initialize WASM engine
            const success = await avgEngine.init('../build/wasm/avg_engine.wasm');
            if (!success) {
                throw new Error('Failed to initialize engine');
            }

            // Load game script
            const script = await assetLoader.loadJSON('../assets/data/script.json');
            await avgEngine.loadScript(script);

            // Setup event listeners
            this.setupEventListeners();

            this.isRunning = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return false;
        }
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('btn-menu')?.addEventListener('click', () => this.showMenu());
        document.getElementById('btn-save')?.addEventListener('click', () => this.quickSave());
        document.getElementById('btn-load')?.addEventListener('click', () => this.quickLoad());
        document.getElementById('btn-auto')?.addEventListener('click', () => this.toggleAuto());
        document.getElementById('btn-skip')?.addEventListener('click', () => this.toggleSkip());

        // Menu modal buttons
        document.getElementById('btn-resume')?.addEventListener('click', () => this.hideMenu());
        document.getElementById('btn-title')?.addEventListener('click', () => this.returnToTitle());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleMenu();
            } else if (e.key === 'Enter' || e.key === ' ') {
                this.advance();
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.quickSave();
            } else if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.quickLoad();
            }
        });
    }

    async start() {
        if (!this.isRunning) {
            await this.init();
        }

        // Hide loading screen
        document.getElementById('loading-screen')?.classList.remove('active');
        document.getElementById('game-screen')?.classList.add('active');

        // Start game loop
        await this.gameLoop();
    }

    async gameLoop() {
        while (this.isRunning) {
            if (this.isPaused) {
                await this.sleep(100);
                continue;
            }

            const node = avgEngine.getCurrentNode();
            if (!node) {
                console.error('No current node');
                break;
            }

            // Load scene
            await sceneManager.loadScene(node);

            // Handle node based on type
            if (node.type === 'dialogue') {
                await dialogueUI.displayDialogue(node);

                // Auto advance if next node exists
                if (node.nextNodeId) {
                    avgEngine.gotoNode(node.nextNodeId);
                } else {
                    break;
                }
            } else if (node.type === 'choice') {
                const choiceIndex = await choiceUI.displayChoices(node);
                if (choiceIndex >= 0) {
                    avgEngine.selectChoice(choiceIndex);
                }
            } else if (node.type === 'end') {
                dialogueUI.hide();
                choiceUI.hide();
                break;
            }

            await this.sleep(50);
        }
    }

    advance() {
        // Skip typewriter effect
        if (textRenderer.isTyping) {
            textRenderer.skip();
        }
    }

    showMenu() {
        this.isPaused = true;
        document.getElementById('menu-screen')?.classList.add('active');
    }

    hideMenu() {
        this.isPaused = false;
        document.getElementById('menu-screen')?.classList.remove('active');
    }

    toggleMenu() {
        if (this.isPaused) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    quickSave() {
        const success = saveSystem.quickSave();
        if (success) {
            console.log('Game saved!');
        }
    }

    async quickLoad() {
        const success = saveSystem.quickLoad();
        if (success) {
            console.log('Game loaded!');
            // Stop current game loop by setting isRunning to false temporarily
            // The while loop in gameLoop will exit, then we restart
            this.isRunning = false;
            // Wait a tick to ensure the current loop exits
            await this.sleep(100);
            this.isRunning = true;
            // Restart the game loop from the loaded state
            this.gameLoop();
        }
    }

    toggleAuto() {
        this.autoMode = !this.autoMode;
        console.log('Auto mode:', this.autoMode);
    }

    toggleSkip() {
        this.skipMode = !this.skipMode;
        console.log('Skip mode:', this.skipMode);
    }

    returnToTitle() {
        this.isRunning = false;
        this.isPaused = false;
        sceneManager.clear();
        dialogueUI.clear();
        choiceUI.clear();
        avgEngine.reset();
        window.location.reload();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const game = new Game();
