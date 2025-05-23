// Edit User Functions
function showEditModal(employeeId, email, workgroup, rtom, status) {
    const modal = document.getElementById('editUserModal');
    document.getElementById('edit_employee_id').value = employeeId;
    document.getElementById('edit_email').value = email;
    document.getElementById('edit_workgroup').value = workgroup;
    document.getElementById('edit_rtom').value = rtom;
    document.getElementById('edit_status').value = status;
    modal.style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Delete User Functions
function showDeleteModal(employeeId) {
    const modal = document.getElementById('deleteUserModal');
    document.getElementById('delete_employee_id').textContent = employeeId;
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteUserModal').style.display = 'none';
}

function confirmDelete() {
    const employeeId = document.getElementById('delete_employee_id').textContent;
    // Add your delete logic here
    console.log(`Deleting user with ID: ${employeeId}`);
    closeDeleteModal();
}

// Form submission handler
document.getElementById('editUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Add your update logic here
    console.log('Updating user:', Object.fromEntries(formData));
    closeEditModal();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    const searchInput = document.getElementById('userSearch');
    const addUserBtn = document.querySelector('.add-user-btn');
    const addUserModal = document.getElementById('addUserModal');
    const closeButtons = document.querySelectorAll('.close');

    searchInput.addEventListener('input', filterUsers);

    // Add User Modal
    addUserBtn.addEventListener('click', function() {
        addUserModal.style.display = 'block';
    });

    // Close button functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Form submission
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        fetch('/admin-panel/users/add/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'User added successfully',
                    icon: 'success'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.error || 'Failed to add user',
                    icon: 'error'
                });
            }
        });
    });
});

function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'block';
}

function closeAddModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'none';
}

function filterUsers() {
    const searchText = document.getElementById('userSearch').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    }
}

// Handle form submission
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('/admin-panel/users/add/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert(data.error);
        }
    });
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
    const modal = document.getElementById('addUserModal');
    if (event.target == modal) {
        closeAddModal();
    }
}