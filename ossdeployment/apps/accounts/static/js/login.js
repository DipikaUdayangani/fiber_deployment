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

            // Get CSRF token from the form
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            if (!csrfToken) {
                console.error('CSRF token not found');
                showAlert('Security token missing. Please refresh the page and try again.', 'error');
                return;
            }

            try {
                const formData = new FormData(this);
                
                // Log the form data for debugging
                console.log('Submitting form data:', {
                    employee_id: formData.get('employee_id'),
                    password: '***', // Don't log the actual password
                    user_type: formData.get('user_type')
                });

                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin' // Important for CSRF
                });

                // Check if the response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Server returned non-JSON response');
                }

                const data = await response.json();
                console.log('Server response:', data);

                if (data.success) {
                    // Get the base URL of the current site
                    const baseUrl = window.location.origin;
                    // Construct the full URL for redirection
                    const fullRedirectUrl = data.redirect_url.startsWith('http') 
                        ? data.redirect_url 
                        : `${baseUrl}${data.redirect_url}`;
                    
                    console.log('Redirecting to:', fullRedirectUrl);
                    window.location.href = fullRedirectUrl;
                } else {
                    // Show error message
                    const errorMessage = data.error || 'Login failed. Please check your credentials.';
                    if (messagesContainer) {
                        messagesContainer.innerHTML = `
                            <div class="alert alert-error">
                                ${errorMessage}
                            </div>
                        `;
                    } else {
                        showAlert(errorMessage, 'error');
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                const errorMessage = 'An error occurred during login. Please try again.';
                if (messagesContainer) {
                    messagesContainer.innerHTML = `
                        <div class="alert alert-error">
                            ${errorMessage}
                        </div>
                    `;
                } else {
                    showAlert(errorMessage, 'error');
                }
            }
        });
    }

    // Show alert message function
    function showAlert(message, type = 'error') {
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="alert alert-${type}">
                    ${message}
                </div>
            `;
        } else if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert alert-${type} show`;
            
            setTimeout(() => {
                alertDiv.classList.remove('show');
            }, 3000);
        } else {
            alert(message);
        }
    }

    // Clear messages when user starts typing
    const inputs = loginForm?.querySelectorAll('input');
    if (inputs) {
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                }
            });
        });
    }

    // Password toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (!input) return;
            
            const type = input.getAttribute('type');
            input.setAttribute('type', type === 'password' ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

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