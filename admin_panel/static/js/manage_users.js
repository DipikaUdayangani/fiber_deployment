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

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}