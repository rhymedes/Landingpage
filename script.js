// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Mobile menu toggle logic
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links-container');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Listen for theme toggle button click
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // Mobile menu toggle event listener
    mobileMenuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked (optional, but good UX)
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });

    // Function to handle scroll animations
    const animateOnScroll = () => {
        // Select elements that should animate, but only those that are NOT in the hero section.
        // This ensures main content is visible by default.
        const elementsToAnimate = document.querySelectorAll(
            'section:not(.relative.h-screen) [data-delay].animate-fade-in, ' +
            'section:not(.relative.h-screen) [data-delay].animate-slide-up'
        );

        // Define a breakpoint (in pixels) below which animations will be disabled.
        const mobileBreakpoint = 768;

        if (window.innerWidth < mobileBreakpoint) {
            elementsToAnimate.forEach(element => {
                element.classList.add('animated'); // This should make them visible
                element.removeAttribute('data-delay');
            });
            return;
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseFloat(element.dataset.delay || 0);

                    setTimeout(() => {
                        element.classList.add('animated');
                        element.removeAttribute('data-delay');
                        observer.unobserve(element);
                    }, delay * 1000);
                }
            });
        }, {
            threshold: 0.1
        });

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    };

    // Card Hover Parallax Tilt Effect
    const tiltCards = document.querySelectorAll('.feature-card, .solution-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to the center of the card
            // Normalized to -1 to 1
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // Define tilt strength (adjust these values to control the intensity)
            const tiltStrength = 10; // Max tilt in degrees
            const liftStrength = -8; // Max lift in pixels
            const scaleStrength = 1.03; // Max scale factor

            const rotateY = mouseX * tiltStrength;
            const rotateX = -mouseY * tiltStrength; // Negative mouseY for intuitive tilt (mouse up -> tilt up)

            card.style.transform = `perspective(1000px) translateY(${liftStrength}px) scale(${scaleStrength}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transform to original state (no tilt, no lift, no scale)
            card.style.transform = 'none';
        });
    });


    // Initial call to set up animations for elements already in view or near view
    animateOnScroll();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            animateOnScroll();
            if (window.innerWidth >= 768) { // md breakpoint
                navLinksContainer.classList.remove('active');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }, 250);
    });

    // Function to update login link text
    function updateLoginLink() {
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                loginLink.innerHTML = '<img src="icon.png" alt="Contact Icon" class="inline-block w-12 h-12 mr-2"> Logout';
                loginLink.href = '#'; // You might want to change this to a profile page or logout action
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Add logout functionality here, e.g., clear localStorage and redirect
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = 'login.html'; // Redirect to login page after logout
                });
            } else {
                loginLink.innerHTML = '<img src="icon.png" alt="Contact Icon" class="inline-block w-12 h-12 mr-2"> Login';
                loginLink.href = 'login.html';
            }
        }
    }

    // Call the function when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', updateLoginLink);
});
