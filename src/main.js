// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Mobile Menu Logic
const burger = document.querySelector('.header__burger');
const closeBtn = document.querySelector('.header__close');
const nav = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.header__link');

function toggleMenu() {
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

burger.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Update icons
lucide.createIcons();