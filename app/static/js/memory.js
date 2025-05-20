// memory.js - Memory Match Game Mode

let questions = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let isProcessing = false;
const QUIZ_MODE = 'memory';

// DOM elements
let gameBoard, currentPlayerDisplay, player1ScoreDisplay, player2ScoreDisplay, restartButton;

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    gameBoard = document.getElementById('game-board');
    currentPlayerDisplay = document.getElementById('current-player');
    player1ScoreDisplay = document.getElementById('player1-score');
    player2ScoreDisplay = document.getElementById('player2-score');
    restartButton = document.getElementById('restart-game');
    
    // Add event listener for restart button
    restartButton.addEventListener('click', function() {
        resetGame();
    });
    
    // Add event listener for Reset Scores button
    const resetScoresBtn = document.getElementById('reset-scores');
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all scores for the Memory game?')) {
                resetMemoryScores();
                updateScoreDisplay();
                alert('Scores have been reset!');
            }
        });
    }
    
    // Update player mode display
    const playerModeIndicator = document.getElementById('player-mode-indicator');
    if (playerModeIndicator) {
        const playerMode = localStorage.getItem('playerMode') || 'single';
        playerModeIndicator.textContent = playerMode === 'single' ? 'Single Player Mode' : 'Two Player Mode';
    }
    
    // Initialize scores in localStorage
    initializeMemoryScores();
    
    // Update player display
    updatePlayerDisplay();
    
    // Load questions from JSON
    fetchQuestions();
});

// Fetch questions from JSON file
function fetchQuestions() {
    fetch('/api/questions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questions = data;
            setupGame();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            // Fallback to local questions
            loadQuestionData();
        });
}

// Function to load the question data directly
function loadQuestionData() {
    // This will be called if fetch fails
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/questions', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                questions = JSON.parse(xhr.responseText);
                setupGame();
            } else {
                console.error('Error loading questions');
                gameBoard.textContent = 'Error loading questions. Please try again later.';
            }
        }
    };
    xhr.send();
}

// Set up the memory match game
function setupGame() {
    // Shuffle questions for randomness
    shuffleArray(questions);
    
    // Create pairs of cards (port & protocol)
    createCards();
    
    // Render the game board
    renderGameBoard();
    
    // Update score display
    updateScoreDisplay();
}

// Create cards from questions
function createCards() {
    cards = [];
    
    // Determine how many pairs to use (8 pairs = 16 cards is a good size)
    // Adjust based on screen size or difficulty
    const numPairs = 8;
    totalPairs = numPairs;
    
    // Use only a subset of questions to create pairs
    for (let i = 0; i < numPairs && i < questions.length; i++) {
        const question = questions[i];
        
        // Create port card
        cards.push({
            id: i + '_port',
            value: question.port,
            type: 'port',
            matchId: i + '_protocol',
            isFlipped: false,
            isMatched: false
        });
        
        // Create protocol card
        cards.push({
            id: i + '_protocol',
            value: question.protocol,
            type: 'protocol',
            matchId: i + '_port',
            isFlipped: false,
            isMatched: false
        });
    }
    
    // Shuffle the cards
    shuffleArray(cards);
}

// Render the game board
function renderGameBoard() {
    // Clear the game board
    gameBoard.innerHTML = '';
    
    // Create card elements
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.id = card.id;
        
        // If card is matched or flipped, show its value
        if (card.isMatched || card.isFlipped) {
            cardElement.textContent = card.value;
            cardElement.classList.add(card.isFlipped ? 'flipped' : 'matched');
        } else {
            cardElement.textContent = '?';
        }
        
        // Add click event listener
        cardElement.addEventListener('click', function() {
            flipCard(card);
        });
        
        gameBoard.appendChild(cardElement);
    });
}

// Flip a card
function flipCard(card) {
    // Ignore if already processing a pair or card is already flipped/matched
    if (isProcessing || card.isFlipped || card.isMatched) {
        return;
    }
    
    // Flip the card
    card.isFlipped = true;
    flippedCards.push(card);
    
    // Update the UI
    renderGameBoard();
    
    // If two cards are flipped, check for a match
    if (flippedCards.length === 2) {
        isProcessing = true;
        
        // Check for match after a small delay
        setTimeout(checkForMatch, 1000);
    }
}

// Check if the two flipped cards match
function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    // Check if one is a port and one is a protocol and they match
    const isMatch = card1.matchId === card2.id;
    
    if (isMatch) {
        // Mark both cards as matched
        card1.isMatched = true;
        card2.isMatched = true;
        
        // Increment matched pairs
        matchedPairs++;
        
        // Update score for current player
        updateMemoryScore();
        
        // Check if game is complete
        if (matchedPairs === totalPairs) {
            setTimeout(showGameComplete, 500);
        }
    } else {
        // Flip cards back over
        card1.isFlipped = false;
        card2.isFlipped = false;
        
        // Switch player in two-player mode
        const playerMode = localStorage.getItem('playerMode') || 'single';
        if (playerMode === 'two') {
            switchMemoryPlayer();
        }
    }
    
    // Clear flipped cards and processing flag
    flippedCards = [];
    isProcessing = false;
    
    // Update game board and score display
    renderGameBoard();
    updateScoreDisplay();
    updatePlayerDisplay();
}

// Show game complete message
function showGameComplete() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        alert('Congratulations! You found all pairs!');
    } else {
        const score1 = parseInt(localStorage.getItem(`${QUIZ_MODE}_score_p1`) || '0');
        const score2 = parseInt(localStorage.getItem(`${QUIZ_MODE}_score_p2`) || '0');
        
        if (score1 > score2) {
            alert('Game over! Player 1 wins!');
        } else if (score2 > score1) {
            alert('Game over! Player 2 wins!');
        } else {
            alert('Game over! It\'s a tie!');
        }
    }
}

// Reset the game
function resetGame() {
    matchedPairs = 0;
    flippedCards = [];
    
    // Reset memory scores
    resetMemoryScores();
    
    // Set player 1 as the current player
    localStorage.setItem('currentPlayer', '1');
    
    // Shuffle questions and create new cards
    shuffleArray(questions);
    createCards();
    
    // Render the game board
    renderGameBoard();
    
    // Update displays
    updateScoreDisplay();
    updatePlayerDisplay();
}

// Initialize scores for memory game
function initializeMemoryScores() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        if (!localStorage.getItem(`${QUIZ_MODE}_score`)) {
            localStorage.setItem(`${QUIZ_MODE}_score`, '0');
        }
    } else {
        // Two-player mode
        if (!localStorage.getItem(`${QUIZ_MODE}_score_p1`)) {
            localStorage.setItem(`${QUIZ_MODE}_score_p1`, '0');
        }
        if (!localStorage.getItem(`${QUIZ_MODE}_score_p2`)) {
            localStorage.setItem(`${QUIZ_MODE}_score_p2`, '0');
        }
        // Show player 2 score in UI
        player2ScoreDisplay.classList.remove('hidden');
        // Set player 1 as the default current player
        localStorage.setItem('currentPlayer', '1');
    }
}

// Reset scores for memory game
function resetMemoryScores() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        localStorage.setItem(`${QUIZ_MODE}_score`, '0');
    } else {
        // Two-player mode
        localStorage.setItem(`${QUIZ_MODE}_score_p1`, '0');
        localStorage.setItem(`${QUIZ_MODE}_score_p2`, '0');
    }
}

// Update score for memory game
function updateMemoryScore() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        // Single player - increment score
        const score = parseInt(localStorage.getItem(`${QUIZ_MODE}_score`) || '0');
        localStorage.setItem(`${QUIZ_MODE}_score`, (score + 1).toString());
    } else {
        // Two-player mode - increment score for current player
        const currentPlayer = localStorage.getItem('currentPlayer') || '1';
        const scoreKey = `${QUIZ_MODE}_score_p${currentPlayer}`;
        const score = parseInt(localStorage.getItem(scoreKey) || '0');
        localStorage.setItem(scoreKey, (score + 1).toString());
    }
}

// Switch player for memory game
function switchMemoryPlayer() {
    const currentPlayer = localStorage.getItem('currentPlayer') || '1';
    const newPlayer = currentPlayer === '1' ? '2' : '1';
    localStorage.setItem('currentPlayer', newPlayer);
}

// Update the score display
function updateScoreDisplay() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        const score = localStorage.getItem(`${QUIZ_MODE}_score`) || '0';
        player1ScoreDisplay.textContent = `Score: ${score} pairs`;
        player2ScoreDisplay.classList.add('hidden');
    } else {
        // Two-player mode
        const scoreP1 = localStorage.getItem(`${QUIZ_MODE}_score_p1`) || '0';
        const scoreP2 = localStorage.getItem(`${QUIZ_MODE}_score_p2`) || '0';
        
        player1ScoreDisplay.textContent = `Player 1: ${scoreP1} pairs`;
        player2ScoreDisplay.textContent = `Player 2: ${scoreP2} pairs`;
        player2ScoreDisplay.classList.remove('hidden');
    }
}

// Update current player display
function updatePlayerDisplay() {
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
        currentPlayerDisplay.textContent = 'Single Player Mode';
    } else {
        // Two-player mode
        const currentPlayer = localStorage.getItem('currentPlayer') || '1';
        currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
