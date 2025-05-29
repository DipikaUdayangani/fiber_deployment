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

document.addEventListener('DOMContentLoaded', function() {
    console.log('dashboard_modals.js loaded'); // Log to confirm script loading

    // Event listeners for stat cards
    const projectsCard = document.getElementById('projectsCard');
    const usersCard = document.getElementById('usersCard');
    const tasksCard = document.getElementById('tasksCard');
    const openAddProjectModalBtn = document.getElementById('openAddProjectModalBtn');
    const cancelAddProjectBtn = document.getElementById('cancelAddProjectBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const addNewTaskBtn = document.getElementById('addNewTaskBtn'); // Get the Add New Task button
    const closeBtns = document.querySelectorAll('.close-btn'); // Get all close buttons
    const customModals = document.querySelectorAll('.custom-modal'); // Get all modals
    const modalContents = document.querySelectorAll('.modal-content'); // Get all modal content areas

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
    if (addNewTaskBtn) {
        addNewTaskBtn.addEventListener('click', function() {
            closeModal('tasksModal'); // Close the tasks list modal
            openModal('addTaskModal'); // Open the add task modal
             console.log('Add New Task button clicked');
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
            console.log('Simulated Add Project:', newProject);
            closeModal('addProjectModal');
            renderProjectsTable(); // Re-render projects table
            openModal('projectsModal'); // Re-open projects modal
            this.reset();
            alert('Project added (demo only, not saved to backend)');
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


    // Dummy data
    const dummyProjects = [
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

     const dummyTasks = [
         { id: 1, name: 'Install Fiber Optics', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Employee 1', workgroup: 'WG-001', rtom: 'RTOM-01', status: 'In Progress' },
         { id: 2, name: 'Configure Router', project: 'City Backbone', projectId: 'PROJ-003', assigned_to: 'Contractor A', workgroup: 'WG-002', rtom: 'RTOM-02', status: 'Due Today' },
         { id: 3, name: 'Site Survey', project: 'Rural Area Upgrade', projectId: 'PROJ-002', assigned_to: 'Employee 2', workgroup: 'WG-001', rtom: 'RTOM-01', status: 'High Priority' },
          { id: 4, name: 'Test Connectivity', project: 'Metro Fiber Expansion', projectId: 'PROJ-001', assigned_to: 'Contractor B', workgroup: 'WG-003', rtom: 'RTOM-03', status: 'In Progress' },
          { id: 5, name: 'Deploy Equipment', project: 'City Backbone', projectId: 'PROJ-003', assigned_to: 'Employee 3', workgroup: 'WG-002', rtom: 'RTOM-02', status: 'In Progress' },
         // Add more dummy tasks as needed
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
                 <td class="project-name-cell">${task.project} (${task.projectId})</td> {# Highlight project name #}
                 <td>${task.assigned_to}</td>
                 <td>${task.workgroup}</td>
                 <td>${task.rtom}</td>
                 <td><span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span></td>
             `;
             tbody.appendChild(tr);
         });
     }

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



});

 