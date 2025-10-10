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

// Speaker Modal Logic + Dynamic Loading of Speakers via speakers.js
(function() {
        let speakers = window.speakers || [];
        const modal = document.getElementById('speaker-modal');
        const modalName = document.getElementById('modal-speaker-name');
        const modalCV = document.getElementById('modal-speaker-cv');
        const closeBtn = document.querySelector('.speaker-modal-close');
        const grid = document.querySelector('.speakers-grid');

        function createSpeakerCard(speaker, idx) {
            const card = document.createElement('div');
            card.className = 'speaker-card';
            card.innerHTML = `
            <button class="speaker-photo-btn" data-speaker="${idx + 1}" aria-label="View CV">
                <img src="${speaker.photo}" alt="Speaker Photo" class="speaker-photo" onerror="this.onerror=null;this.src='https://via.placeholder.com/150x150?text=Photo'" />
            </button>
            <div class="speaker-info">
                <h3 class="speaker-name">${speaker.name}</h3>
                <p class="speaker-capacity">${speaker.capacity}</p>
                ${speaker.role ? `<p class="speaker-role"><em>${speaker.role}</em></p>` : ''}
                <p class="speaker-topic">${speaker.topic}</p>
            </div>
        `;
        return card;
    }

    function populateSpeakersGrid(speakers) {
        if (!grid) return;
        grid.innerHTML = '';
        if (!speakers || speakers.length === 0) {
            grid.innerHTML = '<p>No speaker data found.</p>';
            return;
        }
        speakers.forEach((spk, idx) => {
            grid.appendChild(createSpeakerCard(spk, idx));
        });
    }
    populateSpeakersGrid(speakers);
    // Open modal on photo click
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.speaker-photo-btn');
        if (btn && grid.contains(btn)) {
            const idx = parseInt(btn.getAttribute('data-speaker'), 10) - 1;
            if (speakers[idx]) {
                modalName.textContent = speakers[idx].name;
                modalCV.textContent = speakers[idx].cv;
            } else {
                modalName.textContent = 'Speaker';
                modalCV.textContent = 'CV not available.';
            }
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            modal.focus();
            document.body.style.overflow = 'hidden';
        }
    });
    // Close modal on close button or background click
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal && modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeModal();
        }
    });
})();

// Programme Outline Logic
(function() {
        const programme = window.programme || [];
        const grid = document.querySelector('.programme-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (!programme.length) return;
        programme.forEach(day => {
                    const card = document.createElement('div');
                    card.className = 'format-card';
                    card.innerHTML = `
            <h3>${day.date}</h3>
            ${day.sessions.map(sess => 
                `<p><strong>${sess.time}</strong> ${sess.title}${sess.details ? `<br><span>${sess.details}</span>` : ''}</p>`).join('')}
        `;
        grid.appendChild(card);
    });
})();