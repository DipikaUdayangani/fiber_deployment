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

    // Handle user profile modal
    const userProfileBtn = document.querySelector('.user-avatar-btn');
    const userProfileModal = document.getElementById('userProfileModal');
    
    if (userProfileBtn && userProfileModal) {
        userProfileBtn.addEventListener('click', () => {
            userProfileModal.style.display = 'block';
        });
    }

    // Handle logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    }

    const signOutBtn = document.querySelector('.signout-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', showLogoutConfirmation);
    }
});

function showLogoutConfirmation(event) {
    event.preventDefault();
    
    Swal.fire({
        title: 'Sign Out',
        text: 'Are you sure you want to sign out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, sign out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById('logoutForm');
            if (form) {
                form.submit();
            }
        }
    });
}