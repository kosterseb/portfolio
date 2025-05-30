const gameBoard = document.getElementById("game-board");
gsap.registerPlugin(Draggable);

let points = 0;

let pos = {
    x: 30,
    y: 30,
};

const pointsDisplay = document.getElementById("points");

const moveBy = 50;

const blueSquare = document.getElementById("blueSquare");
const redSquare = document.getElementById("redSquare");

const gameWorldWidth = 2000;
const gameWorldHeight = 1000;

gameBoard.style.width = "800px";
gameBoard.style.height = "200px";

document.addEventListener("keydown", (event) => {
    let newX = pos.x;
    let newY = pos.y;

    switch (event.key) {
        case "ArrowUp":
            newY -= moveBy;
            break;
        case "ArrowDown":
            newY += moveBy;
            break;
        case "ArrowLeft":
            newX -= moveBy;
            break;
        case "ArrowRight":
            newX += moveBy;
            break;
        default:
            return;
    }

    // Boundary checks for blueSquare (game world limits)
    newX = Math.max(0, Math.min(newX, gameWorldWidth - blueSquare.clientWidth));
    newY = Math.max(0, Math.min(newY, gameWorldHeight - blueSquare.clientHeight));

    pos.x = newX;
    pos.y = newY;

    gsap.to("#blueSquare", {
        duration: 0.2,
        x: pos.x,
        y: pos.y,
        ease: "sine.out",
        onComplete: () => {
            if (checkCollision(blueSquare, redSquare)) {
                points++;
                pointsDisplay.innerHTML = points;
                if (points >= Math.floor(Math.random() * 10) + 1) {

                    alert("DEER IS DEAD!");
                    resetGame();
                }

                // redSquare boundary checks within the game world
                let newRedX = Math.random() * (gameWorldWidth - redSquare.clientWidth);
                let newRedY = Math.random() * (gameWorldHeight - redSquare.clientHeight);

                // Ensure red square stays within bounds
                newRedX = Math.max(0, Math.min(newRedX, gameWorldWidth - redSquare.clientWidth));
                newRedY = Math.max(0, Math.min(newRedY, gameWorldHeight - redSquare.clientHeight));
                // Add a small offset to avoid the top edge
                const offsetY = 10; // Adjust this value as needed
                newRedY += offsetY;

                // Ensure the red square stays within bounds after the offset is added.
                newRedY = Math.min(newRedY, gameWorldHeight - redSquare.clientHeight);

                gsap.to(redSquare, {
                    duration: 0.5,
                    x: newRedX,
                    y: newRedY,
                    ease: "sine.out",
                });
            }
            followBlueSquare();
        },
    });
});

function followBlueSquare() {
    const boardWidth = parseInt(gameBoard.style.width, 10);
    const boardHeight = parseInt(gameBoard.style.height, 10);
    const squareWidth = blueSquare.clientWidth;
    const squareHeight = blueSquare.clientHeight;

    const centerX = pos.x + squareWidth / 2;
    const centerY = pos.y + squareHeight / 2;

    let scrollX = centerX - boardWidth / 2;
    let scrollY = centerY - boardHeight / 2;

    // Ensure scrollX and scrollY don't go out of bounds of the game world
    scrollX = Math.max(0, Math.min(scrollX, gameWorldWidth - boardWidth));
    scrollY = Math.max(0, Math.min(scrollY, gameWorldHeight - boardHeight));

    gameBoard.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: "smooth",
    });
}

function checkCollision(blueSquare, redSquare) {
    const blueRect = blueSquare.getBoundingClientRect();
    const redRect = redSquare.getBoundingClientRect();

    return !(
        blueRect.top > redRect.bottom ||
        blueRect.bottom < redRect.top ||
        blueRect.left > redRect.right ||
        blueRect.right < redRect.left
    );
}

function resetGame() {
    points = 0;
    pointsDisplay.innerHTML = points;
    pos.x = 30;
    pos.y = 30;
    gsap.to(blueSquare, {
        duration: 0,
        x: pos.x,
        y: pos.y,
    });

    // redSquare reset within game world limits
    let newRedX = Math.random() * (gameWorldWidth - redSquare.clientWidth);
    let newRedY = Math.random() * (gameWorldHeight - redSquare.clientHeight);

    // Ensure red square stays within bounds
    newRedX = Math.max(0, Math.min(newRedX, gameWorldWidth - redSquare.clientWidth));
    newRedY = Math.max(0, Math.min(newRedY, gameWorldHeight - redSquare.clientHeight));

    // Add a small offset to avoid the top edge
    const offsetY = 10; // Adjust this value as needed
    newRedY += offsetY;

    // Ensure the red square stays within bounds after the offset is added.
    newRedY = Math.min(newRedY, gameWorldHeight - redSquare.clientHeight);

    gsap.to(redSquare, {
        duration: 0,
        x: newRedX,
        y: newRedY,
    });
    followBlueSquare();
}

followBlueSquare();