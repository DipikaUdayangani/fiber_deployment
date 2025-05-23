document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('signUpModal');
    const signUpBtn = document.querySelector('.btn-secondary');
    const closeBtn = document.querySelector('.close');

    // Open modal
    window.showSignUpModal = function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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
    });
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