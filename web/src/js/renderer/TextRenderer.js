// Text renderer with typewriter effect
class TextRenderer {
    constructor() {
        this.textElement = document.getElementById('dialogue-text');
        this.speakerElement = document.getElementById('speaker-name');
        this.isTyping = false;
        this.typewriterSpeed = 50; // ms per character
        this.currentText = '';
        this.skipTyping = false;
    }

    async setText(text, speaker = '', useTypewriter = true) {
        // Set speaker
        if (this.speakerElement) {
            this.speakerElement.textContent = speaker || '';
        }

        // Set text
        if (!text) {
            this.clear();
            return;
        }

        this.currentText = text;

        if (useTypewriter && this.typewriterSpeed > 0) {
            await this.typewrite(text);
        } else {
            this.textElement.textContent = text;
        }
    }

    async typewrite(text) {
        this.isTyping = true;
        this.skipTyping = false;
        this.textElement.textContent = '';

        for (let i = 0; i < text.length; i++) {
            if (this.skipTyping) {
                this.textElement.textContent = text;
                break;
            }

            this.textElement.textContent += text[i];
            await this.sleep(this.typewriterSpeed);
        }

        this.isTyping = false;
    }

    skip() {
        if (this.isTyping) {
            this.skipTyping = true;
        }
    }

    setTypewriterSpeed(speed) {
        this.typewriterSpeed = speed;
    }

    clear() {
        this.textElement.textContent = '';
        this.speakerElement.textContent = '';
        this.currentText = '';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const textRenderer = new TextRenderer();
