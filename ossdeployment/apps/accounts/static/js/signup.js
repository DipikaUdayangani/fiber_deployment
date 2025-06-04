document.addEventListener('DOMContentLoaded', function() {
    const signUpModal = document.getElementById('signUpModal');
    const signUpForm = document.querySelector('.signup-form');
    const closeButtons = document.querySelectorAll('.close');

    // Function to show sign up modal
    window.showSignUpModal = function() {
        signUpModal.style.display = 'block';
    };

    // Close modal when clicking close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            signUpModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === signUpModal) {
            signUpModal.style.display = 'none';
        }
    });

    // Handle signup form submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm_password');

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Validate password strength
            if (password.length < 8) {
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
                    alert('Account created successfully! Please login.');
                    signUpModal.style.display = 'none';
                    signUpForm.reset();
                } else {
                    alert(data.error || 'Account creation failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Add password strength indicator
    const passwordInput = document.getElementById('signup_password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength++;
            
            // Contains number
            if (/\d/.test(password)) strength++;
            
            // Contains lowercase
            if (/[a-z]/.test(password)) strength++;
            
            // Contains uppercase
            if (/[A-Z]/.test(password)) strength++;
            
            // Contains special character
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            // Update strength indicator
            const strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            
            let strengthText = '';
            let strengthClass = '';
            
            switch(strength) {
                case 0:
                case 1:
                    strengthText = 'Very Weak';
                    strengthClass = 'very-weak';
                    break;
                case 2:
                    strengthText = 'Weak';
                    strengthClass = 'weak';
                    break;
                case 3:
                    strengthText = 'Medium';
                    strengthClass = 'medium';
                    break;
                case 4:
                    strengthText = 'Strong';
                    strengthClass = 'strong';
                    break;
                case 5:
                    strengthText = 'Very Strong';
                    strengthClass = 'very-strong';
                    break;
            }

            // Remove existing indicator if any
            const existingIndicator = document.querySelector('.password-strength');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            // Add new indicator
            strengthIndicator.innerHTML = `
                <div class="strength-bar ${strengthClass}"></div>
                <span class="strength-text">${strengthText}</span>
            `;
            this.parentNode.appendChild(strengthIndicator);
        });
    }
});


function showSignUpModal() {
    document.getElementById('signUpModal').style.display = 'block';
}

function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'block';
}

// Close modals when clicking on X
document.querySelectorAll('.close').forEach(function(element) {
    element.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}