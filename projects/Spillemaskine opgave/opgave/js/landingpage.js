let a = 0;

document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('stars');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3;
        
        // Random animation duration
        const duration = 3 + Math.random() * 7;
        const delay = Math.random() * 10;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
});

// Testimonial carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    
    // Hide all slides initially
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show the first slide
    slides[0].classList.add('active');
    
    // Function to rotate slides
    function rotateSlides() {
      // Hide current slide
      slides[currentSlide].classList.remove('active');
      
      // Move to next slide or back to first
      currentSlide = (currentSlide + 1) % slides.length;
      
      // Show new current slide
      slides[currentSlide].classList.add('active');
    }
    
    // Set interval for rotation (4 seconds)
    setInterval(rotateSlides, 4000);
  });

  // Check if user is logged in
  document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
});

function checkUserLogin() {
    const userData = localStorage.getItem('galaxyUser');
    const navAuthButtons = document.getElementById('navAuthButtons');
    
    if (userData) {
        // User is logged in, show account button
        navAuthButtons.innerHTML = '<a href="account.html" class="btn btn-secondary">My Account</a>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Style the icon selection on click
    const iconLabels = document.querySelectorAll('.icon-selection label');
    
    iconLabels.forEach(label => {
        label.addEventListener('click', function() {
            // Remove active class from all labels
            iconLabels.forEach(l => l.style.border = '2px solid transparent');
            // Add active class to clicked label
            this.style.border = '2px solid #4ecca3';
        });
    });
    
    // Form submission
    const signupForm = document.getElementById('signupForm');
    const successModal = document.getElementById('successModal');
    const startPlayingBtn = document.getElementById('startPlayingBtn');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value;
        const birthYear = parseInt(document.getElementById('birthYear').value);
        const favoriteAnimal = document.getElementById('favoriteAnimal').value;
        const playerIcon = document.querySelector('input[name="playerIcon"]:checked').value;
        
        // Check age
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        
        if (age < 18) {
            alert("You must be at least 18 years old to sign up for Galaxy Slots Resort.");
            return;
        }
        
        // Create user object
        const user = {
            username: username,
            birthYear: birthYear,
            favoriteAnimal: favoriteAnimal,
            playerIcon: playerIcon,
            credits: 1000,
            joinDate: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('galaxyUser', JSON.stringify(user));
        
        // Show success modal
        successModal.style.display = 'block';
    });
    
    // Start playing button
    startPlayingBtn.addEventListener('click', function() {
        window.location.href = 'spillemaskine.html';
    });
    
    // Check if user is already logged in
    checkUserLogin();
});

function checkUserLogin() {
    const userData = localStorage.getItem('galaxyUser');
    const navAuthButtons = document.getElementById('navAuthButtons');
    
    if (userData) {
        // User is logged in, show account button
        navAuthButtons.innerHTML = '<a href="account.html" class="btn btn-secondary">My Account</a>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
  
    const user = JSON.parse(userData);
  
    // Populate user information
    document.getElementById('username').textContent = user.username;
    document.getElementById('favoriteAnimal').textContent = user.favoriteAnimal;
    document.getElementById('birthYear').textContent = user.birthYear;
    document.getElementById('userCredits').textContent = user.credits || 1000;
    document.getElementById('userIcon').src = `media/${user.playerIcon}.png`;
  
    // Format join date
    const joinDate = new Date(user.joinDate);
    document.getElementById('joinDate').textContent = joinDate.toLocaleDateString();
  
    // Setup edit form
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editFavoriteAnimal').value = user.favoriteAnimal;
  
    // Set the correct radio button for player icon
    const iconRadio = document.querySelector(`input[name="editPlayerIcon"][value="${user.playerIcon}"]`);
    if (iconRadio) {
      iconRadio.checked = true;
      iconRadio.parentElement.style.border = '2px solid #4ecca3';
    }
  
    // Style the icon selection on click
    const iconLabels = document.querySelectorAll('.icon-selection label');
    iconLabels.forEach(label => {
      label.addEventListener('click', function() {
        // Remove active class from all labels
        iconLabels.forEach(l => l.style.border = '2px solid transparent');
        // Add active class to clicked label
        this.style.border = '2px solid #4ecca3';
      });
    });
  
    // Load stats if available
    if (user.stats) {
      document.getElementById('statsPlaceholder').style.display = 'none';
      document.getElementById('playerStats').style.display = 'block';
      document.getElementById('gamesPlayed').textContent = user.stats.gamesPlayed || 0;
      document.getElementById('biggestWin').textContent = user.stats.biggestWin || 0;
      document.getElementById('totalWins').textContent = user.stats.totalWins || 0;
      
      // Load recent activity if available
      if (user.stats.recentActivity && user.stats.recentActivity.length > 0) {
        const activityContainer = document.getElementById('recentActivity');
        activityContainer.innerHTML = '';
        user.stats.recentActivity.forEach(activity => {
          const activityItem = document.createElement('p');
          activityItem.textContent = `${new Date(activity.date).toLocaleDateString()} - ${activity.description}`;
          activityContainer.appendChild(activityItem);
        });
      } else {
        document.getElementById('activityPlaceholder').style.display = 'block';
      }
    }
  
    // Handle profile update form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const updatedUsername = document.getElementById('editUsername').value.trim();
      const updatedFavoriteAnimal = document.getElementById('editFavoriteAnimal').value.trim();
      const updatedPlayerIcon = document.querySelector('input[name="editPlayerIcon"]:checked').value;
      
      // Validate form
      if (!updatedUsername) {
        showMessage('Please enter a username', 'error');
        return;
      }
      
      // Update user data
      user.username = updatedUsername;
      user.favoriteAnimal = updatedFavoriteAnimal;
      user.playerIcon = updatedPlayerIcon;
      
      // Save updated user data
      localStorage.setItem('galaxyUser', JSON.stringify(user));
      
      // Update displayed information
      document.getElementById('username').textContent = user.username;
      document.getElementById('favoriteAnimal').textContent = user.favoriteAnimal;
      document.getElementById('userIcon').src = `media/${user.playerIcon}.png`;
      
      // Show success message
      showMessage('Profile updated successfully!', 'success');
      
      // Close modal
      const modal = document.getElementById('editProfileModal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  
    // Handle logout button
    document.getElementById('logoutButton').addEventListener('click', function() {
      localStorage.removeItem('galaxyUser');
      window.location.href = 'login.html';
    });
  
    // Modal controls
    const editProfileBtn = document.getElementById('editProfileBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const modal = document.getElementById('editProfileModal');
    
    if (editProfileBtn && modal) {
      editProfileBtn.addEventListener('click', function() {
        modal.style.display = 'block';
      });
    }
    
    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
    
    // Function to show messages
    function showMessage(message, type) {
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(function() {
          messageElement.style.display = 'none';
        }, 3000);
      }
    }
  });

  // Burger menu functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Burger menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuToggle && mainNav && menuOverlay) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking on navigation links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Check user login status
    checkUserLogin();
});

// Unified checkUserLogin function
function checkUserLogin() {
    const userData = localStorage.getItem('galaxyUser');
    const navAuthButtons = document.getElementById('navAuthButtons');
    
    if (userData && navAuthButtons) {
        // User is logged in, show account button
        navAuthButtons.innerHTML = '<a href="account.html" class="btn btn-secondary">My Account</a>';
    }
    
    // Additional account page functionality
    if (userData && document.getElementById('username')) {
        try {
            const user = JSON.parse(userData);
            
            // Populate user information
            document.getElementById('username').textContent = user.username;
            if (document.getElementById('favoriteAnimal')) {
                document.getElementById('favoriteAnimal').textContent = user.favoriteAnimal;
            }
            if (document.getElementById('birthYear')) {
                document.getElementById('birthYear').textContent = user.birthYear;
            }
            if (document.getElementById('userCredits')) {
                document.getElementById('userCredits').textContent = user.credits || 1000;
            }
            if (document.getElementById('userIcon')) {
                document.getElementById('userIcon').src = `media/${user.playerIcon}.png`;
            }
            
            // Format join date if element exists
            if (document.getElementById('joinDate') && user.joinDate) {
                const joinDate = new Date(user.joinDate);
                document.getElementById('joinDate').textContent = joinDate.toLocaleDateString();
            }
            
            // Setup edit form if elements exist
            if (document.getElementById('editUsername')) {
                document.getElementById('editUsername').value = user.username;
            }
            if (document.getElementById('editFavoriteAnimal')) {
                document.getElementById('editFavoriteAnimal').value = user.favoriteAnimal;
            }
            
            // Set the correct radio button for player icon
            const iconRadio = document.querySelector(`input[name="editPlayerIcon"][value="${user.playerIcon}"]`);
            if (iconRadio) {
                iconRadio.checked = true;
                iconRadio.parentElement.style.border = '2px solid #4ecca3';
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }
}