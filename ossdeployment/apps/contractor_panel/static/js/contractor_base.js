
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu toggle
    const handleMobileMenu = () => {
        const sidebar = document.querySelector('.contractor-sidebar');
        const mainContent = document.querySelector('.contractor-main');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.add('mobile');
            mainContent.classList.add('mobile');
        } else {
            sidebar.classList.remove('mobile');
            mainContent.classList.remove('mobile');
        }
    };

    // Initial check
    handleMobileMenu();

    // Listen for window resize
    window.addEventListener('resize', handleMobileMenu);

    // Handle active menu items
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.parentElement.classList.add('active');
        }
    });

    // Handle logout confirmation
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to sign out?')) {
                e.preventDefault();
            }
        });
    }

    // Add smooth transitions for menu items
    const menuLinks = document.querySelectorAll('.menu-item a:not(.logout-link)');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentActive = document.querySelector('.menu-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            this.parentElement.classList.add('active');
        });
    });
}); 