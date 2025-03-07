function showTotalUsersModal() {
    const modal = document.getElementById('totalUsersModal');
    modal.style.display = 'block';
    loadUserData();
}

function showActiveTasksModal() {
    const modal = document.getElementById('activeTasksModal');
    modal.style.display = 'block';
    loadTaskData();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function loadUserData() {
    // Example data - replace with actual API call
    const users = [
        { name: 'John Doe', empId: 'EMP001', workgroup: 'NET-PLAN-TX', status: 'Active', lastActive: '2024-03-07 09:30' },
        { name: 'Jane Smith', empId: 'EMP002', workgroup: 'LEA-MNG-OPMC', status: 'Active', lastActive: '2024-03-07 10:15' }
    ];
    
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.empId}</td>
            <td>${user.workgroup}</td>
            <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td>${user.lastActive}</td>
        </tr>
    `).join('');
}

function loadTaskData() {
    // Example data - replace with actual API call
    const tasks = [
        { name: 'Site Survey', assignedTo: 'John Doe', workgroup: 'NET-PLAN-TX', deadline: '2024-03-15', status: 'In Progress' },
        { name: 'Cable Installation', assignedTo: 'Jane Smith', workgroup: 'LEA-MNG-OPMC', deadline: '2024-03-20', status: 'Pending' }
    ];
    
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.name}</td>
            <td>${task.assignedTo}</td>
            <td>${task.workgroup}</td>
            <td>${task.deadline}</td>
            <td><span class="status-badge status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
        </tr>
    `).join('');
}

function openTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'block';
    // Reset form
    document.getElementById('taskForm').reset();
    // Load employees and RTOMs based on selected workgroup
    loadEmployees();
    loadRTOMs();
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
}

function loadEmployees() {
    // Dummy data - replace with actual API call
    const employees = [
        { id: 'EMP001', name: 'John Doe' },
        { id: 'EMP002', name: 'Jane Smith' },
        { id: 'EMP003', name: 'Mike Johnson' }
    ];

    const select = document.querySelector('select[name="assignTo"]');
    select.innerHTML = '<option value="">Select Employee</option>' +
        employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('');
}

function loadRTOMs() {
    // Dummy data - replace with actual API call
    const rtoms = [
        'RTOM Colombo Metro',
        'RTOM Western North',
        'RTOM Western South',
        'RTOM Central',
        'RTOM North Central'
    ];

    const select = document.querySelector('select[name="rtom"]');
    select.innerHTML = '<option value="">Select RTOM</option>' +
        rtoms.map(rtom => `<option value="${rtom}">${rtom}</option>`).join('');
}

// Form submission handler
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const taskData = Object.fromEntries(formData);
    
    // Validate form
    if (!validateTaskForm(taskData)) {
        return;
    }
    
    // Add task to table
    addTaskToTable(taskData);
    
    // Close modal
    closeTaskModal();
});

function validateTaskForm(data) {
    const requiredFields = ['taskName', 'assignTo', 'workgroup', 'rtom', 'deadline'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        if (!data[field]) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return false;
    }
    
    return true;
}

function addTaskToTable(taskData) {
    const tbody = document.querySelector('.tasks-table tbody');
    const taskId = generateTaskId();
    
    const row = document.createElement('tr');
    row.setAttribute('data-task-id', taskId);
    row.innerHTML = `
        <td>${taskId}</td>
        <td>${taskData.taskName}</td>
        <td>${taskData.assignTo}</td>
        <td>${taskData.workgroup}</td>
        <td>${taskData.rtom}</td>
        <td><span class="status-badge pending">Pending</span></td>
        <td class="actions">
            <button class="action-btn edit" onclick="openEditTaskModal('${taskId}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="openDeleteTaskModal('${taskId}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

function generateTaskId() {
    return 'TASK' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// Event listener for workgroup change
document.querySelector('select[name="workgroup"]').addEventListener('change', function() {
    loadEmployees(); // Reload employees based on selected workgroup
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Close button handler
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
});

// Edit Task Functions
function openEditTaskModal(taskId) {
    const modal = document.getElementById('editTaskModal');
    const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
    
    // Get task data from the row
    const taskData = {
        taskId: taskId,
        taskName: row.cells[1].textContent,
        assignTo: row.cells[2].textContent,
        workgroup: row.cells[3].textContent,
        rtom: row.cells[4].textContent,
        status: row.querySelector('.status-badge').textContent
    };
    
    // Populate form fields
    document.getElementById('editTaskId').value = taskData.taskId;
    document.getElementById('editTaskName').value = taskData.taskName;
    document.getElementById('editAssignTo').value = taskData.assignTo;
    document.getElementById('editWorkgroup').value = taskData.workgroup;
    document.getElementById('editRTOM').value = taskData.rtom;
    document.getElementById('editStatus').value = taskData.status.toLowerCase();
    
    modal.style.display = 'block';
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').style.display = 'none';
}

// Delete Task Functions
function openDeleteTaskModal(taskId) {
    const modal = document.getElementById('deleteTaskModal');
    const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
    const taskName = row.cells[1].textContent;
    
    document.getElementById('deleteTaskId').value = taskId;
    document.getElementById('deleteTaskName').textContent = taskName;
    
    modal.style.display = 'block';
}

function closeDeleteTaskModal() {
    document.getElementById('deleteTaskModal').style.display = 'none';
}

function confirmDeleteTask() {
    const taskId = document.getElementById('deleteTaskId').value;
    const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
    if (row) {
        row.remove();
    }
    closeDeleteTaskModal();
}

// Form submission handler for edit task
document.getElementById('editTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const taskData = Object.fromEntries(formData);
    
    // Validate form
    if (!validateTaskForm(taskData)) {
        return;
    }
    
    // Update task in table
    updateTaskInTable(taskData);
    
    closeEditTaskModal();
});

function updateTaskInTable(taskData) {
    const row = document.querySelector(`tr[data-task-id="${taskData.taskId}"]`);
    if (row) {
        row.innerHTML = `
            <td>${taskData.taskId}</td>
            <td>${taskData.taskName}</td>
            <td>${taskData.assignTo}</td>
            <td>${taskData.workgroup}</td>
            <td>${taskData.rtom}</td>
            <td><span class="status-badge ${taskData.status}">${taskData.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="openEditTaskModal('${taskData.taskId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="openDeleteTaskModal('${taskData.taskId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    }
}

// Helper function to get task data (implement with your data source)
function getTaskById(taskId) {
    // Replace this with actual data retrieval
    return {
        id: taskId,
        name: 'Sample Task',
        assignTo: 'John Doe',
        workgroup: 'NET-PLAN-TX',
        rtom: 'RTOM 1',
        status: 'pending'
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for edit form submission
    document.getElementById('editTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const taskData = Object.fromEntries(formData);
        
        // Update the row in the table
        const row = document.querySelector(`tr[data-task-id="${taskData.taskId}"]`);
        if (row) {
            row.cells[1].textContent = taskData.taskName;
            row.cells[2].textContent = taskData.assignTo;
            row.cells[3].textContent = taskData.workgroup;
            row.cells[4].textContent = taskData.rtom;
            row.querySelector('.status-badge').textContent = taskData.status;
            row.querySelector('.status-badge').className = `status-badge ${taskData.status}`;
        }
        
        closeEditTaskModal();
    });
});

// Sample task data
const tasks = [
    {
        id: 'TASK001',
        name: 'Site Survey - Colombo',
        assignedTo: 'John Doe',
        workgroup: 'NET-PLAN-TX',
        rtom: 'RTOM Colombo',
        status: 'pending',
        priority: 'High'
    },
    {
        id: 'TASK002',
        name: 'Cable Installation - Kandy',
        assignedTo: 'Jane Smith',
        workgroup: 'ACCESS-PLAN',
        rtom: 'RTOM Central',
        status: 'progress',
        priority: 'Medium'
    },
    {
        id: 'TASK003',
        name: 'Network Testing - Galle',
        assignedTo: 'Mike Wilson',
        workgroup: 'LEA-MNG-OPMC',
        rtom: 'RTOM Southern',
        status: 'completed',
        priority: 'Low'
    }
    // Add more dummy tasks as needed
];

// Initialize task filtering
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter tasks
            filterTasks(button.dataset.status);
        });
    });

    // Initial load of all tasks
    filterTasks('all');
    updateTaskCounts();
});

function filterTasks(status) {
    const filteredTasks = status === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === status);

    const tbody = document.querySelector('.tasks-table tbody');
    tbody.innerHTML = filteredTasks.map(task => `
        <tr data-task-id="${task.id}">
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.assignedTo}</td>
            <td>${task.workgroup}</td>
            <td>${task.rtom}</td>
            <td><span class="status-badge ${task.status}">${task.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="openEditTaskModal('${task.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="openDeleteTaskModal('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateTaskCounts() {
    const counts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        progress: tasks.filter(t => t.status === 'progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
    };

    document.querySelectorAll('.filter-btn').forEach(button => {
        const status = button.dataset.status;
        const countSpan = button.querySelector('.task-count');
        if (countSpan) {
            countSpan.textContent = counts[status] || 0;
        }
    });
}

// Update task counts when tasks are added/edited/deleted
function refreshTasksView() {
    const activeFilter = document.querySelector('.filter-btn.active');
    filterTasks(activeFilter.dataset.status);
    updateTaskCounts();
}

