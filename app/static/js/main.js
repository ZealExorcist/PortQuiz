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
    
    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Check for saved dark mode preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        
        // Apply dark mode if saved preference exists
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Listen for toggle changes
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
});
