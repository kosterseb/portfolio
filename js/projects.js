// Register GSAP plugins
gsap.registerPlugin(CustomEase);

// Define CustomEase for animations
CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");

// Set GSAP defaults
gsap.defaults({
  ease: "main",
  duration: 0.7
});

// Hide navigation initially
gsap.set(".nav", {display: "none"});

// Initialize menu functionality
function initMenu() {
  let navWrap = document.querySelector(".nav");
  let state = navWrap.getAttribute("data-nav");
  let overlay = navWrap.querySelector(".overlay");
  let menu = navWrap.querySelector(".menu");
  let bgPanels = navWrap.querySelectorAll(".bg-panel");
  let menuToggles = document.querySelectorAll("[data-menu-toggle]");
  let menuLinks = navWrap.querySelectorAll(".menu-link");
  let fadeTargets = navWrap.querySelectorAll("[data-menu-fade]");
  let menuButton = document.querySelector(".menu-button");
  let menuButtonTexts = menuButton.querySelectorAll("p");
  let menuButtonIcon = menuButton.querySelector(".menu-button-icon");

  let tl = gsap.timeline();
  
  // Open navigation menu
  const openNav = () => {
    navWrap.setAttribute("data-nav", "open");
    
    tl.clear()
      .set(navWrap, {display: "block"})
      .set(menu, {xPercent: 0}, "<")
      .fromTo(menuButtonTexts, {yPercent: 0}, {yPercent: -100, stagger: 0.2})
      .fromTo(menuButtonIcon, {rotate: 0}, {rotate: 315}, "<")
      .fromTo(overlay, {autoAlpha: 0}, {autoAlpha: 1}, "<")
      .fromTo(bgPanels, {xPercent: 101}, {xPercent: 0, stagger: 0.12, duration: 0.575}, "<")
      .fromTo(menuLinks, {yPercent: 140, rotate: 10}, {yPercent: 0, rotate: 0, stagger: 0.05}, "<+=0.35")
      .fromTo(fadeTargets, {autoAlpha: 0, yPercent: 50}, {autoAlpha: 1, yPercent: 0, stagger: 0.04}, "<+=0.2");
  };
  
  // Close navigation menu
  const closeNav = () => {
    navWrap.setAttribute("data-nav", "closed");
    
    tl.clear()
      .to(overlay, {autoAlpha: 0})
      .to(menu, {xPercent: 120}, "<")
      .to(menuButtonTexts, {yPercent: 0}, "<")
      .to(menuButtonIcon, {rotate: 0}, "<")
      .set(navWrap, {display: "none"});
  };  
  
  // Toggle menu open/close based on current state
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      state = navWrap.getAttribute("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });    
  });
  
  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
      closeNav();
    }
  });

  // Close menu when clicking a menu link 
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });
}

// Initialize portfolio functionality
function initPortfolio() {
  // Smooth scrolling using jQuery easing
  $('a.page-scroll').on('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 54
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
  
  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });
  
  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });
  
  // Enhance portfolio item hover effects
  $('.portfolio-item').each(function() {
    const item = $(this);
    const portfolioHover = item.find('.portfolio-hover');
    const img = item.find('img');
    
    item.hover(
      function() {
        portfolioHover.css('opacity', '1');
        gsap.to(img, { scale: 1.05, duration: 0.5 });
      },
      function() {
        portfolioHover.css('opacity', '0');
        gsap.to(img, { scale: 1, duration: 0.5 });
      }
    );
  });

  // Initialize modal close buttons with animation
  $('.close-modal').on('click', function() {
    gsap.to($(this).find('.lr, .rl'), {
      rotate: '+=180',
      duration: 0.4
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initPortfolio();
});