// mcq.js - Multiple Choice Quiz Mode

let questions = [];
let currentQuestion = null;
let questionIndex = 0;
let quizVariation = 'port-to-protocol'; // Default: given port, identify protocol
let selectedOption = null;
const QUIZ_MODE = 'mcq';
const NUM_OPTIONS = 4; // Number of choices for each question

// DOM elements
let questionDisplay, optionsContainer, submitButton, feedbackDisplay, 
    nextButton, scoreDisplay, hintButton, hintText, 
    variationButtons, currentScoreElement, totalQuestionsElement;

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    questionDisplay = document.getElementById('question-display');
    optionsContainer = document.getElementById('options-container');
    submitButton = document.getElementById('submit-answer');
    feedbackDisplay = document.getElementById('feedback-display');
    nextButton = document.getElementById('next-question');
    hintButton = document.getElementById('show-hint');
    hintText = document.getElementById('hint-text');
    currentScoreElement = document.getElementById('current-score');
    totalQuestionsElement = document.getElementById('total-questions');
    
    // Get variation buttons
    const portToProtocolBtn = document.getElementById('port-to-protocol');
    const protocolToPortBtn = document.getElementById('protocol-to-port');
    
    // Add event listeners for variation buttons
    portToProtocolBtn.addEventListener('click', function() {
        setQuizVariation('port-to-protocol');
        portToProtocolBtn.classList.add('active');
        protocolToPortBtn.classList.remove('active');
        resetQuiz();
    });
    
    protocolToPortBtn.addEventListener('click', function() {
        setQuizVariation('protocol-to-port');
        protocolToPortBtn.classList.add('active');
        portToProtocolBtn.classList.remove('active');
        resetQuiz();
    });
    
    // Add event listener for Submit button
    submitButton.addEventListener('click', checkAnswer);
    
    // Add event listener for Next button
    nextButton.addEventListener('click', nextQuestion);
    
    // Add event listener for Hint button
    hintButton.addEventListener('click', showHint);
    
    // Initialize scores in localStorage
    initializeScores(QUIZ_MODE);
    
    // Update score display
    updateScoreDisplay();
    
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
            startQuiz();
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
                startQuiz();
            } else {
                console.error('Error loading questions');
                questionDisplay.textContent = 'Error loading questions. Please try again later.';
            }
        }
    };
    xhr.send();
}

// Start the quiz
function startQuiz() {
    // Shuffle questions for randomness
    shuffleArray(questions);
    questionIndex = 0;
    nextQuestion();
}

// Load the next question
function nextQuestion() {
    // Reset state for the new question
    feedbackDisplay.textContent = '';
    hintText.classList.add('hidden');
    nextButton.classList.add('hidden');
    submitButton.disabled = false;
    selectedOption = null;
    
    // Check if we've gone through all questions
    if (questionIndex >= questions.length) {
        questionIndex = 0; // Loop back to start
        shuffleArray(questions); // Reshuffle for variety
    }
    
    // Get the current question
    currentQuestion = questions[questionIndex];
    
    // Display the question based on the current variation
    if (quizVariation === 'port-to-protocol') {
        questionDisplay.textContent = `What protocol uses port ${currentQuestion.port}?`;
    } else {
        questionDisplay.textContent = `What port does ${currentQuestion.protocol} use?`;
    }
    
    // Update current player display for two-player mode
    if (getPlayerMode() === 'two') {
        const currentPlayer = getCurrentPlayer();
        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        playerInfo.textContent = `Player ${currentPlayer}'s turn`;
        
        // Insert player info at the top of the question
        questionDisplay.insertAdjacentElement('afterbegin', playerInfo);
    }
    
    // Generate options
    generateOptions();
    
    questionIndex++;
}

// Generate multiple choice options
function generateOptions() {
    // Clear any previous options
    optionsContainer.innerHTML = '';
    
    // Correct answer
    let correctAnswer;
    if (quizVariation === 'port-to-protocol') {
        correctAnswer = currentQuestion.protocol;
    } else {
        correctAnswer = currentQuestion.port;
    }
    
    // Create an array with the correct answer and random distractors
    let options = [correctAnswer];
    
    // Add random distractors from other questions
    while (options.length < NUM_OPTIONS) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        
        let distractorOption;
        if (quizVariation === 'port-to-protocol') {
            distractorOption = randomQuestion.protocol;
        } else {
            distractorOption = randomQuestion.port;
        }
        
        // Only add if not already in options
        if (!options.includes(distractorOption) && distractorOption !== correctAnswer) {
            options.push(distractorOption);
        }
    }
    
    // Shuffle options
    shuffleArray(options);
    
    // Create option elements
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.value = option;
        
        // Add click event to select this option
        optionElement.addEventListener('click', function() {
            // Deselect all options
            const allOptions = document.querySelectorAll('.option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select this option
            this.classList.add('selected');
            selectedOption = this.dataset.value;
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

// Check the user's answer
function checkAnswer() {
    if (!currentQuestion || !selectedOption) return;
    
    let correctAnswer;
    
    if (quizVariation === 'port-to-protocol') {
        correctAnswer = currentQuestion.protocol;
    } else {
        correctAnswer = currentQuestion.port;
    }
    
    const isCorrect = selectedOption === correctAnswer;
    
    // Mark options as correct/incorrect
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        if (option.dataset.value === correctAnswer) {
            option.classList.add('correct');
        } else if (option.dataset.value === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Display feedback
    if (isCorrect) {
        feedbackDisplay.textContent = 'Correct!';
        feedbackDisplay.className = 'correct';
    } else {
        feedbackDisplay.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        feedbackDisplay.className = 'incorrect';
    }
    
    // Disable submit button
    submitButton.disabled = true;
    
    // Show next button
    nextButton.classList.remove('hidden');
    
    // Update score
    updateScore(QUIZ_MODE, isCorrect);
    updateScoreDisplay();
}

// Show hint for the current question
function showHint() {
    if (!currentQuestion) return;
    
    hintText.textContent = currentQuestion.hint;
    hintText.classList.remove('hidden');
}

// Update the score display
function updateScoreDisplay() {
    const playerMode = getPlayerMode();
    
    if (playerMode === 'single') {
        currentScoreElement.textContent = getScore(QUIZ_MODE);
        totalQuestionsElement.textContent = getTotal(QUIZ_MODE);
    } else {
        // Two-player mode
        const scoreP1 = localStorage.getItem(`${QUIZ_MODE}_score_p1`) || '0';
        const scoreP2 = localStorage.getItem(`${QUIZ_MODE}_score_p2`) || '0';
        const totalP1 = localStorage.getItem(`${QUIZ_MODE}_total_p1`) || '0';
        const totalP2 = localStorage.getItem(`${QUIZ_MODE}_total_p2`) || '0';
        
        currentScoreElement.textContent = `P1: ${scoreP1}/${totalP1} - P2: ${scoreP2}/${totalP2}`;
        totalQuestionsElement.textContent = '';
    }
}

// Reset the quiz (when changing variations)
function resetQuiz() {
    questionIndex = 0;
    startQuiz();
}

// Set the quiz variation
function setQuizVariation(variation) {
    quizVariation = variation;
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Import utilities from storage.js
function initializeScores(quizMode) {
    // Initialize scores from storage
    const playerMode = localStorage.getItem('playerMode') || 'single';
    
    if (playerMode === 'single') {
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
        localStorage.setItem('currentPlayer', '1');
    }
}

function getPlayerMode() {
    return localStorage.getItem('playerMode') || 'single';
}

function getCurrentPlayer() {
    return localStorage.getItem('currentPlayer') || '1';
}

function getScore(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === 'single') {
        return parseInt(localStorage.getItem(`${quizMode}_score`) || '0');
    } else {
        // Two-player mode
        const currentPlayer = getCurrentPlayer();
        return parseInt(localStorage.getItem(`${quizMode}_score_p${currentPlayer}`) || '0');
    }
}

function getTotal(quizMode) {
    const playerMode = getPlayerMode();
    
    if (playerMode === 'single') {
        return parseInt(localStorage.getItem(`${quizMode}_total`) || '0');
    } else {
        // Two-player mode
        const currentPlayer = getCurrentPlayer();
        return parseInt(localStorage.getItem(`${quizMode}_total_p${currentPlayer}`) || '0');
    }
}

function updateScore(quizMode, isCorrect) {
    const playerMode = getPlayerMode();
    const currentPlayer = getCurrentPlayer();
    
    if (playerMode === 'single') {
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

function switchPlayer() {
    const currentPlayer = getCurrentPlayer();
    const newPlayer = currentPlayer === '1' ? '2' : '1';
    localStorage.setItem('currentPlayer', newPlayer);
    return newPlayer;
}
