document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContainer = document.querySelector('.modal-container');
    const openModalBtn = document.getElementById('openAddProjectModalBtn');
    const closeModalBtn = document.querySelector('.modal-close');
    const cancelModalBtn = document.querySelector('.modal-cancel');
    const modalForm = document.getElementById('projectForm');

    // Open Modal
    function openModal() {
        console.log('Opening modal...');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal
    function closeModal() {
        console.log('Closing modal...');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
        if (modalForm) {
            modalForm.reset();
        }
    }

    // Event Listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add project button clicked');
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            closeModal();
        });
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            closeModal();
        });
    }

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            console.log('Modal backdrop clicked');
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            console.log('Escape key pressed');
            closeModal();
        }
    });

    // Prevent modal from closing when clicking inside the container
    modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Make modal functions available globally
    window.openProjectModal = openModal;
    window.closeProjectModal = closeModal;
}); 