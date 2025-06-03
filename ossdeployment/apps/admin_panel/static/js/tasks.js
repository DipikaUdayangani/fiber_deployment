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

    // State
    let tasks = [
        { id: 'TASK001', name: 'Site Survey - Colombo', assigned_to: 'John Doe', project: 'Colombo Fiber Network Expansion', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-03-15', attachment: true, status: 'Pending' },
        { id: 'TASK002', name: 'Cable Installation', assigned_to: 'Jane Smith', project: 'Kandy Metro Fiber Project', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM Kandy', deadline: '2024-03-20', attachment: true, status: 'In Progress' },
        { id: 'TASK003', name: 'Network Testing', assigned_to: 'Mike Wilson', project: 'Galle Coastal Network Upgrade', workgroup: 'ACCESS-PLAN', rtom: 'RTOM Galle', deadline: '2024-03-18', attachment: false, status: 'Completed' },
        { id: 'TASK004', name: 'New Fiber Route Planning', assigned_to: 'John Doe', project: 'Jaffna Northern Network', workgroup: 'NET-PLAN-TX', rtom: 'RTOM Colombo', deadline: '2024-04-01', attachment: false, status: 'Pending' },
        { id: 'TASK005', name: 'Splice & Terminate - Kandy', assigned_to: 'Jane Smith', project: 'Kandy Metro Fiber Project', workgroup: 'XXX-ENG-NW', rtom: 'RTOM Kandy', deadline: '2024-04-05', attachment: true, status: 'In Progress' },
    ];

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

    // Initialize
    setupEventListeners();
    renderTasksTable();
    updateTabCounts();

    // Event Listeners Setup
    function setupEventListeners() {
        // Add New Task button
    if (openAddTaskModalBtn) {
            openAddTaskModalBtn.addEventListener('click', () => {
                modalTitle.textContent = 'Add New Task';
                taskForm.reset();
                populateDropdowns();
                window.openProjectModal();
        });
    }

        // Form submissions
        if (taskForm) {
            taskForm.addEventListener('submit', handleTaskFormSubmit);
        }

        if (editTaskForm) {
            editTaskForm.addEventListener('submit', handleEditTaskFormSubmit);
        }

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
            window.closeProjectModal();
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
            window.closeProjectModal();
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
            window.openProjectModal();
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

    // Render tasks table
    function renderTasksTable(tasksToRender = tasks) {
        tasksTableBody.innerHTML = '';

        if (tasksToRender.length === 0) {
            tasksTableBody.innerHTML = '<tr><td colspan="10" class="text-center">No tasks found.</td></tr>';
            return;
        }

        tasksToRender.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.name || 'N/A'}</td>
                <td>${task.assigned_to || 'N/A'}</td>
                <td>${task.project || 'N/A'}</td>
                <td>${task.workgroup || 'N/A'}</td>
                <td>${task.rtom || 'N/A'}</td>
                <td>${task.deadline || 'N/A'}</td>
                <td class="attachment-cell">
                    ${task.attachment ? '<span class="attachment-icon"><i class="fas fa-file-alt"></i></span>' : 'N/A'}
                </td>
                <td><span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span></td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${task.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${task.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tasksTableBody.appendChild(row);
        });

        // Add event listeners to buttons
        tasksTableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditButtonClick);
        });
        tasksTableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteButtonClick);
        });
    }

    // Update tab counts
    function updateTabCounts() {
        document.getElementById('allTasksCount').textContent = tasks.length;
        document.getElementById('pendingTasksCount').textContent = tasks.filter(task => task.status === 'Pending').length;
        document.getElementById('inProgressTasksCount').textContent = tasks.filter(task => task.status === 'In Progress').length;
        document.getElementById('completedTasksCount').textContent = tasks.filter(task => task.status === 'Completed').length;
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

    // Dummy data for stat cards (replace with actual counts later)
    // You would fetch total users and active tasks from your backend
    document.getElementById('totalUsersCard').querySelector('.stat-value').textContent = '25'; // Example
    document.getElementById('activeTasksCard').querySelector('.stat-value').textContent = tasks.filter(task => task.status === 'Pending' || task.status === 'In Progress').length; // Example
}); 

// Update the edit modal HTML as well
document.getElementById('editTaskModal').querySelector('.modal-body').innerHTML = `
    <form id="editTaskForm" class="modal-form">
        <input type="hidden" id="editTaskId" name="taskId">
        <div class="form-group">
            <label for="editTaskName">Task Name <span class="required">*</span></label>
            <select id="editTaskName" name="taskName" required>
                <option value="">Select Task</option>
                <option value="SPECIFY DESIGN DETAILS">SPECIFY DESIGN DETAILS</option>
                <option value="APPROVE PE">APPROVE PE</option>
                <option value="SURVEY FIBER ROUTE">SURVEY FIBER ROUTE</option>
                <option value="ASSIGN WORK">ASSIGN WORK</option>
                <option value="DRAW FIBER">DRAW FIBER</option>
                <option value="SPLICE & TERMINATE">SPLICE & TERMINATE</option>
                <option value="UPLOAD FIBER_IN_OSS">UPLOAD FIBER_IN_OSS</option>
                <option value="CONDUCT FIBER_PAT">CONDUCT FIBER_PAT</option>
                <option value="UPLOAD DRAWING">UPLOAD DRAWING</option>
                <option value="UPDATE MASTER DWG">UPDATE MASTER DWG</option>
                <option value="CLOSE EVENT">CLOSE EVENT</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editAssignedTo">Assign To <span class="required">*</span></label>
            <select id="editAssignedTo" name="assignedTo" required>
                <option value="">Select Employee</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editTaskProject">Project <span class="required">*</span></label>
            <select id="editTaskProject" name="taskProject" required>
                <option value="">Select Project</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editTaskWorkgroup">Workgroup <span class="required">*</span></label>
            <select id="editTaskWorkgroup" name="taskWorkgroup" required>
                <option value="">Select Workgroup</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editTaskRtom">RTOM <span class="required">*</span></label>
            <select id="editTaskRtom" name="taskRtom" required>
                <option value="">Select RTOM</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editTaskDeadline">Deadline <span class="required">*</span></label>
            <input type="date" id="editTaskDeadline" name="taskDeadline" required>
        </div>
        <div class="form-group">
            <label for="editTaskAttachment">Attachment (PDF/Other)</label>
            <input type="file" id="editTaskAttachment" name="taskAttachment" accept=".pdf, image/*, .doc, .docx">
            <small>Maximum file size: 5MB</small>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
        </div>
    </form>
`; 