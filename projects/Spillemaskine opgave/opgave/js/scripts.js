
let slot1 = document.getElementById("slot1");
let slot2 = document.getElementById("slot2");
let slot3 = document.getElementById("slot3");
let point = 0;
// Variables to track which slots are being held
let holdSlot1 = false;
let holdSlot2 = false;
let holdSlot3 = false;
// Add global variables to track hold spins
let holdSpinsRemaining = 4;
let holdActive = false;
// Variables for banking system
let bankBalance = 1000;
// Variables for coin toss feature
let recentWinAmount = 0;
let coinTossAvailable = false;
// Variables to track win history
let winHistory = [];
// Add global variables for win streak
let winStreak = 0;
let maxWinStreak = 0;
// Add these global variables
let gamesPlayed = 0;
let gamesUntilInterest = 30;
// Add these global variables
let consecutiveLosses = 0;
let probabilityBoost = 0;

// everytime the window reloads, the points will be reset to 200
window.onload = function () {
    document.getElementById("credit").innerHTML = point;

    // Disable the spin button if there are no credits
    checkCredits();
};

// Call this when the page loads
window.onload = function () {
    // Initialize the points to 200 if it's a new game
    if (point === 0) {
        point = 0;
    }

    // Load saved data from local storage
    loadWinHistory();
    loadBankBalance();

    // Initialize displays
    document.getElementById("credit").innerHTML = point;
    updateBankDisplay();

    // Initialize game
    checkCredits();
    resetHolds();
    addHoldSpinsDisplayStyle();
    addStyles();
};

// Function to check if there are enough credits to spin
function checkCredits() {
    const spinButton = document.getElementById("spinButton");
    if (point < 10) {
        // Disable spin button if not enough credits
        if (spinButton) {
            spinButton.disabled = true;
        }
        // Show a message prompting to insert credits if points are at 0
        if (point === 0) {
            document.getElementById("message").innerHTML = "Please insert credits to play!";
        }
    } else {
        // Enable spin button if enough credits
        if (spinButton) {
            spinButton.disabled = false;
        }
    }
}

function getIconForNumber(number) {
    // Map numbers 1-10 to the corresponding icon images
    const iconMap = {
        1: "/Spillemaskine opgave/opgave/media/astronaut.png",    // Astronaut
        2: "/Spillemaskine opgave/opgave/media/galaxy (1).png",   // Galaxy (1)
        3: "/Spillemaskine opgave/opgave/media/meteor.png",       // Meteor
        4: "/Spillemaskine opgave/opgave/media/planet.png",       // Planet
        5: "/Spillemaskine opgave/opgave/media/star.png",         // Star
        6: "/Spillemaskine opgave/opgave/media/space-shuttle.png", // Space-shuttle
        7: "/Spillemaskine opgave/opgave/media/ufo.png",          // UFO
        8: "/Spillemaskine opgave/opgave/media/galaxy.png",       // Galaxy
        9: "/Spillemaskine opgave/opgave/media/space-ship.png",   // Space-ship
        10: "/Spillemaskine opgave/opgave/media/logo.png"         // Logo (blackhole)
    };

    return iconMap[number] || '';
}

// Function for spinning the slots
function spin() {
    // First, check if player has enough points to spin
    if (point < 10) {
        alert("Not enough credits to spin! You need at least 10 credits.");
        return;
    }

    // Count this as a game played
    gamesPlayed++;

    // Check if interest should be paid
    if (gamesPlayed >= gamesUntilInterest) {
        payBankInterest();
        gamesPlayed = 0; // Reset counter
    }

    // Check if coin toss is available (should not happen, but just in case)
    if (coinTossAvailable) {
        alert("Please complete the current coin toss game first!");
        return;
    }

    // Deduct 10 points for spinning
    point -= 10;

    // Check if holds are active
    if (holdSlot1 || holdSlot2 || holdSlot3) {
        holdActive = true;

        // Decrease remaining hold spins if holds are active
        holdSpinsRemaining--;

        // Update hold spins counter display
        updateHoldSpinsDisplay();
    }

    // Flag to track if we need to force new random numbers for all slots
    let forceNewNumbers = false;

    // If hold spins have run out, we force new numbers for all slots
    if (holdActive && holdSpinsRemaining <= 0) {
        forceNewNumbers = true;
    }

    // Generate random numbers for slots that aren't held
    let slot1Value, slot2Value, slot3Value;

    // Function to get a random slot value with potential bias
    function getRandomSlotValue(heldValue) {
        // Base random number
        const baseRandom = Math.random();

        // If there's a held value and we should apply bias (5% higher chance)
        if (heldValue && Math.random() < 0.05 + (probabilityBoost / 100)) {
            return heldValue;
        }

        // Normal random slot value
        return Math.floor(Math.random() * 10) + 1;
    }

    if (holdSlot1 && !forceNewNumbers) {
        slot1Value = parseInt(document.getElementById("slot1").dataset.value);
    } else {
        // If another slot is held, bias toward that value
        const heldValue = (holdSlot2 ? parseInt(document.getElementById("slot2").innerHTML) :
            (holdSlot3 ? parseInt(document.getElementById("slot3").innerHTML) : null));
        slot1Value = getRandomSlotValue(heldValue);
    }

    if (holdSlot2 && !forceNewNumbers) {
        slot2Value = parseInt(document.getElementById("slot2").dataset.value);
    } else {
        // If another slot is held, bias toward that value
        const heldValue = (holdSlot1 ? parseInt(document.getElementById("slot1").innerHTML) :
            (holdSlot3 ? parseInt(document.getElementById("slot3").innerHTML) : null));
        slot2Value = getRandomSlotValue(heldValue);
    }

    if (holdSlot3 && !forceNewNumbers) {
        slot3Value = parseInt(document.getElementById("slot3").dataset.value);
    } else {
        // If another slot is held, bias toward that value
        const heldValue = (holdSlot1 ? parseInt(document.getElementById("slot1").innerHTML) :
            (holdSlot2 ? parseInt(document.getElementById("slot2").innerHTML) : null));
        slot3Value = getRandomSlotValue(heldValue);
    }

    // Update the display with images
    updateSlotDisplay("slot1", slot1Value);
    updateSlotDisplay("slot2", slot2Value);
    updateSlotDisplay("slot3", slot3Value);

    // Update the display
    function updateSlotDisplay(slotId, slotValue) {
        const slotElement = document.getElementById(slotId);
    
        // Clear previous content
        slotElement.innerHTML = '';
    
        // Store the value as a data attribute for reference
        slotElement.dataset.value = slotValue;
    
        // Create and append an image element
        const img = document.createElement('img');
        img.src = getIconForNumber(slotValue);
        img.alt = "Slot Icon " + slotValue;
        img.width = 75; // Set appropriate size
    
        slotElement.appendChild(img);
    }

    // Update the credits display
    document.getElementById("credit").innerHTML = point;

    // Variable to track if player won this spin
    let playerWon = false;
    let winAmount = 0;
    let winMessage = "";

    // Check for winning combinations using the correct variables
    if (slot1Value === 1 && slot2Value === 1 && slot3Value === 1) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Astronauts!";
        winAmount = 100;
        playerWon = true;
    } else if (slot1Value === 2 && slot2Value === 2 && slot3Value === 2) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Spacedust!";
        winAmount = 200;
        playerWon = true;
    } else if (slot1Value === 3 && slot2Value === 3 && slot3Value === 3) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Meteors!";
        winAmount = 300;
        playerWon = true;
    } else if (slot1Value === 4 && slot2Value === 4 && slot3Value === 4) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Planets!";
        winAmount = 400;
        playerWon = true;
    } else if (slot1Value === 5 && slot2Value === 5 && slot3Value === 5) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Shooting Stars!";
        winAmount = 500;
        playerWon = true;
    } else if (slot1Value === 6 && slot2Value === 6 && slot3Value === 6) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Shuttles!";
        winAmount = 600;
        playerWon = true;
    } else if (slot1Value === 7 && slot2Value === 7 && slot3Value === 7) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Ufo's!";
        winAmount = 700;
        playerWon = true;
    } else if (slot1Value === 8 && slot2Value === 8 && slot3Value === 8) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Galaxys!";
        winAmount = 800;
        playerWon = true;
    } else if (slot1Value === 9 && slot2Value === 9 && slot3Value === 9) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Aliens!";
        winAmount = 900;
        playerWon = true;
    } else if (slot1Value === 10 && slot2Value === 10 && slot3Value === 10) {
        // If they are the same, the user wins
        winMessage = "You won! 3x Blackholes!";
        winAmount = 1000;
        playerWon = true;
    } else if (slot1Value === 8 && slot2Value === 10 && slot3Value === 8) {
        // First special combination
        winMessage = "You won! Astronout in Space!";
        winAmount = 1500;
        playerWon = true;
    } else if (slot1Value === 10 && slot2Value === 8 && slot3Value === 10) {
        // Second special combination
        winMessage = "You won! Dark Galaxy!";
        winAmount = 2000;
        playerWon = true;
    } else if (slot1Value === 8 && slot2Value === 10 && slot3Value === 6) {
        // Third special combination
        winMessage = "You won! Alien Army!";
        winAmount = 2500;
        playerWon = true;
    } else if (slot1Value === 8 && slot2Value === 10 && slot3Value === 9) {
        // Fourth special combination
        winMessage = "Wormhole Alien!";
        winAmount = 3000;
        playerWon = true;
    } else {
        // If they are not the same, the user loses
        document.getElementById("message").innerHTML = "You lost! Try again!";
        document.getElementById("points").innerHTML = "-10";
    }

    // If player won, show the coin toss offer
    // Modify the win handling in the spin function
    if (playerWon) {
        // Reset consecutive losses and probability boost after a win
        consecutiveLosses = 0;
        probabilityBoost = 0;

        document.getElementById("message").innerHTML = winMessage;

        // Calculate win streak bonus
        const streakBonus = updateWinStreak(true);

        // Add the bonus to the win amount if applicable
        if (streakBonus > 0) {
            winAmount += streakBonus;
            document.getElementById("message").innerHTML += ` + Streak Bonus: ${streakBonus}!`;
        }

        document.getElementById("points").innerHTML = "+" + winAmount;

        // Update win streak display
        updateWinStreakDisplay();

        // Add win to history
        addWinToHistory(winMessage, winAmount);

        // Only offer coin toss randomly
        if (shouldOfferCoinToss()) {
            document.getElementById("message").innerHTML += " - COIN TOSS AVAILABLE!";
            showCoinToss(winAmount);
        } else {
            // If no coin toss, just add the points immediately
            point += winAmount;
            document.getElementById("credit").innerHTML = point;

            // Reset slots after a win (add this line)
            resetSlotsAfterWin();
        }
    } else {
        // Increment consecutive losses
        consecutiveLosses++;

        // Every 20 spins without a win, increase probability by 10%
        if (consecutiveLosses % 20 === 0) {
            probabilityBoost += 10;
            document.getElementById("message").innerHTML += " Your luck is improving!";
        }

        // Reset win streak on loss
        updateWinStreak(false);
        updateWinStreakDisplay();

        // Update message for loss
        document.getElementById("message").innerHTML = "You lost! Try again!";
        document.getElementById("points").innerHTML = "-10";

        // Update the credit display after losing
        document.getElementById("credit").innerHTML = point;
    }

    // Reset hold buttons if player won or used all hold spins
    if ((holdActive && playerWon) || holdSpinsRemaining <= 0) {
        resetHolds();
        holdSpinsRemaining = 4;
        holdActive = false;
    }

    // Update hold spins display
    updateHoldSpinsDisplay();

    // Check if player has run out of points
    if (point <= 0) {
        // Set points to exactly 0 to avoid negative display
        point = 0;
        document.getElementById("credit").innerHTML = point;

        // Show game over message
        document.getElementById("message").innerHTML = "GAME OVER! You're out of credits!";

        // Disable the spin button
        checkCredits();

        // Reset all holds
        resetHolds();

        // Show the out of credits popup instead of reloading
        showOutOfCreditsPopup();
    }

}


// Function to pay bank interest
function payBankInterest() {
    if (bankBalance > 0) {
        // Calculate 0.5% interest
        const interestAmount = Math.floor(bankBalance * 0.005);
        bankBalance += interestAmount;

        // Update display
        updateBankDisplay();
        saveBankBalance();

        // Show message about interest payment
        document.getElementById("message").innerHTML = `Bank paid 0.5% interest: +${interestAmount} credits!`;
    }
}

// Function to update the hold spins display
function updateHoldSpinsDisplay() {
    // Create the element if it doesn't exist
    let holdSpinsDisplay = document.getElementById("holdSpinsDisplay");
    if (!holdSpinsDisplay) {
        holdSpinsDisplay = document.createElement("div");
        holdSpinsDisplay.id = "holdSpinsDisplay";
        document.getElementById("choice").appendChild(holdSpinsDisplay);
    }

    // Only show remaining spins if holds are active
    if (holdActive) {
        holdSpinsDisplay.innerHTML = "Hold Spins Remaining: " + holdSpinsRemaining;
        holdSpinsDisplay.style.display = "block";
    } else {
        holdSpinsDisplay.style.display = "none";
    }
}

// Count how many slots are currently held
function countHeldSlots() {
    let count = 0;
    if (holdSlot1) count++;
    if (holdSlot2) count++;
    if (holdSlot3) count++;
    return count;
}

// Toggle hold status for a slot
// Updated toggleHold function
function toggleHold(slotNumber) {
    // Check if coin toss is active
    if (coinTossAvailable) {
        alert("Please complete the current coin toss game first!");
        return;
    }

    // Get the current slot value - make sure it exists and is not 0 before allowing hold
    const slotElement = document.getElementById("slot" + slotNumber);
    const slotValue = slotElement.dataset.value;
    
    if (!slotValue || slotValue === "" || slotValue === "0") {
        alert("You need to spin first before holding!");
        return;
    }

    // Block holds immediately after the 4 hold spins are used up
    const messageElement = document.getElementById("message");
    if (messageElement && messageElement.innerHTML.includes("Hold chances used up")) {
        alert("You need to spin again with new numbers before using holds!");
        return;
    }

    // Reference to the hold button element
    const holdButton = document.getElementById("holdBtn" + slotNumber);

    // Check which slot we're dealing with
    let isCurrentlyHeld = false;

    switch (slotNumber) {
        case 1: isCurrentlyHeld = holdSlot1; break;
        case 2: isCurrentlyHeld = holdSlot2; break;
        case 3: isCurrentlyHeld = holdSlot3; break;
    }

    // If this slot is already held, release it
    if (isCurrentlyHeld) {
        switch (slotNumber) {
            case 1: holdSlot1 = false; break;
            case 2: holdSlot2 = false; break;
            case 3: holdSlot3 = false; break;
        }
        holdButton.classList.remove("active");
        slotElement.classList.remove("held");
        document.getElementById("message").innerHTML = "Slot " + slotNumber + " released";

        // Check if any slots are still held
        if (!holdSlot1 && !holdSlot2 && !holdSlot3) {
            holdActive = false;
            holdSpinsRemaining = 6;
            updateHoldSpinsDisplay();
        }

        return;
    }

    // If this slot is not held, check if we can hold it (max 2 slots)
    if (countHeldSlots() < 2) {
        // Check if there are enough credits
        if (point >= 15) {
            // Deduct 15 credits for holding a slot
            point -= 15;
            document.getElementById("credit").innerHTML = point;

            // Set the slot to held
            switch (slotNumber) {
                case 1: holdSlot1 = true; break;
                case 2: holdSlot2 = true; break;
                case 3: holdSlot3 = true; break;
            }

            holdButton.classList.add("active");
            slotElement.classList.add("held");
            document.getElementById("message").innerHTML = "Slot " + slotNumber + " held (-15 credits)";
            document.getElementById("points").innerHTML = "-15";

            // Initialize hold spins if this is the first hold
            if (!holdActive) {
                holdActive = true;
                holdSpinsRemaining = 6;
                updateHoldSpinsDisplay();
            }

            // Check if we need to disable the spin button after holding
            checkCredits();
        } else {
            // Not enough credits to hold
            alert("Not enough credits to hold! Holding costs 15 credits.");
        }
    } else {
        alert("You can only hold a maximum of 2 slots at a time!");
    }
}


// Reset all holds when starting a new game
function resetHolds() {
    holdSlot1 = false;
    holdSlot2 = false;
    holdSlot3 = false;

    // Reset visual indicators
    const slots = document.querySelectorAll(".slot");
    const holdBtns = document.querySelectorAll(".hold-button");

    slots.forEach(slot => slot.classList.remove("held"));
    holdBtns.forEach(btn => btn.classList.remove("active"));

    // Reset hold spins
    holdSpinsRemaining = 4;
    holdActive = false;
    updateHoldSpinsDisplay();
}

// Function to load win history from local storage
function loadWinHistory() {
    const savedHistory = localStorage.getItem('slotMachineWinHistory');
    if (savedHistory) {
        winHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Function to save win history to local storage
function saveWinHistory() {
    localStorage.setItem('slotMachineWinHistory', JSON.stringify(winHistory));
}

// Function to load win history from local storage
function loadWinHistory() {
    const savedHistory = localStorage.getItem('slotMachineWinHistory');
    if (savedHistory) {
        winHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Function to add a win to the history
function addWinToHistory(winMessage, winAmount) {
    // Create a win entry with timestamp
    const winEntry = {
        message: winMessage,
        amount: winAmount,
        timestamp: new Date().toLocaleString()
    };

    // Add to beginning of array (most recent first)
    winHistory.unshift(winEntry);

    // Keep only the 30 most recent wins
    if (winHistory.length > 30) {
        winHistory.pop();
    }

    // Save to local storage and update display
    saveWinHistory();
    updateHistoryDisplay();
}

// Function to update the history display
function updateHistoryDisplay() {
    for (let i = 0; i < 30; i++) {
        const historyElement = document.getElementById("history" + (i + 1));
        if (historyElement && i < winHistory.length) {
            historyElement.innerHTML = `${winHistory[i].timestamp}: ${winHistory[i].message} (${winHistory[i].amount > 0 ? '+' : ''}${winHistory[i].amount})`;
        } else if (historyElement) {
            historyElement.innerHTML = "";
        }
    }
}

// Function to load bank balance from local storage
function loadBankBalance() {
    const savedBalance = localStorage.getItem('slotMachineBankBalance');
    if (savedBalance) {
        bankBalance = parseInt(savedBalance);
        updateBankDisplay();
    }
}

// Function to save bank balance to local storage
function saveBankBalance() {
    localStorage.setItem('slotMachineBankBalance', bankBalance.toString());
}

// Function to update bank display
function updateBankDisplay() {
    const bankElement = document.getElementById("bankBalance");
    if (bankElement) {
        bankElement.innerHTML = bankBalance;
    } else {

        // Insert after the credits section
        const creditSection = document.querySelector('section:nth-child(2)');
        if (creditSection) {
            creditSection.parentNode.insertBefore(bankSection, creditSection.nextSibling);
        } else {
            document.body.appendChild(bankSection);
        }
    }
}


// Function to deposit credits to bank
function deposit() {
    // Prevent action if coin toss is active
    if (coinTossAvailable) {
        alert("Please complete the current coin toss game first!");
        return;
    }

    // Prompt user for amount to deposit
    const amount = parseInt(prompt("Enter amount to deposit:"));

    // Validate input
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    // Check if player has enough credits
    if (amount > point) {
        alert("Not enough credits! You only have " + point + " credits.");
        return;
    }

    // Transfer credits to bank
    point -= amount;
    bankBalance += amount;

    // Update displays
    document.getElementById("credit").innerHTML = point;
    updateBankDisplay();
    saveBankBalance();

    // Show message
    document.getElementById("message").innerHTML = "Deposited " + amount + " credits to bank.";
    document.getElementById("points").innerHTML = "-" + amount;

    // Check if spin button should be disabled
    checkCredits();
}

// Function to withdraw credits from bank
function withdraw() {
    // Prevent action if coin toss is active
    if (coinTossAvailable) {
        alert("Please complete the current coin toss game first!");
        return;
    }

    // Prompt user for amount to withdraw
    const amount = parseInt(prompt("Enter amount to withdraw:"));

    // Validate input
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    // Check if bank has enough credits
    if (amount > bankBalance) {
        alert("Not enough credits in bank! You only have " + bankBalance + " credits in your bank.");
        return;
    }

    // Transfer credits from bank
    point += amount;
    bankBalance -= amount;

    // Update displays
    document.getElementById("credit").innerHTML = point;
    updateBankDisplay();
    saveBankBalance();

    // Show message
    document.getElementById("message").innerHTML = "Withdrew " + amount + " credits from bank.";
    document.getElementById("points").innerHTML = "+" + amount;

    // Check if spin button should be enabled
    checkCredits();
}

// Function to show coin toss after a win
function showCoinToss(winAmount) {
    // Set the recent win amount and make coin toss available
    recentWinAmount = winAmount;
    coinTossAvailable = true;

    // Create and show the coin toss modal
    const coinTossModal = document.createElement("div");
    coinTossModal.id = "coinTossModal";
    coinTossModal.className = "modal";
    coinTossModal.innerHTML = `
        <div class="modal-content">
            <h2>Double Your Win!</h2>
            <p>You just won ${winAmount} credits!</p>
            <p>Would you like to bet half (${winAmount / 2}) for a chance to double your win?</p>
            <p>If you win, you'll get ${winAmount * 2} credits total!</p>
            <p>If you lose, you'll keep ${winAmount / 2} credits.</p>
            <div class="coin-buttons">
                <button id="headsBet" onclick="playCoinToss('heads')">Bet on Heads</button>
                <button id="tailsBet" onclick="playCoinToss('tails')">Bet on Tails</button>
                <button id="noThanks" onclick="closeCoinToss(false)">No Thanks</button>
            </div>
        </div>
    `;

    // Add the modal to the body
    document.body.appendChild(coinTossModal);

    // Disable the spin button while coin toss is active
    document.getElementById("spinButton").disabled = true;
}

// Function to check if coin toss should be offered (50% chance)
function shouldOfferCoinToss() {
    return Math.random() < 0.5; // 50% chance
}

// Function to play the coin toss game
function playCoinToss(playerChoice) {
    // Determine the coin toss result (heads or tails)
    const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';

    // Check if player won
    const playerWon = (playerChoice === coinResult);

    // Get the modal
    const modal = document.getElementById("coinTossModal");

    // Change the modal content to show the result
    const modalContent = modal.querySelector(".modal-content");

    if (playerWon) {
        // Player won the coin toss
        const doubledWin = recentWinAmount * 2;
        modalContent.innerHTML = `
            <h2>You Won!</h2>
            <p>The coin landed on ${coinResult}!</p>
            <p>You've doubled your win to ${doubledWin} credits!</p>
            <button onclick="closeCoinToss(true)">Collect Winnings</button>
        `;

        // Add to history
        addWinToHistory("Won coin toss bet", recentWinAmount);
    } else {
        // Player lost the coin toss
        const remainingWin = recentWinAmount / 2;
        modalContent.innerHTML = `
            <h2>You Lost</h2>
            <p>The coin landed on ${coinResult}!</p>
            <p>You keep ${remainingWin} credits.</p>
            <button onclick="closeCoinToss(true)">Continue</button>
        `;

        // Add to history
        addWinToHistory("Lost coin toss bet", -recentWinAmount / 2);
    }
}

// Function to close the coin toss modal
function closeCoinToss(playedGame) {
    // Get the modal
    const modal = document.getElementById("coinTossModal");

    // Calculate final win amount before removing the modal
    let finalWinAmount = recentWinAmount;

    if (playedGame) {
        const modalHeading = modal ? modal.querySelector(".modal-content h2") : null;
        const playerWon = modalHeading && modalHeading.textContent.includes("Won");
        finalWinAmount = playerWon ? recentWinAmount * 2 : recentWinAmount / 2;
    }

    if (modal) {
        // Remove the modal
        document.body.removeChild(modal);
    }

    // Update the player's points based on the outcome
    if (playedGame) {
        point += finalWinAmount;

        // Update message
        document.getElementById("message").innerHTML = finalWinAmount > recentWinAmount
            ? "You Won the Coin Toss!"
            : "You Lost the Coin Toss";
        document.getElementById("points").innerHTML = "+" + finalWinAmount;
    } else {
        // Player chose not to play, they keep their original win
        point += recentWinAmount;
        document.getElementById("credit").innerHTML = point;
        document.getElementById("message").innerHTML = "Win Collected";
        document.getElementById("points").innerHTML = "+" + recentWinAmount;
    }

    // Update credit display
    document.getElementById("credit").innerHTML = point;

    // Reset coin toss variables - IMPORTANT!
    recentWinAmount = 0;
    coinTossAvailable = false;

    // Re-enable the spin button
    const spinButton = document.getElementById("spinButton");
    if (spinButton) {
        spinButton.disabled = false;
    }

    // Reset the slots to 0 after a win
    resetSlotsAfterWin();

    // Check if credits need to be checked
    checkCredits();
}

// Function to reset slots after a win
function resetSlotsAfterWin() {
    // Reset all slot values to empty or default image
    document.getElementById("slot1").innerHTML = '';
    document.getElementById("slot1").dataset.value = '0';
    
    document.getElementById("slot2").innerHTML = '';
    document.getElementById("slot2").dataset.value = '0';
    
    document.getElementById("slot3").innerHTML = '';
    document.getElementById("slot3").dataset.value = '0';

    // Reset holds
    resetHolds();
}

// Function to update win streak
function updateWinStreak(isWin) {
    if (isWin) {
        // Increment win streak
        winStreak++;

        // Update max win streak if needed
        if (winStreak > maxWinStreak) {
            maxWinStreak = winStreak;
            // Save max win streak to local storage
            localStorage.setItem('slotMachineMaxWinStreak', maxWinStreak.toString());
        }

        // Calculate bonus based on win streak
        let streakBonus = 0;
        if (winStreak >= 3) {
            streakBonus = winStreak * 10; // 10 points per streak level after 3
        }

        return streakBonus;
    } else {
        // Reset win streak on loss
        winStreak = 0;
        return 0;
    }
}

// Function to load max win streak from local storage
function loadMaxWinStreak() {
    const savedMaxStreak = localStorage.getItem('slotMachineMaxWinStreak');
    if (savedMaxStreak) {
        maxWinStreak = parseInt(savedMaxStreak);
    }
}

// Update the win streak display
function updateWinStreakDisplay() {
    const streakElement = document.getElementById("winStreak");
    if (streakElement) {
        streakElement.innerHTML = winStreak;
    } else {
        // Create streak display if it doesn't exist
        const streakSection = document.createElement("div");
        streakSection.id = "streakSection";
        streakSection.innerHTML = `
            <p>Win Streak: <span id="winStreak">${winStreak}</span></p>
            <p>Max Streak: <span id="maxWinStreak">${maxWinStreak}</span></p>
        `;

        // Insert it in the game area
        const gameArea = document.querySelector("#slot-machine");
        if (gameArea) {
            gameArea.appendChild(streakSection);
        } else {
            document.body.appendChild(streakSection);
        }
    }
}

// First, let's add the function to create and show the popup
function showOutOfCreditsPopup() {
    // Create the popup modal
    const outOfCreditsModal = document.createElement("div");
    outOfCreditsModal.id = "outOfCreditsModal";
    outOfCreditsModal.className = "modal";
    outOfCreditsModal.innerHTML = `
        <div class="modal-content">
            <h2>Out of Credits!</h2>
            <p>You don't have enough credits to continue playing.</p>
            <p>Would you like to withdraw from your bank balance?</p>
            <div class="popup-buttons">
                <button id="withdrawNowBtn" onclick="handleWithdrawFromPopup()">Withdraw Now</button>
                <button id="cancelBtn" onclick="closeOutOfCreditsPopup()">Cancel</button>
            </div>
        </div>
    `;

    // Add the modal to the body
    document.body.appendChild(outOfCreditsModal);
}

// Function to handle the withdrawal from the popup
function handleWithdrawFromPopup() {
    // Close the popup
    closeOutOfCreditsPopup();

    // Check if the player has money in the bank
    if (bankBalance > 0) {
        // Trigger the withdraw function
        withdraw();
    } else {
        // Show a message that there's no money in the bank
        document.getElementById("message").innerHTML = "No credits in bank. Please add more credits to play!";
    }
}

// Function to close the popup
function closeOutOfCreditsPopup() {
    const modal = document.getElementById("outOfCreditsModal");
    if (modal) {
        document.body.removeChild(modal);
    }
}