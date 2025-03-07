function showProjects() {
    document.getElementById('projectsModal').style.display = 'block';
}

function closeProjectsModal() {
    document.getElementById('projectsModal').style.display = 'none';
}

function showAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'block';
}

function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
}

// Form submission handling
document.getElementById('addProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate required fields
    const required = ['projectName', 'sltRef', 'contractNo', 'projectNo'];
    let isValid = true;
    
    required.forEach(field => {
        if (!document.getElementById(field).value) {
            isValid = false;
            document.getElementById(field).classList.add('error');
        } else {
            document.getElementById(field).classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Add your form submission logic here
    
    closeAddProjectModal();
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}