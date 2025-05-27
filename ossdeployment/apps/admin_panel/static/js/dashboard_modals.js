// Utility to open/close modals
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('projectsCard').onclick = function() { 
        renderProjectsTable();
        openModal('projectsModal'); 
    };
    document.getElementById('usersCard').onclick = function() { openModal('usersModal'); };
    document.getElementById('tasksCard').onclick = function() { openModal('tasksModal'); };

    // Add New Project button in list modal
    document.getElementById('openAddProjectModalBtn').onclick = function() {
        closeModal('projectsModal');
        openModal('addProjectModal');
    };

    // Cancel button in add modal
    document.getElementById('cancelAddProjectBtn').onclick = function() {
        closeModal('addProjectModal');
        openModal('projectsModal');
    };

    // Form submit
    document.getElementById('addProjectForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        dummyProjects.push({
            name: formData.get('project_name'),
            status: 'pending',
            slt_ref: formData.get('slt_ref_no'),
            contract: formData.get('contract_no')
        });
        closeModal('addProjectModal');
        renderProjectsTable();
        openModal('projectsModal');
        this.reset();
        alert('Project added (demo only, not saved to backend)');
    };

    // Modal close on background click
    document.querySelectorAll('.custom-modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal(modal.id);
        });
    });
});

// Dummy project data
const dummyProjects = [
    { name: 'Metro Fiber Expansion', status: 'pending', slt_ref: 'SLT-001', contract: 'C-2024-01' },
    { name: 'Rural Area Upgrade', status: 'ongoing', slt_ref: 'SLT-002', contract: 'C-2024-02' },
    { name: 'City Backbone', status: 'finished', slt_ref: 'SLT-003', contract: 'C-2024-03' }
];

// Render dummy projects in the table
function renderProjectsTable() {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '';
    dummyProjects.forEach(proj => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proj.name}</td>
            <td><span class="status-badge status-${proj.status}">${proj.status.charAt(0).toUpperCase() + proj.status.slice(1)}</span></td>
            <td>${proj.slt_ref}</td>
            <td>${proj.contract}</td>
        `;
        tbody.appendChild(tr);
    });
}

