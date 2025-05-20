// main.js - Common utilities and player mode selection

document.addEventListener('DOMContentLoaded', function() {
    // Player mode selection
    const singlePlayerBtn = document.getElementById('single-player');
    const twoPlayerBtn = document.getElementById('two-player');
    
    if (singlePlayerBtn && twoPlayerBtn) {
        // Set default mode to single player
        localStorage.setItem('playerMode', 'single');
        
        singlePlayerBtn.addEventListener('click', function() {
            localStorage.setItem('playerMode', 'single');
            singlePlayerBtn.classList.add('active');
            twoPlayerBtn.classList.remove('active');
        });
        
        twoPlayerBtn.addEventListener('click', function() {
            localStorage.setItem('playerMode', 'two');
            twoPlayerBtn.classList.add('active');
            singlePlayerBtn.classList.remove('active');
        });
        
        // Load saved player mode if exists
        const savedMode = localStorage.getItem('playerMode');
        if (savedMode === 'two') {
            twoPlayerBtn.click();
        } else {
            singlePlayerBtn.click();
        }
    }
});
