// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const paletteToggle = document.querySelector('.palette-toggle');
const palettePanel = document.querySelector('.palette-panel');
const colorOptions = document.querySelectorAll('.color-option');

function setThemeMode(mode) {
    const isDark = mode === 'dark';

    document.body.classList.toggle('dark-mode', isDark);

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    localStorage.setItem('portfolioThemeMode', mode);
}

function setThemeColor(themeColor) {
    document.body.classList.remove('theme-rose', 'theme-teal', 'theme-amber');

    if (themeColor !== 'default') {
        document.body.classList.add(`theme-${themeColor}`);
    }

    colorOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.themeColor === themeColor);
    });

    localStorage.setItem('portfolioThemeColor', themeColor);
}

const savedThemeMode = localStorage.getItem('portfolioThemeMode') || 'light';
const savedThemeColor = localStorage.getItem('portfolioThemeColor') || 'default';

setThemeMode(savedThemeMode);
setThemeColor(savedThemeColor);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextMode = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        setThemeMode(nextMode);
    });
}

if (paletteToggle && palettePanel) {
    paletteToggle.addEventListener('click', () => {
        palettePanel.classList.toggle('open');
    });
}

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        setThemeColor(option.dataset.themeColor);
    });
});

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing Effect for Hero Title
const typeText = document.querySelector('.typed-text');
const textArray = ['Student', 'Data Science Undergraduate', 'ML Developer', 'Full-Stack Developer', 'Mobile App Developer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        typeText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => {
            isDeleting = true;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    typeEffect();
});

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.children[0].children[0].value;
        const email = contactForm.children[1].children[0].value;
        const subject = contactForm.children[2].children[0].value;
        const message = contactForm.children[3].children[0].value;

        // Show success message
        alert(`Thank you for your message, ${name}!\n\nI'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY;
    
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation to skill cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project and skill cards
document.querySelectorAll('.project-card, .skill-card, .education-item, .certificate-item, .achievement-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Counter animation for stats (optional)
function countUp(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn-contact, .btn-project, .btn-submit, .btn-download').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Dynamic year in footer
const year = new Date().getFullYear();
const footer = document.querySelector('.footer p');
if (footer) {
    footer.textContent = `© ${year} Raahavi Krishnakumar. All rights reserved.`;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});
