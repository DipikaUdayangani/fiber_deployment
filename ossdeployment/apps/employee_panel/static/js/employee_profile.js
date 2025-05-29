document.addEventListener('DOMContentLoaded', function() {
    console.log('Employee Profile script loaded.');

    const userNameSpan = document.getElementById('userName');
    const userIdSpan = document.getElementById('userId');
    const userEmailSpan = document.getElementById('userEmail');
    const profileImageView = document.getElementById('profileImageView');
    const profileImageInput = document.getElementById('profileImageInput');
    const saveImageButton = document.getElementById('saveImageButton');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Dummy user data (replace with actual data fetching)
    const dummyUser = {
        name: 'John Doe',
        userId: 'EMP001',
        email: 'john.doe@example.com',
        profileImageUrl: '{% static "images/default_profile.png" %}' // Default or fetched image URL
    };

    // Display dummy user data
    function displayUserDetails() {
        userNameSpan.textContent = dummyUser.name;
        userIdSpan.textContent = dummyUser.userId;
        userEmailSpan.textContent = dummyUser.email;
        profileImageView.src = dummyUser.profileImageUrl;
    }

    // Handle profile image selection
    profileImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImageView.src = e.target.result;
                saveImageButton.disabled = false; // Enable save button
            };
            reader.readAsDataURL(file);
        }
    });

    // Simulate saving profile image
    saveImageButton.addEventListener('click', function() {
        // In a real application, you would upload the image to the server here.
        // For this example, we'll just log the action and disable the button.
        console.log('Simulating saving profile image...');
        // Add actual AJAX/Fetch request here to send image data to backend
        alert('Profile image updated (simulated)!');
        saveImageButton.disabled = true; // Disable after saving
    });

    // Simulate changing password
    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation (replace with backend validation)
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        // In a real application, you would send the password data to the server.
        // For this example, we'll just log the action.
        console.log('Simulating changing password...');
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);

        // Add actual AJAX/Fetch request here to send password data to backend

        alert('Password change requested (simulated)!');
        changePasswordForm.reset();
    });

    // Initial display of user details
    displayUserDetails();
}); 