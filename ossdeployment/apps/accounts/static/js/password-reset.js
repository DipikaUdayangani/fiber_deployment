document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.querySelector('.reset-form');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotPassword = document.getElementById('closeForgotPassword');

    // Function to show forgot password modal
    window.showForgotPasswordModal = function() {
        forgotPasswordModal.style.display = 'block';
    };

    // Close modal when clicking the close button
    closeForgotPassword.addEventListener('click', function() {
        forgotPasswordModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });

    // Handle password reset form submission
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const newPassword = formData.get('new_password');
            const confirmPassword = formData.get('confirm_new_password');

            // Validate passwords match
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Validate password strength
            if (newPassword.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    }
                });

                const data = await response.json();

                if (data.success) {
                    alert('Password reset successful! Please login with your new password.');
                    forgotPasswordModal.style.display = 'none';
                    resetForm.reset();
                } else {
                    alert(data.error || 'Password reset failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
}); 