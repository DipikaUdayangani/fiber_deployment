document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const userTypeSelect = document.getElementById('user_type');
    const employeeIdInput = document.getElementById('employee_id');
    const passwordInput = document.getElementById('password');
    const alertDiv = document.querySelector('.alert');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!userTypeSelect.value) {
                showAlert('Please select a user type', 'error');
                return;
            }

            if (!employeeIdInput.value) {
                showAlert('Please enter your employee ID', 'error');
                return;
            }

            if (!passwordInput.value) {
                showAlert('Please enter your password', 'error');
                return;
            }

            // If validation passes, submit the form
            this.submit();
        });
    }

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