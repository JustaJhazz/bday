// Helper to show a screen by id
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- Screen 1: Moving Button ---
const movingBtn = document.getElementById('moving-button');
if (movingBtn) {
    let clickCount = 0;
    const maxClicks = 6;
    
    function moveButton() {
        // Get the full viewport dimensions
        const maxX = window.innerWidth - movingBtn.offsetWidth - 40;
        const maxY = window.innerHeight - movingBtn.offsetHeight - 40;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        // Set absolute positioning relative to the viewport
        movingBtn.style.position = 'fixed';
        movingBtn.style.left = x + 'px';
        movingBtn.style.top = y + 'px';
        movingBtn.style.zIndex = '1000';
    }
    
    movingBtn.addEventListener('click', () => {
        clickCount++;
        if (clickCount < maxClicks) {
            moveButton();
        } else {
            // 6th click - proceed to next screen
            setTimeout(() => {
                showScreen('screen-2');
            }, 400);
        }
    });
}

// --- Screen 2: Speed Clicker ---
const speedBtn = document.getElementById('speed-button');
const clickCountSpan = document.getElementById('click-count');
if (speedBtn && clickCountSpan) {
    let count = 0;
    speedBtn.addEventListener('click', () => {
        count++;
        clickCountSpan.textContent = count;
        if (count >= 10) {
            setTimeout(() => {
                showScreen('screen-3');
            }, 400);
        }
    });
    // Reset on show
    document.getElementById('screen-2').addEventListener('transitionend', () => {
        if (document.getElementById('screen-2').classList.contains('active')) {
            count = 0;
            clickCountSpan.textContent = count;
        }
    });
}

// --- Screen 3: Reaction Game ---
const reactionBtn = document.getElementById('reaction-button');
const reactionTimeSpan = document.getElementById('reaction-time');
if (reactionBtn && reactionTimeSpan) {
    let startTime, timeout, waiting = true;
    function startReaction() {
        reactionBtn.textContent = 'Wait...';
        reactionBtn.className = 'game-button waiting';
        waiting = true;
        reactionTimeSpan.textContent = '0.00';
        timeout = setTimeout(() => {
            reactionBtn.textContent = 'Click!';
            reactionBtn.className = 'game-button ready';
            startTime = Date.now();
            waiting = false;
        }, 1200 + Math.random() * 2000);
    }
    reactionBtn.addEventListener('click', () => {
        if (waiting) return;
        const reaction = (Date.now() - startTime) / 1000;
        reactionTimeSpan.textContent = reaction.toFixed(2);
        reactionBtn.textContent = 'Nice!';
        reactionBtn.className = 'game-button clicked';
        setTimeout(() => showScreen('screen-4'), 1000);
    });
    // Reset on show
    document.getElementById('screen-3').addEventListener('transitionend', () => {
        if (document.getElementById('screen-3').classList.contains('active')) {
            clearTimeout(timeout);
            startReaction();
        }
    });
}

// --- Screen 4: Memory Game ---
const memoryCells = document.querySelectorAll('.memory-cell');
const memoryLevel = document.getElementById('memory-level');
const memoryScore = document.getElementById('memory-score');
let pattern = [], userStep = 0, level = 1, score = 0, accepting = false, gameStarted = false, memoryInitialized = false;

function flashCell(idx) {
    const cell = memoryCells[idx];
    cell.classList.add('flash');
    setTimeout(() => cell.classList.remove('flash'), 400);
}

function playPattern() {
    accepting = false;
    let i = 0;
    function next() {
        if (i < pattern.length) {
            flashCell(pattern[i]);
            i++;
            setTimeout(next, 600);
        } else {
            accepting = true;
            userStep = 0;
        }
    }
    next();
}

function nextLevel() {
    level++;
    score += 10;
    memoryLevel.textContent = level;
    memoryScore.textContent = score;
    pattern.push(Math.floor(Math.random() * 4));
    setTimeout(playPattern, 800);
}

if (memoryCells.length) {
    function startMemoryGame() {
        if (memoryInitialized) return; // Prevent multiple initializations
        memoryInitialized = true;
        
        pattern = [Math.floor(Math.random() * 4)];
        userStep = 0;
        level = 1;
        score = 0;
        gameStarted = false;
        accepting = false;
        memoryLevel.textContent = level;
        memoryScore.textContent = score;
        
        // Add start button functionality
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start Memory Game';
        startBtn.className = 'game-button';
        startBtn.style.marginBottom = '1rem';
        
        const memoryGame = document.querySelector('.memory-game');
        const existingStartBtn = memoryGame.querySelector('.start-memory-btn');
        if (existingStartBtn) {
            existingStartBtn.remove();
        }
        
        startBtn.classList.add('start-memory-btn');
        memoryGame.insertBefore(startBtn, memoryGame.firstChild);
        
        startBtn.addEventListener('click', () => {
            gameStarted = true;
            startBtn.remove();
            setTimeout(playPattern, 500);
        });
    }
    
    memoryCells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            if (!gameStarted || !accepting) return;
            flashCell(idx);
            if (pattern[userStep] === idx) {
                userStep++;
                if (userStep === pattern.length) {
                    if (level >= 3) {
                        setTimeout(() => showScreen('screen-5'), 800);
                    } else {
                        nextLevel();
                    }
                }
            } else {
                // Wrong!
                cell.classList.add('active');
                setTimeout(() => cell.classList.remove('active'), 400);
                score = Math.max(0, score - 5);
                memoryScore.textContent = score;
                userStep = 0;
                setTimeout(playPattern, 800);
            }
        });
    });
    
    document.getElementById('screen-4').addEventListener('transitionend', () => {
        if (document.getElementById('screen-4').classList.contains('active')) {
            startMemoryGame();
        }
    });
}

// --- Screen 5: Birthday Surprise ---
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = `hsl(${Math.random()*360}, 90%, 60%)`;
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.width = confetti.style.height = (8 + Math.random() * 8) + 'px';
        confettiContainer.appendChild(confetti);
    }
}

const startOverBtn = document.getElementById('start-over');
if (startOverBtn) {
    startOverBtn.addEventListener('click', () => {
        showScreen('screen-1');
    });
}

document.getElementById('screen-5').addEventListener('transitionend', () => {
    if (document.getElementById('screen-5').classList.contains('active')) {
        createConfetti();
        // Optionally play music here
        // let audio = new Audio('party.mp3'); audio.play();
    }
});

// Start at screen 1
showScreen('screen-1'); 