// Main entry point
async function main() {
    console.log('AVG Game starting...');

    const loadingText = document.getElementById('loading-text');
    const progressFill = document.getElementById('progress-fill');

    try {
        // Update loading progress
        loadingText.textContent = 'Loading engine...';
        progressFill.style.width = '30%';

        // Initialize game
        await game.init();

        loadingText.textContent = 'Loading assets...';
        progressFill.style.width = '60%';

        // Preload some assets if needed
        // await assetLoader.loadImage('assets/images/backgrounds/...');

        loadingText.textContent = 'Starting game...';
        progressFill.style.width = '100%';

        // Small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 500));

        // Start the game
        await game.start();

    } catch (error) {
        console.error('Failed to start game:', error);
        loadingText.textContent = 'Error: ' + error.message;
        loadingText.style.color = '#ff6b6b';
    }
}

// Start the game when the page loads
window.addEventListener('load', main);
