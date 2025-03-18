document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the header
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        dateDisplay.value = now.toLocaleDateString('en-US', options);
    }

    // Handle logout functionality
    const logoutLinks = document.querySelectorAll('#logout-link, #sidebar-logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '/logout/';
            }
        });
    });

    // Task filtering functionality
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterTasks);
    }

    // Initial call to ensure filters are applied on page load
    setTimeout(filterTasks, 100);

    // Task detail view modal
    const viewTaskButtons = document.querySelectorAll('.view-task');
    viewTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            openTaskModal(taskId);
        });
    });
});

/**
 * Filter tasks based on selected criteria
 */
function filterTasks() {
    const statusFilter = document.getElementById('status-filter').value;
    const projectFilter = document.getElementById('project-filter').value;
    const searchText = document.getElementById('search-tasks').value.toLowerCase();
    
    const rows = document.querySelectorAll('.task-row');
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        const rowProject = row.getAttribute('data-project');
        const rowText = row.textContent.toLowerCase();
        
        const statusMatch = statusFilter === 'all' || rowStatus === statusFilter;
        const projectMatch = projectFilter === 'all' || rowProject === projectFilter;
        const searchMatch = searchText === '' || rowText.includes(searchText);
        
        if (statusMatch && projectMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    const tableBody = document.querySelector('.task-table tbody');
    const visibleRows = tableBody.querySelectorAll('tr[style=""]');
    
    if (visibleRows.length === 0) {
        if (!document.querySelector('.no-results-row')) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.className = 'no-results-row';
            const noResultsCell = document.createElement('td');
            noResultsCell.colSpan = 6;
            noResultsCell.className = 'text-center';
            noResultsCell.textContent = 'No tasks match the selected filters.';
            noResultsRow.appendChild(noResultsCell);
            tableBody.appendChild(noResultsRow);
        }
    } else {
        const noResultsRow = document.querySelector('.no-results-row');
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }
}

/**
 * Load and display task details in the modal
 */
function openTaskModal(taskId) {
    const modal = new bootstrap.Modal(document.getElementById('taskViewModal'));
    const modalBody = document.getElementById('taskViewModalBody');
    
    // Show loading spinner
    modalBody.innerHTML = `<div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>`;
    
    modal.show();
    
    // In a real application, you would fetch task details from the server
    // For this example, we'll simulate an API call
    setTimeout(() => {
        fetchTaskDetails(taskId)
            .then(task => {
                // Display task details
                modalBody.innerHTML = createTaskDetailHTML(task);
            })
            .catch(error => {
                modalBody.innerHTML = <div class="alert alert-danger">Error loading task details: ${error.message}</div>;
            });
    }, 1000);
}

/**
 * Simulate fetching task details from the server
 */
function fetchTaskDetails(taskId) {
    // In a real application, this would be an API call
    // For now, we're returning mock data
    return new Promise((resolve) => {
        resolve({
            id: taskId,
            title: "Sample Task " + taskId,
            description: "This is a detailed description of the task. It includes all the information needed to complete the task successfully.",
            status: ["pending", "in-progress", "completed"][Math.floor(Math.random() * 3)],
            created_at: "2023-09-15",
            due_date: "2023-10-30",
            project: "Fiber Deployment Project",
            created_by: "John Doe",
            assigned_users: [
                { name: "Jane Smith", email: "jane@example.com", completed: true },
                { name: "Bob Johnson", email: "bob@example.com", completed: false }
            ],
            attachments: [
                { name: "requirements.pdf", type: "pdf", size: "1.2 MB" },
                { name: "location_map.png", type: "image", size: "3.5 MB" },
                { name: "instructions.docx", type: "document", size: "842 KB" }
            ]
        });
    });
}

/**
 * Generate HTML for task details
 */
function createTaskDetailHTML(task) {
    // Get the appropriate badge class based on status
    const statusClass = {
        'pending': 'bg-warning',
        'in-progress': 'bg-info',
        'completed': 'bg-success'
    }[task.status] || 'bg-secondary';
    
    // Create the attachment list HTML
    const attachmentsHTML = task.attachments.length > 0 
        ? `<ul class="attachment-list">
            ${task.attachments.map(att => {
                const iconClass = {
                    'pdf': 'bi-file-earmark-pdf',
                    'image': 'bi-file-earmark-image',
                    'document': 'bi-file-earmark-word'
                }[att.type] || 'bi-file-earmark';
                
                return `<li>
                    <i class="bi ${iconClass} attachment-icon"></i>
                    <strong>${att.name}</strong> (${att.size})
                    <a href="#" class="btn btn-sm btn-outline-primary float-end">
                        <i class="bi bi-download"></i> Download
                    </a>
                </li>`;
            }).join('')}
           </ul>`
        : '<p>No attachments for this task.</p>';
    
    // Create the assigned users HTML
    const assignedUsersHTML = task.assigned_users.length > 0
        ? `<ul class="list-group">
            ${task.assigned_users.map(user => {
                const statusBadge = user.completed 
                    ? '<span class="badge bg-success float-end">Completed</span>' 
                    : '<span class="badge bg-warning float-end">Pending</span>';
                
                return `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <i class="bi bi-person-circle me-2"></i>
                        ${user.name}
                    </div>
                    ${statusBadge}
                </li>`;
            }).join('')}
           </ul>`
        : '<p>No users assigned to this task.</p>';
    
    // Build the complete HTML
    return `
        <div class="task-details">
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <h3>${task.title}</h3>
                    <span class="badge ${statusClass}">${task.status.toUpperCase()}</span>
                </div>
                <hr>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="label">Description</div>
                    <p>${task.description}</p>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="label">Project</div>
                    <p>${task.project}</p>
                </div>
                <div class="col-md-6">
                    <div class="label">Created By</div>
                    <p>${task.created_by}</p>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="label">Created Date</div>
                    <p>${task.created_at}</p>
                </div>
                <div class="col-md-6">
                    <div class="label">Due Date</div>
                    <p>${task.due_date}</p>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="label">Assigned Users</div>
                    ${assignedUsersHTML}
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="label">Attachments</div>
                    ${attachmentsHTML}
                </div>
            </div>
        </div>
    `;
}