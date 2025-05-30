// Simple modal handling
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'flex';
    // Use a slight delay to allow display: flex to take effect before adding active class for transition
    setTimeout(() => {
        modal.classList.add('active');
         // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');

    // Wait for the CSS transition to complete before setting display to none
    modal.addEventListener('transitionend', function handler() {
         // Check if the modal is actually not active before hiding to prevent issues if opened again quickly
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
             // Restore body scrolling
            document.body.style.overflow = 'auto';
        }
        // Remove the event listener after it runs once
        modal.removeEventListener('transitionend', handler);
    });

     // Fallback in case transitionend doesn't fire (e.g., no transition defined or js error)
    // If modal is not active after a short delay, hide it and restore scroll
     setTimeout(() => {
         if (!modal.classList.contains('active')) {
             modal.style.display = 'none';
             document.body.style.overflow = 'auto';
         }
     }, 300); // Match or exceed your CSS transition duration
}

// Separate click handler for modal background
function modalClickHandler(e) {
    if (e.target === this) {
        closeModal(this.id);
    }
}

// Dummy data
let dummyUsers = [
    { id: 1, employeeId: 'EMP001', name: 'Admin User', email: 'admin.user@example.com', workgroup: 'NET-PLAN-TX', rtom: 'RTOM 1', status: 'Active' },
    { id: 2, employeeId: 'EMP002', name: 'Contractor A', email: 'contractor.a@example.com', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM 2', status: 'Active' },
    { id: 3, employeeId: 'EMP003', name: 'Employee 1', email: 'employee.1@example.com', workgroup: 'NET-PLAN-ACC', rtom: 'RTOM 3', status: 'Inactive' },
    { id: 4, employeeId: 'SLTM001', name: 'SLT Manager', email: 'slt.manager@example.com', workgroup: 'XXX-RTOM', rtom: 'RTOM 1', status: 'Active' },
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

// Get modal elements
const userModal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const employeeIdInput = document.getElementById('employeeId');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userWorkgroupSelect = document.getElementById('userWorkgroup');
const userRtomSelect = document.getElementById('userRtom');
// const userStatusSelect = document.getElementById('userStatus'); // Uncomment if adding status to modal

// Get button to open add modal
const addNewUserBtn = document.getElementById('addNewUserBtn');

// Get table body
const usersTableBody = document.getElementById('usersTableBody');

// Function to populate dropdowns
function populateDropdown(selectElement, optionsList) {
    selectElement.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `Select ${selectElement.id.replace('user', '').replace('Select', '')}`; // Generate placeholder text
    selectElement.appendChild(defaultOption);

    optionsList.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

// Function to render the users table
function renderUsersTable() {
    usersTableBody.innerHTML = ''; // Clear existing rows
    dummyUsers.forEach(user => {
        const row = usersTableBody.insertRow();
        row.innerHTML = `
            <td>${user.employeeId}</td>
            <td>${user.email}</td>
            <td>${user.workgroup}</td>
            <td>${user.rtom}</td>
            <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });

    // Add event listeners to the new edit and delete buttons
    usersTableBody.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditButtonClick);
    });

    usersTableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteButtonClick);
    });
}

// Handle click on Add New User button
addNewUserBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New User';
    userForm.reset();
    userIdInput.value = ''; // Clear hidden ID
    // Populate dropdowns for add form
    populateDropdown(userWorkgroupSelect, workgroupsList);
    populateDropdown(userRtomSelect, rtomsList);
    // if (userStatusSelect) userStatusSelect.value = ''; // Reset status if in modal
    openModal('userModal');
});

// Handle click on Edit button
function handleEditButtonClick(event) {
    const userId = parseInt(event.currentTarget.dataset.id);
    const userToEdit = dummyUsers.find(user => user.id === userId);

    if (userToEdit) {
        modalTitle.textContent = 'Edit User';
        userIdInput.value = userToEdit.id;
        employeeIdInput.value = userToEdit.employeeId;
        userNameInput.value = userToEdit.name;
        userEmailInput.value = userToEdit.email;
        // Populate dropdowns and set current value
        populateDropdown(userWorkgroupSelect, workgroupsList);
        userWorkgroupSelect.value = userToEdit.workgroup;
        populateDropdown(userRtomSelect, rtomsList);
        userRtomSelect.value = userToEdit.rtom;
        // if (userStatusSelect) userStatusSelect.value = userToEdit.status; // Set status if in modal
        openModal('userModal');
    }
}

// Handle click on Delete button
function handleDeleteButtonClick(event) {
    const userId = parseInt(event.currentTarget.dataset.id);
    if (confirm('Are you sure you want to delete this user?')) {
        dummyUsers = dummyUsers.filter(user => user.id !== userId);
        renderUsersTable(); // Re-render table after deletion
        console.log(`User with ID ${userId} deleted.`);
    }
}

// Handle form submission (Add/Edit User)
userForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const userId = userIdInput.value;
    const employeeId = employeeIdInput.value.trim();
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userWorkgroup = userWorkgroupSelect.value;
    const userRtom = userRtomSelect.value;
    // const userStatus = userStatusSelect ? userStatusSelect.value : 'Active'; // Get status if in modal, default to Active
    const userStatus = 'Active'; // Default status if not in modal form

    if (!employeeId || !userName || !userEmail || !userWorkgroup || !userRtom) {
        alert('Please fill in all required fields.');
        return;
    }

    if (userId) { // Editing existing user
        dummyUsers = dummyUsers.map(user =>
            user.id === parseInt(userId) ? { ...user, employeeId, name: userName, email: userEmail, workgroup: userWorkgroup, rtom: userRtom, status: userStatus } : user
        );
        console.log(`User with ID ${userId} updated.`);
    } else { // Adding new user
        // Simple check for unique employee ID for dummy data
        if (dummyUsers.some(user => user.employeeId === employeeId)) {
            alert(`User with Employee ID ${employeeId} already exists.`);
            return;
        }
        const newUser = {
            id: Date.now(), // Simple unique ID
            employeeId,
            name: userName,
            email: userEmail,
            workgroup: userWorkgroup,
            rtom: userRtom,
            status: userStatus,
        };
        dummyUsers.push(newUser);
        console.log('New user added:', newUser);
    }

    renderUsersTable(); // Re-render table after add/edit
    closeModal('userModal');
});

// Close modal when clicking outside the modal content
userModal.addEventListener('click', (event) => {
    if (event.target === userModal) {
        closeModal('userModal');
    }
});

// Initial render of the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderUsersTable();
    // Populate dropdowns initially if the modal is present on page load (though it's hidden)
    // populateDropdown(userWorkgroupSelect, workgroupsList);
    // populateDropdown(userRtomSelect, rtomsList);

    // Add event listener to stop propagation on modal content clicks
    const modalContent = userModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent clicks inside content from bubbling up
        });
    }
});

// Basic Search functionality (Optional)
const userSearchInput = document.getElementById('userSearchInput');
const searchUsersBtn = document.getElementById('searchUsersBtn');

function performSearch() {
    const searchTerm = userSearchInput.value.toLowerCase();
    const filteredUsers = dummyUsers.filter(user =>
        user.employeeId.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.workgroup.toLowerCase().includes(searchTerm) ||
        user.rtom.toLowerCase().includes(searchTerm) ||
        user.status.toLowerCase().includes(searchTerm)
    );
    renderUsersTableFiltered(filteredUsers);
}

function renderUsersTableFiltered(filteredUsers) {
     usersTableBody.innerHTML = ''; // Clear existing rows
    filteredUsers.forEach(user => {
        const row = usersTableBody.insertRow();
        row.innerHTML = `
            <td>${user.employeeId}</td>
            <td>${user.email}</td>
            <td>${user.workgroup}</td>
            <td>${user.rtom}</td>
            <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });

    // Add event listeners to the new edit and delete buttons on filtered results
    usersTableBody.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditButtonClick);
    });

    usersTableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteButtonClick);
    });
}

searchUsersBtn.addEventListener('click', performSearch);
userSearchInput.addEventListener('input', performSearch); // Live search as user types
