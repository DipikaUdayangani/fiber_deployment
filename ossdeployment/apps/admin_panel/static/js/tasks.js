// Dummy task data
let tasks = [
    { id: 'TASK001', name: 'Site Survey - Colombo', assigned_to: 'John Doe', project: 'Colombo Fiber Network Expansion', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-03-15', attachment: true, status: 'Pending' },
    { id: 'TASK002', name: 'Cable Installation', assigned_to: 'Jane Smith', project: 'Kandy Metro Fiber Project', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM Kandy', deadline: '2024-03-20', attachment: true, status: 'In Progress' },
    { id: 'TASK003', name: 'Network Testing', assigned_to: 'Mike Wilson', project: 'Galle Coastal Network Upgrade', workgroup: 'ACCESS-PLAN', rtom: 'RTOM Galle', deadline: '2024-03-18', attachment: false, status: 'Completed' },
    { id: 'TASK004', name: 'New Fiber Route Planning', assigned_to: 'John Doe', project: 'Jaffna Northern Network', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-04-01', attachment: false, status: 'Pending' },
    { id: 'TASK005', name: 'Splice & Terminate - Kandy', assigned_to: 'Jane Smith', project: 'Kandy Metro Fiber Project', workgroup: 'XXX-ENG-NW', rtom: 'RTOM Kandy', deadline: '2024-04-05', attachment: true, status: 'In Progress' },
];

// Dummy data for dropdowns (replace with actual data fetched from backend)
const assignedToList = [
    'John Doe',
    'Jane Smith',
    'Mike Wilson',
    'User 4',
    'User 5',
];

const projectsList = [
    'Colombo Fiber Network Expansion',
    'Kandy Metro Fiber Project',
    'Galle Coastal Network Upgrade',
    'Jaffna Northern Network',
    'Matara Southern Expansion',
    'Kurunegala Central Network',
    'Anuradhapura Heritage City Project',
    'Trincomalee Port Network',
    'Ratnapura Gem City Network',
    'Badulla Uva Region Project'
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
    if (!tbody) {
        console.error('Tasks table body not found');
        return;
    }

    tbody.innerHTML = ''; // Clear existing rows

    if (tasksToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No tasks found.</td></tr>';
        return;
    }
    
    tasksToRender.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.assigned_to || 'Not Assigned'}</td>
            <td>${task.project || 'N/A'}</td>
            <td>${task.workgroup || 'N/A'}</td>
            <td>${task.rtom || 'N/A'}</td>
            <td>${task.deadline || 'N/A'}</td>
            <td class="attachment-cell">
                ${task.attachment ? '<span class="attachment-icon"><i class="fas fa-file-alt"></i></span>' : 'N/A'}
            </td>
            <td><span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span></td>
            <td class="action-buttons">
                <button type="button" class="edit-btn" data-task-id="${task.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn" data-task-id="${task.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Remove any existing event listeners
    const newTbody = tbody.cloneNode(true);
    tbody.parentNode.replaceChild(newTbody, tbody);

    // Add event delegation for edit/delete buttons
    newTbody.addEventListener('click', async function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const taskId = target.dataset.taskId;
        if (!taskId) return;

        if (target.classList.contains('edit-btn')) {
            e.preventDefault();
            e.stopPropagation();
            await handleEditTaskClick(taskId);
        } else if (target.classList.contains('delete-btn')) {
            e.preventDefault();
            e.stopPropagation();
            await handleDeleteTaskClick(taskId);
        }
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

// Utility functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// API functions
async function fetchTasks() {
    try {
        const response = await fetch('/admin_panel/api/tasks/');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        return data.tasks || [];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Failed to load tasks', 'error');
        return [];
    }
}

async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(`/admin_panel/api/tasks/${taskId}/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error('Failed to update task');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`/admin_panel/api/tasks/${taskId}/delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        if (!response.ok) throw new Error('Failed to delete task');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const editTaskForm = document.getElementById('editTaskForm');
    const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const editModalTitle = document.getElementById('editModalTitle');
    const tasksTableBody = document.getElementById('tasksTableBody');
    const taskModal = document.getElementById('taskModal');
    const editTaskModal = document.getElementById('editTaskModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCancelBtn = document.querySelector('.modal-cancel');

    // Check if required elements exist
    if (!tasksTableBody) {
        console.warn('Tasks table body element not found');
        return;
    }

    if (!editTaskModal) {
        console.warn('Edit task modal element not found');
    }

    // Initialize
    setupEventListeners();
    await loadInitialTasks();

    // Event Listeners Setup
    function setupEventListeners() {
        // Add New Task button
        if (openAddTaskModalBtn) {
            openAddTaskModalBtn.addEventListener('click', () => {
                console.log('Add task button clicked');
                modalTitle.textContent = 'Add New Task';
                taskForm.reset();
                populateDropdowns();
                window.openModal('taskModal');
            });
        }

        // Form submissions
        if (taskForm) {
            taskForm.addEventListener('submit', handleTaskFormSubmit);
        }

        if (editTaskForm) {
            editTaskForm.addEventListener('submit', handleEditTaskFormSubmit);
        }

        // Modal close button
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                window.closeModal('taskModal');
                taskForm.reset();
            });
        }

        // Modal cancel button
        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => {
                window.closeModal('taskModal');
                taskForm.reset();
            });
        }

        // Close modal when clicking outside
        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target === taskModal) {
                    window.closeModal('taskModal');
                    taskForm.reset();
                }
            });
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && taskModal.classList.contains('active')) {
                window.closeModal('taskModal');
                taskForm.reset();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('taskSearchInput');
        const searchBtn = document.getElementById('taskSearchBtn');
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => performSearch(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch(searchInput.value);
            });
        }

        // Tab switching
        document.querySelectorAll('.task-tabs .tab-link').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.task-tabs .tab-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                const status = this.getAttribute('data-status');
                let filteredTasks = tasks;
                if (status !== 'All') {
                    filteredTasks = tasks.filter(task => task.status === status);
                }
                renderTasksTable(filteredTasks);
            });
        });
    }

    // Function to populate dropdowns
    function populateDropdowns() {
        populateDropdown('assignedTo', assignedToList);
        populateDropdown('taskProject', projectsList);
        populateDropdown('taskWorkgroup', workgroupsList);
        populateDropdown('taskRtom', rtomsList);
        
        // Also populate edit form dropdowns
        populateDropdown('editAssignedTo', assignedToList);
        populateDropdown('editTaskProject', projectsList);
        populateDropdown('editTaskWorkgroup', workgroupsList);
        populateDropdown('editTaskRtom', rtomsList);
    }

    // Handle form submission
    async function handleTaskFormSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('taskName').value.trim(),
            assigned_to: document.getElementById('assignedTo').value,
            project: document.getElementById('taskProject').value,
            workgroup: document.getElementById('taskWorkgroup').value,
            rtom: document.getElementById('taskRtom').value,
            deadline: document.getElementById('taskDeadline').value,
            attachment: document.getElementById('taskAttachment').files.length > 0,
            status: 'Pending'
        };

        // Validate required fields
        if (!formData.name || !formData.assigned_to || !formData.project || !formData.workgroup || !formData.rtom || !formData.deadline) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Create new task
            formData.id = 'TASK' + (tasks.length + 1).toString().padStart(3, '0');
            tasks.push(formData);

            showNotification('Task created successfully', 'success');
            window.closeModal('taskModal');
            renderTasksTable();
            updateTabCounts();
        } catch (error) {
            console.error('Error saving task:', error);
            showNotification(error.message || 'Error saving task', 'error');
        }
    }

    // Handle edit form submission
    async function handleEditTaskFormSubmit(e) {
        e.preventDefault();

        const taskId = document.getElementById('editTaskId').value;
        const formData = {
            name: document.getElementById('editTaskName').value.trim(),
            assigned_to_id: document.getElementById('editAssignedTo').value,
            project_id: document.getElementById('editTaskProject').value,
            workgroup: document.getElementById('editTaskWorkgroup').value,
            rtom_id: document.getElementById('editTaskRtom').value,
            deadline: document.getElementById('editTaskDeadline').value,
            status: document.getElementById('editTaskStatus').value
        };

        // Validate required fields
        if (!formData.name || !formData.assigned_to_id || !formData.project_id || 
            !formData.workgroup || !formData.rtom_id || !formData.deadline) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            await updateTask(taskId, formData);
            showNotification('Task updated successfully', 'success');
            window.closeModal('editTaskModal');
            
            // Refresh the tasks list
            const updatedTasks = await fetchTasks();
            tasks = updatedTasks;
            renderTasksTable();
            updateTabCounts();
        } catch (error) {
            showNotification('Failed to update task', 'error');
        }
    }

    // Handle edit button click
    async function handleEditTaskClick(taskId) {
        try {
            // Show loading state
            const editBtn = document.querySelector(`button[data-task-id="${taskId}"].edit-btn`);
            if (editBtn) {
                editBtn.disabled = true;
                editBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            // For now, use dummy data since we don't have the API endpoint
            const taskData = tasks.find(t => t.id === taskId);
            if (!taskData) {
                throw new Error('Task not found');
            }

            // Populate the edit form
            const editForm = document.getElementById('editTaskForm');
            if (!editForm) {
                throw new Error('Edit form not found');
            }

            // Reset form first
            editForm.reset();

            // Set form values
            document.getElementById('editTaskId').value = taskData.id;
            document.getElementById('editTaskName').value = taskData.name;
            document.getElementById('editAssignedTo').value = taskData.assigned_to;
            document.getElementById('editTaskProject').value = taskData.project;
            document.getElementById('editTaskWorkgroup').value = taskData.workgroup;
            document.getElementById('editTaskRtom').value = taskData.rtom;
            document.getElementById('editTaskDeadline').value = taskData.deadline || '';
            document.getElementById('editTaskStatus').value = taskData.status || 'Pending';

            // Populate dropdowns with current values
            populateDropdowns();

            // Update modal title
            const modalTitle = document.getElementById('editModalTitle');
            if (modalTitle) {
                modalTitle.textContent = `Edit Task: ${taskData.name}`;
            }

            // Open the edit modal
            window.openModal('editTaskModal');

        } catch (error) {
            console.error('Error preparing edit form:', error);
            showNotification('Failed to load task details', 'error');
        } finally {
            // Reset button state
            const editBtn = document.querySelector(`button[data-task-id="${taskId}"].edit-btn`);
            if (editBtn) {
                editBtn.disabled = false;
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            }
        }
    }

    // Handle delete button click
    async function handleDeleteTaskClick(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            showNotification('Task not found', 'error');
            return;
        }

        // Create and show custom confirmation dialog
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'modal-overlay active';
        confirmDialog.innerHTML = `
            <div class="modal-container" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>Confirm Delete</h2>
                    <button type="button" class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete the task "${task.name}"?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                    <div class="form-actions">
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(confirmDialog);

        // Show dialog with animation
        confirmDialog.style.display = 'flex';
        setTimeout(() => {
            confirmDialog.style.opacity = '1';
            confirmDialog.querySelector('.modal-container').style.transform = 'translateY(0)';
        }, 10);

        // Handle confirmation
        return new Promise((resolve) => {
            const closeDialog = () => {
                confirmDialog.style.opacity = '0';
                confirmDialog.querySelector('.modal-container').style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    confirmDialog.remove();
                    resolve(false);
                }, 300);
            };

            confirmDialog.querySelector('.modal-close').onclick = closeDialog;
            confirmDialog.querySelector('.modal-cancel').onclick = closeDialog;
            confirmDialog.onclick = (e) => {
                if (e.target === confirmDialog) closeDialog();
            };

            confirmDialog.querySelector('#confirmDeleteBtn').onclick = async () => {
                try {
                    // Show loading state
                    const deleteBtn = document.querySelector(`button[data-task-id="${taskId}"].delete-btn`);
                    if (deleteBtn) {
                        deleteBtn.disabled = true;
                        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    }

                    // For now, just remove from the local array since we don't have the API endpoint
                    tasks = tasks.filter(t => t.id !== taskId);
                    showNotification('Task deleted successfully', 'success');
                    
                    // Update the UI
                    renderTasksTable();
                    updateTabCounts();
                    
                    closeDialog();
                    resolve(true);
                } catch (error) {
                    console.error('Error deleting task:', error);
                    showNotification('Failed to delete task', 'error');
                    resolve(false);
                } finally {
                    // Reset button state
                    const deleteBtn = document.querySelector(`button[data-task-id="${taskId}"].delete-btn`);
                    if (deleteBtn) {
                        deleteBtn.disabled = false;
                        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    }
                }
            };

            // Handle escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape' && confirmDialog.classList.contains('active')) {
                    closeDialog();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    // Search functionality
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
            renderTasksTable();
            return;
        }

        const filteredTasks = tasks.filter(task => 
            task.name.toLowerCase().includes(term) ||
            task.assigned_to.toLowerCase().includes(term) ||
            task.project.toLowerCase().includes(term) ||
            task.workgroup.toLowerCase().includes(term) ||
            task.rtom.toLowerCase().includes(term) ||
            task.id.toLowerCase().includes(term)
        );

        renderTasksTable(filteredTasks);
    }

    // Load initial tasks
    async function loadInitialTasks() {
        try {
            tasks = await fetchTasks();
            renderTasksTable();
            updateTabCounts();
        } catch (error) {
            console.error('Error loading initial tasks:', error);
            showNotification('Failed to load tasks', 'error');
        }
    }
}); 