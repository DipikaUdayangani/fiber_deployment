// Manage Users JavaScript

// Show Add User Modal
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'block';
    document.getElementById('addUserForm').reset();
    clearFormErrors();
}

// Close Add User Modal
function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'none';
    clearFormErrors();
}

// Clear Form Errors
function clearFormErrors() {
    const form = document.getElementById('addUserForm');
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('error');
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
    });
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    clearFormErrors();

    // Required fields validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    const passwordField = form.querySelector('#password');
    const confirmPasswordField = form.querySelector('#confirm_password');
    if (passwordField.value && confirmPasswordField.value) {
        if (passwordField.value.length < 8) {
            showError(passwordField, 'Password must be at least 8 characters long');
            isValid = false;
        }
        if (passwordField.value !== confirmPasswordField.value) {
            showError(confirmPasswordField, 'Passwords do not match');
            isValid = false;
        }
    }

    return isValid;
}

// Show Error Message
function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Edit User
function editUser(userId) {
    // Fetch user data and populate edit form
    fetch(`/admin/users/${userId}/`)
        .then(response => response.json())
        .then(data => {
            // Populate form with user data
            const form = document.getElementById('addUserForm');
            form.querySelector('#employee_number').value = data.employee_number;
            form.querySelector('#first_name').value = data.first_name;
            form.querySelector('#last_name').value = data.last_name;
            form.querySelector('#email').value = data.email;
            form.querySelector('#workgroup').value = data.workgroup;
            form.querySelector('#rtom').value = data.rtom;
            
            // Change form action and add user ID
            form.action = `/admin/users/${userId}/edit/`;
            form.dataset.userId = userId;
            
            // Show modal
            showAddUserModal();
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Error loading user data. Please try again.');
        });
}

// Toggle User Status
function toggleUserStatus(userId) {
    if (confirm('Are you sure you want to change this user\'s status?')) {
        fetch(`/admin/users/${userId}/toggle-status/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI
                const statusBadge = document.querySelector(`tr[data-user-id="${userId}"] .status-badge`);
                const toggleButton = document.querySelector(`tr[data-user-id="${userId}"] .btn-icon i`);
                
                if (data.is_active) {
                    statusBadge.className = 'status-badge active';
                    statusBadge.textContent = 'Active';
                    toggleButton.className = 'fas fa-user-slash';
                } else {
                    statusBadge.className = 'status-badge inactive';
                    statusBadge.textContent = 'Inactive';
                    toggleButton.className = 'fas fa-user-check';
                }
            } else {
                alert('Error updating user status. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error toggling user status:', error);
            alert('Error updating user status. Please try again.');
        });
    }
}

// Delete User
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        fetch(`/admin/users/${userId}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove user row from table
                const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
                userRow.remove();
            } else {
                alert('Error deleting user. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        });
    }
}

// Get CSRF Token
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

// Form Submit Handler
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        const formData = new FormData(this);
        const userId = this.dataset.userId;
        const url = userId ? `/admin/users/${userId}/edit/` : '/admin/users/add/';
        
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeAddUserModal();
                if (userId) {
                    // Update existing user row
                    updateUserRow(userId, data.user);
                } else {
                    // Add new user row
                    addUserRow(data.user);
                }
            } else {
                // Show validation errors
                Object.keys(data.errors).forEach(field => {
                    const input = document.getElementById(field);
                    if (input) {
                        showError(input, data.errors[field].join(', '));
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        });
    }
});

// Update User Row
function updateUserRow(userId, userData) {
    const row = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (row) {
        row.querySelector('td:nth-child(1)').textContent = userData.employee_number;
        row.querySelector('td:nth-child(2)').textContent = `${userData.first_name} ${userData.last_name}`;
        row.querySelector('td:nth-child(3)').textContent = userData.email;
        row.querySelector('td:nth-child(4)').textContent = userData.workgroup;
        
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = `status-badge ${userData.is_active ? 'active' : 'inactive'}`;
        statusBadge.textContent = userData.is_active ? 'Active' : 'Inactive';
    }
}

// Add User Row
function addUserRow(userData) {
    const tbody = document.querySelector('.users-table tbody');
    const row = document.createElement('tr');
    row.dataset.userId = userData.id;
    
    row.innerHTML = `
        <td>${userData.employee_number}</td>
        <td>${userData.first_name} ${userData.last_name}</td>
        <td>${userData.email}</td>
        <td>${userData.workgroup}</td>
        <td>
            <span class="status-badge ${userData.is_active ? 'active' : 'inactive'}">
                ${userData.is_active ? 'Active' : 'Inactive'}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon" onclick="editUser('${userData.id}')" title="Edit User">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="toggleUserStatus('${userData.id}')" title="Toggle Status">
                    <i class="fas ${userData.is_active ? 'fa-user-slash' : 'fa-user-check'}"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteUser('${userData.id}')" title="Delete User">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        clearFormErrors();
    }
} 