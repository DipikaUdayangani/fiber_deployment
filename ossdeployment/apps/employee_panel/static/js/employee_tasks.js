document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Tasks script loaded.');

    const tasksGrid = document.querySelector('.tasks-grid');
    const statusFilter = document.getElementById('statusFilter');
    const documentModal = document.getElementById('documentModal');
    const rejectionModal = document.getElementById('rejectionModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const submitRejection = document.querySelector('.submit-rejection');

    // Dummy data for the logged-in employee (emp001)
    const employeeId = 'emp001';
    const employeeTasks = [
        {
            id: 1,
            taskName: 'SPECIFY DESIGN DETAILS',
            projectName: 'Fiber Rollout Phase 1',
            projectNo: 'PROJ001',
            workgroup: 'NET-PLAN-TX',
            rtom: 'RTOM 1',
            status: 'pending',
            documents: [
                {
                    id: 101,
                    name: 'design_specifications_v1.pdf',
                    uploadedBy: 'Contractor A',
                    uploadDate: '2024-03-15',
                    status: 'pending',
                    type: 'pdf'
                }
            ]
        },
        {
            id: 2,
            taskName: 'APPROVE PE',
            projectName: 'Network Upgrade City Center',
            projectNo: 'PROJ002',
            workgroup: 'NET-PLAN-TX',
            rtom: 'RTOM 1',
            status: 're-checked',
            documents: [
                {
                    id: 201,
                    name: 'PE_approval_doc_v1.docx',
                    uploadedBy: 'Admin User',
                    uploadDate: '2024-03-16',
                    status: 'rejected',
                    rejectionReason: 'Missing signature page.',
                    type: 'docx'
                },
                {
                    id: 202,
                    name: 'PE_approval_doc_v2_corrected.docx',
                    uploadedBy: 'Contractor C',
                    uploadDate: '2024-03-20',
                    status: 'pending',
                    type: 'docx'
                }
            ]
        },
        {
            id: 3,
            taskName: 'SURVEY FIBER ROUTE',
            projectName: 'Rural Area Expansion',
            projectNo: 'PROJ003',
            workgroup: 'LEA-MNG-OPMC',
            rtom: 'RTOM 2',
            status: 'approved',
            documents: [
                {
                    id: 301,
                    name: 'fiber_route_survey.pdf',
                    uploadedBy: 'Contractor B',
                    uploadDate: '2024-03-14',
                    status: 'approved',
                    type: 'pdf'
                }
            ]
        },
        {
            id: 4,
            taskName: 'ASSIGN WORK',
            projectName: 'Metro Connectivity Project',
            projectNo: 'PROJ004',
            workgroup: 'NET-PLAN-ACC',
            rtom: 'RTOM 3',
            status: 'rejected',
            documents: [
                {
                    id: 401,
                    name: 'work_assignment_plan.docx',
                    uploadedBy: 'Admin User',
                    uploadDate: '2024-03-13',
                    status: 'rejected',
                    rejectionReason: 'Incomplete work scope details',
                    type: 'docx'
                }
            ]
        }
    ];

    // Function to render task cards
    function renderTasks(tasks) {
        tasksGrid.innerHTML = '';

        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.taskName}</h3>
                    <div class="project-info">
                        Project: ${task.projectName} (${task.projectNo})<br>
                        Workgroup: ${task.workgroup}<br>
                        RTOM: ${task.rtom}
                    </div>
                    <span class="task-status status-${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                </div>
                <div class="documents-list">
                    ${task.documents.map(doc => `
                        <div class="document-item" data-document-id="${doc.id}" data-task-id="${task.id}">
                            <div class="document-content">
                                <i class="fas fa-file-${doc.type === 'pdf' ? 'pdf' : 'word'} document-icon"></i>
                                <span class="document-name">${doc.name}</span>
                                <span class="document-status-badge status-${doc.status}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                            </div>
                            ${doc.status === 'pending' ? `
                                <div class="document-actions">
                                    <button class="document-action-button approve" 
                                        onclick="approveDocument(${doc.id}, ${task.id})">
                                        <i class="fas fa-check"></i> Approve
                                    </button>
                                    <button class="document-action-button reject" 
                                        onclick="showRejectionModal(${doc.id}, ${task.id})">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                </div>
                            ` : ''}
                            ${doc.status === 'rejected' && doc.rejectionReason ? `
                                <div class="rejection-message">
                                    <strong>Rejection Reason:</strong> ${doc.rejectionReason}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            tasksGrid.appendChild(taskCard);
        });

        // Add click listeners to document content for preview
        addDocumentPreviewListeners();
    }

    // Function to add click listeners to document content for preview
    function addDocumentPreviewListeners() {
        document.querySelectorAll('.document-content').forEach(content => {
            content.addEventListener('click', function() {
                const documentItem = this.closest('.document-item');
                const documentId = documentItem.dataset.documentId;
                const taskId = documentItem.dataset.taskId;
                const task = employeeTasks.find(t => t.id == taskId);
                const document = task.documents.find(d => d.id == documentId);
                
                if (document) {
                    showDocumentPreview(task, document);
                }
            });
        });
    }

    // Function to show document preview modal
    function showDocumentPreview(task, document) {
        const modalTitle = documentModal.querySelector('.document-title');
        const projectName = documentModal.querySelector('.project-name');
        const taskName = documentModal.querySelector('.task-name');
        const uploader = documentModal.querySelector('.uploader');
        const uploadDate = documentModal.querySelector('.upload-date');
        const documentViewer = document.getElementById('documentViewer');

        // Update modal content
        modalTitle.textContent = document.name;
        projectName.textContent = `${task.projectName} (${task.projectNo})`;
        taskName.textContent = task.taskName;
        uploader.textContent = document.uploadedBy;
        uploadDate.textContent = new Date(document.uploadDate).toLocaleDateString();

        // Set document preview (dummy URL for now)
        documentViewer.src = `#${document.name}`;

        // Show modal
        documentModal.style.display = 'flex';
    }

    // Function to show rejection modal
    window.showRejectionModal = function(documentId, taskId) {
        rejectionModal.dataset.documentId = documentId;
        rejectionModal.dataset.taskId = taskId;
        rejectionModal.querySelector('textarea').value = '';
        rejectionModal.style.display = 'flex';
    };

    // Function to approve document
    window.approveDocument = function(documentId, taskId) {
        updateDocumentStatus(documentId, taskId, 'approved');
    };

    // Function to update document status
    function updateDocumentStatus(documentId, taskId, status, rejectionReason = null) {
        const task = employeeTasks.find(t => t.id == taskId);
        const document = task.documents.find(d => d.id == documentId);
        
        if (document) {
            document.status = status;
            if (status === 'rejected') {
                document.rejectionReason = rejectionReason;
            }
            // Update task status based on document status
            task.status = status;
            
            // Re-render tasks
            renderTasks(filterTasks(employeeTasks, statusFilter.value));
        }
    }

    // Function to filter tasks based on status
    function filterTasks(tasks, status) {
        if (status === 'all') return tasks;
        return tasks.filter(task => task.status === status);
    }

    // Event Listeners
    statusFilter.addEventListener('change', function() {
        renderTasks(filterTasks(employeeTasks, this.value));
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            documentModal.style.display = 'none';
            rejectionModal.style.display = 'none';
        });
    });

    documentModal.addEventListener('click', function(event) {
        if (event.target === documentModal) {
            documentModal.style.display = 'none';
        }
    });

    rejectionModal.addEventListener('click', function(event) {
        if (event.target === rejectionModal) {
            rejectionModal.style.display = 'none';
        }
    });

    submitRejection.addEventListener('click', function() {
        const documentId = rejectionModal.dataset.documentId;
        const taskId = rejectionModal.dataset.taskId;
        const reason = rejectionModal.querySelector('textarea').value;
        
        if (reason.trim()) {
            updateDocumentStatus(documentId, taskId, 'rejected', reason);
            rejectionModal.style.display = 'none';
        } else {
            alert('Please provide a reason for rejection');
        }
    });

    // Initial render
    renderTasks(employeeTasks);
}); 