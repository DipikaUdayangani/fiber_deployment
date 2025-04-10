function handleLogout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Make logout request to server
        fetch('/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(),
            },
        })
        .then(response => {
            if (response.ok) {
                // Redirect to login page
                window.location.href = '/login/';
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        });
    }
}

// Helper function to get CSRF token
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}