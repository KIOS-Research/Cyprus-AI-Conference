// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.topic-card, .format-card, .audience-list li');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Staggered animation for topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Staggered animation for audience list items
    const audienceItems = document.querySelectorAll('.audience-list li');
    audienceItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Staggered animation for format cards
    const formatCards = document.querySelectorAll('.format-card');
    formatCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });

    // Event listeners
    window.addEventListener('scroll', function() {
        updateActiveNav();
        toggleScrollToTop();
    });

    // Initial calls
    updateActiveNav();
    toggleScrollToTop();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.content-card, .topic-card, .format-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #1e3a8a';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Add performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
        // Preload critical resources
        const criticalImages = document.querySelectorAll('img[data-src]');
        criticalImages.forEach(img => {
            img.src = img.dataset.src;
        });
    });
}

// Add error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Add resize handler for responsive adjustments
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate positions after resize
        updateActiveNav();
    }, 250);
});