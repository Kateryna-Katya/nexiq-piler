document.addEventListener("DOMContentLoaded", () => {

    // 1. INIT LIBRARIES
    gsap.registerPlugin(ScrollTrigger);
    lucide.createIcons();

    // Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. MOBILE MENU
    const burger = document.querySelector('.header__burger');
    const closeBtn = document.querySelector('.header__close');
    const nav = document.querySelector('#nav-menu');
    const navLinks = document.querySelectorAll('.header__link');

    function toggleMenu() {
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    if(burger && closeBtn) {
        burger.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) toggleMenu();
            });
        });
    }

    // 3. ANIMATIONS
    if(document.querySelector('.hero__title')) {
        const heroTitle = new SplitType('.hero__title', { types: 'words, chars' });
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 }});

        heroTl
            .to('.hero__label.fade-in', { opacity: 1, duration: 0.8, delay: 0.3 })
            .to(heroTitle.chars, { y: 0, opacity: 1, stagger: 0.02, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4")
            .to('.hero__subtitle.fade-in', { opacity: 1, duration: 0.8 }, "-=0.6")
            .to('.hero__actions.fade-in-up, .hero__stats.fade-in-up', { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 }, "-=0.6");
    }

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if(section.children.length > 0) {
            gsap.fromTo(section.children,
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1
                }
            );
        }
    });

    if(document.querySelector("#innovations")) {
        gsap.to(".inn-circle--1", {
            scrollTrigger: { trigger: "#innovations", scrub: 1 },
            rotation: 360
        });
    }

    const statsSection = document.querySelector('#career');
    let statsAnimated = false;
    if(statsSection) {
        ScrollTrigger.create({
            trigger: statsSection,
            start: "top 70%",
            onEnter: () => {
                if(!statsAnimated) {
                    gsap.utils.toArray(".c-stat__num").forEach(el => {
                        const targetVal = el.getAttribute("data-val");
                        const suffix = el.innerText.replace(/[0-9]/g, '');
                        gsap.to(el, {
                            innerText: targetVal,
                            duration: 2,
                            snap: { innerText: 1 },
                            onUpdate: function() { el.innerHTML = Math.ceil(this.targets()[0].innerText) + suffix; }
                        });
                    });
                    statsAnimated = true;
                }
            }
        });
    }

    // 4. FAQ
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq__trigger');
        const content = item.querySelector('.faq__content');
        trigger.addEventListener('click', () => {
            const isActive = trigger.classList.contains('active');
            document.querySelectorAll('.faq__trigger').forEach(t => {
                t.classList.remove('active');
                if(t.nextElementSibling) t.nextElementSibling.style.maxHeight = null;
            });
            if (!isActive) {
                trigger.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

   // 5. CONTACT FORM
const form = document.getElementById('contactForm');
if (form) {
    const captchaLabel = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    let captchaResult = 0;
    function initCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaResult = num1 + num2;
        captchaLabel.innerText = `${num1} + ${num2}`;
        captchaInput.value = '';
    }
    initCaptcha();

    function showError(input) { input.closest('.form-group').classList.add('error'); }
    function clearError(input) { input.closest('.form-group').classList.remove('error'); }
    function validateEmail(email) {
        return String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
    function validatePhone(phone) {
        return /^\+?\d{5,15}$/.test(phone.trim());
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        successMsg.classList.remove('active');
        errorMsg.classList.remove('active');

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const agreement = document.getElementById('agreement');

        if(name.value.trim() === '') { showError(name); isValid = false; } else clearError(name);
        if(!validateEmail(email.value)) { showError(email); isValid = false; } else clearError(email);
        if(!validatePhone(phone.value)) { showError(phone); isValid = false; } else clearError(phone);
        if(!agreement.checked) { agreement.closest('.form-group').classList.add('error'); isValid = false; } else agreement.closest('.form-group').classList.remove('error');
        if(parseInt(captchaInput.value) !== captchaResult) { showError(captchaInput); isValid = false; } else clearError(captchaInput);

        if(!isValid) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            const isSuccess = true;
            if(isSuccess) {
                successMsg.classList.add('active');
                form.reset();
                initCaptcha();
                setTimeout(() => { successMsg.classList.remove('active'); }, 5000);
            } else {
                errorMsg.classList.add('active');
            }
        }, 2000);
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}

    // 6. COOKIE POPUP
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');
    if(cookiePopup && acceptBtn) {
        if(!localStorage.getItem('nexiq_cookie_consent')) {
            setTimeout(() => { cookiePopup.classList.add('show'); }, 2000);
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('nexiq_cookie_consent', 'true');
            cookiePopup.classList.remove('show');
        });
    }
});