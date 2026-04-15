document.addEventListener('DOMContentLoaded', () => {
    const car = document.getElementById('car');
    const roadProgress = document.getElementById('road-progress');
    const journeySection = document.querySelector('.journey-section');
    const reveals = document.querySelectorAll('.reveal');

    // 1. Scroll-based Car Movement
    const updateJourney = () => {
        const sectionRect = journeySection.getBoundingClientRect();
        const sectionTop = journeySection.offsetTop;
        const sectionHeight = journeySection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate how far we've scrolled through the journey section
        // We start moving when the section top is at the middle of the screen
        // and finish when the section bottom is at the middle
        const start = sectionTop - viewportHeight / 2;
        const end = sectionTop + sectionHeight - viewportHeight / 2;
        const currentScroll = window.scrollY;

        let progress = (currentScroll - start) / (end - start);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1

        // Move the car
        const carTop = progress * 100;
        car.style.top = `${carTop}%`;

        // Update Road SVG Progress
        // The path length is roughly 1000 in our viewBox
        const pathLength = 1000;
        roadProgress.style.strokeDasharray = `${progress * pathLength}, ${pathLength}`;

        // Add a slight tilt to the car based on scroll speed
        // (Optional cinematic touch)
    };

    // 2. Intersection Observer for Reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(el => revealObserver.observe(el));

    // 3. Parallax Stars
    const stars = document.querySelector('.stars-container');
    const handleParallax = () => {
        const scrolled = window.scrollY;
        stars.style.transform = `translateY(${scrolled * 0.1}px)`;
    };

    // Listeners
    window.addEventListener('scroll', () => {
        updateJourney();
        handleParallax();
    });

    // Initial call
    updateJourney();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for fixed nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dashboard UI Hover Effect for Exp Cards
    const expCards = document.querySelectorAll('.exp-card');
    expCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Subtle glow effect following mouse
            card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 120, 212, 0.05), transparent 40%), var(--card-bg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = `var(--card-bg)`;
        });
    });
});
