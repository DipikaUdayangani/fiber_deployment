// Placeholder for Employee Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Dashboard script loaded.');

    // Ensure static URL is set and properly formatted
    if (typeof window.STATIC_URL === 'undefined' || !window.STATIC_URL) {
        console.error('Static URL not properly initialized. Check if STATIC_URL is set in the template context.');
        window.STATIC_URL = '/static/';
    }

    // Normalize static URL
    window.STATIC_URL = window.STATIC_URL.replace(/\/+$/, '') + '/';
    console.log('Using static URL:', window.STATIC_URL);

    // Helper function to get static URL for images
    function getStaticImageUrl(path) {
        if (!path) {
            console.error('No path provided to getStaticImageUrl');
            return window.STATIC_URL + 'images/default_avatar.svg';
        }
        return window.STATIC_URL + 'images/' + path.replace(/^\/+/, '');
    }

    // Helper function to handle image loading errors
    function handleImageError(img) {
        console.warn('Failed to load image:', img.src);
        img.onerror = null; // Prevent infinite loop
        img.src = getStaticImageUrl('default_avatar.svg');
    }

    const modal = document.getElementById('detailsModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const closeButton = modal.querySelector('.close-button');
    const statCards = document.querySelectorAll('.stat-card-clickable');

    // Add responsive handling for tables
    function handleTableResponsiveness() {
        const tables = document.querySelectorAll('.projects-table, .team-members-table');
        tables.forEach(table => {
            const container = table.closest('.table-container');
            if (container) {
                container.style.overflowX = 'auto';
                container.style.width = '100%';
            }
        });
    }

    // Dummy Data for Projects
    const dummyProjects = [
        {
            projectName: 'Fiber Rollout Phase 1',
            projectNo: 'PROJ001',
            peNo: 'PE101',
            contractorNo: 'CONT005',
            status: 'Completed'
        },
        {
            projectName: 'Network Upgrade City Center',
            projectNo: 'PROJ002',
            peNo: 'PE102',
            contractorNo: 'CONT010',
            status: 'In Progress'
        },
        {
            projectName: 'Rural Area Expansion',
            projectNo: 'PROJ003',
            peNo: 'PE103',
            contractorNo: 'CONT015',
            status: 'Pending'
        },
         {
            projectName: 'Metro Connectivity Project',
            projectNo: 'PROJ004',
            peNo: 'PE104',
            contractorNo: 'CONT020',
            status: 'In Progress'
        },
         {
            projectName: 'Suburban Network Upgrade',
            projectNo: 'PROJ005',
            peNo: 'PE105',
            contractorNo: 'CONT025',
            status: 'Completed'
        },
    ];

    // Dummy Data for Pending Tasks based on user description
    const dummyPendingTasks = [
        {
            taskName: 'SPECIFY DESIGN DETAILS',
            assignedEmployee: 'Employee A',
            workgroup: 'NET-PLAN-TX',
            rtom: 'RTOM 1',
            attachments: ['design_v1.pdf'],
            condition: null
        },
        {
            taskName: 'APPROVE PE',
            assignedEmployee: 'Employee B',
            workgroup: 'NET-PLAN-TX',
            rtom: 'RTOM 1',
            attachments: ['PE101_approval.docx'],
            condition: null
        },
        {
            taskName: 'SURVEY FIBER ROUTE',
            assignedEmployee: 'Employee C',
            workgroup: 'LEA-MNG-OPMC',
            rtom: 'RTOM 2',
            attachments: [],
            condition: null
        },
         {
            taskName: 'ASSIGN WORK',
            assignedEmployee: 'Employee D',
            workgroup: 'NET-PLAN-ACC',
            rtom: 'RTOM 3',
            attachments: [],
            condition: null
        },
         {
            taskName: 'DRAW FIBER',
            assignedEmployee: 'Employee E',
            workgroup: 'ET-PROJ-ACC-CABLE',
            rtom: 'RTOM 4',
            attachments: ['fiber_drawing_v1.dwg'],
            condition: 'If Area belongs to Metro'
        },
         {
            taskName: 'DRAW FIBER',
            assignedEmployee: 'Employee F',
            workgroup: 'XXX-MNG-OPMC',
            rtom: 'RTOM 5',
            attachments: ['fiber_drawing_v2.dwg'],
            condition: 'If Area belongs to region'
        },
         {
            taskName: 'SPLICE & TERMINATE',
            assignedEmployee: 'Employee G',
            workgroup: 'NET-PROJ-ACC-CABLE',
            rtom: 'RTOM 4',
            attachments: ['splice_report_g.pdf'],
            condition: 'If Area belongs to Metro'
        },
         {
            taskName: 'SPLICE & TERMINATE',
            assignedEmployee: 'Employee H',
            workgroup: 'XXX-ENG-NW',
            rtom: 'RTOM 6',
            attachments: ['splice_report_h.pdf'],
            condition: 'If Area belongs to region'
        },
         {
            taskName: 'UPLOAD FIBER_IN_OSS',
            assignedEmployee: 'Employee I',
            workgroup: 'XXX-ENG-NW',
            rtom: 'RTOM 6',
            attachments: ['oss_upload_log.txt'],
            condition: null
        },
         {
            taskName: 'CONDUCT FIBER_PAT',
            assignedEmployee: 'Employee J',
            workgroup: 'NET-PROJ-ACC-CABLE',
            rtom: 'RTOM 4',
            attachments: ['pat_report_j.pdf'],
            condition: 'If Area belongs to Metro'
        },
          {
            taskName: 'CONDUCT FIBER_PAT',
            assignedEmployee: 'Employee K',
            workgroup: 'XXX-MNG-OPMC',
            rtom: 'RTOM 5',
            attachments: ['pat_report_k.pdf'],
            condition: 'If Area belongs to region'
        },
         {
            taskName: 'UPLOAD DRAWING',
            assignedEmployee: 'Employee L',
            workgroup: 'NET-PROJ-ACC-CABLE',
            rtom: 'RTOM 4',
            attachments: ['final_drawing.dwg'],
            condition: null
        },
         {
            taskName: 'UPDATE MASTER DWG',
            assignedEmployee: 'Employee M',
            workgroup: 'NET-PLAN-DRAWING',
            rtom: 'RTOM 7',
            attachments: [],
            condition: null
        },
        {
            taskName: 'CLOSE EVENT',
            assignedEmployee: 'Employee N',
            workgroup: 'XXX-RTOM',
            rtom: 'RTOM 8',
            attachments: [],
            condition: null
        }

    ];

     // Dummy data for Team Members (Basic structure)
    const dummyTeamMembers = [
        {
            name: 'Employee A',
            role: 'Active',
            workgroup: 'NET-PLAN-TX',
            tasks: 5,
            status: 'Online',
            avatar: getStaticImageUrl('default_avatar.svg')
        },
        {
            name: 'Employee C',
            role: 'Active',
            workgroup: 'LEA-MNG-OPMC',
            tasks: 3,
            status: 'Offline',
            avatar: getStaticImageUrl('default_avatar.svg')
        },
        {
            name: 'Employee D',
            role: 'Active',
            workgroup: 'NET-PLAN-ACC',
            tasks: 7,
            status: 'Online',
            avatar: getStaticImageUrl('default_avatar.svg')
        },
        {
            name: 'Employee E',
            role: 'Active',
            workgroup: 'ET-PROJ-ACC-CABLE',
            tasks: 4,
            status: 'Online',
            avatar: getStaticImageUrl('default_avatar.svg')
        },
        {
            name: 'Employee F',
            role: 'Active',
            workgroup: 'XXX-MNG-OPMC',
            tasks: 6,
            status: 'Busy',
            avatar: getStaticImageUrl('default_avatar.svg')
        }
    ];


    // Function to update statistic numbers on the cards
    function updateStatNumbers() {
        document.querySelector('.stat-card[data-type="total-projects"] .stat-number').textContent = dummyProjects.length;
        document.querySelector('.stat-card[data-type="completed-projects"] .stat-number').textContent = dummyProjects.filter(project => project.status === 'Completed').length;
        document.querySelector('.stat-card[data-type="in-progress-projects"] .stat-number').textContent = dummyProjects.filter(project => project.status === 'In Progress').length;
        document.querySelector('.stat-card[data-type="pending-tasks"] .stat-number').textContent = dummyPendingTasks.length; // Assuming all dummy tasks are pending for this card
    }

     // Function to render recent projects in the table
    function renderRecentProjects() {
        const recentProjectsTableBody = document.querySelector('.projects-table tbody');
        recentProjectsTableBody.innerHTML = ''; // Clear existing rows

        if (dummyProjects.length > 0) {
            // Display a few recent projects, e.g., the last 3
            const recent = dummyProjects.slice(0, 3);
            recent.forEach(project => {
                const row = `
                    <tr>
                        <td>${project.projectName}</td>
                        <td>Work Group Placeholder</td> <!-- Replace with actual workgroup if available -->
                        <td><span class="status-badge status-${project.status.toLowerCase().replace(' ', '_')}">${project.status}</span></td>
                         <td>
                            <div class="progress-bar-container">
                                <div class="progress-bar ${getProgressBarColor(project.status)}" style="width: ${getProjectProgress(project.status)}%;"></div>
                            </div>
                        </td>
                        <td>Due Date Placeholder</td> <!-- Replace with actual due date -->
                    </tr>
                `;
                recentProjectsTableBody.innerHTML += row;
            });
        } else {
            recentProjectsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No recent projects found</td></tr>';
        }
    }

     // Helper function to get progress bar color based on status
    function getProgressBarColor(status) {
        switch (status) {
            case 'Completed': return 'green';
            case 'In Progress': return 'yellow'; // Or orange/blue
            case 'Pending': return 'red'; // Or yellow
            default: return 'red';
        }
    }

    // Helper function to get project progress (dummy logic)
    function getProjectProgress(status) {
         switch (status) {
            case 'Completed': return 100;
            case 'In Progress': return 60; // Example progress
            case 'Pending': return 10; // Example progress
            default: return 0;
        }
    }


    // Function to render team members in the table
     function renderTeamMembers() {
        const teamMembersTableBody = document.querySelector('.team-members-table tbody');
        if (!teamMembersTableBody) {
            console.warn('Team members table body not found');
            return;
        }

        teamMembersTableBody.innerHTML = ''; // Clear existing rows

        if (dummyTeamMembers.length > 0) {
            dummyTeamMembers.forEach(member => {
                const avatarUrl = getStaticImageUrl('default_avatar.svg');
                const row = `
                    <tr>
                        <td>
                            <div class="avatar">
                                <img src="${avatarUrl}" 
                                     alt="${member.name}" 
                                     onerror="handleImageError(this)"
                                     data-member="${member.name}">
                                <span class="member-name">${member.name}</span>
                            </div>
                        </td>
                        <td><span class="role-badge role-${member.role.toLowerCase()}">${member.role}</span></td>
                        <td>${member.workgroup}</td>
                        <td>${member.tasks}</td>
                        <td><span class="status-indicator ${member.status.toLowerCase()}">${member.status}</span></td>
                    </tr>
                `;
                teamMembersTableBody.innerHTML += row;
            });
        } else {
            teamMembersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No team members found</td></tr>';
        }
     }


    // Function to render data in the modal
    function renderModalContent(data, type) {
        let tableHtml = '<div class="modal-list">';
        if (data.length > 0) {
            tableHtml += '<table>';

            if (type === 'projects') {
                tableHtml += '<thead><tr><th>Project Name</th><th>Project No</th><th>PE No</th><th>Contractor No</th><th>Status</th></tr></thead>';
                tableHtml += '<tbody>';
                data.forEach(item => {
                    tableHtml += `
                        <tr>
                            <td>${item.projectName}</td>
                            <td>${item.projectNo}</td>
                            <td>${item.peNo}</td>
                            <td>${item.contractorNo}</td>
                            <td><span class="status-badge status-${item.status.toLowerCase().replace(' ', '_')}">${item.status}</span></td>
                        </tr>
                    `;
                });
                 tableHtml += '</tbody>';
            } else if (type === 'pending-tasks') {
                 tableHtml += '<thead><tr><th>Task Name</th><th>Assigned Employee</th><th>Workgroup</th><th>RTOM</th><th>Attachments</th><th>Condition</th></tr></thead>';
                 tableHtml += '<tbody>';
                 data.forEach(item => {
                     tableHtml += `
                         <tr>
                             <td>${item.taskName}</td>
                             <td>${item.assignedEmployee}</td>
                             <td>${item.workgroup}</td>
                             <td>${item.rtom}</td>
                             <td>${item.attachments.join(', ') || 'None'}</td>
                             <td>${item.condition || 'N/A'}</td>
                         </tr>
                     `;
                 });
                 tableHtml += '</tbody>';
            }

            tableHtml += '</table>';
        } else {
            tableHtml += '<p>No items found for this category.</p>';
        }
         tableHtml += '</div>';
        modalContent.innerHTML = tableHtml;
    }

    // Add click event listeners to stat cards
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            let filteredData = [];
            let modalHeaderText = 'Details';
            let contentType = ''; // 'projects' or 'pending-tasks'

            switch (dataType) {
                case 'total-projects':
                    filteredData = dummyProjects;
                    modalHeaderText = 'All Projects';
                    contentType = 'projects';
                    break;
                case 'completed-projects':
                    filteredData = dummyProjects.filter(project => project.status === 'Completed');
                    modalHeaderText = 'Completed Projects';
                    contentType = 'projects';
                    break;
                case 'in-progress-projects':
                    filteredData = dummyProjects.filter(project => project.status === 'In Progress');
                    modalHeaderText = 'In Progress Projects';
                    contentType = 'projects';
                    break;
                case 'pending-tasks':
                    filteredData = dummyPendingTasks;
                    modalHeaderText = 'Pending Tasks';
                    contentType = 'pending-tasks';
                    break;
                default:
                    filteredData = [];
                    modalHeaderText = 'Details';
                    contentType = '';
            }

            modalTitle.textContent = modalHeaderText;
            renderModalContent(filteredData, contentType);
            modal.style.display = 'flex'; // Use flex to center the modal
        });
    });

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial render on page load
    handleTableResponsiveness();
    updateStatNumbers();
    renderRecentProjects();
    renderTeamMembers();

    // Handle window resize for responsiveness
    window.addEventListener('resize', handleTableResponsiveness);

    // Make helper functions globally available
    window.handleImageError = handleImageError;
}); 