// FIXED Portfolio Transitions - Copy this to js/transitions.js

class PortfolioTransitions {
    constructor() {
        this.transitionDuration = 0.9;
        this.isTransitioning = false;
        this.hasEntryAnimationPlayed = false;
        this.init();
    }

    init() {
        // Make sure GSAP is loaded
        if (typeof gsap === 'undefined') {
            console.error('GSAP not loaded! Make sure GSAP script is included before transitions.js');
            document.body.style.visibility = 'visible'; // Fallback
            return;
        }

        // Set initial state immediately
        this.setInitialState();
        
        // Play entry animation
        this.scheduleEntryAnimation();
        
        // Add navigation listeners
        this.addNavigationListeners();
    }

    setInitialState() {
        // Make body visible but hide content
        document.body.style.visibility = 'visible';
        
        // Set overlays to cover screen
        gsap.set(".transition-overlay", { 
            y: "0%",
            x: "0%"
        });
        gsap.set(".transition-overlay.secondary", { 
            y: "0%",
            x: "0%"
        });
        gsap.set(".transition-loading", { 
            opacity: 1,
            display: "flex"
        });
        gsap.set("main", { opacity: 0 });
        gsap.set(".header-image-container", { opacity: 0 });
        
        console.log("Initial state set");
    }

    scheduleEntryAnimation() {
        // Try multiple timing strategies to ensure it runs
        
        // Immediate attempt
        setTimeout(() => this.tryEntryAnimation(), 100);
        
        // Wait for load event
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                setTimeout(() => this.tryEntryAnimation(), 200);
            });
        } else {
            setTimeout(() => this.tryEntryAnimation(), 300);
        }
        
        // Fallback after longer delay
        setTimeout(() => this.tryEntryAnimation(), 1000);
    }

    tryEntryAnimation() {
        if (this.hasEntryAnimationPlayed) return;
        
        // Check if elements exist
        const overlay = document.querySelector(".transition-overlay");
        const overlaySecondary = document.querySelector(".transition-overlay.secondary");
        const loading = document.querySelector(".transition-loading");
        const main = document.querySelector("main");
        
        if (!overlay || !overlaySecondary || !loading || !main) {
            console.error("Transition elements not found. Make sure HTML structure is correct.");
            this.fallbackShow();
            return;
        }
        
        this.pageEnter();
    }

    pageEnter() {
        if (this.hasEntryAnimationPlayed) return;
        this.hasEntryAnimationPlayed = true;
        
        console.log("Starting entry animation");

        // Create entrance timeline
        const tl = gsap.timeline({
            onComplete: () => {
                console.log("Entry animation complete");
            }
        });
        
        // Fade out loading
        tl.to(".transition-loading", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        // Slide main overlay up
        .to(".transition-overlay", {
            y: "-100%",
            duration: this.transitionDuration,
            ease: "power3.inOut"
        }, "+=0.3")
        // Slide secondary overlay left
        .to(".transition-overlay.secondary", {
            x: "-100%",
            duration: this.transitionDuration * 0.8,
            ease: "power3.inOut"
        }, "-=0.6")
        // Fade in content
        .to("main", {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.5")
        .to(".header-image-container", {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.5");
    }

    pageExit(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        console.log("Starting exit animation to:", url);

        // Show loading indicator
        gsap.to(".transition-loading", {
            opacity: 1,
            duration: 0.4,
            delay: 0.4,
            ease: "power2.out"
        });

        // Create exit timeline
        const tl = gsap.timeline({
            onComplete: () => {
                console.log("Exit animation complete, navigating...");
                window.location.href = url;
            }
        });

        tl.to("main", {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        })
        .to(".header-image-container", {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.3")
        .to(".transition-overlay.secondary", {
            x: "0%",
            duration: this.transitionDuration * 0.7,
            ease: "power3.inOut"
        }, "-=0.2")
        .to(".transition-overlay", {
            y: "0%",
            duration: this.transitionDuration,
            ease: "power3.inOut"
        }, "-=0.5");
    }

    fallbackShow() {
        // If animations fail, just show the content
        console.log("Using fallback - showing content without animation");
        
        if (document.querySelector(".transition-overlay")) {
            gsap.set(".transition-overlay", { display: "none" });
        }
        if (document.querySelector(".transition-overlay.secondary")) {
            gsap.set(".transition-overlay.secondary", { display: "none" });
        }
        if (document.querySelector(".transition-loading")) {
            gsap.set(".transition-loading", { display: "none" });
        }
        if (document.querySelector("main")) {
            gsap.set("main", { opacity: 1 });
        }
        if (document.querySelector(".header-image-container")) {
            gsap.set(".header-image-container", { opacity: 1 });
        }
        
        this.hasEntryAnimationPlayed = true;
    }

    addNavigationListeners() {
        // Add listeners to menu links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, email, etc.
            if (!href || 
                href.startsWith('http') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                href.startsWith('#') ||
                href === '' ||
                link.getAttribute('target') === '_blank') {
                return; // Let default behavior happen
            }

            // Skip if it's a file download
            if (href.includes('.pdf') || href.includes('.doc') || href.includes('.zip')) {
                return;
            }

            // It's an internal page navigation
            e.preventDefault();
            console.log("Intercepted click to:", href);
            this.pageExit(href);
        });
    }
}

// Initialize when DOM is ready and GSAP is loaded
function initTransitions() {
    if (typeof gsap !== 'undefined') {
        console.log("Initializing Portfolio Transitions");
        new PortfolioTransitions();
    } else {
        console.log("GSAP not ready, retrying...");
        setTimeout(initTransitions, 100);
    }
}

// Multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitions);
} else {
    initTransitions();
}

// Export for manual initialization if needed
window.PortfolioTransitions = PortfolioTransitions;