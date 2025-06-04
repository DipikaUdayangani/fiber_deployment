document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Profile script loaded.');

    // Ensure static URL is set and properly formatted
    if (typeof window.STATIC_URL === 'undefined' || !window.STATIC_URL) {
        console.warn('Static URL not set, using default');
        window.STATIC_URL = '/static/';
    }

    // Normalize static URL
    window.STATIC_URL = window.STATIC_URL.replace(/\/+$/, '') + '/';
    console.log('Using static URL:', window.STATIC_URL);

    const userNameSpan = document.getElementById('userName');
    const userIdSpan = document.getElementById('userId');
    const userEmailSpan = document.getElementById('userEmail');
    const profileImageView = document.getElementById('profileImageView');
    const profileImageInput = document.getElementById('profileImageInput');
    const saveImageButton = document.getElementById('saveImageButton');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Debug: Log the image source
    console.log('Profile image source:', profileImageView.src);
    console.log('Profile image current src:', profileImageView.getAttribute('src'));

    // Dummy user data (replace with actual data fetching)
    const dummyUser = {
        name: 'John Doe',
        userId: 'EMP001',
        email: 'john.doe@example.com'
    };

    // Set up error handling for the profile image
    profileImageView.onerror = function(e) {
        console.error('Failed to load profile image:', e);
        console.error('Attempted URL:', this.src);
        // Show a text placeholder instead of trying to load another image
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-image-placeholder';
        placeholder.textContent = dummyUser.name.charAt(0).toUpperCase();
        this.parentNode.insertBefore(placeholder, this);
    };

    // Display dummy user data
    function displayUserDetails() {
        userNameSpan.textContent = dummyUser.name;
        userIdSpan.textContent = dummyUser.userId;
        userEmailSpan.textContent = dummyUser.email;
    }

    // Handle image selection
    profileImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImageView.src = e.target.result;
                saveImageButton.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle image save
    saveImageButton.addEventListener('click', function() {
        // Here you would typically upload the image to the server
        // For now, we'll just show a success message
        showNotification('success', 'Profile image updated successfully');
        saveImageButton.disabled = true;
    });

    // Handle password change
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showNotification('error', 'New passwords do not match');
            return;
        }

        // Here you would typically send the password change request to the server
        // For now, we'll just show a success message
        showNotification('success', 'Password changed successfully');
        changePasswordForm.reset();
    });

    // Helper function to show notifications
    function showNotification(type, message) {
        console.log(`${type} notification: ${message}`);
        // Here you would typically show a notification to the user
        // For now, we'll just log it to the console
    }

    // Initialize the page
    displayUserDetails();
}); 