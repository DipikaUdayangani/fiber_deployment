// Utility to open/close modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Optional: Add a slight delay before removing display: none to ensure animation plays
        // setTimeout(() => { modal.style.display = 'flex'; }, 10);
         modal.style.display = 'flex'; // Use flex display when active
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
     if (modal) {
        modal.classList.remove('active');
        // Optional: Use a timeout to match animation duration before hiding
        // setTimeout(() => { modal.style.display = 'none'; }, 250); // Match animation duration
        modal.style.display = 'none'; // Hide immediately
     }
}

// Make modal functions available globally
window.openModal = openModal;
window.closeModal = closeModal;

// Function to populate dropdown options
function populateDropdown(selectElementId, optionsList, valueKey = 'value', textKey = 'text') {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Clear existing options except the default 'Select...' option
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `Select ${selectElement.name.replace('task_', '').replace('assigned_', '').replace('_', ' ')}`;
    selectElement.appendChild(defaultOption);

    optionsList.forEach(optionData => {
        const option = document.createElement('option');
        // Handle both simple arrays (value = text) and array of objects
        if (typeof optionData === 'object' && optionData !== null) {
             option.value = optionData[valueKey];
             option.textContent = optionData[textKey];
        } else {
             option.value = optionData;
             option.textContent = optionData;
        }
        selectElement.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('dashboard_modals.js loaded'); // Log to confirm script loading

    // Event listeners for stat cards
    const projectsCard = document.getElementById('projectsCard');
    const usersCard = document.getElementById('usersCard');
    const tasksCard = document.getElementById('tasksCard');
    const openAddProjectModalBtn = document.getElementById('openAddProjectModalBtn');
    const cancelAddProjectBtn = document.getElementById('cancelAddProjectBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn'); // Updated ID
    const closeBtns = document.querySelectorAll('.close-btn'); // Get all close buttons
    const customModals = document.querySelectorAll('.custom-modal'); // Get all modals
    const modalContents = document.querySelectorAll('.modal-content'); // Get all modal content areas
    const addTaskForm = document.getElementById('addTaskForm'); // Get the Add Task form
    const openAddUserModalBtn = document.getElementById('openAddUserModalBtn'); // Get the Add New User button
    const addUserForm = document.getElementById('addUserForm'); // Get the Add User form

    if (projectsCard) {
        projectsCard.addEventListener('click', function() { 
            renderProjectsTable();
            openModal('projectsModal'); 
        });
    }

    if (usersCard) {
        usersCard.addEventListener('click', function() { 
            renderUsersTable();
            openModal('usersModal'); 
        });
    }

    if (tasksCard) {
        tasksCard.addEventListener('click', function() { 
            renderTasksTable();
            openModal('tasksModal'); 
        });
    }

    // Add New Project button in projects list modal
    if (openAddProjectModalBtn) {
        openAddProjectModalBtn.addEventListener('click', function() {
            closeModal('projectsModal');
            openModal('addProjectModal');
        });
    }

    // Cancel button in add project modal
    if (cancelAddProjectBtn) {
        cancelAddProjectBtn.addEventListener('click', function() {
            closeModal('addProjectModal');
            // Optionally, re-open projects modal if that was the previous one
            // openModal('projectsModal');
        });
    }

    // Add New Task button in tasks list modal
    if (openAddTaskModalBtn) {
        openAddTaskModalBtn.addEventListener('click', function() {
            console.log('Add New Task button clicked');
            closeModal('tasksModal'); // Close the tasks list modal

            // Populate dropdowns in the Add Task modal
            populateDropdown('assign_to', dummyEmployees, 'userId', 'name');
            populateDropdown('task_project_name', dummyProjects, 'name', 'name');
            populateDropdown('task_workgroup', workgroupsList);
            populateDropdown('task_rtom', rtomsList);

            // Reset the form
             if (addTaskForm) {
                addTaskForm.reset();
             }

            openModal('addTaskModal'); // Open the add task modal
        });
    }

    // Form submit handler for Add Project (simulated)
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            // Simulate adding project (replace with actual backend call)
            const newProject = {
                name: formData.get('project_name'),
                slt_ref: formData.get('slt_ref_no'),
                pe_nos: formData.get('pe_nos'),
                contract: formData.get('contract_no'),
                project_no: formData.get('project_no'),
                invoice: formData.get('invoice'),
                // status is removed as per user request
                attachment: formData.get('project_attachment') ? formData.get('project_attachment').name : 'N/A' // Dummy attachment name
            };
            // Assign a dummy status for display in the table
            newProject.status = 'Pending'; 

            dummyProjects.push(newProject);
            console.log('Simulating Add Project:', newProject);
            closeModal('addProjectModal');
            renderProjectsTable(); // Re-render projects table
            openModal('projectsModal'); // Re-open projects modal
            this.reset();
            alert('Project added (demo only, not saved to backend)');
        });
    }

     // Form submit handler for Add Task (Simulated)
     if (addTaskForm) {
         addTaskForm.addEventListener('submit', function(e) {
             e.preventDefault();
             const formData = new FormData(this);
             
             // Get the selected task name from the dropdown
             const taskNameSelect = document.getElementById('task_name');
             const selectedTaskName = taskNameSelect.value;
             
             // Simulate adding task (replace with actual backend call)
             const newTask = {
                 id: Date.now(), // Simple unique ID
                 name: selectedTaskName,
                 project: formData.get('project_name'),
                 assigned_to: formData.get('assigned_to'),
                 workgroup: formData.get('workgroup'),
                 rtom: formData.get('rtom'),
                 deadline: formData.get('deadline'),
                 attachment: formData.get('attachment') ? formData.get('attachment').name : 'N/A',
                 status: 'Pending' // Default status for new tasks
             };

             // Basic validation
             if (!selectedTaskName || !newTask.project || !newTask.assigned_to || !newTask.workgroup || !newTask.rtom || !newTask.deadline || newTask.attachment === 'N/A') {
                 alert('Please fill in all required fields and attach a PDF.');
                 return;
             }

             dummyTasks.push(newTask);
             console.log('Simulating Add Task:', newTask);
             closeModal('addTaskModal');
             renderTasksTable(); // Re-render tasks table
             alert('Task added (demo only, not saved to backend)');
             this.reset();
         });
     }

    // Modal close on background click for all modals
    customModals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal && modal.classList.contains('active')) {
                 closeModal(modal.id);
            }
        });
    });

     // Ensure modals do not close on content click for all modal content areas
     modalContents.forEach(function(content) {
         content.addEventListener('click', function(e) {
             e.stopPropagation(); // Prevent click from bubbling to the modal background
         });
     });

    // Handle closing all modals with close buttons
    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Find the closest modal parent and close it
            const modal = btn.closest('.custom-modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });


    // Dummy data (updated based on user requirements)
    let dummyProjects = [
        { name: 'Metro Fiber Expansion', status: 'ongoing', slt_ref: 'SLT-001', contract: 'C-2024-01', project_no: 'PROJ-001', invoice: 'INV-001', attachment: 'doc1.pdf' },
        { name: 'Rural Area Upgrade', status: 'finished', slt_ref: 'SLT-002', contract: 'C-2024-02', project_no: 'PROJ-002', invoice: 'INV-002', attachment: 'doc2.docx' },
        { name: 'City Backbone', status: 'pending', slt_ref: 'SLT-003', contract: 'C-2024-03', project_no: 'PROJ-003', invoice: 'INV-003', attachment: 'doc3.pdf' },
        // Add more dummy projects as needed
    ];

    const dummyUsers = [
        { name: 'Admin User', userId: 'ADMIN001', email: 'admin.user@example.com', role: 'Admin' },
        { name: 'Contractor A', userId: 'CONT001', email: 'contractor.a@example.com', role: 'Contractor' },
        { name: 'Employee 1', userId: 'EMP001', email: 'employee.1@example.com', role: 'Employee' },
        { name: 'SLT Manager', userId: 'SLTM001', email: 'slt.manager@example.com', role: 'SLT' },
         // Add more dummy users as needed
    ];

     let dummyTasks = [
         // Tasks for NET-PLAN-TX
         { id: 1, name: 'SPECIFY DESIGN DETAILS', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Employee 1', workgroup: 'NET-PLAN-TX', rtom: 'RTOM-01', status: 'In Progress' },
         { id: 2, name: 'APPROVE PE', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Employee 1', workgroup: 'NET-PLAN-TX', rtom: 'RTOM-01', status: 'Pending' },

         // Tasks for LEA-MNG-OPMC
         { id: 3, name: 'SURVEY FIBER ROUTE', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'Employee 2', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM-02', status: 'Completed' },

         // Tasks for NET-PLAN-ACC
         { id: 4, name: 'ASSIGN WORK', project: 'City Backbone', projectId: 'PROJ-003', assigned_to: 'Admin User', workgroup: 'NET-PLAN-ACC', rtom: 'RTOM-03', status: 'In Progress' },

         // Tasks for DRAW FIBER (NET-PROJ-ACC-CABLE and XXX-MNG-OPMC)
         { id: 5, name: 'DRAW FIBER', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Contractor A', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM-01', status: 'In Progress', condition: 'If Area belongs to Metro' },
         { id: 6, name: 'DRAW FIBER', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'Employee 2', workgroup: 'XXX-MNG-OPMC', rtom: 'RTOM-02', status: 'Pending', condition: 'If Area belongs to region' },

         // SPLICE & TERMINATE (NET-PROJ-ACC-CABLE and XXX-ENG-NW)
         { id: 7, name: 'SPLICE & TERMINATE', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Contractor B', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM-01', status: 'Pending', condition: 'If Area belongs to Metro' },
         { id: 8, name: 'SPLICE & TERMINATE', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'Employee 3', workgroup: 'XXX-ENG-NW', rtom: 'RTOM-02', status: 'In Progress', condition: 'If Area belongs to region' },

          // UPLOAD FIBER_IN_OSS (XXX-ENG-NW)
          { id: 9, name: 'UPLOAD FIBER_IN_OSS', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'Employee 3', workgroup: 'XXX-ENG-NW', rtom: 'RTOM-02', status: 'Pending' },

         // CONDUCT FIBER_PAT (NET-PROJ-ACC-CABLE and XXX-MNG-OPMC)
         { id: 10, name: 'CONDUCT FIBER_PAT', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Contractor A', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM-01', status: 'Pending', condition: 'If Area belongs to Metro' },
         { id: 11, name: 'CONDUCT FIBER_PAT', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'Employee 2', workgroup: 'XXX-MNG-OPMC', rtom: 'RTOM-02', status: 'In Progress', condition: 'If Area belongs to region' },

         // UPLOAD DRAWING (NET-PROJ-ACC-CABLE)
         { id: 12, name: 'UPLOAD DRAWING', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Contractor B', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM-01', status: 'Completed' },

         // UPDATE MASTER DWG (NET-PLAN-DRAWING)
         { id: 13, name: 'UPDATE MASTER DWG', project: 'City Backbone', projectId: 'PROJ-003', assigned_to: 'Admin User', workgroup: 'NET-PLAN-DRAWING', rtom: 'RTOM-03', status: 'Pending' },

         // CLOSE EVENT (XXX-RTOM)
         { id: 14, name: 'CLOSE EVENT', project: 'Rural Area Expansion', projectId: 'PROJ-002', assigned_to: 'SLT Manager', workgroup: 'XXX-RTOM', rtom: 'RTOM-04', status: 'In Progress' },

         // Example of existing tasks (adjust if necessary)
          { id: 15, name: 'Install Fiber Optics', project: 'City Backbone', projectId: 'PROJ-003', assigned_to: 'Employee 1', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM-03', status: 'In Progress' },

     ];

     // Assuming these lists are available globally or fetched
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

    const dummyEmployees = [
         { userId: 'EMP001', name: 'John Smith' },
         { userId: 'EMP002', name: 'Sarah Johnson' },
         { userId: 'EMP003', name: 'Michael Williams' },
         
         // Add more dummy employees as needed
    ];

    // Render dummy users in the table
    function renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return; // Exit if tbody not found
        tbody.innerHTML = '';
        dummyUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.userId}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
            `;
            tbody.appendChild(tr);
        });
    }

     // Render dummy tasks in the table
     function renderTasksTable() {
         const tbody = document.getElementById('tasksTableBody');
          if (!tbody) return; // Exit if tbody not found
         tbody.innerHTML = '';
         dummyTasks.forEach(task => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                 <td>${task.name}</td>
                 <td class="project-name-cell">${task.project} (${task.projectId || 'N/A'})</td>
                 <td>${task.assigned_to}</td>
                 <td>${task.workgroup}</td>
                 <td>${task.rtom}</td>
                 <td><span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span></td>
                 <td class="action-buttons">
                     <button type="button" class="edit-btn" data-task-id="${task.id}" title="Edit"><i class="fas fa-edit"></i></button>
                     <button type="button" class="delete-btn" data-task-id="${task.id}" title="Delete"><i class="fas fa-trash"></i></button>
                 </td>
             `;
             tbody.appendChild(tr);
         });

         // Use event delegation for better performance and reliability
         tbody.addEventListener('click', function(e) {
             const target = e.target.closest('button');
             if (!target) return;

             const taskId = parseInt(target.dataset.taskId);
             if (!taskId) return;

             if (target.classList.contains('edit-btn')) {
                 handleEditTaskClick(taskId);
             } else if (target.classList.contains('delete-btn')) {
                 handleDeleteTaskClick(taskId);
             }
         });
     }

    // Get the edit task form
    const editTaskForm = document.getElementById('editTaskForm');

    // Update handleEditTaskClick function
    async function handleEditTaskClick(taskId) {
        console.log('Edit clicked for task:', taskId);
        try {
            const response = await fetch(`/admin_panel/api/tasks/${taskId}/`);
            if (!response.ok) throw new Error('Failed to fetch task details');
            
            const taskData = await response.json();
            
            // Populate the edit form
            document.getElementById('editTaskId').value = taskData.id;
            document.getElementById('editTaskName').value = taskData.name;
            document.getElementById('editAssignedTo').value = taskData.assigned_to_id;
            document.getElementById('editTaskProject').value = taskData.project_id;
            document.getElementById('editTaskWorkgroup').value = taskData.workgroup;
            document.getElementById('editTaskRtom').value = taskData.rtom_id;
            document.getElementById('editTaskDeadline').value = taskData.deadline || '';

            // Populate dropdowns
            populateDropdown('editAssignedTo', dummyEmployees, 'userId', 'name');
            populateDropdown('editTaskProject', dummyProjects, 'name', 'name');
            populateDropdown('editTaskWorkgroup', workgroupsList);
            populateDropdown('editTaskRtom', rtomsList);

            // Open the edit modal
            openModal('editTaskModal');
        } catch (error) {
            console.error('Error fetching task details:', error);
            showNotification('Failed to load task details', 'error');
        }
    }

    // Update handleDeleteTaskClick function
    async function handleDeleteTaskClick(taskId) {
        console.log('Delete clicked for task:', taskId);
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`/admin_panel/api/tasks/${taskId}/delete/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                if (!response.ok) throw new Error('Failed to delete task');
                
                const result = await response.json();
                if (result.status === 'success') {
                    // Remove the task from the array
                    dummyTasks = dummyTasks.filter(task => task.id !== taskId);
                    // Re-render the table
                    renderTasksTable();
                    // Show success notification
                    showNotification('Task deleted successfully', 'success');
                } else {
                    throw new Error(result.message || 'Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                showNotification('Failed to delete task', 'error');
            }
        }
    }

    // Update edit form submission handler
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const taskId = parseInt(formData.get('taskId'));
            
            try {
                const response = await fetch(`/admin_panel/api/tasks/${taskId}/update/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        name: formData.get('taskName'),
                        assigned_to_id: formData.get('assignedTo'),
                        project_id: formData.get('taskProject'),
                        workgroup: formData.get('taskWorkgroup'),
                        rtom_id: formData.get('taskRtom'),
                        deadline: formData.get('taskDeadline'),
                        status: 'PENDING' // or get from form if you have a status field
                    })
                });

                if (!response.ok) throw new Error('Failed to update task');
                
                const result = await response.json();
                if (result.status === 'success') {
                    // Close modal and show success message
                    closeModal('editTaskModal');
                    // Refresh the tasks table
                    await loadTasks();
                    showNotification('Task updated successfully', 'success');
                } else {
                    throw new Error(result.message || 'Failed to update task');
                }
            } catch (error) {
                console.error('Error updating task:', error);
                showNotification('Failed to update task', 'error');
            }
        });
    }

    // Function to load tasks from the API
    async function loadTasks() {
        try {
            const response = await fetch('/admin_panel/api/tasks/');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            
            const data = await response.json();
            dummyTasks = data.tasks; // Update the tasks array
            renderTasksTable(); // Re-render the table
        } catch (error) {
            console.error('Error loading tasks:', error);
            showNotification('Failed to load tasks', 'error');
        }
    }

    // Helper function to get CSRF token
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

    // Call loadTasks when the page loads
    loadTasks();

    // Render dummy projects in the table (refined)
    function renderProjectsTable() {
        const tbody = document.getElementById('projectsTableBody');
         if (!tbody) return; // Exit if tbody not found
        tbody.innerHTML = '';
        dummyProjects.forEach(proj => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${proj.name}</td>
                <td>${proj.slt_ref || 'N/A'}</td>
                <td>${proj.pe_nos || 'N/A'}</td>
                <td>${proj.contract || 'N/A'}</td>
                <td>${proj.project_no || 'N/A'}</td>
                <td>${proj.invoice || 'N/A'}</td>
                <td><span class="status-badge status-${proj.status.toLowerCase()}">${proj.status.charAt(0).toUpperCase() + proj.status.slice(1)}</span></td>
                 <td>${proj.attachment || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Call render functions for initial load if needed (depends on your page load strategy)
    // If these tables are meant to be populated when modals open, keep calls within event listeners.

    // Dummy data (updated based on user requirements)
    // Declare dummyTasks on window to be accessible by other scripts like admin tasks.js
    window.dummyTasks = [
        // ... existing code ...
    ];

    // Add New User button in users list modal
    if (openAddUserModalBtn) {
        openAddUserModalBtn.addEventListener('click', function() {
            closeModal('usersModal'); // Close the users list modal

            // Populate dropdowns in the Add User modal
            populateDropdown('user_workgroup', workgroupsList);
            populateDropdown('user_rtom', rtomsList);

            // Reset the form
            if (addUserForm) {
                addUserForm.reset();
            }

            openModal('addUserModal'); // Open the add user modal
            console.log('Add New User button clicked');
        });
    }

    // Form submit handler for Add User (Simulated)
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            // Simulate adding user (replace with actual backend call)
            const newUser = {
                userId: formData.get('user_employee_id'),
                name: formData.get('user_name'),
                email: formData.get('user_email'),
                workgroup: formData.get('user_workgroup'),
                rtom: formData.get('user_rtom'),
                role: 'Employee' // Default role, adjust if needed
            };

            // Basic validation (add more as needed)
            if (!newUser.userId || !newUser.name || !newUser.email || !newUser.workgroup || !newUser.rtom) {
                alert('Please fill in all required fields.');
                return;
            }

            // Check if user ID already exists (simple dummy check)
            const userExists = dummyUsers.some(user => user.userId === newUser.userId);
            if (userExists) {
                 alert(`User with Employee ID ${newUser.userId} already exists.`);
                 return;
            }

            dummyUsers.push(newUser);
            console.log('Simulating Add User:', newUser);
            closeModal('addUserModal');
            renderUsersTable(); // Re-render users table
            alert('User added (demo only, not saved to backend)');
             // Optionally, re-open the users list modal
            openModal('usersModal');
        });
    }

});

 