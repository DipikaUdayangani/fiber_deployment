// Dummy admin user data
const adminUser = {
    username: 'admin',
    employeeId: 'ADMIN001',
    email: 'admin@example.com',
    // Add other relevant fields if needed
};

// Get elements
const usernameSpan = document.getElementById('username');
const employeeIdSpan = document.getElementById('employeeId');
const emailSpan = document.getElementById('email');
const profileImagePreview = document.getElementById('profileImagePreview');
const profileImageUpload = document.getElementById('profileImageUpload');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

// Display dummy user data
if (usernameSpan) usernameSpan.textContent = adminUser.username;
if (employeeIdSpan) employeeIdSpan.textContent = adminUser.employeeId;
if (emailSpan) emailSpan.textContent = adminUser.email;

// Handle profile image upload preview
if (profileImageUpload) {
    profileImageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (profileImagePreview) {
                    profileImagePreview.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Handle password change form submission (simulated)
if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const currentPassword = currentPasswordInput ? currentPasswordInput.value : '';
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmNewPassword = confirmNewPasswordInput ? confirmNewPasswordInput.value : '';

        // Basic validation (replace with actual backend validation)
        if (newPassword !== confirmNewPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        // In a real application, you would send currentPassword and newPassword to the server
        console.log('Simulating password change:');
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);

        // Simulate success
        alert('Password change simulated (not saved to backend).');
        passwordChangeForm.reset();
    });
}

// Optional: Add functionality to save profile details if you make them editable
// const saveProfileBtn = document.getElementById('saveProfileBtn');
// if (saveProfileBtn) {
//     saveProfileBtn.addEventListener('click', function() {
//         // Get editable profile data
//         console.log('Simulating profile save');
//         alert('Profile save simulated (not saved to backend).');
//     });
// } 