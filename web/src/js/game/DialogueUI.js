// Dialogue UI controller
class DialogueUI {
    constructor() {
        this.dialogueBox = document.getElementById('dialogue-box');
        this.isVisible = false;
        this.clickHandler = null;
    }

    show() {
        if (this.dialogueBox) {
            this.dialogueBox.style.display = 'block';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.dialogueBox) {
            this.dialogueBox.style.display = 'none';
            this.isVisible = false;
        }
    }

    async displayDialogue(node) {
        if (!node) {
            return;
        }

        // Clean up any existing click handler before creating a new one
        this.removeClickHandler();

        this.show();
        await textRenderer.setText(node.text, node.speaker, true);

        // Wait for user input
        return new Promise(resolve => {
            this.clickHandler = () => {
                if (textRenderer.isTyping) {
                    textRenderer.skip();
                } else {
                    this.removeClickHandler();
                    resolve();
                }
            };

            this.addClickHandler();
        });
    }

    addClickHandler() {
        if (this.dialogueBox) {
            this.dialogueBox.addEventListener('click', this.clickHandler);
        }
    }

    removeClickHandler() {
        if (this.dialogueBox && this.clickHandler) {
            this.dialogueBox.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
    }

    clear() {
        textRenderer.clear();
        this.removeClickHandler();
        this.hide();
    }
}

const dialogueUI = new DialogueUI();
