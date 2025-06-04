document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.querySelector('.login-form');
    const userTypeSelect = document.getElementById('user_type');
    const employeeIdInput = document.getElementById('employee_id');
    const passwordInput = document.getElementById('password');
    const alertDiv = document.querySelector('.alert');
    const messagesContainer = document.querySelector('.messages');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    }
                });

                const data = await response.json();

                if (data.success) {
                    // Redirect to the appropriate dashboard based on user type
                    window.location.href = data.redirect_url;
                } else {
                    // Show error message
                    if (messagesContainer) {
                        messagesContainer.innerHTML = `
                            <div class="alert alert-error">
                                ${data.error || 'Login failed. Please check your credentials.'}
                            </div>
                        `;
                    } else {
                        alert(data.error || 'Login failed. Please check your credentials.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (messagesContainer) {
                    messagesContainer.innerHTML = `
                        <div class="alert alert-error">
                            An error occurred. Please try again.
                        </div>
                    `;
                } else {
                    alert('An error occurred. Please try again.');
                }
            }
        });
    }

    // Clear messages when user starts typing
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        });
    });

    // Password toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type');
            input.setAttribute('type', type === 'password' ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Show alert message function
    function showAlert(message, type) {
        if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert alert-${type} show`;
            
            setTimeout(() => {
                alertDiv.classList.remove('show');
            }, 3000);
        }
    }

    // Display Django messages if any
    const messages = document.querySelectorAll('.messages .alert');
    messages.forEach(message => {
        if (message.textContent.trim()) {
            message.classList.add('show');
            setTimeout(() => {
                message.classList.remove('show');
            }, 3000);
        }
    });

    // Sign Up Modal
    const modal = document.getElementById('signUpModal');
    const closeBtn = document.querySelector('.close');

    window.showSignUpModal = function() {
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Form validation
    const signupForm = document.querySelector('.signup-form');
    signupForm.addEventListener('submit', function(e) {
        const password = document.querySelector('#signup_password').value;
        const confirmPassword = document.querySelector('#confirm_password').value;

        if (password !== confirmPassword) {
            e.preventDefault();
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            e.preventDefault();
            alert('Password must be at least 8 characters long!');
            return;
        }

        // Password strength validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
            e.preventDefault();
            alert('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)');
            return;
        }
    });
});