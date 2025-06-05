document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectForm = document.getElementById('projectForm');
    console.log('Project form element:', projectForm); // Debug log
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectSearchBtn = document.getElementById('projectSearchBtn');
    const tabLinks = document.querySelectorAll('.tab-link');
    const projectsTableBody = document.getElementById('projectsTableBody');

    // State
    let currentFilter = 'All';
    let projects = []; // Initialize as empty array
    let editingProjectId = null;

    // Initialize
    setupEventListeners();
    loadProjects();

    // Event Listeners Setup
    function setupEventListeners() {
        // Form Submission
        if (projectForm) {
            console.log('Setting up form submit listener'); // Debug log
            projectForm.addEventListener('submit', handleProjectSubmit);
        } else {
            console.error('Project form not found!'); // Debug log
        }

        // Search
        if (projectSearchBtn) {
            projectSearchBtn.addEventListener('click', handleSearch);
        }
        if (projectSearchInput) {
            projectSearchInput.addEventListener('input', handleSearch);
        }

        // Tab Navigation
        tabLinks.forEach(tab => {
            tab.addEventListener('click', () => {
                tabLinks.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.status;
                filterProjects();
            });
        });

        // Modal close button
        const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal('projectModal');
                resetForm();
            });
        });

        // Add event delegation for edit/delete buttons
        if (projectsTableBody) {
            projectsTableBody.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;

                const projectId = target.dataset.projectId;
                if (!projectId) return;

                if (target.classList.contains('edit-btn')) {
                    handleEditClick(projectId);
                } else if (target.classList.contains('delete-btn')) {
                    handleDeleteClick(projectId);
                }
            });
        }
    }

    function resetForm() {
        if (projectForm) {
            projectForm.reset();
            editingProjectId = null;
            document.getElementById('projectModalTitle').textContent = 'Add New Project';
        }
    }

    // Project Management Functions
    async function handleProjectSubmit(e) {
        e.preventDefault();
        console.log('Form submission started');

        // Get form elements with correct IDs
        const formElements = {
            project_name: document.getElementById('project_name'),
            project_no: document.getElementById('project_no'),
            slt_ref_no: document.getElementById('slt_ref_no'),
            pe_no: document.getElementById('pe_no'),
            contract_no: document.getElementById('contract_no'),
            invoice: document.getElementById('invoice'),
            starting_date: document.getElementById('starting_date'),
            description: document.getElementById('description')
        };

        // Log form elements for debugging
        console.log('Form elements found:', Object.entries(formElements).map(([key, el]) => ({
            field: key,
            found: !!el,
            value: el ? el.value : null
        })));

        // Check if any required elements are missing
        const missingElements = Object.entries(formElements)
            .filter(([key, el]) => !el && ['project_name', 'project_no', 'slt_ref_no', 'contract_no', 'starting_date'].includes(key))
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Missing required form elements:', missingElements);
            showNotification(`Missing required form elements: ${missingElements.join(', ')}`, 'error');
            return;
        }

        const formData = {
            project_name: formElements.project_name.value.trim(),
            project_no: formElements.project_no.value.trim(),
            slt_ref_no: formElements.slt_ref_no.value.trim(),
            pe_no: formElements.pe_no ? formElements.pe_no.value.trim() : '',
            contract_no: formElements.contract_no.value.trim(),
            invoice: formElements.invoice ? formElements.invoice.value.trim() : '',
            starting_date: formElements.starting_date.value,
            description: formElements.description ? formElements.description.value.trim() : ''
        };

        console.log('Form data prepared:', formData);

        // Validate required fields
        const requiredFields = ['project_name', 'project_no', 'slt_ref_no', 'contract_no', 'starting_date'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            console.log('Validation failed:', missingFields);
            showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        try {
            const url = editingProjectId 
                ? `/admin-panel/api/projects/${editingProjectId}/update/`
                : '/admin-panel/api/projects/create/';
            
            console.log('Sending request to:', url);
            
            const response = await fetch(url, {
                method: editingProjectId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success response:', result);
            
            showNotification(
                `Project ${editingProjectId ? 'updated' : 'created'} successfully`,
                'success'
            );
            
            closeModal('projectModal');
            resetForm();
            await loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            showNotification(error.message || 'Error saving project', 'error');
        }
    }

    async function loadProjects() {
        try {
            console.log('Loading projects...');
            const response = await fetch('/admin-panel/api/projects/');
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Raw response data:', data);
            
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format: expected an object');
            }
            
            if (!('projects' in data)) {
                throw new Error('Invalid response format: missing projects array');
            }
            
            if (!Array.isArray(data.projects)) {
                throw new Error('Invalid response format: projects is not an array');
            }
            
            // Ensure each project has required fields
            projects = data.projects.map(project => ({
                ...project,
                status: project.status || 'Active',
                budget: parseFloat(project.budget) || 0
            }));
            
            console.log('Processed projects:', projects);
            
            // Update UI
            updateProjectsTable(projects);
            updateProjectStats();
            updateProjectCounts();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            showNotification('Error loading projects: ' + error.message, 'error');
            projects = [];
            
            // Update UI with empty state
            updateProjectsTable([]);
            updateProjectStats();
            updateProjectCounts();
        }
    }

    async function deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            showNotification('Project deleted successfully', 'success');
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification(error.message || 'Error deleting project', 'error');
        }
    }

    // UI Update Functions
    function filterProjects() {
        const filteredProjects = currentFilter === 'All'
            ? projects
            : projects.filter(project => project.status === currentFilter);

        updateProjectsTable(filteredProjects);
        updateProjectCounts();
    }

    function updateProjectsTable(projects) {
        if (!projectsTableBody) {
            console.error('Projects table body not found');
            return;
        }

        if (!Array.isArray(projects) || projects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No projects found</td></tr>';
            return;
        }

        projectsTableBody.innerHTML = projects.map(project => `
            <tr>
                <td>${escapeHtml(project.project_name || '')}</td>
                <td>${escapeHtml(project.project_no || '')}</td>
                <td>${escapeHtml(project.slt_ref_no || '')}</td>
                <td>${escapeHtml(project.pe_no || 'N/A')}</td>
                <td>${escapeHtml(project.contract_no || '')}</td>
                <td>${escapeHtml(project.invoice || 'N/A')}</td>
                <td>${formatDate(project.starting_date)}</td>
                <td class="action-buttons">
                    <button type="button" class="edit-btn" data-project-id="${project.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn" data-project-id="${project.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateProjectStats() {
        console.log('Updating project stats with projects:', projects);
        
        if (!Array.isArray(projects)) {
            console.error('Projects is not an array:', projects);
            projects = [];
        }

        try {
            const activeProjects = projects.filter(p => p.status === 'Active').length;
            const completedProjects = projects.filter(p => p.status === 'Completed').length;
            const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

            const activeProjectsElement = document.querySelector('#activeProjectsCard .stat-value');
            const completedProjectsElement = document.querySelector('#completedProjectsCard .stat-value');
            const totalBudgetElement = document.querySelector('#totalBudgetCard .stat-value');

            if (activeProjectsElement) {
                activeProjectsElement.textContent = activeProjects;
            }
            if (completedProjectsElement) {
                completedProjectsElement.textContent = completedProjects;
            }
            if (totalBudgetElement) {
                totalBudgetElement.textContent = `LKR ${formatNumber(totalBudget)}`;
            }
        } catch (error) {
            console.error('Error updating project stats:', error);
            // Set default values
            const elements = {
                activeProjects: document.querySelector('#activeProjectsCard .stat-value'),
                completedProjects: document.querySelector('#completedProjectsCard .stat-value'),
                totalBudget: document.querySelector('#totalBudgetCard .stat-value')
            };
            
            if (elements.activeProjects) elements.activeProjects.textContent = '0';
            if (elements.completedProjects) elements.completedProjects.textContent = '0';
            if (elements.totalBudget) elements.totalBudget.textContent = 'LKR 0';
        }
    }

    function updateProjectCounts() {
        // Ensure projects is an array
        if (!Array.isArray(projects)) {
            console.error('Projects is not an array in updateProjectCounts:', projects);
            projects = [];
            return;
        }

        const counts = {
            'All': projects.length,
            'Active': projects.filter(p => p.status === 'Active').length,
            'On Hold': projects.filter(p => p.status === 'On Hold').length,
            'Completed': projects.filter(p => p.status === 'Completed').length
        };

        Object.entries(counts).forEach(([status, count]) => {
            const element = document.getElementById(`${status.toLowerCase().replace(' ', '')}ProjectsCount`);
            if (element) {
                element.textContent = count;
            }
        });
    }

    function handleSearch() {
        const searchTerm = projectSearchInput.value.toLowerCase();
        const filteredProjects = projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) ||
            project.location.toLowerCase().includes(searchTerm)
        );
        updateProjectsTable(filteredProjects);
    }

    // Utility Functions
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    function showNotification(message, type = 'info') {
        // TODO: Implement notification system
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    async function handleEditClick(projectId) {
        try {
            console.log('Fetching project details for ID:', projectId);
            const response = await fetch(`/admin-panel/api/projects/${projectId}/`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch project details: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            const project = data.project;
            editingProjectId = project.id;
            
            // Update modal title
            const modalTitle = document.getElementById('projectModalTitle');
            if (modalTitle) {
                modalTitle.textContent = 'Edit Project';
            }
            
            // Populate form with project data
            const formElements = {
                project_name: document.getElementById('project_name'),
                project_no: document.getElementById('project_no'),
                slt_ref_no: document.getElementById('slt_ref_no'),
                pe_no: document.getElementById('pe_no'),
                contract_no: document.getElementById('contract_no'),
                invoice: document.getElementById('invoice'),
                starting_date: document.getElementById('starting_date'),
                description: document.getElementById('description')
            };

            // Set form values
            if (formElements.project_name) formElements.project_name.value = project.project_name || '';
            if (formElements.project_no) formElements.project_no.value = project.project_no || '';
            if (formElements.slt_ref_no) formElements.slt_ref_no.value = project.slt_ref_no || '';
            if (formElements.pe_no) formElements.pe_no.value = project.pe_no || '';
            if (formElements.contract_no) formElements.contract_no.value = project.contract_no || '';
            if (formElements.invoice) formElements.invoice.value = project.invoice || '';
            if (formElements.starting_date) formElements.starting_date.value = project.starting_date || '';
            if (formElements.description) formElements.description.value = project.description || '';

            // Open modal
            openModal('projectModal');
        } catch (error) {
            console.error('Error loading project details:', error);
            showNotification('Error loading project details: ' + error.message, 'error');
        }
    }

    async function handleDeleteClick(projectId) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Deleting project with ID:', projectId);
            const response = await fetch(`/admin-panel/api/projects/${projectId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete project: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            showNotification('Project deleted successfully', 'success');
            await loadProjects(); // Refresh the projects list
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification('Error deleting project: ' + error.message, 'error');
        }
    }

    // Make functions available globally
    window.editProject = handleEditClick;
    window.deleteProject = handleDeleteClick;
    window.openProjectModal = () => {
        resetForm();
        openModal('projectModal');
    };
    window.closeProjectModal = () => {
        closeModal('projectModal');
        resetForm();
    };
}); 