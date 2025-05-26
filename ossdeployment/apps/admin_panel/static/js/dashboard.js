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
        closeAllModals();
    }
}

// Close button functionality
document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', closeAllModals);
});

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
        signOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }

    // Initialize stat cards animations
    const statCards = document.querySelectorAll('.stat-box');
    
    statCards.forEach(card => {
        // Add hover animation class
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });

    // Function to animate numbers
    function animateValue(element, start, end, duration) {
        if (!element) return;
        
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const timer = setInterval(function() {
            current += increment;
            element.textContent = Math.round(current);
            if (current >= end) {
                element.textContent = end;
                clearInterval(timer);
            }
        }, 16);
    }

    // Animate stat numbers when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-value');
                if (numberElement) {
                    const targetNumber = parseInt(numberElement.textContent) || 0;
                    animateValue(numberElement, 0, targetNumber, 1000);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe stat boxes for animation
    statCards.forEach(card => observer.observe(card));
});

// Logout confirmation function
function showLogoutConfirmation() {
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

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNewProjectForm() {
    Swal.fire({
        title: 'Create New Project',
        html: `
            <form id="newProjectForm">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" id="projectName" class="swal2-input">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="projectDescription" class="swal2-textarea"></textarea>
                </div>
                <div class="form-group">
                    <label>RTOM</label>
                    <select id="projectRtom" class="swal2-select">
                        <option value="">Select RTOM</option>
                        <option value="RTOM1">RTOM 1</option>
                        <option value="RTOM2">RTOM 2</option>
                        <option value="RTOM3">RTOM 3</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Create Project',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
            return {
                name: document.getElementById('projectName').value,
                description: document.getElementById('projectDescription').value,
                rtom: document.getElementById('projectRtom').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            createProject(result.value);
        }
    });
}

function createProject(projectData) {
    fetch('/admin-panel/projects/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify(projectData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Success!', 'Project created successfully', 'success')
            .then(() => {
                location.reload();
            });
        } else {
            Swal.fire('Error!', data.error, 'error');
        }
    });
}