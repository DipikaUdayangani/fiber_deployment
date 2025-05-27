// Simple modal handling
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // First set display to flex
    modal.style.display = 'flex';
    
    // Force a reflow
    modal.offsetHeight;
    
    // Then add active class
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Remove active class first
    modal.classList.remove('active');
    
    // Wait for transition to complete before hiding
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
        }
    }, 300);
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Separate click handler for modal background
function modalClickHandler(e) {
    if (e.target === this) {
        closeModal(this.id);
    }
}

// Dummy users data
let users = [
    { employee_id: 'EMP001', email: 'user1@slt.lk', workgroup: 'NET-PLAN-TX', rtom: 'RTOM 1', status: 'Active' },
    { employee_id: 'EMP002', email: 'user2@slt.lk', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM 2', status: 'Inactive' },
    { employee_id: 'EMP003', email: 'user3@slt.lk', workgroup: 'NET-PLAN-ACC', rtom: 'RTOM 3', status: 'Active' },
    { employee_id: 'EMP004', email: 'user4@slt.lk', workgroup: 'XXX-RTOM', rtom: 'RTOM 1', status: 'Active' },
];

// Dummy lists for dropdowns
const workgroupsList = [
    'NET-PLAN-TX',
    'LEA-MNG-OPMC',
    'NET-PLAN-ACC',
    'NET-PROJ-ACC-CABLE',
    'XXX-MNG-OPMC',
    'XXX-ENG-NW',
    'NET-PLAN-DRAWING',
    'XXX-RTOM',
];

const rtomsList = [
    'RTOM 1',
    'RTOM 2',
    'RTOM 3',
    'RTOM 4',
];

// Function to render the users table
function renderUsersTable(usersToRender = users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (usersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No users found.</td></tr>';
        return;
    }

    usersToRender.forEach((user, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.employee_id}</td>
            <td>${user.email}</td>
            <td>${user.workgroup}</td>
            <td>${user.rtom}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="openEditUserModal(${idx})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteUser(${idx})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to populate dropdown options
function populateDropdown(selectElementId, optionsList) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Select ' + selectElement.name.replace('add_user_', '').replace('_', ' ') + '</option>';

    optionsList.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial render of the users table
    renderUsersTable();

    // Add New User button click handler
    const openAddUserModalBtn = document.getElementById('openAddUserModalBtn');
    if (openAddUserModalBtn) {
        openAddUserModalBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Reset and prepare the form
            const form = document.getElementById('addUserForm');
            if (form) {
                form.reset();
                populateDropdown('add_user_workgroup', workgroupsList);
                populateDropdown('add_user_rtom', rtomsList);
            }
            
            // Open the modal
            openModal('addUserModal');
        };
    }

    // Add User form submission handler
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.onsubmit = function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Get form data
            const formData = new FormData(this);
            const newUser = {
                employee_id: formData.get('employee_id'),
                email: formData.get('email'),
                workgroup: formData.get('workgroup'),
                rtom: formData.get('rtom'),
                status: formData.get('status')
            };

            // Basic validation
            if (!newUser.workgroup) {
                alert('Please select a Workgroup.');
                return false;
            }
            if (!newUser.rtom) {
                alert('Please select an RTOM.');
                return false;
            }

            // Add the new user
            users.push(newUser);
            renderUsersTable();
            
            // Close modal after successful submission
            closeModal('addUserModal');
            alert('New user added successfully!');
            return false;
        };
    }

    // Close button handlers
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.custom-modal');
            if (modal) {
                closeModal(modal.id);
            }
        };
    });

    // Cancel button handler
    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');
    if (cancelAddUserBtn) {
        cancelAddUserBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal('addUserModal');
        };
    }

    // Close modal when clicking outside
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.onclick = function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        };
    });

    // Prevent clicks inside modal content from closing the modal
    document.querySelectorAll('.modal-content').forEach(content => {
        content.onclick = function(e) {
            e.stopPropagation();
        };
    });

    // Search functionality
    const userSearchInput = document.getElementById('userSearchInput');
    if (userSearchInput) {
        userSearchInput.oninput = function() {
            const searchText = this.value.toLowerCase();
            const filteredUsers = users.filter(user =>
                user.employee_id.toLowerCase().includes(searchText) ||
                user.email.toLowerCase().includes(searchText) ||
                user.workgroup.toLowerCase().includes(searchText) ||
                user.rtom.toLowerCase().includes(searchText) ||
                user.status.toLowerCase().includes(searchText)
            );
            renderUsersTable(filteredUsers);
        };
    }
});

// Edit user modal handler
function openEditUserModal(idx) {
    const user = users[idx];
    const form = document.getElementById('editUserForm');
    if (!form) return;

    // Populate form fields
    form.employee_id.value = user.employee_id;
    form.email.value = user.email;
    form.workgroup.value = user.workgroup;
    form.rtom.value = user.rtom;
    form.status.value = user.status;

    // Store the index
    form.setAttribute('data-user-index', idx);

    // Show the modal
    openModal('editUserModal');
}

// Delete user handler
function deleteUser(idx) {
    if (confirm(`Are you sure you want to delete user ${users[idx].employee_id}?`)) {
        users.splice(idx, 1);
        renderUsersTable();
        alert('User deleted successfully!');
    }
}
