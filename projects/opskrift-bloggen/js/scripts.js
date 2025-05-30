document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const recipeTitle = document.querySelector('.todo-input');
    const recipeContent = document.querySelector('.recipe-input');
    const addBtn = document.querySelector('.add-btn');
    const recipeList = document.querySelector('.todo-list');
    const clearCompletedBtn = document.querySelector('.clear-completed-btn');
    const clearAllBtn = document.querySelector('.clear-all-btn');
    const emptyState = document.querySelector('.empty-state');
    
    // Rename the array to recipes
    let recipes = [];
    
    // Load recipes from localStorage
    function loadRecipes() {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            recipes = JSON.parse(storedRecipes);
            renderRecipes();
        }
    }
    
    // Save recipes to localStorage
    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
    
    // Render recipes to the DOM
    function renderRecipes() {
        recipeList.innerHTML = '';
        
        if (recipes.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            
            recipes.forEach((recipe, index) => {
                const recipeItem = document.createElement('li');
                recipeItem.classList.add('recipe-item');
                if (recipe.completed) {
                    recipeItem.classList.add('done');
                }
                
                // Format date
                const date = new Date(recipe.createdAt);
                const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                recipeItem.innerHTML = `
                    <div class="recipe-content">
                        <h2 class="recipe-title">${recipe.title}</h2>
                        <div class="recipe-text">${recipe.content.replace(/\n/g, '<br>')}</div>
                        <div class="recipe-date">Created: ${formattedDate}</div>
                    </div>
                    <div class="recipe-actions">
                        <button class="edit-btn" data-index="${index}">✏️</button>
                        <button class="toggle-btn" data-index="${index}">
                            ${recipe.completed ? 'Mark Uncooked' : 'Mark Cooked'}
                        </button>
                        <button class="delete-btn" data-index="${index}">🗑️</button>
                    </div>
                `;
                
                recipeList.appendChild(recipeItem);
            });
        }
    }
    
    // Add a new recipe
    function addRecipe() {
        const title = recipeTitle.value.trim();
        const content = recipeContent.value.trim();
        
        if (title && content) {
            const newRecipe = {
                title: title,
                content: content,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            recipes.unshift(newRecipe); // Add to beginning of array
            saveRecipes();
            renderRecipes();
            recipeTitle.value = '';
            recipeContent.value = '';
        } else {
            alert('Please enter both a recipe title and content');
        }
    }
    
    // Edit recipe
    function editRecipe(index) {
        const recipe = recipes[index];
        
        // Fill the input fields with the recipe data
        recipeTitle.value = recipe.title;
        recipeContent.value = recipe.content;
        
        // Remove the recipe from the array
        recipes.splice(index, 1);
        
        // Focus on the title input
        recipeTitle.focus();
        
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        
        // Update the UI
        saveRecipes();
        renderRecipes();
    }
    
    // Toggle recipe completion status
    function toggleRecipe(index) {
        recipes[index].completed = !recipes[index].completed;
        saveRecipes();
        renderRecipes();
    }
    
    // Delete a recipe
    function deleteRecipe(index) {
        const recipeItem = document.querySelectorAll('.recipe-item')[index];
        
        // Add deleting animation class
        recipeItem.classList.add('deleting');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            recipes.splice(index, 1);
            saveRecipes();
            renderRecipes();
        }, 300);
    }
    
    // Clear completed recipes
    function clearCompleted() {
        recipes = recipes.filter(recipe => !recipe.completed);
        saveRecipes();
        renderRecipes();
    }
    
    // Clear all recipes
    function clearAll() {
        if (confirm('Are you sure you want to delete all recipes?')) {
            recipes = [];
            saveRecipes();
            renderRecipes();
        }
    }
    
    // Event Listeners
    addBtn.addEventListener('click', addRecipe);
    
    recipeTitle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Move focus to recipe content instead of adding
            recipeContent.focus();
        }
    });
    
    recipeList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        
        if (e.target.classList.contains('toggle-btn')) {
            toggleRecipe(index);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            deleteRecipe(index);
        }
        
        if (e.target.classList.contains('edit-btn')) {
            editRecipe(index);
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
    
    // Initialize
    loadRecipes();
});

document.addEventListener('DOMContentLoaded', () => {
 
    // Recipe array
    let recipes = [];
    let filteredRecipes = [];
    
    // Load recipes from localStorage
    function loadRecipes() {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            recipes = JSON.parse(storedRecipes);
            filteredRecipes = [...recipes];
            updateRecipeCount();
            applyFiltersAndSort();
        } else {
            showEmptyState();
        }
    }
    
    // Update recipe count display
    function updateRecipeCount() {
        recipeCount.textContent = filteredRecipes.length;
    }
    
    // Show empty state when no recipes
    function showEmptyState() {
        emptyState.style.display = 'block';
        recipeList.style.display = 'none';
    }
    
    // Hide empty state
    function hideEmptyState() {
        emptyState.style.display = 'none';
        recipeList.style.display = 'block';
    }
    
    // Apply filters and sorting
    function applyFiltersAndSort() {
        // First apply search filter
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Apply status filter
        const filterValue = filterSelect.value;
        
        filteredRecipes = recipes.filter(recipe => {
            // Text search
            const matchesSearch = 
                recipe.title.toLowerCase().includes(searchTerm) || 
                recipe.content.toLowerCase().includes(searchTerm);
            
            // Status filter
            let matchesFilter = true;
            if (filterValue === 'cooked') {
                matchesFilter = recipe.completed;
            } else if (filterValue === 'uncooked') {
                matchesFilter = !recipe.completed;
            }
            
            return matchesSearch && matchesFilter;
        });
        
        // Apply sorting
        const sortValue = sortSelect.value;
        
        switch (sortValue) {
            case 'newest':
                filteredRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filteredRecipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'az':
                filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                filteredRecipes.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        updateRecipeCount();
        renderRecipes();
    }
    
    // Render recipes to the DOM
    function renderRecipes() {
        recipeList.innerHTML = '';
        
        if (filteredRecipes.length === 0) {
            showEmptyState();
            return;
        }
        
        hideEmptyState();
        
        filteredRecipes.forEach(recipe => {
            const recipeItem = document.createElement('li');
            recipeItem.classList.add('recipe-item');
            if (recipe.completed) {
                recipeItem.classList.add('done');
            }
            
            // Format date
            const date = new Date(recipe.createdAt);
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            recipeItem.innerHTML = `
                <div class="recipe-content">
                    <div class="recipe-header">
                        <h2 class="recipe-title">${recipe.title}</h2>
                        <span class="recipe-status">${recipe.completed ? 'Cooked' : 'Not Cooked Yet'}</span>
                    </div>
                    <div class="recipe-text">${recipe.content.replace(/\n/g, '<br>')}</div>
                    <div class="recipe-date">Created: ${formattedDate}</div>
                </div>
            `;
            
            recipeList.appendChild(recipeItem);
        });
    }
    
    // Event Listeners
    searchInput.addEventListener('input', applyFiltersAndSort);
    filterSelect.addEventListener('change', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);
    
    // Initialize
    loadRecipes();
});