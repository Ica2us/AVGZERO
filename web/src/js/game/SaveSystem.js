// Save system
class SaveSystem {
    constructor() {
        this.saveSlots = 10;
        this.storageKey = 'avg_save_';
        this.currentVersion = '1.0.0';
    }

    save(slotIndex, gameState) {
        if (slotIndex < 0 || slotIndex >= this.saveSlots) {
            console.error('Invalid save slot');
            return false;
        }

        try {
            const saveData = {
                timestamp: new Date().toISOString(),
                state: gameState,
                version: this.currentVersion
            };

            const jsonString = JSON.stringify(saveData);

            // Check if we have enough storage space
            try {
                localStorage.setItem(this.storageKey + slotIndex, jsonString);
            } catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                    console.error('Storage quota exceeded. Cannot save game.');
                    return false;
                }
                throw e;
            }

            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    load(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.saveSlots) {
            console.error('Invalid save slot');
            return null;
        }

        try {
            const data = localStorage.getItem(this.storageKey + slotIndex);
            if (!data) {
                return null;
            }

            const saveData = JSON.parse(data);

            // Validate save data structure
            if (!saveData || typeof saveData !== 'object') {
                console.error('Invalid save data format');
                return null;
            }

            if (!saveData.state || !saveData.version) {
                console.error('Save data missing required fields');
                return null;
            }

            // Check version compatibility
            if (!this.isVersionCompatible(saveData.version)) {
                console.warn(`Save file version ${saveData.version} may not be compatible with current version ${this.currentVersion}`);
            }

            return saveData;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    isVersionCompatible(savedVersion) {
        // Simple major version check - can be made more sophisticated if needed
        const currentMajor = parseInt(this.currentVersion.split('.')[0], 10);
        const savedMajor = parseInt(savedVersion.split('.')[0], 10);
        return currentMajor === savedMajor;
    }

    deleteSave(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.saveSlots) {
            console.error('Invalid save slot');
            return false;
        }

        try {
            localStorage.removeItem(this.storageKey + slotIndex);
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    getSaveInfo(slotIndex) {
        const saveData = this.load(slotIndex);
        if (!saveData) {
            return null;
        }

        return {
            timestamp: saveData.timestamp,
            version: saveData.version
        };
    }

    getAllSaves() {
        const saves = [];
        for (let i = 0; i < this.saveSlots; i++) {
            const info = this.getSaveInfo(i);
            saves.push({
                slot: i,
                info: info,
                isEmpty: !info
            });
        }
        return saves;
    }

    quickSave() {
        const state = avgEngine.saveState();
        return this.save(0, state);
    }

    quickLoad() {
        const saveData = this.load(0);
        if (!saveData) {
            return false;
        }

        return avgEngine.loadState(saveData.state);
    }
}

const saveSystem = new SaveSystem();
