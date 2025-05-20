document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const resetForm = document.getElementById('resetForm');
    const signUpModal = document.getElementById('signUpModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const signUpBtn = document.getElementById('signUpBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const closeButtons = document.querySelectorAll('.close-modal');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Show Sign Up Modal
    signUpBtn.addEventListener('click', () => {
        signUpModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Show Forgot Password Modal
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Toggle Password Visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Form Validation and Submission
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });

        // Password validation for signup and reset forms
        if (form === signUpForm || form === resetForm) {
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirm_password"]');
            
            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    isValid = false;
                    confirmPassword.classList.add('invalid');
                    showAlert('Passwords do not match', 'danger');
                }
            }
        }

        return isValid;
    }

    // Show Alert Message
    function showAlert(message, type = 'info') {
        const alertContainer = document.querySelector('.alert-container') || createAlertContainer();
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        alertContainer.appendChild(alert);

        // Remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
            if (alertContainer.children.length === 0) {
                alertContainer.remove();
            }
        }, 5000);
    }

    // Create Alert Container if it doesn't exist
    function createAlertContainer() {
        const container = document.createElement('div');
        container.className = 'alert-container';
        const form = document.querySelector('.login-form');
        form.insertBefore(container, form.firstChild);
        return container;
    }

    // Handle Form Submissions
    function handleSubmit(form, event) {
        event.preventDefault();

        if (!validateForm(form)) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');

        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            form.submit();
        }, 1000);
    }

    // Add form submit event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleSubmit(loginForm, e));
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => handleSubmit(signUpForm, e));
    }

    if (resetForm) {
        resetForm.addEventListener('submit', (e) => handleSubmit(resetForm, e));
    }

    // Remember Me Functionality
    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox) {
        // Check if there are saved credentials
        const savedEmployeeId = localStorage.getItem('employeeId');
        if (savedEmployeeId) {
            document.getElementById('employee_id').value = savedEmployeeId;
            rememberCheckbox.checked = true;
        }

        // Save credentials when logging in
        loginForm.addEventListener('submit', () => {
            if (rememberCheckbox.checked) {
                localStorage.setItem('employeeId', document.getElementById('employee_id').value);
            } else {
                localStorage.removeItem('employeeId');
            }
        });
    }

    // User Type Change Handler
    const userTypeSelect = document.getElementById('user_type');
    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    }

    // Prevent form resubmission on page refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}); 