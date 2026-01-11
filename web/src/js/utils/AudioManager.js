// Audio manager for BGM and sound effects
class AudioManager {
    constructor() {
        this.bgm = null;
        this.bgmVolume = 0.5;
        this.seVolume = 0.7;
        this.currentBGM = '';
        this.isMuted = false;
        this.audioUnlocked = false;
        this.pendingBGM = null;
        this.pendingSE = [];
    }

    // Unlock audio context (call this on user interaction)
    async unlockAudio() {
        if (this.audioUnlocked) {
            return;
        }

        try {
            // Create and resume AudioContext to unlock
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const buffer = ctx.createBuffer(1, 1, 22050);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(0);

                if (ctx.state === 'suspended') {
                    await ctx.resume();
                }

                // Also try to unlock HTML5 Audio
                const audio = new Audio();
                audio.src = 'data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
                audio.volume = 0;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {}); // Ignore errors
                }
            }

            this.audioUnlocked = true;
            console.log('Audio unlocked');

            // Play pending audio if any
            if (this.pendingBGM) {
                const { url, loop } = this.pendingBGM;
                this.pendingBGM = null;
                await this.playBGM(url, loop);
            }

            // Play pending sound effects
            for (const url of this.pendingSE) {
                await this.playSE(url);
            }
            this.pendingSE = [];
        } catch (error) {
            console.error('Failed to unlock audio:', error);
            // Mark as unlocked anyway to allow the game to proceed
            this.audioUnlocked = true;
        }
    }

    async playBGM(url, loop = true) {
        // If audio is not unlocked yet, queue it
        if (!this.audioUnlocked) {
            console.log('Audio not unlocked yet, queuing BGM:', url);
            this.pendingBGM = { url, loop };
            return;
        }

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
        // If audio is not unlocked yet, queue it
        if (!this.audioUnlocked) {
            console.log('Audio not unlocked yet, queuing SE:', url);
            this.pendingSE.push(url);
            return;
        }

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
