document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const completionMessage = document.getElementById('completionMessage');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Initial state check
    updateProgress();

    // Event Delegation
    taskList.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');

        // Handle Delete Button Click
        if (e.target.closest('.delete-btn')) {
            e.stopPropagation(); // Avoid triggering the item click
            deleteTask(item);
            return;
        }

        // Handle Task Toggle
        if (item) {
            toggleTask(item);
        }
    });

    // Add Task Button Click
    addTaskBtn.addEventListener('click', () => {
        addNewTask();
    });

    // Add Task on Enter Key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });

    function toggleTask(item) {
        // Toggle completed class
        item.classList.toggle('completed');

        // Add a little pop animation
        item.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });

        updateProgress();
    }

    function deleteTask(item) {
        // Fade out animation
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';

        setTimeout(() => {
            item.remove();
            updateProgress();
        }, 200);
    }

    function addNewTask() {
        const text = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (text === '') return;

        const li = document.createElement('li');
        li.className = `task-item priority-${priority}`;
        // Simple ID generation
        const id = Date.now();
        li.dataset.id = id;

        li.innerHTML = `
            <span class="checkbox"></span>
            <span class="text">${escapeHtml(text)}</span>
            <button class="delete-btn" aria-label="削除">×</button>
        `;

        // Add animation for insertion
        li.style.opacity = '0';
        li.style.transform = 'translateY(10px)';

        // Insert at the top based on priority logic? Or just append?
        // Let's prepend to make it more obvious
        taskList.prepend(li);

        // Animate in
        requestAnimationFrame(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        });

        taskInput.value = '';
        taskInput.focus();

        updateProgress();
    }

    function updateProgress() {
        const taskItems = document.querySelectorAll('.task-item');
        const total = taskItems.length;
        const completed = document.querySelectorAll('.task-item.completed').length;

        // Prevent division by zero
        const percentage = total === 0 ? 0 : (completed / total) * 100;

        progressBar.style.width = `${percentage}%`;

        if (total > 0 && percentage === 100) {
            if (completionMessage.classList.contains('hidden')) {
                completionMessage.classList.remove('hidden');
                triggerConfettiEffect();
            }
        } else {
            completionMessage.classList.add('hidden');
        }
    }

    function triggerConfettiEffect() {
        const header = document.querySelector('h1');
        header.animate([
            { filter: 'hue-rotate(0deg)' },
            { filter: 'hue-rotate(360deg)' }
        ], {
            duration: 1000,
            iterations: 1
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
