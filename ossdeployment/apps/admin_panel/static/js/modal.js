// Global modal functions
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Show modal with animation
    modal.style.display = 'flex';
    modal.classList.add('active');
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
        }
    }, 10);

    // Add escape key handler
    const handleEscape = (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modalId);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Add click outside handler
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal(modalId);
        }
    };
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }

    // Hide modal with animation
    modal.style.opacity = '0';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'translateY(-20px)';
    }

    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Re-enable body scrolling if no other modals are open
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        if (activeModals.length === 0) {
            document.body.style.overflow = '';
        }
    }, 300);
};

// Add event listeners for all modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                closeModal(modal.id);
            }
        };
    });

    // Cancel buttons
    document.querySelectorAll('.modal-cancel').forEach(btn => {
        btn.onclick = function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                closeModal(modal.id);
            }
        };
    });
});

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContainer = document.querySelector('.modal-container');
    const openModalBtn = document.getElementById('openAddProjectModalBtn');
    const closeModalBtn = document.querySelector('.modal-close');
    const cancelModalBtn = document.querySelector('.modal-cancel');
    const modalForm = document.getElementById('projectForm');

    // Event Listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add project button clicked');
            openModal('projectModal');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            closeModal('projectModal');
            if (modalForm) {
                modalForm.reset();
            }
        });
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            closeModal('projectModal');
            if (modalForm) {
                modalForm.reset();
            }
        });
    }

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            console.log('Modal backdrop clicked');
            closeModal('projectModal');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            console.log('Escape key pressed');
            closeModal('projectModal');
        }
    });

    // Prevent modal from closing when clicking inside the container
    modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 