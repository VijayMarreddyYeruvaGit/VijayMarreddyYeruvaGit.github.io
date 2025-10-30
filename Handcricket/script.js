// ===================== Game State Variables =====================
let gameState = {
    playerName: '',
    totalOvers: 0,
    totalWickets: 0,
    currentOver: 0,
    currentBall: 0,
    userScore: 0,
    computerScore: 0,
    userWickets: 0,
    computerWickets: 0,
    isUserBatting: true,
    isFirstInnings: true,
    userRuns: [],
    computerRuns: [],
    targetScore: 0,
    waitingForUserInput: false
};

// ===================== DOM Elements =====================
const startSection = document.getElementById('startSection');
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const gameOverSection = document.getElementById('gameOverSection');

const playerNameInput = document.getElementById('playerName');
const playerDisplay = document.getElementById('playerDisplay');
const startBtn = document.getElementById('startBtn');
const confirmSetupBtn = document.getElementById('confirmSetupBtn');
const restartBtn = document.getElementById('restartBtn');

const oversOptions = document.getElementById('oversOptions');
const wicketsOptions = document.getElementById('wicketsOptions');

const batsmenInfo = document.getElementById('batsmenInfo');
const overScores = document.getElementById('overScores');
const ballResult = document.getElementById('ballResult');
const inningsInfo = document.getElementById('inningsInfo');
const defendBtn = document.getElementById('defendBtn');
const finalScore = document.getElementById('finalScore');

const runButtons = document.querySelectorAll('.runBtn');

// ===================== Game Initialization =====================
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    createOptionButtons();
});

function initializeGame() {
    // Reset game state
    gameState = {
        playerName: '',
        totalOvers: 0,
        totalWickets: 0,
        currentOver: 0,
        currentBall: 0,
        userScore: 0,
        computerScore: 0,
        userWickets: 0,
        computerWickets: 0,
        isUserBatting: true,
        isFirstInnings: true,
        userRuns: [],
        computerRuns: [],
        targetScore: 0,
        waitingForUserInput: false
    };

    // Reset UI
    playerNameInput.value = '';
    ballResult.textContent = '';
    inningsInfo.textContent = '';
    batsmenInfo.innerHTML = '';
    overScores.innerHTML = '';
    defendBtn.style.display = 'none';

    // Reset run buttons text
    runButtons.forEach(button => {
        button.textContent = button.textContent.replace('Bowl ', '');
    });

    // Show start section
    showSection(startSection);
}

function createOptionButtons() {
    // Create overs buttons (1-10)
    oversOptions.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => selectOption('overs', i, button));
        oversOptions.appendChild(button);
    }

    // Create wickets buttons (1-10)
    wicketsOptions.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => selectOption('wickets', i, button));
        wicketsOptions.appendChild(button);
    }
}

// ===================== Section Management =====================
function showSection(section) {
    // Hide all sections
    startSection.style.display = 'none';
    setupSection.style.display = 'none';
    gameSection.style.display = 'none';
    gameOverSection.style.display = 'none';

    // Show target section with animation
    section.style.display = 'block';
    section.style.animation = 'fadeInUp 0.8s ease';
}

// ===================== Event Listeners =====================
startBtn.addEventListener('click', function() {
    const name = playerNameInput.value.trim();
    if (name) {
        gameState.playerName = name;
        playerDisplay.textContent = name;
        showSection(setupSection);
        
        // Add celebration animation
        this.classList.add('celebrate');
        setTimeout(() => this.classList.remove('celebrate'), 800);
    } else {
        // Shake animation for empty input
        playerNameInput.style.animation = 'shake 0.5s ease';
        setTimeout(() => playerNameInput.style.animation = '', 500);
    }
});

confirmSetupBtn.addEventListener('click', function() {
    if (gameState.totalOvers > 0 && gameState.totalWickets > 0) {
        startGame();
        
        // Add celebration animation
        this.classList.add('celebrate');
        setTimeout(() => this.classList.remove('celebrate'), 800);
    } else {
        // Pulse animation to indicate selection needed
        const sections = document.querySelectorAll('.options > div');
        sections.forEach(section => {
            section.style.animation = 'pulse 0.5s ease';
            setTimeout(() => section.style.animation = '', 500);
        });
    }
});

restartBtn.addEventListener('click', function() {
    initializeGame();
    
    // Add celebration animation
    this.classList.add('celebrate');
    setTimeout(() => this.classList.remove('celebrate'), 800);
});

defendBtn.addEventListener('click', function() {
    console.log("Defend button clicked!"); // Debug log
    if (gameState.isFirstInnings && gameState.isUserBatting) {
        console.log("Switching to second innings..."); // Debug log
        switchToSecondInnings();
        
        // Add celebration animation
        this.classList.add('celebrate');
        setTimeout(() => this.classList.remove('celebrate'), 800);
    } else {
        console.log("Defend button conditions not met:", { 
            isFirstInnings: gameState.isFirstInnings, 
            isUserBatting: gameState.isUserBatting 
        }); // Debug log
    }
});

// Run buttons event listeners
runButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Check if defend button is visible - if so, don't play ball
        if (defendBtn.style.display === 'block') {
            ballResult.textContent = "Innings complete! Click 'Defend Score' to continue.";
            ballResult.style.color = '#f59e0b';
            return;
        }
        
        const run = parseInt(this.textContent.replace('Bowl ', ''));
        playBall(run);
        
        // Add ball animation
        this.classList.add('ball-animation');
        setTimeout(() => this.classList.remove('ball-animation'), 600);
    });
});

// ===================== Game Logic =====================
function selectOption(type, value, button) {
    // Remove selected class from all buttons in the group
    const parent = button.parentElement;
    const buttons = parent.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Add selected class to clicked button
    button.classList.add('selected');

    // Update game state
    if (type === 'overs') {
        gameState.totalOvers = value;
    } else if (type === 'wickets') {
        gameState.totalWickets = value;
    }
}

function startGame() {
    showSection(gameSection);
    updateGameDisplay();
    inningsInfo.textContent = `${gameState.playerName} is batting first! Click a number to bat!`;
    inningsInfo.style.color = '#10b981';
}

function playBall(userRun) {
    // Check if innings is complete (defend button is visible)
    if (defendBtn.style.display === 'block') {
        ballResult.textContent = "Innings complete! Click 'Defend Score' to continue.";
        ballResult.style.color = '#f59e0b';
        return;
    }

    if (gameState.userWickets >= gameState.totalWickets || 
        gameState.currentOver >= gameState.totalOvers ||
        gameState.waitingForUserInput) {
        return;
    }

    // Computer bowls (random run between 1-6) when user is batting
    // OR Computer bats (random run between 1-6) when user is bowling
    const computerRun = Math.floor(Math.random() * 6) + 1;

    let result = '';
    let isWicket = false;

    // Check if out
    if (userRun === computerRun) {
        if (gameState.isUserBatting) {
            result = `OUT! You chose ${userRun}, computer bowled ${computerRun}`;
        } else {
            result = `OUT! You bowled ${userRun}, computer chose ${computerRun}`;
        }
        isWicket = true;
        ballResult.style.color = '#ef4444';
    } else {
        if (gameState.isUserBatting) {
            // User is batting - they score runs
            result = `You scored ${userRun} runs (Computer bowled ${computerRun})`;
            ballResult.style.color = '#10b981';
        } else {
            // User is bowling - computer scores runs
            result = `Computer scored ${computerRun} runs (You bowled ${userRun})`;
            ballResult.style.color = '#f59e0b';
        }
    }

    // Update scores
    if (gameState.isUserBatting) {
        if (!isWicket) {
            gameState.userScore += userRun;
            gameState.userRuns.push(userRun);
        } else {
            gameState.userWickets++;
        }
    } else {
        if (!isWicket) {
            gameState.computerScore += computerRun;
            gameState.computerRuns.push(computerRun);
        } else {
            gameState.computerWickets++;
        }
    }

    // Update ball and over
    gameState.currentBall++;
    if (gameState.currentBall === 6) {
        gameState.currentOver++;
        gameState.currentBall = 0;
    }

    // Display result with animation
    ballResult.textContent = result;
    ballResult.style.animation = 'pop 0.5s ease';

    // Update display
    updateGameDisplay();

    // Check game conditions
    checkGameConditions();
}

function checkGameConditions() {
    // First innings conditions
    if (gameState.isFirstInnings) {
        let isInningsComplete = false;
        let inningsMessage = '';

        // Check if all wickets are lost
        if (gameState.userWickets >= gameState.totalWickets) {
            isInningsComplete = true;
            inningsMessage = `All out! ${gameState.playerName} scored ${gameState.userScore}`;
        }

        // Check if all overs are completed
        if (gameState.currentOver >= gameState.totalOvers && gameState.currentBall === 0) {
            isInningsComplete = true;
            inningsMessage = `Innings over! ${gameState.playerName} scored ${gameState.userScore}`;
        }

        if (isInningsComplete) {
            // Show defend button when innings is actually complete
            defendBtn.style.display = 'block';
            defendBtn.style.animation = 'fadeInUp 0.5s ease';
            
            // Update ball result and innings info
            ballResult.textContent = inningsMessage;
            ballResult.style.color = '#f59e0b';
            inningsInfo.textContent = `${inningsMessage} - Click "Defend Score" to continue!`;
            inningsInfo.style.color = '#f59e0b';
            
            return;
        }
    }
    // Second innings conditions
    else {
        // Check if computer wins
        if (gameState.computerScore > gameState.targetScore) {
            endGame(`Computer wins by ${gameState.totalWickets - gameState.computerWickets} wickets!`);
            return;
        }

        // Check if computer is all out
        if (gameState.computerWickets >= gameState.totalWickets) {
            endGame(`${gameState.playerName} wins by ${gameState.targetScore - gameState.computerScore} runs!`);
            return;
        }

        // Check if overs completed
        if (gameState.currentOver >= gameState.totalOvers && gameState.currentBall === 0) {
            if (gameState.computerScore === gameState.targetScore) {
                endGame("It's a tie!");
            } else if (gameState.computerScore < gameState.targetScore) {
                endGame(`${gameState.playerName} wins by ${gameState.targetScore - gameState.computerScore} runs!`);
            }
            return;
        }
    }
}

function switchToSecondInnings() {
    console.log("switchToSecondInnings called"); // Debug log
    gameState.isFirstInnings = false;
    gameState.isUserBatting = false; // User is now bowling/defending
    gameState.targetScore = gameState.userScore + 1;
    gameState.currentOver = 0;
    gameState.currentBall = 0;

    defendBtn.style.display = 'none';
    
    // Clear previous runs for computer's innings
    gameState.computerRuns = [];
    
    // Update display immediately
    updateGameDisplay();

    inningsInfo.textContent = `${gameState.playerName} is bowling - Click a number to bowl!`;
    inningsInfo.style.color = '#f59e0b';
    ballResult.textContent = `Target: ${gameState.targetScore} runs. Click a number to bowl!`;
    ballResult.style.color = '#f59e0b';
}

function endGame(message) {
    let resultMessage = '';
    
    if (message.includes('wins')) {
        if (message.includes('Computer wins')) {
            resultMessage = `😞 ${message}`;
            finalScore.style.background = 'var(--gradient-danger)';
        } else {
            resultMessage = `🎉 ${message} 🎉`;
            finalScore.style.background = 'var(--gradient-success)';
        }
    } else if (message.includes('tie')) {
        resultMessage = `🤝 ${message} 🤝`;
        finalScore.style.background = 'var(--gradient)';
    } else {
        resultMessage = message;
        finalScore.style.background = 'var(--gradient)';
    }

    finalScore.textContent = resultMessage;
    
    setTimeout(() => {
        showSection(gameOverSection);
        finalScore.classList.add('celebrate');
    }, 2000);
}

// ===================== UI Updates =====================
function updateGameDisplay() {
    updateBatsmenInfo();
   
    updateInningsInfo();
    updateRunButtonsContext();
}

function updateBatsmenInfo() {
    let info = '';
    
    if (gameState.isUserBatting) {
        info = `
            <div><strong>Batsman:</strong> ${gameState.playerName}</div>
            <div><strong>Score:</strong> ${gameState.userScore}/${gameState.userWickets}</div>
            <div><strong>Overs:</strong> ${gameState.currentOver}.${gameState.currentBall}</div>
            <div><strong>Wickets Left:</strong> ${gameState.totalWickets - gameState.userWickets}</div>
        `;
    } else {
        info = `
            <div><strong>Batsman:</strong> Computer</div>
            <div><strong>Score:</strong> ${gameState.computerScore}/${gameState.computerWickets}</div>
            <div><strong>Overs:</strong> ${gameState.currentOver}.${gameState.currentBall}</div>
            <div><strong>Wickets Left:</strong> ${gameState.totalWickets - gameState.computerWickets}</div>
            ${gameState.targetScore ? `<div><strong>Target:</strong> ${gameState.targetScore}</div>` : ''}
        `;
    }
    
    batsmenInfo.innerHTML = info;
}

function updateOverScores() {
    let scores = '<h3>Over Progress</h3>';
    
    if (gameState.isUserBatting && gameState.userRuns.length > 0) {
        gameState.userRuns.forEach((run, index) => {
            scores += `<div>Ball ${index + 1}: ${run} run${run !== 1 ? 's' : ''}</div>`;
        });
    } else if (!gameState.isUserBatting && gameState.computerRuns.length > 0) {
        gameState.computerRuns.forEach((run, index) => {
            scores += `<div>Ball ${index + 1}: ${run} run${run !== 1 ? 's' : ''}</div>`;
        });
    } else {
        scores += '<div>No balls played yet</div>';
    }
    
    overScores.innerHTML = scores;
}

function updateInningsInfo() {
    if (gameState.isFirstInnings) {
        if (gameState.isUserBatting) {
            if (defendBtn.style.display === 'block') {
                inningsInfo.textContent = `Innings complete! ${gameState.playerName} scored ${gameState.userScore}. Click "Defend Score" to continue!`;
                inningsInfo.style.color = '#f59e0b';
            } else {
                inningsInfo.textContent = `${gameState.playerName} is batting - Click a number to bat! Score: ${gameState.userScore}/${gameState.userWickets}`;
                inningsInfo.style.color = '#10b981';
            }
        } else {
            inningsInfo.textContent = `Computer is batting - Score: ${gameState.computerScore}/${gameState.computerWickets}`;
            inningsInfo.style.color = '#f59e0b';
        }
    } else {
        // Second innings - computer is always batting, user is always bowling
        const runsNeeded = gameState.targetScore - gameState.computerScore;
        const ballsRemaining = (gameState.totalOvers * 6) - (gameState.currentOver * 6 + gameState.currentBall);
        
        if (ballsRemaining > 0 && runsNeeded > 0) {
            inningsInfo.textContent = `${gameState.playerName} is bowling - Computer needs ${runsNeeded} runs from ${ballsRemaining} balls - Click a number to bowl!`;
        } else if (runsNeeded <= 0) {
            inningsInfo.textContent = `Computer has won!`;
        } else {
            inningsInfo.textContent = `${gameState.playerName} has won!`;
        }
        inningsInfo.style.color = '#f59e0b';
    }
}

function updateRunButtonsContext() {
    const runButtons = document.querySelectorAll('.runBtn');
    
    if (!gameState.isUserBatting && !gameState.isFirstInnings) {
        // User is bowling - change button labels
        runButtons.forEach(button => {
            const originalText = button.textContent;
            if (!originalText.startsWith('Bowl ')) {
                button.textContent = `Bowl ${originalText}`;
            }
        });
    } else {
        // User is batting - reset button labels
        runButtons.forEach(button => {
            const text = button.textContent;
            if (text.startsWith('Bowl ')) {
                button.textContent = text.replace('Bowl ', '');
            }
        });
    }
}

// ===================== Utility Functions =====================
function getRandomRun() {
    return Math.floor(Math.random() * 6) + 1;
}

// Add shake animation for invalid inputs
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
