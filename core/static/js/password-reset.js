document.addEventListener('DOMContentLoaded', function() {
    // Modal handling
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotPassword = document.getElementById('closeForgotPassword');
    
    window.showForgotPasswordModal = function() {
        forgotPasswordModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeForgotPassword.onclick = function() {
        forgotPasswordModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Password visibility toggle
    const toggleButtons = forgotPasswordModal.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Form validation
    const resetForm = forgotPasswordModal.querySelector('.reset-form');
    resetForm.addEventListener('submit', function(e) {
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_new_password').value;
        
        if (newPassword !== confirmPassword) {
            e.preventDefault();
            alert('Passwords do not match!');
        }
    });
    
    window.onclick = function(event) {
        if (event.target == forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});