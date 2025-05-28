// Placeholder for Contractor Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contractor Tasks script loaded.');

    const tasksTableBody = document.querySelector('#contractorTasksTable tbody');
    const attachmentModal = document.getElementById('attachmentModal');
    const attachmentModalCloseButton = attachmentModal.querySelector('.close-button');
    const uploadAttachmentButton = document.getElementById('uploadAttachmentButton');
    const attachmentFile = document.getElementById('attachmentFile');
    const currentTaskIDSpan = document.getElementById('currentTaskID');
    const uploadStatusDiv = document.getElementById('uploadStatus');

    // Dummy Task Data (Replace with actual data from Django view)
    const dummyTasks = [
        {
            id: 'TASK001',
            project: 'Fiber Deployment - Zone A',
            description: 'Installation of fiber cables in Zone A',
            dueDate: '2024-03-15',
            status: 'Pending',
            priority: 'High',
            details: {
                projectDetails: 'Project Alpha: Deployment in urban area.',
                assignedWorkgroups: ['Workgroup 1', 'Workgroup 3'],
                rtoms: ['RTOM 101', 'RTOM 105'],
                employeeDetails: ['Emp1: John Doe', 'Emp2: Jane Smith'],
                relatedTasks: ['Task002: Site Survey', 'Task003: Cable Laying']
            }
        },
        {
            id: 'TASK004',
            project: 'Network Maintenance',
            description: 'Routine check and maintenance of Sector C network.',
            dueDate: '2024-04-01',
            status: 'Completed',
            priority: 'Medium',
            details: {
                projectDetails: 'Project Beta: Quarterly maintenance.',
                assignedWorkgroups: ['Workgroup 2'],
                rtoms: ['RTOM 202'],
                employeeDetails: ['Emp3: Peter Jones'],
                relatedTasks: []
            }
        }
        // Add more dummy tasks here
    ];

    // Add dummy attachments data structure
    const dummyAttachments = {
        'TASK001': [
            {
                id: 'ATT001',
                name: 'Site Survey Report.pdf',
                uploadDate: '2024-03-10',
                status: 'pending',
                reviewedBy: null,
                reviewDate: null
            },
            {
                id: 'ATT002',
                name: 'Equipment List.xlsx',
                uploadDate: '2024-03-11',
                status: 'approved',
                reviewedBy: 'John Smith (SLT)',
                reviewDate: '2024-03-12'
            }
        ],
        'TASK004': [
            {
                id: 'ATT003',
                name: 'Maintenance Checklist.pdf',
                uploadDate: '2024-03-15',
                status: 'rejected',
                reviewedBy: 'Sarah Johnson (SLT)',
                reviewDate: '2024-03-16',
                rejectionReason: 'Incomplete checklist items'
            }
        ]
    };

    // Function to get file icon based on extension
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            docx: 'fa-file-word',
            xls: 'fa-file-excel',
            xlsx: 'fa-file-excel',
            jpg: 'fa-file-image',
            jpeg: 'fa-file-image',
            png: 'fa-file-image'
        };
        return icons[ext] || 'fa-file';
    }

    // Function to format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    // Function to render attachments list
    function renderAttachments(taskId) {
        const attachmentsList = document.getElementById('currentAttachments');
        const attachments = dummyAttachments[taskId] || [];
        
        if (attachments.length === 0) {
            attachmentsList.innerHTML = '<p class="no-attachments">No attachments uploaded yet.</p>';
            return;
        }

        attachmentsList.innerHTML = attachments.map(attachment => `
            <div class="attachment-item">
                <div class="attachment-info">
                    <i class="fas ${getFileIcon(attachment.name)} attachment-icon"></i>
                    <div class="attachment-details">
                        <div class="attachment-name">${attachment.name}</div>
                        <div class="attachment-meta">
                            Uploaded: ${formatDate(attachment.uploadDate)}
                            ${attachment.reviewedBy ? ` | Reviewed by: ${attachment.reviewedBy}` : ''}
                        </div>
                    </div>
                </div>
                <div class="attachment-status status-${attachment.status}">
                    ${attachment.status.charAt(0).toUpperCase() + attachment.status.slice(1)}
                    ${attachment.rejectionReason ? `<br><small>${attachment.rejectionReason}</small>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Function to update task details with attachments
    function updateTaskDetailsWithAttachments(taskId, detailsCell) {
        const attachments = dummyAttachments[taskId] || [];
        if (attachments.length > 0) {
            const documentSection = document.createElement('div');
            documentSection.className = 'task-details-section document-status-section';
            documentSection.innerHTML = `
                <h3>Documents</h3>
                <div class="document-list">
                    ${attachments.map(doc => `
                        <div class="document-item">
                            <div class="document-info">
                                <i class="fas ${getFileIcon(doc.name)}"></i>
                                <span class="document-name">${doc.name}</span>
                            </div>
                            <div class="document-status status-${doc.status}">
                                ${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                ${doc.reviewedBy ? `<br><small>by ${doc.reviewedBy}</small>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            detailsCell.querySelector('.task-details-content').appendChild(documentSection);
        }
    }

    // Function to render task rows
    function renderTasks(tasks) {
        tasksTableBody.innerHTML = ''; // Clear existing rows
        if (tasks.length === 0) {
            tasksTableBody.innerHTML = '<tr><td colspan="7">No tasks assigned.</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.classList.add('task-row');
            row.dataset.taskId = task.id; // Store task ID on the row

            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.project}</td>
                <td>${task.description}</td>
                <td>${task.dueDate}</td>
                <td><span class="status-badge status-${task.status.toLowerCase()}">${task.status}</span></td>
                <td><span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                <td>
                    <button class="action-btn upload-btn" data-task-id="${task.id}">
                         <i class="fas fa-paperclip"></i>
                    </button>
                </td>
            `;

            tasksTableBody.appendChild(row);

            // Create a hidden row for task details
            const detailsRow = document.createElement('tr');
            detailsRow.classList.add('task-details-row');
            detailsRow.style.display = 'none'; // Initially hidden

            const detailsCell = document.createElement('td');
            detailsCell.setAttribute('colspan', '7'); // Span across all columns
            detailsCell.classList.add('task-details-cell');

            // Create the basic details content
            detailsCell.innerHTML = `
                <div class="task-details-content">
                    <div class="task-details-section">
                        <h3>Project Details</h3>
                        <p>${task.details.projectDetails}</p>
                    </div>
                    <div class="task-details-section">
                        <h3>Assigned Workgroups</h3>
                        <ul>
                            ${task.details.assignedWorkgroups.map(wg => `<li>${wg}</li>`).join('')}</ul>
                    </div>
                    <div class="task-details-section">
                        <h3>RTOMs</h3>
                        <ul>
                            ${task.details.rtoms.map(rtom => `<li>${rtom}</li>`).join('')}</ul>
                    </div>
                    <div class="task-details-section">
                        <h3>Employee Details</h3>
                         <ul>
                            ${task.details.employeeDetails.map(emp => `<li>${emp}</li>`).join('')}</ul>
                    </div>
                     <div class="task-details-section">
                        <h3>Related Tasks</h3>
                         <ul>
                            ${task.details.relatedTasks.map(relatedTask => `<li>${relatedTask}</li>`).join('')}</ul>
                    </div>
                </div>
            `;

            // Add attachments section if any exist
            updateTaskDetailsWithAttachments(task.id, detailsCell);

            detailsRow.appendChild(detailsCell);
            tasksTableBody.appendChild(detailsRow);
        });
    }

    // Function to toggle task details visibility
    function toggleTaskDetails(row) {
        const detailsRow = row.nextElementSibling; // The details row is right after the task row
        if (detailsRow && detailsRow.classList.contains('task-details-row')) {
            if (detailsRow.style.display === 'none') {
                detailsRow.style.display = 'table-row';
                row.classList.add('expanded');
            } else {
                detailsRow.style.display = 'none';
                row.classList.remove('expanded');
            }
        }
    }

    // Event listener for task row clicks to show details
    tasksTableBody.addEventListener('click', function(event) {
        const targetRow = event.target.closest('.task-row');
        if (targetRow) {
            // Check if the click target is not the upload button
            if (!event.target.closest('.upload-btn')) {
                 toggleTaskDetails(targetRow);
            }
        }
    });

    // Function to open the attachment modal
    function openAttachmentModal(taskId) {
        currentTaskIDSpan.textContent = taskId;
        uploadStatusDiv.textContent = '';
        attachmentFile.value = null;
        attachmentModal.style.display = 'block';
        renderAttachments(taskId); // Show current attachments
    }

    // Function to close the attachment modal
    function closeAttachmentModal() {
        attachmentModal.style.display = 'none';
    }

     // Event listener for upload button click within task row
     tasksTableBody.addEventListener('click', function(event) {
        const uploadButton = event.target.closest('.upload-btn');
        if (uploadButton) {
            const taskId = uploadButton.dataset.taskId;
            openAttachmentModal(taskId);
        }
    });

    // Event listener for closing the attachment modal with the close button
    attachmentModalCloseButton.addEventListener('click', closeAttachmentModal);

    // Event listener for closing the attachment modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === attachmentModal) {
            closeAttachmentModal();
        }
    });

    // Event listener for the upload button inside the modal
    uploadAttachmentButton.addEventListener('click', function() {
        const taskId = currentTaskIDSpan.textContent;
        const files = attachmentFile.files;

        if (files.length > 0) {
            const progressBar = document.querySelector('.upload-progress .progress-bar');
            const uploadProgress = document.getElementById('uploadProgress');
            
            uploadProgress.style.display = 'block';
            progressBar.style.width = '0%';
            uploadStatusDiv.textContent = `Uploading ${files.length} file(s)...`;

            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    uploadProgress.style.display = 'none';
                    
                    // Add new dummy attachments
                    Array.from(files).forEach(file => {
                        const newAttachment = {
                            id: `ATT${Date.now()}`,
                            name: file.name,
                            uploadDate: new Date().toISOString().split('T')[0],
                            status: 'pending',
                            reviewedBy: null,
                            reviewDate: null
                        };
                        
                        if (!dummyAttachments[taskId]) {
                            dummyAttachments[taskId] = [];
                        }
                        dummyAttachments[taskId].push(newAttachment);
                    });

                    uploadStatusDiv.textContent = 'Upload complete!';
                    renderAttachments(taskId);
                    
                    // Update task details if expanded
                    const taskRow = document.querySelector(`.task-row[data-task-id="${taskId}"]`);
                    if (taskRow && taskRow.classList.contains('expanded')) {
                        const detailsCell = taskRow.nextElementSibling.querySelector('.task-details-cell');
                        updateTaskDetailsWithAttachments(taskId, detailsCell);
                    }
                }
            }, 200);
        } else {
            uploadStatusDiv.textContent = 'Please select files to upload.';
        }
    });

    // Add drag and drop functionality
    const fileUploadArea = document.querySelector('.file-upload-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileUploadArea.classList.add('highlight');
    }

    function unhighlight(e) {
        fileUploadArea.classList.remove('highlight');
    }

    fileUploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        attachmentFile.files = files;
    }

    // Initial rendering
    renderTasks(dummyTasks);
}); 