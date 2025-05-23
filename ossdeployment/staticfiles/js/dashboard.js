function showProjects() {
    document.getElementById('projectsModal').style.display = 'block';
}

function closeProjectsModal() {
    document.getElementById('projectsModal').style.display = 'none';
}

function showAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'block';
}

function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
}

// User Modal Functions
function showUsersModal() {
    document.getElementById('usersModal').style.display = 'block';
}

function closeUsersModal() {
    document.getElementById('usersModal').style.display = 'none';
}

function showUserProfileModal() {
    document.getElementById('userProfileModal').style.display = 'block';
}

function closeUserProfileModal() {
    document.getElementById('userProfileModal').style.display = 'none';
}

// Task Modal Functions
function showTasksModal() {
    document.getElementById('tasksModal').style.display = 'block';
}

function closeTasksModal() {
    document.getElementById('tasksModal').style.display = 'none';
}

// Form submission handling
document.getElementById('addProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate required fields
    const required = ['projectName', 'sltRef', 'contractNo', 'projectNo'];
    let isValid = true;
    
    required.forEach(field => {
        if (!document.getElementById(field).value) {
            isValid = false;
            document.getElementById(field).classList.add('error');
        } else {
            document.getElementById(field).classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Add your form submission logic here
    
    closeAddProjectModal();
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        const modals = ['projectsModal', 'addProjectModal', 'usersModal', 'tasksModal', 'userProfileModal'];
        modals.forEach(modalId => {
            document.getElementById(modalId).style.display = 'none';
        });
    }
}

// Initialize data tables when modals open
function loadUserData() {
    const userTableBody = document.querySelector('#usersModal tbody');
    const users = [
        { name: 'John Doe', empId: 'EMP001', workgroup: 'NET-PLAN', status: 'Active' },
        { name: 'Jane Smith', empId: 'EMP002', workgroup: 'LEA-MNG', status: 'Active' }
        // Add more user data as needed
    ];

    userTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.empId}</td>
            <td>${user.workgroup}</td>
            <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
        </tr>
    `).join('');
}

function loadTaskData() {
    const taskTableBody = document.querySelector('#tasksModal tbody');
    const tasks = [
        { name: 'Site Survey', project: 'Project A', assignedTo: 'John Doe', status: 'In Progress' },
        { name: 'Cable Installation', project: 'Project B', assignedTo: 'Jane Smith', status: 'Pending' }
        // Add more task data as needed
    ];

    taskTableBody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.name}</td>
            <td>${task.project}</td>
            <td>${task.assignedTo}</td>
            <td><span class="status-badge ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
        </tr>
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // User card click handler
    const userCard = document.querySelector('.card.users');
    if (userCard) {
        userCard.onclick = function() {
            showUsersModal();
            loadUserData();
        };
    }

    // Task card click handler
    const taskCard = document.querySelector('.card.tasks');
    if (taskCard) {
        taskCard.onclick = function() {
            showTasksModal();
            loadTaskData();
        };
    }

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });
});

// Logout Modal Functions
let isModalOpen = false;

function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
    
    // Trigger reflow
    modal.offsetHeight;
    
    modal.classList.add('show');
    isModalOpen = true;
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300); // Match transition duration
    
    isModalOpen = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('logoutModal');
        if (event.target === modal && isModalOpen) {
            closeLogoutModal();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isModalOpen) {
            closeLogoutModal();
        }
    });

    // Prevent form resubmission
    const logoutForm = document.querySelector('#logoutModal form');
    if (logoutForm) {
        logoutForm.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            }
        });
    }
});

// Handle browser back button
window.addEventListener('popstate', function() {
    if (isModalOpen) {
        closeLogoutModal();
    }
});