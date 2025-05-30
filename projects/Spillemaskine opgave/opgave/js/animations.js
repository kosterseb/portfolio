// Function to animate slot spinning
function animateSlots(slots, duration = 2000) {
    // Add spinning class to create spinning effect
    slots.forEach(slot => {
        if (!slot.classList.contains('held')) {
            slot.classList.add('spinning');
            
            // Create spinning animation with multiple images flashing
            const symbols = ['astronaut.png', 'galaxy.png', 'meteor.png', 'planet.png', 
                            'star.png', 'space-shuttle.png', 'ufo.png', 'galaxy.png', 
                            'space-ship.png', 'logo.png'];
            
            // Flash random symbols during spin
            let flashInterval = setInterval(() => {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                slot.innerHTML = `<img src="media/${randomSymbol}" alt="Spinning">`;
            }, 100);
            
            // Stop spinning after duration
            setTimeout(() => {
                clearInterval(flashInterval);
                slot.classList.remove('spinning');
            }, duration);
        }
    });
    
    // Play spin sound
    playSound('spin');
}

// Function to handle winning animations
function animateWin(message, points, matchedSlots) {
    // Update message with win class for glowing animation
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.add('win');
    
    // Animate points counter
    const pointsElement = document.getElementById('points');
    const currentPoints = parseInt(pointsElement.textContent) || 0;
    const newPoints = currentPoints + points;
    
    // Animate counting up
    let count = currentPoints;
    const interval = setInterval(() => {
        count += Math.ceil((newPoints - currentPoints) / 20);
        if (count >= newPoints) {
            count = newPoints;
            clearInterval(interval);
            
            // Remove win class after animation completes
            setTimeout(() => {
                messageElement.classList.remove('win');
            }, 3000);
        }
        pointsElement.textContent = count;
    }, 50);
    
    // Add win animation to matched slots
    if (matchedSlots && matchedSlots.length) {
        matchedSlots.forEach(slotNum => {
            const slot = document.getElementById(`slot${slotNum}`);
            slot.classList.add('win');
            
            // Remove win class after animation completes
            setTimeout(() => {
                slot.classList.remove('win');
            }, 3000);
        });
    }
    
    // Create confetti celebration for big wins
    if (points > 300) {
        createConfetti(points > 1000 ? 100 : 50);
        playSound('bigwin');
    } else {
        playSound('win');
    }
}

// Function to toggle hold on slots
function toggleHold(slotNum) {
    const slot = document.getElementById(`slot${slotNum}`);
    const holdBtn = document.getElementById(`holdBtn${slotNum}`);
    
    // Check if we can hold (max 2 holds)
    const heldSlots = document.querySelectorAll('.slot.held');
    
    if (slot.classList.contains('held')) {
        // Remove hold
        slot.classList.remove('held');
        holdBtn.classList.remove('active');
        holdBtn.textContent = `HOLD ${slotNum}`;
        playSound('unhold');
    } else {
        // Add hold if we haven't reached max holds
        if (heldSlots.length < 2) {
            slot.classList.add('held');
            holdBtn.classList.add('active');
            holdBtn.textContent = `UNHOLD ${slotNum}`;
            playSound('hold');
            
            // Add pulsing effect to show it's held
            slot.animate([
                { transform: 'scale(1)', boxShadow: '0 0 15px rgba(127, 90, 240, 0.3)' },
                { transform: 'scale(1.05)', boxShadow: '0 0 25px rgba(127, 90, 240, 0.5)' },
                { transform: 'scale(1)', boxShadow: '0 0 15px rgba(127, 90, 240, 0.3)' }
            ], {
                duration: 800,
                iterations: 1
            });
        } else {
            // Show error - can't hold more than 2 slots
            const messageEl = document.getElementById('message');
            messageEl.textContent = "You can hold a maximum of 2 slots!";
            messageEl.style.color = "#f04a5a";
            
            // Reset message after a moment
            setTimeout(() => {
                messageEl.textContent = "";
                messageEl.style.color = "";
            }, 2000);
            
            playSound('error');
        }
    }
    
    // Update credit display based on hold cost
    updateCredits();
}

// Create confetti celebration effect
function createConfetti(particleCount = 50) {
    // Create container for confetti if it doesn't exist
    let celebrationEl = document.querySelector('.win-celebration');
    if (!celebrationEl) {
        celebrationEl = document.createElement('div');
        celebrationEl.classList.add('win-celebration');
        document.body.appendChild(celebrationEl);
    }
    
    // Clear previous confetti
    celebrationEl.innerHTML = '';
    celebrationEl.classList.add('active');
    
    // Generate confetti particles
    for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize confetti properties
        const colors = ['#4ecca3', '#7f5af0', '#2cb5e8', '#f04a5a', '#ffcc00'];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${left}%`;
        confetti.style.animationDelay = `${delay}s`;
        
        celebrationEl.appendChild(confetti);
    }
    
    // Remove celebration after animation completes
    setTimeout(() => {
        celebrationEl.classList.remove('active');
    }, 4000);
}

// Sound effects system
function playSound(soundType) {
    // Create audio element if it doesn't exist
    let audio = document.getElementById(`sound-${soundType}`);
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = `sound-${soundType}`;
        audio.volume = 0.5;
        document.body.appendChild(audio);
    }
    
    // Set the source based on sound type
    switch(soundType) {
        case 'spin':
            audio.src = 'sounds/spin.mp3';
            break;
        case 'win':
            audio.src = 'sounds/win.mp3';
            break;
        case 'bigwin':
            audio.src = 'sounds/bigwin.mp3';
            break;
        case 'hold':
            audio.src = 'sounds/hold.mp3';
            break;
        case 'unhold':
            audio.src = 'sounds/unhold.mp3';
            break;
        case 'deposit':
            audio.src = 'sounds/deposit.mp3';
            break;
        case 'withdraw':
            audio.src = 'sounds/withdraw.mp3';
            break;
        case 'error':
            audio.src = 'sounds/error.mp3';
            break;
    }
    
    // Play the sound
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Animate credits display
function animateCredits(oldValue, newValue) {
    const creditElement = document.getElementById('credit');
    let currentValue = oldValue;
    const difference = newValue - oldValue;
    const increment = difference / 20;
    
    // Create a visual indicator for gain/loss
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.fontSize = '1.2rem';
    indicator.style.fontWeight = 'bold';
    indicator.style.opacity = '1';
    indicator.style.transition = 'all 1s ease-out';
    
    if (difference > 0) {
        indicator.textContent = `+${difference}`;
        indicator.style.color = '#4ecca3';
    } else if (difference < 0) {
        indicator.textContent = `${difference}`;
        indicator.style.color = '#f04a5a';
    }
    
    creditElement.parentNode.style.position = 'relative';
    creditElement.parentNode.appendChild(indicator);
    
    // Animate the indicator
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translate(-50%, -20px)';
    }, 50);
    
    // Remove the indicator after animation
    setTimeout(() => {
        indicator.remove();
    }, 1000);
    
    // Animate the credit counter
    const interval = setInterval(() => {
        currentValue += increment;
        if ((increment > 0 && currentValue >= newValue) || 
            (increment < 0 && currentValue <= newValue)) {
            currentValue = newValue;
            clearInterval(interval);
        }
        creditElement.textContent = Math.round(currentValue);
    }, 50);
}

// Initialize event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure all UI elements are ready
    const spinButton = document.getElementById('spinButton');
    const holdButtons = document.querySelectorAll('.hold-button');
    const depositButton = document.getElementById('depositButton');
    const withdrawButton = document.getElementById('withdrawButton');
    
    // Add animation to buttons on hover
    [spinButton, ...holdButtons, depositButton, withdrawButton].forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-3px)' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            button.animate([
                { transform: 'translateY(-3px)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        });
    });
    
    // Create stars background effect
    createStarsBackground();
});

// Create animated stars in background
function createStarsBackground() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);
    
    // Create random stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        // Apply styles
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}