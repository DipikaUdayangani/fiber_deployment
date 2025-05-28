// Placeholder for Contractor Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contractor Dashboard script loaded.');

    const modal = document.getElementById('taskDetailsModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const closeButton = modal.querySelector('.close-button');
    const statCards = document.querySelectorAll('.stat-card-clickable');

    // Dummy Task Data (categorized by status)
    const dummyTasks = [
        {
            id: '#TASK001',
            project: 'Fiber Deployment - Zone A',
            description: 'Installation of fiber cables in Zone A',
            dueDate: '2024-07-15',
            status: 'Pending',
            priority: 'High'
        },
        {
            id: '#TASK002',
            project: 'Network Maintenance',
            description: 'Regular maintenance of existing network',
            dueDate: '2024-07-10',
            status: 'Completed',
            priority: 'Medium'
        },
        {
            id: '#TASK003',
            project: 'Equipment Upgrade',
            description: 'Upgrade network equipment in Sector B',
            dueDate: '2024-07-05',
            status: 'Overdue',
            priority: 'High'
        },
         {
            id: '#TASK004',
            project: 'Site Survey',
            description: 'Conduct site survey for new deployment',
            dueDate: '2024-07-20',
            status: 'Pending',
            priority: 'Low'
        },
        {
            id: '#TASK005',
            project: 'Fiber Splicing',
            description: 'Perform fiber splicing in central office',
            dueDate: '2024-07-18',
            status: 'Completed',
            priority: 'High'
        },
    ];

    // Function to render tasks in the modal
    function renderTasksInModal(tasks, title) {
        modalTitle.textContent = title;
        let tableHtml = '<div class="modal-task-list">';
        if (tasks.length > 0) {
            tableHtml += '<table>';
            tableHtml += '<thead><tr><th>Task ID</th><th>Project</th><th>Description</th><th>Due Date</th><th>Status</th><th>Priority</th></tr></thead>';
            tableHtml += '<tbody>';
            tasks.forEach(task => {
                tableHtml += `
                    <tr>
                        <td>${task.id}</td>
                        <td>${task.project}</td>
                        <td>${task.description}</td>
                        <td>${task.dueDate}</td>
                        <td><span class="status-badge status-${task.status.toLowerCase().replace(' ', '_')}">${task.status}</span></td>
                        <td><span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                    </tr>
                `;
            });
            tableHtml += '</tbody></table>';
        } else {
            tableHtml += '<p>No tasks found for this category.</p>';
        }
         tableHtml += '</div>';
        modalContent.innerHTML = tableHtml;
    }

    // Add click event listeners to stat cards
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const taskType = this.getAttribute('data-task-type');
            let filteredTasks = [];
            let modalHeaderText = 'Task Details';

            switch (taskType) {
                case 'total':
                    filteredTasks = dummyTasks;
                    modalHeaderText = 'All Tasks';
                    break;
                case 'pending':
                    filteredTasks = dummyTasks.filter(task => task.status === 'Pending');
                    modalHeaderText = 'Pending Tasks';
                    break;
                case 'completed':
                    filteredTasks = dummyTasks.filter(task => task.status === 'Completed');
                    modalHeaderText = 'Completed Tasks';
                    break;
                case 'overdue':
                    // For dummy data, we'll just filter by a specific due date past today
                    const today = new Date();
                    filteredTasks = dummyTasks.filter(task => {
                         const dueDate = new Date(task.dueDate);
                        return task.status !== 'Completed' && dueDate < today;
                    });
                    modalHeaderText = 'Overdue Tasks';
                    break;
                default:
                    filteredTasks = [];
                    modalHeaderText = 'Task Details';
            }

            renderTasksInModal(filteredTasks, modalHeaderText);
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

}); 