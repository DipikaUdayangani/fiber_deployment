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
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear existing rows

    if (tasksToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No tasks found.</td></tr>';
        return;
    }
    
    tasksToRender.forEach((task, idx) => {
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
            <td><span class="status-badge status-${task.status.replace(/\s+/g, '-')}">${task.status}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${task.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${task.id}" title="Delete"><i class="fas fa-trash"></i></button>
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
    renderTasksTable();
    updateTabCounts();

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
            assigned_to: document.getElementById('editAssignedTo').value,
            project: document.getElementById('editTaskProject').value,
            workgroup: document.getElementById('editTaskWorkgroup').value,
            rtom: document.getElementById('editTaskRtom').value,
            deadline: document.getElementById('editTaskDeadline').value,
            attachment: document.getElementById('editTaskAttachment').files.length > 0
        };

        // Validate required fields
        if (!formData.name || !formData.assigned_to || !formData.project || !formData.workgroup || !formData.rtom || !formData.deadline) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Update existing task
            const index = tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...formData };
            }

            showNotification('Task updated successfully', 'success');
            window.closeModal('taskModal');
            renderTasksTable();
        } catch (error) {
            console.error('Error updating task:', error);
            showNotification(error.message || 'Error updating task', 'error');
        }
    }

    // Handle edit button click
    function handleEditButtonClick(event) {
        const taskId = event.currentTarget.dataset.id;
        const taskToEdit = tasks.find(task => task.id === taskId);

        if (taskToEdit) {
            editModalTitle.textContent = 'Edit Task';
            document.getElementById('editTaskId').value = taskToEdit.id;
            document.getElementById('editTaskName').value = taskToEdit.name;
            document.getElementById('editAssignedTo').value = taskToEdit.assigned_to;
            document.getElementById('editTaskProject').value = taskToEdit.project;
            document.getElementById('editTaskWorkgroup').value = taskToEdit.workgroup;
            document.getElementById('editTaskRtom').value = taskToEdit.rtom;
            document.getElementById('editTaskDeadline').value = taskToEdit.deadline;

            populateDropdowns();
            window.openModal('editTaskModal');
        }
    }

    // Handle delete button click
    function handleDeleteButtonClick(event) {
        const taskId = event.currentTarget.dataset.id;
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            renderTasksTable();
            updateTabCounts();
            showNotification('Task deleted successfully', 'success');
        }
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

    // Utility function for notifications
    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // TODO: Implement proper notification system
    }
}); 