document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const employeeIdInput = document.getElementById('employeeId');
    const userNameInput = document.getElementById('employeeName');
    const userEmailInput = document.getElementById('userEmail');
    const userWorkgroupSelect = document.getElementById('userWorkgroup');
    const userRtomSelect = document.getElementById('userRtom');
    const addNewUserBtn = document.getElementById('addNewUserBtn');
    const usersTableBody = document.getElementById('usersTableBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCancelBtn = document.querySelector('.modal-cancel');
    const userModal = document.getElementById('userModal');
    const searchInput = document.getElementById('userSearchInput');
    const searchBtn = document.getElementById('searchUsersBtn');

    // State
    let users = [];
    let rtoms = [];

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

    // Initialize
    setupEventListeners();
    loadUsers();
    loadRtoms();

    // Event Listeners Setup
    function setupEventListeners() {
        // Add New User button
        if (addNewUserBtn) {
            addNewUserBtn.addEventListener('click', () => {
                modalTitle.textContent = 'Add New User';
                userForm.reset();
                userIdInput.value = ''; // Clear hidden ID
                employeeIdInput.disabled = false;
                populateDropdowns();
                window.openModal('userModal');
            });
        }

        // Form submission
        if (userForm) {
            userForm.addEventListener('submit', handleFormSubmit);
        }

        // Modal close button
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                window.closeModal('userModal');
                userForm.reset();
            });
        }

        // Modal cancel button
        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => {
                window.closeModal('userModal');
                userForm.reset();
            });
        }

        // Close modal when clicking outside
        if (userModal) {
            userModal.addEventListener('click', (e) => {
                if (e.target === userModal) {
                    window.closeModal('userModal');
                    userForm.reset();
                }
            });
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && userModal.classList.contains('active')) {
                window.closeModal('userModal');
                userForm.reset();
            }
        });

        // Search functionality
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => performSearch(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch(searchInput.value);
            });
        }
    }

// Function to populate dropdowns
    function populateDropdowns() {
        populateDropdown(userWorkgroupSelect, workgroupsList);
        populateDropdown(userRtomSelect, rtomsList);
    }

function populateDropdown(selectElement, optionsList) {
        selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
        defaultOption.textContent = `Select ${selectElement.name.replace('user', '').trim()}`;
    selectElement.appendChild(defaultOption);

    optionsList.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

    // Function to load RTOMs from the backend
    async function loadRtoms() {
        try {
            const response = await fetch('/admin-panel/api/rtoms/');
            const data = await response.json();

            if (response.ok) {
                rtoms = data.rtoms;
                populateRtomDropdown();
            } else {
                throw new Error(data.error || 'Failed to load RTOMs');
            }
        } catch (error) {
            console.error('Error loading RTOMs:', error);
            showNotification(error.message || 'Error loading RTOMs', 'error');
        }
    }

    // Function to populate RTOM dropdown
    function populateRtomDropdown() {
        userRtomSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select RTOM';
        userRtomSelect.appendChild(defaultOption);

        rtoms.forEach(rtom => {
            const option = document.createElement('option');
            option.value = rtom.id;
            option.textContent = rtom.name;
            userRtomSelect.appendChild(option);
        });
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        console.log('Form submission started');

        // Get form data
        const formData = {
            first_name: '',
            last_name: '',
            email: userEmailInput.value.trim(),
            workgroup: userWorkgroupSelect.value,
            rtom_id: userRtomSelect.value
        };

        // Split name into first and last name
        const nameParts = userNameInput.value.trim().split(' ');
        formData.first_name = nameParts[0];
        formData.last_name = nameParts.slice(1).join(' ');

        // Only include employee_id for new users
        if (!userIdInput.value) {
            formData.employee_id = employeeIdInput.value.trim();
        }

        console.log('Form data prepared:', formData);

        // Validate required fields
        const requiredFields = {
            'first_name': 'Employee Name',
            'email': 'Email',
            'workgroup': 'Workgroup',
            'rtom_id': 'RTOM'
        };

        if (!userIdInput.value) {
            requiredFields['employee_id'] = 'Employee ID';
        }

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !formData[key])
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            console.log('Validation failed. Missing fields:', missingFields);
            showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        try {
            const isEdit = userIdInput.value !== '';
            const url = isEdit ? 
                `/admin-panel/api/users/${userIdInput.value}/update/` : 
                '/admin-panel/api/users/add/';
            const method = isEdit ? 'PUT' : 'POST';
            
            console.log('Sending request to:', url);
            console.log('Request method:', method);
            console.log('Request data:', formData);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                showNotification(`User ${isEdit ? 'updated' : 'created'} successfully`, 'success');
                window.closeModal('userModal');
                await loadUsers(); // Refresh the users list
            } else {
                throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} user`);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            showNotification(error.message || 'Error saving user', 'error');
        }
    }

    // Load users from the backend
    async function loadUsers() {
        try {
            const response = await fetch('/admin-panel/api/users/list/');
            if (!response.ok) {
                throw new Error('Failed to load users');
            }
            
            const data = await response.json();
            console.log('Loaded users:', data);
            
            if (data.users) {
                users = data.users;
                renderUsersTable(users);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showNotification('Error loading users', 'error');
        }
    }

    // Handle edit button click
    async function handleEditButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const userId = event.currentTarget.dataset.id;
        console.log('Editing user:', userId);
        
        try {
            const response = await fetch(`/admin-panel/api/users/${userId}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            
            const data = await response.json();
            const user = data.user;
            
            // Populate the form with user data
            modalTitle.textContent = 'Edit User';
            userIdInput.value = user.id;
            employeeIdInput.value = user.employee_number;
            employeeIdInput.disabled = true; // Can't change employee ID
            userNameInput.value = `${user.first_name} ${user.last_name}`;
            userEmailInput.value = user.email;
            userWorkgroupSelect.value = user.workgroup;
            userRtomSelect.value = user.rtom_id || '';
            
            // Show the modal
            window.openModal('userModal');
            
        } catch (error) {
            console.error('Error loading user details:', error);
            showNotification('Error loading user details', 'error');
        }
    }

    // Handle delete button click
    async function handleDeleteButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const userId = event.currentTarget.dataset.id;
        console.log('Deleting user:', userId);
        
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`/admin-panel/api/users/${userId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('User deleted successfully', 'success');
                await loadUsers(); // Refresh the users list
            } else {
                throw new Error(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification(error.message || 'Error deleting user', 'error');
        }
    }

    // Render users table
    function renderUsersTable(users) {
        usersTableBody.innerHTML = '';

        if (!users || users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No users found.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.employee_number}</td>
                <td>${user.workgroup_display}</td>
                <td>${user.rtom || 'N/A'}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.status?.toLowerCase() || 'active'}">${user.status_display}</span></td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${user.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${user.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        // Add event listeners to buttons
        usersTableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditButtonClick);
        });
        usersTableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteButtonClick);
        });
    }

    // Search functionality
    function performSearch(query) {
        if (!query) {
            loadUsers();
            return;
        }
        
        const searchTerm = query.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.first_name.toLowerCase().includes(searchTerm) ||
            user.last_name.toLowerCase().includes(searchTerm) ||
            user.employee_number.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.workgroup_display.toLowerCase().includes(searchTerm) ||
            (user.rtom && user.rtom.toLowerCase().includes(searchTerm))
        );
        
        renderUsersTable(filteredUsers);
    }

    // Utility function for notifications
    function showNotification(message, type = 'info') {
        // You can implement a proper notification system here
        // For now, we'll just use alert
        alert(`${type.toUpperCase()}: ${message}`);
    }
});