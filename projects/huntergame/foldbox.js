const toggleBtn = document.getElementById("toggleBtn");
const foldBox = document.getElementById("foldBox");
let isOpen = false;
let animating = false;

toggleBtn.addEventListener("click", () => {
    if (animating) return;

    animating = true;

    if (!isOpen) { // Check if it's currently closed
        foldBox.style.display = "block";
        const targetHeight = foldBox.scrollHeight;

        gsap.fromTo(foldBox,
            { height: 0 },
            {
                duration: 0.5,
                height: targetHeight,
                ease: "power1",
                onComplete: () => {
                    foldBox.style.height = "auto";
                    isOpen = true;
                    animating = false;
                },
            }
        );
    } else { // It's currently open, so close it
        const currentHeight = foldBox.scrollHeight;

        gsap.fromTo(foldBox,
            { height: currentHeight },
            {
                duration: 0.5,
                height: 0,
                ease: "power1",
                onComplete: () => {
                    foldBox.style.display = "none";
                    isOpen = false;
                    animating = false;
                },
            }
        );
    }
});