document.addEventListener('DOMContentLoaded', function() {
    // Profile Image Preview
    const profileUpload = document.getElementById('profile-upload');
    const profilePreview = document.getElementById('profile-preview');

    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Profile Form Submission
    const profileForm = document.querySelector('.settings-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your profile update logic here
        alert('Profile updated successfully!');
    });

    // Password Form Submission
    const passwordForm = document.querySelectorAll('.settings-form')[1];
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = this.querySelector('input[type="password"]:nth-child(2)').value;
        const confirmPassword = this.querySelector('input[type="password"]:nth-child(3)').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Add your password update logic here
        alert('Password updated successfully!');
    });

    // Notification Settings
    const notificationToggles = document.querySelectorAll('.switch input[type="checkbox"]');
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', function(e) {
            const notificationType = this.closest('.option').querySelector('span').textContent;
            const isEnabled = this.checked;
            // Add your notification settings update logic here
            console.log(`${notificationType} ${isEnabled ? 'enabled' : 'disabled'}`);
        });
    });
});

    // Add to settings.js
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push('Password must be at least 8 characters');
    if (!hasUpperCase) errors.push('Include at least one uppercase letter');
    if (!hasLowerCase) errors.push('Include at least one lowercase letter');
    if (!hasNumbers) errors.push('Include at least one number');
    if (!hasSpecialChar) errors.push('Include at least one special character');

    return errors;
}

// Update password form submission
const passwordForm = document.querySelectorAll('.settings-form')[1];
passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = this.querySelector('input[type="password"]:nth-child(2)').value;
    const confirmPassword = this.querySelector('input[type="password"]:nth-child(3)').value;
    
    const errors = validatePassword(newPassword);
    const errorContainer = this.querySelector('.error-message') || 
        document.createElement('div');
    errorContainer.className = 'error-message';
    
    if (errors.length > 0) {
        errorContainer.textContent = errors.join('. ');
        errorContainer.classList.add('show');
        this.appendChild(errorContainer);
        return;
    }

    if (newPassword !== confirmPassword) {
        errorContainer.textContent = 'Passwords do not match!';
        errorContainer.classList.add('show');
        this.appendChild(errorContainer);
        return;
    }

    // Simulate API call
    const btn = this.querySelector('.btn-save');
    btn.classList.add('loading');
    setTimeout(() => {
        btn.classList.remove('loading');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Password updated successfully!';
        this.insertBefore(successMessage, this.firstChild);
        this.reset();
    }, 1500);
});
