document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const recipeList = document.getElementById('recipe-list');
    const emptyState = document.getElementById('empty-state');
    const recipeCount = document.getElementById('recipe-count');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const sortSelect = document.getElementById('sort-select');
    
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