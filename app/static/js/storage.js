// storage.js - Local storage and score management utilities

// Player mode constants
const SINGLE_PLAYER = 'single';
const TWO_PLAYER = 'two';

// Get the current player mode from localStorage
function getPlayerMode() {
    return localStorage.getItem('playerMode') || SINGLE_PLAYER;
}

// Get current player (for two-player mode)
function getCurrentPlayer() {
    return localStorage.getItem('currentPlayer') || '1';
}

// Set current player (for two-player mode)
function setCurrentPlayer(player) {
    localStorage.setItem('currentPlayer', player);
}

// Switch player (for two-player mode)
function switchPlayer() {
    const currentPlayer = getCurrentPlayer();
    const newPlayer = currentPlayer === '1' ? '2' : '1';
    setCurrentPlayer(newPlayer);
    return newPlayer;
}

// Initialize scores for the current quiz mode
function initializeScores(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === SINGLE_PLAYER) {
        if (!localStorage.getItem(`${quizMode}_score`)) {
            localStorage.setItem(`${quizMode}_score`, '0');
        }
        if (!localStorage.getItem(`${quizMode}_total`)) {
            localStorage.setItem(`${quizMode}_total`, '0');
        }
    } else {
        // Two-player mode
        if (!localStorage.getItem(`${quizMode}_score_p1`)) {
            localStorage.setItem(`${quizMode}_score_p1`, '0');
        }
        if (!localStorage.getItem(`${quizMode}_score_p2`)) {
            localStorage.setItem(`${quizMode}_score_p2`, '0');
        }
        if (!localStorage.getItem(`${quizMode}_total_p1`)) {
            localStorage.setItem(`${quizMode}_total_p1`, '0');
        }
        if (!localStorage.getItem(`${quizMode}_total_p2`)) {
            localStorage.setItem(`${quizMode}_total_p2`, '0');
        }
        // Set player 1 as the default current player
        setCurrentPlayer('1');
    }
}

// Get score for the current player and quiz mode
function getScore(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === SINGLE_PLAYER) {
        return parseInt(localStorage.getItem(`${quizMode}_score`) || '0');
    } else {
        // Two-player mode
        const currentPlayer = getCurrentPlayer();
        return parseInt(localStorage.getItem(`${quizMode}_score_p${currentPlayer}`) || '0');
    }
}

// Get total questions attempted for the current player and quiz mode
function getTotal(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === SINGLE_PLAYER) {
        return parseInt(localStorage.getItem(`${quizMode}_total`) || '0');
    } else {
        // Two-player mode
        const currentPlayer = getCurrentPlayer();
        return parseInt(localStorage.getItem(`${quizMode}_total_p${currentPlayer}`) || '0');
    }
}

// Update score for the current player and quiz mode
function updateScore(quizMode, isCorrect) {
    const playerMode = getPlayerMode();
    const currentPlayer = getCurrentPlayer();
    
    if (playerMode === SINGLE_PLAYER) {
        // Update total questions
        const total = parseInt(localStorage.getItem(`${quizMode}_total`) || '0');
        localStorage.setItem(`${quizMode}_total`, (total + 1).toString());
        
        // Update correct answers if applicable
        if (isCorrect) {
            const score = parseInt(localStorage.getItem(`${quizMode}_score`) || '0');
            localStorage.setItem(`${quizMode}_score`, (score + 1).toString());
        }
    } else {
        // Two-player mode
        // Update total questions for current player
        const total = parseInt(localStorage.getItem(`${quizMode}_total_p${currentPlayer}`) || '0');
        localStorage.setItem(`${quizMode}_total_p${currentPlayer}`, (total + 1).toString());
        
        // Update correct answers if applicable
        if (isCorrect) {
            const score = parseInt(localStorage.getItem(`${quizMode}_score_p${currentPlayer}`) || '0');
            localStorage.setItem(`${quizMode}_score_p${currentPlayer}`, (score + 1).toString());
        }
        
        // Switch player after answering
        switchPlayer();
    }
}

// Reset scores for a specific quiz mode
function resetScores(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === SINGLE_PLAYER) {
        localStorage.setItem(`${quizMode}_score`, '0');
        localStorage.setItem(`${quizMode}_total`, '0');
    } else {
        // Two-player mode
        localStorage.setItem(`${quizMode}_score_p1`, '0');
        localStorage.setItem(`${quizMode}_score_p2`, '0');
        localStorage.setItem(`${quizMode}_total_p1`, '0');
        localStorage.setItem(`${quizMode}_total_p2`, '0');
        // Reset to player 1
        setCurrentPlayer('1');
    }
}
