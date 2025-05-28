// Simple modal handling
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal element with ID "${modalId}" not found.`);
        return;
    }
    
    // Prevent any default behaviors
    event?.preventDefault();
    event?.stopPropagation();
    
    // Set display and visibility directly
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    // Add active class
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal element with ID "${modalId}" not found.`);
        return;
    }
    
    // Prevent any default behaviors
    event?.preventDefault();
    event?.stopPropagation();
    
    // Remove active class
    modal.classList.remove('active');
    
    // Set display and visibility after transition
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
        }
    }, 300);
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Dummy task data
let tasks = [
    { id: 'TASK001', name: 'Site Survey - Colombo', assigned_to: 'John Doe', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-03-15', attachment: true, status: 'Pending' },
    { id: 'TASK002', name: 'Cable Installation', assigned_to: 'Jane Smith', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM Kandy', deadline: '2024-03-20', attachment: true, status: 'In Progress' },
    { id: 'TASK003', name: 'Network Testing', assigned_to: 'Mike Wilson', workgroup: 'ACCESS-PLAN', rtom: 'RTOM Galle', deadline: '2024-03-18', attachment: false, status: 'Completed' },
    { id: 'TASK004', name: 'New Fiber Route Planning', assigned_to: 'John Doe', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-04-01', attachment: false, status: 'Pending' },
    { id: 'TASK005', name: 'Splice & Terminate - Kandy', assigned_to: 'Jane Smith', workgroup: 'XXX-ENG-NW', rtom: 'RTOM Kandy', deadline: '2024-04-05', attachment: true, status: 'In Progress' },
];

// Dummy data for dropdowns (replace with actual data fetched from backend)
const assignedToList = [
    'John Doe',
    'Jane Smith',
    'Mike Wilson',
    'User 4',
    'User 5',
];

const workgroupsList = [
    'NET-PLAN-TX',
    'LEA-MNG-OPMC',
    'NET-PLAN-ACC',
    'NET-PROJ-ACC-CABLE',
    'XXX-MNG-OPMC',
    'XXX-ENG-NW',
    'NET-PLAN-DRAWING',
    'XXX-RTOM',
    'ACCESS-PLAN',
];

const rtomsList = [
    'RTOM 1',
    'RTOM 2',
    'RTOM 3',
    'RTOM 4',
    'RTOM Colombo',
    'RTOM Kandy',
    'RTOM Galle',
];

// Function to render the tasks table
function renderTasksTable(tasksToRender = tasks) {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear existing rows

    if (tasksToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No tasks found.</td></tr>';
        return;
    }
    
    tasksToRender.forEach((task, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.assigned_to || 'Not Assigned'}</td>
            <td>${task.workgroup || 'N/A'}</td>
            <td>${task.rtom || 'N/A'}</td>
            <td>${task.deadline || 'N/A'}</td>
            <td class="attachment-cell">
                ${task.attachment ? '<span class="attachment-icon"><i class="fas fa-file-alt"></i></span>' : 'N/A'}
            </td>
            <td><span class="status-badge status-${task.status.replace(/\s+/g, '-')}">${task.status}</span></td>
            <td>
                <button class="action-btn edit" data-index="${idx}" data-tooltip="Edit Task">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete" data-index="${idx}" data-tooltip="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to update tab counts
function updateTabCounts() {
    document.getElementById('allTasksCount').textContent = tasks.length;
    document.getElementById('pendingTasksCount').textContent = tasks.filter(task => task.status === 'Pending').length;
    document.getElementById('inProgressTasksCount').textContent = tasks.filter(task => task.status === 'In Progress').length;
    document.getElementById('completedTasksCount').textContent = tasks.filter(task => task.status === 'Completed').length;
}

// Function to populate dropdown options
function populateDropdown(selectElementId, optionsList) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Store the currently selected value
    const currentValue = selectElement.value;

    selectElement.innerHTML = '<option value="">Select ' + selectElement.name.replace('task_', '').replace('_', ' ') + '</option>';

    optionsList.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentValue) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial render of all tasks and update counts
    renderTasksTable();
    updateTabCounts();

    // Add New Task button click handler
    const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn');
    if (openAddTaskModalBtn) {
        console.log('Found + New Task button. Attaching click listener.');
        openAddTaskModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('+ New Task button clicked!');

            // Reset and prepare the form
            const form = document.getElementById('addTaskForm');
            if (form) {
                form.reset();
                // Populate dropdowns
                populateDropdown('assigned_to', assignedToList);
                populateDropdown('task_workgroup', workgroupsList);
                populateDropdown('task_rtom', rtomsList);
            }

            // Open the modal
            openModal('addTaskModal');
        });
    }

    // Add Task form submission handler
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
            e.stopPropagation();
            console.log('Form submission intercepted');
        
            // Get form data
        const formData = new FormData(this);

            // Basic validation
            if (!formData.get('task_name') || !formData.get('assigned_to') || 
                !formData.get('workgroup') || !formData.get('rtom') || 
                !formData.get('deadline')) {
                alert('Please fill in all required fields.');
                return false;
            }

            // Create new task object
            const newTask = {
                id: 'TASK' + (tasks.length + 1).toString().padStart(3, '0'),
                name: formData.get('task_name'),
                assigned_to: formData.get('assigned_to'),
                workgroup: formData.get('workgroup'),
                rtom: formData.get('rtom'),
                deadline: formData.get('deadline'),
                attachment: formData.get('attachment') && formData.get('attachment').name ? true : false,
                status: 'Pending'
            };

            // Add the new task
            tasks.push(newTask);

            // Update UI
            renderTasksTable();
            updateTabCounts();

            // Close modal and show success message
            closeModal('addTaskModal');
            alert('New task added successfully!');
        });
    }

    // Tab switching logic
    document.querySelectorAll('.task-tabs .tab-link').forEach(tab => {
        tab.onclick = function() {
            // Remove active class from all tabs
            document.querySelectorAll('.task-tabs .tab-link').forEach(link => link.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            const status = this.getAttribute('data-status');
            let filteredTasks = tasks;
            if (status !== 'All') {
                filteredTasks = tasks.filter(task => task.status === status);
            }
            renderTasksTable(filteredTasks);
        };
    });

     // Add event listeners for Edit and Delete buttons (using event delegation)
    document.getElementById('tasksTableBody').addEventListener('click', function(e) {
        const target = e.target.closest('.action-btn');
        if (!target) return;

        const index = target.getAttribute('data-index');
        const task = tasks[index];

        if (target.classList.contains('edit')) {
            // Handle Edit - Open modal and populate form
            console.log('Edit task:', task);
            // Implement opening and populating edit modal here later
             alert('Edit functionality coming soon for Task ID: ' + task.id);

        } else if (target.classList.contains('delete')) {
            // Handle Delete
            if (confirm(`Are you sure you want to delete task ${task.id}?`)) {
                tasks.splice(index, 1);
                renderTasksTable(); // Re-render table
                updateTabCounts(); // Update counts after deletion
                alert('Task deleted (demo only)!');
            }
        }
    });

    // Close button handlers for modals
    document.querySelectorAll('.custom-modal .close-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.custom-modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Cancel button handlers
    document.querySelectorAll('.custom-modal .cancel-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.custom-modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Prevent clicks inside modal content from closing the modal
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Search functionality (basic filtering)
    const taskSearchInput = document.getElementById('taskSearchInput');
    if (taskSearchInput) {
        taskSearchInput.oninput = function() {
            const searchText = this.value.toLowerCase();
            const activeTab = document.querySelector('.task-tabs .tab-link.active').getAttribute('data-status');

            let tasksToSearch = tasks;
            if (activeTab !== 'All') {
                 tasksToSearch = tasks.filter(task => task.status === activeTab);
            }

            const filteredTasks = tasksToSearch.filter(task =>
                Object.values(task).some(value =>
                    value && value.toString().toLowerCase().includes(searchText)
                )
            );
            renderTasksTable(filteredTasks);
        };
    }

    // Dummy data for stat cards (replace with actual counts later)
    // You would fetch total users and active tasks from your backend
    document.getElementById('totalUsersCard').querySelector('.stat-value').textContent = '25'; // Example
    document.getElementById('activeTasksCard').querySelector('.stat-value').textContent = tasks.filter(task => task.status === 'Pending' || task.status === 'In Progress').length; // Example
}); 