document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectForm = document.getElementById('projectForm');
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectSearchBtn = document.getElementById('projectSearchBtn');
    const tabLinks = document.querySelectorAll('.tab-link');
    const projectsTableBody = document.getElementById('projectsTableBody');

    // State
    let currentFilter = 'All';
    let projects = []; // Will be populated from backend
    let editingProjectId = null;

    // Initialize
    loadProjects();
    setupEventListeners();

    // Event Listeners Setup
    function setupEventListeners() {
        // Form Submission
        projectForm.addEventListener('submit', handleProjectSubmit);

        // Search
        projectSearchBtn.addEventListener('click', handleSearch);
        projectSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Tab Navigation
        tabLinks.forEach(tab => {
            tab.addEventListener('click', () => {
                tabLinks.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.status;
                filterProjects();
            });
        });
    }

    // Project Management Functions
    async function handleProjectSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('projectName').value,
            location: document.getElementById('projectLocation').value,
            rtom: document.getElementById('projectRtom').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            status: document.getElementById('projectStatus').value,
            budget: document.getElementById('projectBudget').value,
            description: document.getElementById('projectDescription').value
        };

        // Validate required fields
        if (!formData.name || !formData.location || !formData.rtom) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            const url = editingProjectId 
                ? `/admin-panel/api/projects/${editingProjectId}/`
                : '/admin-panel/api/projects/create/';
            
            const response = await fetch(url, {
                method: editingProjectId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showNotification(
                `Project ${editingProjectId ? 'updated' : 'created'} successfully`,
                'success'
            );
            window.closeProjectModal();
            loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            showNotification(error.message || 'Error saving project', 'error');
        }
    }

    async function loadProjects() {
        try {
            const response = await fetch('/admin-panel/api/projects/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            projects = await response.json();
            updateProjectStats();
            filterProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            showNotification('Error loading projects', 'error');
        }
    }

    async function deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/admin-panel/api/projects/${projectId}/delete/`, {
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
        projectsTableBody.innerHTML = projects.map(project => `
            <tr>
                <td>${escapeHtml(project.name)}</td>
                <td>${escapeHtml(project.location)}</td>
                <td>${formatDate(project.startDate)}</td>
                <td>${formatDate(project.endDate)}</td>
                <td>
                    <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                        ${project.status}
                    </span>
                </td>
                <td>LKR ${formatNumber(project.budget)}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
                    </div>
                    <span class="progress-text">${project.progress}%</span>
                </td>
                <td>
                    <button onclick="editProject(${project.id})" class="action-btn edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProject(${project.id})" class="action-btn delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateProjectStats() {
        const activeProjects = projects.filter(p => p.status === 'Active').length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

        document.querySelector('#activeProjectsCard .stat-value').textContent = activeProjects;
        document.querySelector('#completedProjectsCard .stat-value').textContent = completedProjects;
        document.querySelector('#totalBudgetCard .stat-value').textContent = 
            `LKR ${formatNumber(totalBudget)}`;
    }

    function updateProjectCounts() {
        const counts = {
            'All': projects.length,
            'Active': projects.filter(p => p.status === 'Active').length,
            'On Hold': projects.filter(p => p.status === 'On Hold').length,
            'Completed': projects.filter(p => p.status === 'Completed').length
        };

        Object.entries(counts).forEach(([status, count]) => {
            const element = document.getElementById(`${status.toLowerCase().replace(' ', '')}ProjectsCount`);
            if (element) element.textContent = count;
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

    // Make functions available globally
    window.editProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            editingProjectId = project.id;
            // Populate form with project data
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectLocation').value = project.location;
            document.getElementById('projectRtom').value = project.rtom;
            document.getElementById('startDate').value = project.startDate;
            document.getElementById('endDate').value = project.endDate;
            document.getElementById('projectStatus').value = project.status;
            document.getElementById('projectBudget').value = project.budget;
            document.getElementById('projectDescription').value = project.description || '';
            document.getElementById('projectModalTitle').textContent = 'Edit Project';
            window.openProjectModal();
        }
    };

    window.deleteProject = deleteProject;
}); 