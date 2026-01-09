// Audio manager for BGM and sound effects
class AudioManager {
    constructor() {
        this.bgm = null;
        this.bgmVolume = 0.5;
        this.seVolume = 0.7;
        this.currentBGM = '';
        this.isMuted = false;
    }

    async playBGM(url, loop = true) {
        if (this.currentBGM === url && this.bgm && !this.bgm.paused) {
            return;
        }

        this.stopBGM();

        try {
            this.bgm = await assetLoader.loadAudio(url);
            this.bgm.loop = loop;
            this.bgm.volume = this.isMuted ? 0 : this.bgmVolume;
            this.currentBGM = url;

            await this.bgm.play();
        } catch (error) {
            console.error('Failed to play BGM:', error);
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.currentBGM = '';
        }
    }

    pauseBGM() {
        if (this.bgm) {
            this.bgm.pause();
        }
    }

    resumeBGM() {
        if (this.bgm) {
            this.bgm.play().catch(error => {
                console.error('Failed to resume BGM:', error);
            });
        }
    }

    async playSE(url) {
        try {
            const audio = await assetLoader.loadAudio(url);
            const se = audio.cloneNode();
            se.volume = this.isMuted ? 0 : this.seVolume;
            await se.play();
        } catch (error) {
            console.error('Failed to play SE:', error);
        }
    }

    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.isMuted ? 0 : this.bgmVolume;
        }
    }

    setSEVolume(volume) {
        this.seVolume = Math.max(0, Math.min(1, volume));
    }

    mute() {
        this.isMuted = true;
        if (this.bgm) {
            this.bgm.volume = 0;
        }
    }

    unmute() {
        this.isMuted = false;
        if (this.bgm) {
            this.bgm.volume = this.bgmVolume;
        }
    }

    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}

// Global audio manager instance
const audioManager = new AudioManager();
