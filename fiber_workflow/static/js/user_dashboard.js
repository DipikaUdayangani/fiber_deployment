document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    const logoutLinks = document.querySelectorAll('#logout-link, #sidebar-logout-link');
    
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a form for CSRF protection
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/logout/';
            
            // Add CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            if (csrfToken) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrfmiddlewaretoken';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }
            
            document.body.appendChild(form);
            form.submit();
        });
    });
    
    // Set current date in the dashboard header
    const setCurrentDate = () => {
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const currentDate = new Date().toLocaleDateString('en-US', dateOptions);
        const dateElements = document.querySelectorAll('input[value="{{ current_date }}"]');
        dateElements.forEach(el => {
            el.value = currentDate;
        });
    };
    
    setCurrentDate();
    
    // Collapse sidebar on mobile
    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            document.querySelector('.sidebar').classList.add('collapse');
        } else {
            document.querySelector('.sidebar').classList.remove('collapse');
        }
    };
    
    // Call on page load and resize
    toggleSidebar();
    window.addEventListener('resize', toggleSidebar);
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

// Handle table search functionality if present
const tableSearch = document.getElementById('table-search');
if (tableSearch) {
    tableSearch.addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('.dashboard-table tbody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchValue) ? '' : 'none';
        });
    });
}

// Add CSRF token to all AJAX requests if jQuery is available
if (typeof $ !== 'undefined') {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        }
    });
}