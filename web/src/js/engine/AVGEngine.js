// JavaScript wrapper for AVG Engine WASM
class AVGEngine {
    constructor() {
        this.wasm = null;
        this.initialized = false;

        // Function wrappers
        this.functions = {};
    }

    async init(wasmPath) {
        try {
            // Load WASM module
            await wasmLoader.load(wasmPath);
            this.wasm = wasmLoader.getModule();

            // Initialize function wrappers
            this.setupFunctions();

            // Initialize engine
            const result = this.functions.init();
            this.initialized = result === 1;

            return this.initialized;
        } catch (error) {
            console.error('Failed to initialize AVG Engine:', error);
            return false;
        }
    }

    setupFunctions() {
        const w = this.wasm;

        // Engine lifecycle
        this.functions.init = w.cwrap('avg_init', 'number', []);
        this.functions.shutdown = w.cwrap('avg_shutdown', null, []);

        // Script loading
        this.functions.loadScript = w.cwrap('avg_load_script', 'number', ['string']);

        // Navigation
        this.functions.gotoNode = w.cwrap('avg_goto_node', 'number', ['string']);
        this.functions.selectChoice = w.cwrap('avg_select_choice', 'number', ['number']);
        this.functions.goBack = w.cwrap('avg_go_back', 'number', []);
        this.functions.canGoBack = w.cwrap('avg_can_go_back', 'number', []);

        // Current node access
        this.functions.getCurrentNodeId = w.cwrap('avg_get_current_node_id', 'string', []);
        this.functions.getNodeType = w.cwrap('avg_get_node_type', 'string', []);
        this.functions.getSpeaker = w.cwrap('avg_get_speaker', 'string', []);
        this.functions.getText = w.cwrap('avg_get_text', 'string', []);
        this.functions.getNextNodeId = w.cwrap('avg_get_next_node_id', 'string', []);
        this.functions.getChoiceCount = w.cwrap('avg_get_choice_count', 'number', []);
        this.functions.getChoiceText = w.cwrap('avg_get_choice_text', 'string', ['number']);
        this.functions.getChoiceNext = w.cwrap('avg_get_choice_next', 'string', ['number']);

        // Scene data
        this.functions.getBackground = w.cwrap('avg_get_background', 'string', []);
        this.functions.getCharacter = w.cwrap('avg_get_character', 'string', []);
        this.functions.getExpression = w.cwrap('avg_get_expression', 'string', []);
        this.functions.getBGM = w.cwrap('avg_get_bgm', 'string', []);
        this.functions.getSoundEffect = w.cwrap('avg_get_sound_effect', 'string', []);

        // Variables
        this.functions.setVariable = w.cwrap('avg_set_variable', null, ['string', 'number']);
        this.functions.getVariable = w.cwrap('avg_get_variable', 'number', ['string']);

        // Save/Load
        this.functions.saveState = w.cwrap('avg_save_state', 'string', []);
        this.functions.loadState = w.cwrap('avg_load_state', 'number', ['string']);

        // Reset
        this.functions.reset = w.cwrap('avg_reset', null, []);

        // Audio callbacks
        this.functions.setAudioPlayBGMCallback = w.cwrap('avg_set_audio_play_bgm_callback', null, ['number']);
        this.functions.setAudioPlaySECallback = w.cwrap('avg_set_audio_play_se_callback', null, ['number']);
        this.functions.setAudioStopBGMCallback = w.cwrap('avg_set_audio_stop_bgm_callback', null, ['number']);
        this.functions.triggerAudioFromNode = w.cwrap('avg_trigger_audio_from_node', null, []);
    }

    setupAudioCallbacks() {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }
        // Audio is now handled directly in JavaScript via triggerAudio()
        // No WASM callbacks needed - this avoids addFunction requirements
    }

    triggerAudio() {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        // Handle audio directly in JavaScript using node data
        const bgm = this.functions.getBGM();
        const soundEffect = this.functions.getSoundEffect();

        if (bgm) {
            const fullUrl = `assets/audio/bgm/${bgm}`;
            audioManager.playBGM(fullUrl, true);
        }

        if (soundEffect) {
            const fullUrl = `assets/audio/se/${soundEffect}`;
            audioManager.playSE(fullUrl);
        }
    }

    async loadScript(jsonData) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        const jsonString = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);
        return this.functions.loadScript(jsonString) === 1;
    }

    gotoNode(nodeId) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.gotoNode(nodeId) === 1;
    }

    selectChoice(choiceIndex) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.selectChoice(choiceIndex) === 1;
    }

    goBack() {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.goBack() === 1;
    }

    canGoBack() {
        if (!this.initialized) {
            return false;
        }

        return this.functions.canGoBack() === 1;
    }

    getCurrentNode() {
        if (!this.initialized) {
            return null;
        }

        const nodeId = this.functions.getCurrentNodeId();
        if (!nodeId) {
            return null;
        }

        const node = {
            id: nodeId,
            type: this.functions.getNodeType(),
            speaker: this.functions.getSpeaker(),
            text: this.functions.getText(),
            nextNodeId: this.functions.getNextNodeId(),
            background: this.functions.getBackground(),
            character: this.functions.getCharacter(),
            expression: this.functions.getExpression(),
            bgm: this.functions.getBGM(),
            soundEffect: this.functions.getSoundEffect(),
            choices: []
        };

        // Get choices
        const choiceCount = this.functions.getChoiceCount();
        if (typeof choiceCount === 'number' && choiceCount > 0) {
            for (let i = 0; i < choiceCount; i++) {
                const text = this.functions.getChoiceText(i);
                const nextNodeId = this.functions.getChoiceNext(i);
                node.choices.push({
                    text: text || '',
                    nextNodeId: nextNodeId || ''
                });
            }
        }

        return node;
    }

    setVariable(name, value) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        this.functions.setVariable(name, value);
    }

    getVariable(name) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.getVariable(name);
    }

    saveState() {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.saveState();
    }

    loadState(saveData) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        return this.functions.loadState(saveData) === 1;
    }

    reset() {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        this.functions.reset();
    }

    shutdown() {
        if (this.initialized) {
            this.functions.shutdown();
            this.initialized = false;
        }
    }
}

// Global engine instance
const avgEngine = new AVGEngine();
