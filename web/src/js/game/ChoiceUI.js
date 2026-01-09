// Choice UI controller
class ChoiceUI {
    constructor() {
        this.choiceBox = document.getElementById('choice-box');
        this.choiceQuestion = document.getElementById('choice-question');
        this.choiceList = document.getElementById('choice-list');
        this.isVisible = false;
    }

    show() {
        if (this.choiceBox) {
            this.choiceBox.style.display = 'block';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.choiceBox) {
            this.choiceBox.style.display = 'none';
            this.isVisible = false;
        }
    }

    async displayChoices(node) {
        if (!node || !node.choices || node.choices.length === 0) {
            return -1;
        }

        this.show();

        // Set question text
        if (this.choiceQuestion) {
            this.choiceQuestion.textContent = node.text || 'Choose an option:';
        }

        // Clear previous choices
        this.choiceList.innerHTML = '';

        // Create choice buttons
        return new Promise(resolve => {
            node.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = choice.text;
                button.onclick = async () => {
                    await audioManager.playSE('assets/audio/se/click.mp3');
                    this.clear();
                    resolve(index);
                };
                this.choiceList.appendChild(button);
            });
        });
    }

    clear() {
        if (this.choiceList) {
            this.choiceList.innerHTML = '';
        }
        if (this.choiceQuestion) {
            this.choiceQuestion.textContent = '';
        }
        this.hide();
    }
}

const choiceUI = new ChoiceUI();
