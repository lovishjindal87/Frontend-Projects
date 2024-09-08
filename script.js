document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const taskForm = document.getElementById('task-form');
    const filterInput = document.getElementById('filter');
    const taskList = document.getElementById('task-list');
    const clearTasksBtn = document.querySelector('.clear-tasks');
    const feedbackForm = document.getElementById('feedback-form');

    // Event Listeners
    loadEventListeners();

    function loadEventListeners() {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        taskForm.addEventListener('submit', addTask);
        taskList.addEventListener('click', modifyTask);
        filterInput.addEventListener('keyup', filterTasks);
        clearTasksBtn.addEventListener('click', clearTaskList);
        feedbackForm.addEventListener('submit', submitFeedback);
    }

    // Toggle Dark Mode
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
    }

    // Add Task
    function addTask(e) {
        const taskInput = document.getElementById('task');
        const priority = document.getElementById('priority').value;
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please add a task');
        } else {
            createTaskElement(taskText, priority);
            storeTaskInLocalStorage(taskText, priority);
            taskInput.value = '';
        }
        e.preventDefault();
    }

    // Create Task Element
    function createTaskElement(taskText, priority) {
        const li = document.createElement('li');
        li.className = `collection-item ${priority}`;
        li.appendChild(document.createTextNode(taskText));

        // Color-coding based on priority
        switch (priority) {
            case 'low':
                li.style.backgroundColor = '#ffffcc'; // Yellow
                break;
            case 'medium':
                li.style.backgroundColor = '#ccffcc'; // Green
                break;
            case 'high':
                li.style.backgroundColor = '#ffcccc'; // Red
                break;
        }

        const editBtn = document.createElement('a');
        editBtn.className = 'edit secondary-content';
        editBtn.innerHTML = 'Edit';
        editBtn.style.color = 'blue'; // Blue color for edit button
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('a');
        deleteBtn.className = 'delete secondary-content';
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.style.color = 'red'; // Red color for delete button
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    // Store Task in Local Storage
    function storeTaskInLocalStorage(task, priority) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ task, priority });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Modify Task (Edit or Delete)
    function modifyTask(e) {
        if (e.target.classList.contains('delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                const taskItem = e.target.parentElement;
                taskItem.remove();
                removeTaskFromLocalStorage(taskItem.firstChild.textContent);
            }
        } else if (e.target.classList.contains('edit')) {
            const taskItem = e.target.parentElement;
            const newTaskText = prompt('Edit your task', taskItem.firstChild.textContent);
            if (newTaskText !== null) {
                taskItem.firstChild.textContent = newTaskText;
                updateTaskInLocalStorage(taskItem.firstChild.textContent, newTaskText);
            }
        }
    }

    // Remove Task from Local Storage
    function removeTaskFromLocalStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Update Task in Local Storage
    function updateTaskInLocalStorage(oldText, newText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(t => {
            if (t.task === oldText) {
                t.task = newText;
            }
            return t;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Filter Tasks
    function filterTasks(e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.collection-item').forEach(task => {
            const item = task.firstChild.textContent.toLowerCase();
            task.style.display = item.includes(text) ? 'block' : 'none';
        });
    }

    // Clear Task List
    function clearTaskList() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        localStorage.removeItem('tasks');
    }

    // Submit Feedback
    function submitFeedback(e) {
        alert('Thank you for your feedback!');
        e.preventDefault();
    }

    // Load Stored Tasks from Local Storage
    function loadStoredTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            createTaskElement(task.task, task.priority);
        });
    }

    loadStoredTasks();
});