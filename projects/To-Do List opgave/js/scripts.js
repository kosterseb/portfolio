document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoInput = document.querySelector('.todo-input');
    const addBtn = document.querySelector('.add-btn');
    const todoList = document.querySelector('.todo-list');
    const clearCompletedBtn = document.querySelector('.clear-completed-btn');
    const clearAllBtn = document.querySelector('.clear-all-btn');
    const emptyState = document.querySelector('.empty-state');
    
    // Todo array to store tasks
    let todos = [];
    
    // Load todos from localStorage
    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
            renderTodos();
        }
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Render todos to the DOM
    function renderTodos() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            
            todos.forEach((todo, index) => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');
                if (todo.completed) {
                    todoItem.classList.add('done');
                }
                
                // Format date
                const date = new Date(todo.createdAt);
                const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                todoItem.innerHTML = `
                    <div class="todo-content">
                        <div class="todo-text">${todo.text}</div>
                        <div class="todo-date">Created: ${formattedDate}</div>
                    </div>
                    <div class="todo-actions">
                        <button class="toggle-btn" data-index="${index}">
                            ${todo.completed ? '↩️' : '✓'}
                        </button>
                        <button class="delete-btn" data-index="${index}">🗑️</button>
                    </div>
                `;
                
                todoList.appendChild(todoItem);
            });
        }
    }
    
    // Add a new todo
    function addTodo() {
        const todoText = todoInput.value.trim();
        
        if (todoText) {
            const newTodo = {
                text: todoText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            todos.unshift(newTodo); // Add to beginning of array
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }
    
    // Toggle todo completion status
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }
    
    // Delete a todo
    function deleteTodo(index) {
        const todoItem = document.querySelectorAll('.todo-item')[index];
        
        // Add deleting animation class
        todoItem.classList.add('deleting');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }, 300);
    }
    
    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
    
    // Clear all todos
    function clearAll() {
        todos = [];
        saveTodos();
        renderTodos();
    }
    
    // Event Listeners
    addBtn.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-btn')) {
            const index = e.target.dataset.index;
            toggleTodo(index);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteTodo(index);
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
    
    // Initialize
    loadTodos();
});