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

    // State
    let dummyUsers = [
        { id: 1, name: 'Admin User', employeeId: 'EMP001', email: 'admin.user@example.com', workgroup: 'NET-PLAN-TX', rtom: 'RTOM 1', status: 'Active' },
        { id: 2, name: 'Contractor A', employeeId: 'EMP002', email: 'contractor.a@example.com', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM 2', status: 'Active' },
        { id: 3, name: 'Employee 1', employeeId: 'EMP003', email: 'employee.1@example.com', workgroup: 'NET-PLAN-ACC', rtom: 'RTOM 3', status: 'Inactive' },
        { id: 4, name: 'SLT Manager', employeeId: 'SLTM001', email: 'slt.manager@example.com', workgroup: 'XXX-RTOM', rtom: 'RTOM 1', status: 'Active' },
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
    ];

    const rtomsList = [
        'RTOM 1',
        'RTOM 2',
        'RTOM 3',
        'RTOM 4',
    ];

    // Initialize
    setupEventListeners();
    renderUsersTable();

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
                window.openProjectModal();
            });
        }

        // Form submission
        if (userForm) {
            userForm.addEventListener('submit', handleFormSubmit);
        }

        // Search functionality
        const searchInput = document.getElementById('userSearchInput');
        const searchBtn = document.getElementById('searchUsersBtn');
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

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            id: userIdInput.value,
            name: userNameInput.value.trim(),
            employeeId: employeeIdInput.value.trim(),
            email: userEmailInput.value.trim(),
            workgroup: userWorkgroupSelect.value,
            rtom: userRtomSelect.value,
            status: 'Active' // Default status for new users
        };

        // Validate required fields
        if (!formData.name || !formData.employeeId || !formData.email || !formData.workgroup || !formData.rtom) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (formData.id) {
                // Update existing user
                const index = dummyUsers.findIndex(u => u.id === parseInt(formData.id));
                if (index !== -1) {
                    dummyUsers[index] = { ...dummyUsers[index], ...formData };
                }
            } else {
                // Add new user
                formData.id = dummyUsers.length + 1;
                dummyUsers.push(formData);
            }

            showNotification(`User ${formData.id ? 'updated' : 'created'} successfully`, 'success');
            window.closeProjectModal();
            renderUsersTable();
        } catch (error) {
            console.error('Error saving user:', error);
            showNotification(error.message || 'Error saving user', 'error');
        }
    }

    // Handle edit button click
    function handleEditButtonClick(event) {
        const userId = parseInt(event.currentTarget.dataset.id);
        const userToEdit = dummyUsers.find(user => user.id === userId);

        if (userToEdit) {
            modalTitle.textContent = 'Edit User';
            userIdInput.value = userToEdit.id;
            employeeIdInput.value = userToEdit.employeeId;
            userNameInput.value = userToEdit.name;
            userEmailInput.value = userToEdit.email;
            employeeIdInput.disabled = true;

            populateDropdowns();
            userWorkgroupSelect.value = userToEdit.workgroup || '';
            userRtomSelect.value = userToEdit.rtom || '';

            window.openProjectModal();
        }
    }

    // Handle delete button click
    function handleDeleteButtonClick(event) {
        const userId = parseInt(event.currentTarget.dataset.id);
        if (confirm('Are you sure you want to delete this user?')) {
            dummyUsers = dummyUsers.filter(user => user.id !== userId);
            renderUsersTable();
            showNotification('User deleted successfully', 'success');
        }
    }

    // Render users table
    function renderUsersTable(usersToRender = dummyUsers) {
        usersTableBody.innerHTML = '';

        if (usersToRender.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No users found.</td></tr>';
            return;
        }

        usersToRender.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name || 'N/A'}</td>
                <td>${user.employeeId || 'N/A'}</td>
                <td>${user.workgroup || 'N/A'}</td>
                <td>${user.rtom || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
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
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
            renderUsersTable();
            return;
        }

        const filteredUsers = dummyUsers.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.employeeId.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.workgroup.toLowerCase().includes(term) ||
            user.rtom.toLowerCase().includes(term)
        );

        renderUsersTable(filteredUsers);
    }

    // Utility function for notifications
    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // TODO: Implement proper notification system
    }
});