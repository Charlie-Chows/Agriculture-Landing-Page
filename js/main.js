// Load all sections dynamically, apply animations, and enforce 404 redirects
document.addEventListener("DOMContentLoaded", async () => {
    const sectionsList = [
        'header', 'hero', 'about', 'practices', 'crops',
        'soilhealth', 'testimonials', 'stats', 'contact', 'footer'
    ];
    const mainContainer = document.getElementById('main-content');
    const loader = document.getElementById('loader');

    async function loadSections() {
        mainContainer.innerHTML = '';
        for (const sec of sectionsList) {
            try {
                const response = await fetch(`sections/${sec}.html`);
                if (!response.ok) throw new Error(`failed ${sec}`);
                const html = await response.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const sectionElement = tempDiv.firstElementChild;
                if (sectionElement) {
                    sectionElement.classList.add('fade-up');
                    mainContainer.appendChild(sectionElement);
                } else {
                    mainContainer.insertAdjacentHTML('beforeend', html);
                }
            } catch (err) {
                console.warn(`section ${sec} not loaded`, err);
            }
        }
        // hide loader
        if (loader) loader.style.opacity = '0';
        setTimeout(() => { if(loader) loader.style.display = 'none'; }, 400);
        
        // Intersection Observer for animations
        const animatedElements = document.querySelectorAll('.fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
        
        // Hamburger menu logic (open/close)
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        if (closeMenuBtn && navLinks) {
            closeMenuBtn.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        }
        
        // Close mobile menu when clicking outside (optional but good UX)
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            }
        });
        
        // ALL LINKS (ANYWHERE) REDIRECT TO 404.HTML except 404 page itself
        const allAnchors = document.querySelectorAll('a');
        allAnchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (href && href !== '404.html' && !href.startsWith('#')) {
                    window.location.href = '404.html';
                } else if (!href || href === '#') {
                    window.location.href = '404.html';
                } else if (href === '404.html') {
                    window.location.href = '404.html';
                } else {
                    window.location.href = '404.html';
                }
            });
        });
        
        // dummy contact form prevents any action
        const dummyForm = document.getElementById('dummyForm');
        if (dummyForm) {
            dummyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                window.location.href = '404.html';
            });
        }
    }
    
    await loadSections();
});