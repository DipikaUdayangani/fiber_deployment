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
            window.openModal('projectModal');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            window.closeModal('projectModal');
            if (modalForm) {
                modalForm.reset();
            }
        });
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            window.closeModal('projectModal');
            if (modalForm) {
                modalForm.reset();
            }
        });
    }

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            console.log('Modal backdrop clicked');
            window.closeModal('projectModal');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            console.log('Escape key pressed');
            window.closeModal('projectModal');
        }
    });

    // Prevent modal from closing when clicking inside the container
    modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 