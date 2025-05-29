document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Projects script loaded.');

    const projectsTableBody = document.querySelector('.projects-table-container tbody');
    const taskModal = document.getElementById('taskModal');
    const modalBody = taskModal.querySelector('.task-modal-body');
    const closeModalBtn = taskModal.querySelector('.close-modal');

    // Dummy Data for Projects (adapted from previous turn)
    const dummyProjects = [
        {
            id: 1,
            projectName: 'Fiber Rollout Phase 1',
            projectNo: 'PROJ001',
            peNo: 'PE101',
            contractorNo: 'CONT005',
            status: 'Completed'
        },
        {
            id: 2,
            projectName: 'Network Upgrade City Center',
            projectNo: 'PROJ002',
            peNo: 'PE102',
            contractorNo: 'CONT010',
            status: 'In Progress'
        },
        {
            id: 3,
            projectName: 'Rural Area Expansion',
            projectNo: 'PROJ003',
            peNo: 'PE103',
            contractorNo: 'CONT015',
            status: 'Pending'
        },
         {
            id: 4,
            projectName: 'Metro Connectivity Project',
            projectNo: 'PROJ004',
            peNo: 'PE104',
            contractorNo: 'CONT020',
            status: 'In Progress'
        },
         {
            id: 5,
            projectName: 'Suburban Network Upgrade',
            projectNo: 'PROJ005',
            peNo: 'PE105',
            contractorNo: 'CONT025',
            status: 'Completed'
        },
    ];

    // Dummy Data for Tasks (based on your specific requirements)
    // Linking tasks to projects is simulated here based on project ID
    const dummyTasks = [
        // Tasks for Project 1 (Completed)
        { id: 101, projectId: 1, taskName: 'SPECIFY DESIGN DETAILS', assignedEmployee: 'Employee A', workgroup: 'NET-PLAN-TX', rtom: 'RTOM 1', attachments: ['design_v1.pdf'], condition: null, status: 'Completed' },
        { id: 102, projectId: 1, taskName: 'APPROVE PE', assignedEmployee: 'Employee B', workgroup: 'NET-PLAN-TX', rtom: 'RTOM 1', attachments: ['PE101_approval.docx'], condition: null, status: 'Completed' },

        // Tasks for Project 2 (In Progress)
        { id: 201, projectId: 2, taskName: 'SURVEY FIBER ROUTE', assignedEmployee: 'Employee C', workgroup: 'LEA-MNG-OPMC', rtom: 'RTOM 2', attachments: [], condition: null, status: 'Completed' },
        { id: 202, projectId: 2, taskName: 'ASSIGN WORK', assignedEmployee: 'Employee D', workgroup: 'NET-PLAN-ACC', rtom: 'RTOM 3', attachments: [], condition: null, status: 'In Progress' },
        { id: 203, projectId: 2, taskName: 'DRAW FIBER', assignedEmployee: 'Employee E', workgroup: 'ET-PROJ-ACC-CABLE', rtom: 'RTOM 4', attachments: ['fiber_drawing_v1.dwg'], condition: 'If Area belongs to Metro', status: 'In Progress' },

        // Tasks for Project 3 (Pending)
        { id: 301, projectId: 3, taskName: 'DRAW FIBER', assignedEmployee: 'Employee F', workgroup: 'XXX-MNG-OPMC', rtom: 'RTOM 5', attachments: ['fiber_drawing_v2.dwg'], condition: 'If Area belongs to region', status: 'Pending' },
        { id: 302, projectId: 3, taskName: 'SPLICE & TERMINATE', assignedEmployee: 'Employee G', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM 4', attachments: ['splice_report_g.pdf'], condition: 'If Area belongs to Metro', status: 'Pending' },

         // Tasks for Project 4 (In Progress)
         { id: 401, projectId: 4, taskName: 'SPLICE & TERMINATE', assignedEmployee: 'Employee H', workgroup: 'XXX-ENG-NW', rtom: 'RTOM 6', attachments: ['splice_report_h.pdf'], condition: 'If Area belongs to region', status: 'In Progress' },
         { id: 402, projectId: 4, taskName: 'UPLOAD FIBER_IN_OSS', assignedEmployee: 'Employee I', workgroup: 'XXX-ENG-NW', rtom: 'RTOM 6', attachments: ['oss_upload_log.txt'], condition: null, status: 'In Progress' },

         // Tasks for Project 5 (Completed)
         { id: 501, projectId: 5, taskName: 'CONDUCT FIBER_PAT', assignedEmployee: 'Employee J', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM 4', attachments: ['pat_report_j.pdf'], condition: 'If Area belongs to Metro', status: 'Completed' },
         { id: 502, projectId: 5, taskName: 'CONDUCT FIBER_PAT', assignedEmployee: 'Employee K', workgroup: 'XXX-MNG-OPMC', rtom: 'RTOM 5', attachments: ['pat_report_k.pdf'], condition: 'If Area belongs to region', status: 'Completed' },
         { id: 503, projectId: 5, taskName: 'UPLOAD DRAWING', assignedEmployee: 'Employee L', workgroup: 'NET-PROJ-ACC-CABLE', rtom: 'RTOM 4', attachments: ['final_drawing.dwg'], condition: null, status: 'Completed' },
         { id: 504, projectId: 5, taskName: 'UPDATE MASTER DWG', assignedEmployee: 'Employee M', workgroup: 'NET-PLAN-DRAWING', rtom: 'RTOM 7', attachments: [], condition: null, status: 'Completed' },
         { id: 505, projectId: 5, taskName: 'CLOSE EVENT', assignedEmployee: 'Employee N', workgroup: 'XXX-RTOM', rtom: 'RTOM 8', attachments: [], condition: null, status: 'Completed' }
    ];

    // Function to render projects in the table
    function renderProjects() {
        projectsTableBody.innerHTML = ''; // Clear existing rows

        if (dummyProjects.length > 0) {
            dummyProjects.forEach(project => {
                const projectRow = document.createElement('tr');
                projectRow.classList.add('project-row');
                projectRow.dataset.projectId = project.id;

                projectRow.innerHTML = `
                    <td>${project.projectName}</td>
                    <td>${project.projectNo}</td>
                    <td>${project.peNo}</td>
                    <td>${project.contractorNo}</td>
                    <td><span class="status-badge status-${project.status.toLowerCase().replace(' ', '_')}">${project.status}</span></td>
                    <td><span class="expand-icon">&#9658;</span></td>
                `;

                projectsTableBody.appendChild(projectRow);

                // Create a hidden row for task list
                const taskListRow = document.createElement('tr');
                taskListRow.classList.add('task-details-row');
                taskListRow.style.display = 'none';
                taskListRow.innerHTML = `
                    <td colspan="6">
                        <div class="task-details-content">
                            <ul class="task-list"></ul>
                        </div>
                    </td>
                `;
                projectsTableBody.appendChild(taskListRow);
            });

            // Add event listeners after rendering
            addProjectRowClickListeners();
            addTaskClickListeners();

        } else {
            projectsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No projects found</td></tr>';
        }
    }

    // Function to add click listeners to project rows
    function addProjectRowClickListeners() {
        const projectRows = document.querySelectorAll('.project-row');

        projectRows.forEach(row => {
            row.addEventListener('click', function() {
                const projectId = this.dataset.projectId;
                const expandIcon = this.querySelector('.expand-icon');
                const taskListRow = this.nextElementSibling;

                // Toggle display of the task list row
                if (taskListRow.style.display === 'none') {
                    // Hide any currently open task lists
                    document.querySelectorAll('.task-details-row').forEach(detailsRow => {
                        detailsRow.style.display = 'none';
                        detailsRow.previousElementSibling.querySelector('.expand-icon').classList.remove('expanded');
                        detailsRow.previousElementSibling.querySelector('.expand-icon').innerHTML = '&#9658;';
                    });

                    taskListRow.style.display = 'table-row';
                    expandIcon.classList.add('expanded');
                    expandIcon.innerHTML = '&#9660;';
                    renderTaskList(projectId, taskListRow.querySelector('.task-list'));
                } else {
                    taskListRow.style.display = 'none';
                    expandIcon.classList.remove('expanded');
                    expandIcon.innerHTML = '&#9658;';
                }
            });
        });
    }

    // Function to render task list for a project
    function renderTaskList(projectId, targetElement) {
        const projectTasks = dummyTasks.filter(task => task.projectId == projectId);
        let tasksHtml = '';

        if (projectTasks.length > 0) {
            projectTasks.forEach(task => {
                tasksHtml += `
                    <li data-task-id="${task.id}">
                        ${task.taskName}
                    </li>
                `;
            });
        } else {
            tasksHtml = '<li>No tasks found for this project.</li>';
        }

        targetElement.innerHTML = tasksHtml;
    }

    // Function to add click listeners to task items
    function addTaskClickListeners() {
        document.addEventListener('click', function(event) {
            const taskItem = event.target.closest('.task-list li');
            if (taskItem && taskItem.dataset.taskId) {
                const taskId = parseInt(taskItem.dataset.taskId);
                const task = dummyTasks.find(t => t.id === taskId);
                if (task) {
                    showTaskDetails(task);
                }
            }
        });
    }

    // Function to show task details in modal
    function showTaskDetails(task) {
        const taskDetailsHtml = `
            <div class="task-info-item">
                <strong>Task Name:</strong>
                <span>${task.taskName}</span>
            </div>
            <div class="task-info-item">
                <strong>Assigned Employee:</strong>
                <span>${task.assignedEmployee}</span>
            </div>
            <div class="task-info-item">
                <strong>Workgroup:</strong>
                <span>${task.workgroup}</span>
            </div>
            <div class="task-info-item">
                <strong>RTOM:</strong>
                <span>${task.rtom}</span>
            </div>
            <div class="task-info-item">
                <strong>Condition:</strong>
                <span>${task.condition || 'N/A'}</span>
            </div>
            <div class="task-info-item">
                <strong>Status:</strong>
                <span class="status-badge status-${task.status.toLowerCase().replace(' ', '_')}">${task.status}</span>
            </div>
            <div class="task-info-item">
                <strong>Attachments:</strong>
                <div class="task-attachments">
                    ${task.attachments && task.attachments.length > 0 
                        ? `<ul>${task.attachments.map(att => `<li>${att}</li>`).join('')}</ul>`
                        : 'None'}
                </div>
            </div>
        `;

        modalBody.innerHTML = taskDetailsHtml;
        taskModal.style.display = 'flex';
    }

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        taskModal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    taskModal.addEventListener('click', function(event) {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });

    // Initial render on page load
    renderProjects();
}); 