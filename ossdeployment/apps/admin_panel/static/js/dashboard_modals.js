// Define all utility functions in the global scope
(function(window) {
    // Global notification function
    window.showNotification = function(message, type = 'info') {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            background-color: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            margin-bottom: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
        `;
        notification.textContent = message;

        // Add to container
        notificationContainer.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // Modal utility functions with improved handling
    window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id ${modalId} not found`);
            return;
        }

        // Prevent multiple modals from being open
        document.querySelectorAll('.custom-modal.active').forEach(m => {
            if (m.id !== modalId) {
                window.closeModal(m.id);
            }
        });

        // Add active class and show modal
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        // Force a reflow
        modal.offsetHeight;
        
        // Fade in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.3s ease-in-out';
        });

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id ${modalId} not found`);
            return;
        }

        // Fade out
        modal.style.opacity = '0';
        
        // Wait for fade out animation to complete
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.transition = 'none';
            
            // Re-enable body scrolling if no other modals are open
            if (!document.querySelector('.custom-modal.active')) {
                document.body.style.overflow = '';
    }
        }, 300);
    };

    // Render tasks table function
    window.renderTasksTable = function() {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) {
            console.warn('Tasks table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        if (!window.dummyTasks || !Array.isArray(window.dummyTasks)) {
            console.warn('No tasks data available');
            return;
        }

        window.dummyTasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${task.name || 'N/A'}</td>
                <td class="project-name-cell">${task.project || 'N/A'} (${task.projectId || 'N/A'})</td>
                <td>${task.assigned_to || 'N/A'}</td>
                <td>${task.workgroup || 'N/A'}</td>
                <td>${task.rtom || 'N/A'}</td>
                <td><span class="status-badge status-${(task.status || 'pending').toLowerCase().replace(/\s+/g, '-')}">${task.status || 'Pending'}</span></td>
                <td class="action-buttons">
                    <button type="button" class="edit-btn" data-task-id="${task.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button type="button" class="delete-btn" data-task-id="${task.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add event delegation for edit/delete buttons
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
    };

    // Function to load tasks from the API
    window.loadTasks = async function() {
        try {
            // Get the base URL from the current page
            const baseUrl = window.location.pathname.split('/')[1]; // Gets 'admin_panel' or 'admin-panel'
            const apiUrl = `/${baseUrl}/api/tasks/`;
            
            console.log('Fetching tasks from:', apiUrl); // Debug log
            
            // First try to get tasks from the API
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRFToken': window.getCookie('csrftoken')
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                console.warn(`API request failed with status ${response.status}, falling back to dummy data`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data || !data.tasks) {
                console.warn('Invalid API response format, falling back to dummy data');
                throw new Error('Invalid response format: tasks array not found');
            }

            // Update tasks and render
            window.dummyTasks = data.tasks;
            window.renderTasksTable();
            window.showNotification('Tasks loaded successfully', 'success');

        } catch (error) {
            console.error('Error loading tasks:', error);
            window.showNotification('Using sample data (API unavailable)', 'info');
            
            // Fallback to dummy data
            window.dummyTasks = [
                { 
                    id: 1, 
                    name: 'Sample Task 1', 
                    project: 'Project A', 
                    projectId: 'PROJ-001',
                    assigned_to: 'John Doe', 
                    workgroup: 'NET-PROJ-ACC-CABLE', 
                    rtom: 'RTOM-01', 
                    status: 'Pending' 
                },
                { 
                    id: 2, 
                    name: 'Sample Task 2', 
                    project: 'Project B', 
                    projectId: 'PROJ-002',
                    assigned_to: 'Jane Smith', 
                    workgroup: 'XXX-ENG-NW', 
                    rtom: 'RTOM-02', 
                    status: 'In Progress' 
                }
            ];
            window.renderTasksTable();
        }
    };

    // Helper function to get CSRF token
    window.getCookie = function(name) {
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
    };

// Function to populate dropdown options
    window.populateDropdown = function(selectElementId, optionsList, valueKey = 'value', textKey = 'text') {
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
        if (typeof optionData === 'object' && optionData !== null) {
             option.value = optionData[valueKey];
             option.textContent = optionData[textKey];
        } else {
             option.value = optionData;
             option.textContent = optionData;
        }
        selectElement.appendChild(option);
    });
    };

    // Initialize dummy data
    window.dummyTasks = [];

})(window);

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('dashboard_modals.js loaded'); // Log to confirm script loading

    // Call loadTasks when the page loads
    window.loadTasks();

    // Event listeners for stat cards with improved handling
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

    // Add click handlers with debouncing to prevent double-clicks
    let isModalTransitioning = false;

    function handleCardClick(card, modalId, renderFunction) {
        if (isModalTransitioning) return;
        
        isModalTransitioning = true;
        card.style.pointerEvents = 'none'; // Prevent multiple clicks
        
        try {
            if (renderFunction) {
                renderFunction();
            }
            window.openModal(modalId);
        } catch (error) {
            console.error('Error opening modal:', error);
            window.showNotification('Error opening modal', 'error');
        } finally {
            setTimeout(() => {
                isModalTransitioning = false;
                card.style.pointerEvents = '';
            }, 500);
        }
    }

    if (projectsCard) {
        projectsCard.addEventListener('click', () => handleCardClick(projectsCard, 'projectsModal', renderProjectsTable));
    }

    if (usersCard) {
        usersCard.addEventListener('click', () => handleCardClick(usersCard, 'usersModal', renderUsersTable));
    }

    if (tasksCard) {
        tasksCard.addEventListener('click', () => handleCardClick(tasksCard, 'tasksModal', renderTasksTable));
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

    // Improved modal close handling
    customModals.forEach(function(modal) {
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !isModalTransitioning) {
                closeModal(modal.id);
            }
        });

        // Prevent clicks inside modal from closing it
        modal.querySelector('.modal-content')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active') && !isModalTransitioning) {
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

    // Close buttons with improved handling
    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.custom-modal');
            if (modal && !isModalTransitioning) {
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

    // Render dummy projects in the table
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

    // Form submit handler for Add User
    if (addUserForm) {
        addUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('User form submission started');
            
            const formData = new FormData(this);
            
            // Prepare user data
            const userData = {
                employee_id: formData.get('user_employee_id'),
                name: formData.get('user_name'),
                email: formData.get('user_email'),
                workgroup: formData.get('user_workgroup'),
                rtom: formData.get('user_rtom'),
                password: 'default123' // Default password for new users
            };

            console.log('Prepared user data:', userData);

            // Basic validation
            if (!userData.employee_id || !userData.name || !userData.email || !userData.workgroup || !userData.rtom) {
                const missingFields = [];
                if (!userData.employee_id) missingFields.push('Employee ID');
                if (!userData.name) missingFields.push('Name');
                if (!userData.email) missingFields.push('Email');
                if (!userData.workgroup) missingFields.push('Workgroup');
                if (!userData.rtom) missingFields.push('RTOM');
                
                showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
                return;
            }

            try {
                console.log('Making API call to create user...');
                // Make API call to create user - using underscore instead of hyphen
                const response = await fetch('/admin_panel/api/users/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(userData)
                });

                console.log('API response status:', response.status);
                const data = await response.json();
                console.log('API response data:', data);

                if (response.ok) {
                    console.log('User created successfully:', data);
                    closeModal('addUserModal');
                    // Refresh the users list
                    if (typeof loadUsers === 'function') {
                        await loadUsers();
                    }
                    showNotification('User added successfully', 'success');
                } else {
                    throw new Error(data.error || 'Failed to create user');
                }
            } catch (error) {
                console.error('Error creating user:', error);
                showNotification(error.message || 'Error creating user. Please try again.', 'error');
            }
        });
    }

});

 