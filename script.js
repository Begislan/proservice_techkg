/**
 * =========================================================
 * NEXUSTECH — INTERACTIVE JAVASCRIPT
 * =========================================================
 * Pure Vanilla JavaScript, no libraries or frameworks.
 * Handles all interactivity: navigation, animations, sliders,
 * counters, scroll effects, and form handling.
 * =========================================================
 */

(function () {
    'use strict';

    // =========================================================
    // DOM ELEMENT REFERENCES
    // =========================================================
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const backToTop = document.getElementById('backToTop');
    const revealElements = document.querySelectorAll('.reveal');
    const counterElements = document.querySelectorAll('.stat-card__number');
    const heroVisual = document.querySelector('.hero__visual');
    const contactForm = document.getElementById('contactForm');

    // Testimonial slider elements
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialDots = document.getElementById('testimonialDots');

    // =========================================================
    // MOBILE MENU
    // =========================================================
    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.toggle('active');
        burgerBtn.classList.toggle('active', isActive);
        burgerBtn.setAttribute('aria-expanded', isActive);
        mobileMenu.setAttribute('aria-hidden', !isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // =========================================================
    // HEADER SCROLL EFFECT
    // =========================================================
    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check

    // =========================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================================
    function smoothScroll(e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = header ? header.offsetHeight + 20 : 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Attach to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', smoothScroll);
    });

    // =========================================================
    // ACTIVE NAVIGATION LINK
    // =========================================================
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = 100;

    function updateActiveNav() {
        const scrollPos = window.scrollY + headerHeight;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // =========================================================
    // SCROLL REVEAL ANIMATION
    // =========================================================
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // =========================================================
    // ANIMATED COUNTERS
    // =========================================================
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                function animateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quad
                    const eased = 1 - (1 - progress) * (1 - progress);
                    const currentValue = Math.floor(eased * target);

                    el.textContent = currentValue + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animateCounter);
                    } else {
                        el.textContent = target + suffix;
                    }
                }

                requestAnimationFrame(animateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(function (el) {
        counterObserver.observe(el);
    });

    // =========================================================
    // TESTIMONIAL SLIDER
    // =========================================================
    let currentSlide = 0;
    let totalSlides = 0;
    let slideWidth = 0;
    let gap = 24;

    function initTestimonialSlider() {
        const testimonials = testimonialTrack.querySelectorAll('.testimonial');
        totalSlides = testimonials.length;

        if (totalSlides === 0) return;

        // Create dots
        testimonialDots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Перейти к отзыву ' + (i + 1));
            dot.addEventListener('click', function () {
                goToSlide(i);
            });
            testimonialDots.appendChild(dot);
        }

        updateSliderDimensions();
        goToSlide(0);
    }

    function updateSliderDimensions() {
        const containerWidth = testimonialTrack.parentElement.offsetWidth;
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

        if (isMobile) {
            slideWidth = containerWidth;
            gap = 16;
        } else if (isTablet) {
            slideWidth = containerWidth;
            gap = 16;
        } else {
            slideWidth = (containerWidth - 24) / 2;
            gap = 24;
        }
    }

    function goToSlide(index) {
        // Clamp index
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        currentSlide = index;

        const offset = -(currentSlide * (slideWidth + gap));
        testimonialTrack.style.transform = 'translateX(' + offset + 'px)';

        // Update dots
        const dots = testimonialDots.querySelectorAll('.testimonials__dot');
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        const isDesktop = window.innerWidth > 1024;
        const maxSlide = isDesktop ? totalSlides - 2 : totalSlides - 1;
        if (currentSlide < maxSlide) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            const isDesktop = window.innerWidth > 1024;
            const maxSlide = isDesktop ? totalSlides - 2 : totalSlides - 1;
            goToSlide(maxSlide);
        }
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', prevSlide);
    }

    if (testimonialNext) {
        testimonialNext.addEventListener('click', nextSlide);
    }

    // Touch/swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialTrack) {
        testimonialTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Auto-play testimonials (optional, pauses on hover)
    let autoPlayInterval = null;

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    const sliderContainer = document.getElementById('testimonialSlider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize slider on load and resize
    window.addEventListener('load', function () {
        initTestimonialSlider();
        startAutoPlay();
    });

    window.addEventListener('resize', function () {
        updateSliderDimensions();
        goToSlide(currentSlide);
    });

    // =========================================================
    // BACK TO TOP BUTTON
    // =========================================================
    function toggleBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
    }

    // =========================================================
    // MOUSE PARALLAX FOR HERO
    // =========================================================
    let mouseX = 0;
    let mouseY = 0;
    let isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice && heroVisual) {
        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateParallax() {
            const rotateX = mouseY * -8;
            const rotateY = mouseX * 8;
            const translateX = mouseX * 15;
            const translateY = mouseY * 10;

            heroVisual.style.transform =
                'translate(' + translateX + 'px, ' + translateY + 'px) ' +
                'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // =========================================================
    // CONTACT FORM HANDLING
    // =========================================================
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            const requiredFields = ['name', 'email', 'message'];
            let isValid = true;

            requiredFields.forEach(function (field) {
                const input = contactForm.querySelector('[name="' + field + '"]');
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#EF4444';
                    setTimeout(function () {
                        input.style.borderColor = '';
                    }, 3000);
                }
            });

            if (!isValid) return;

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Отправка...</span>';

            setTimeout(function () {
                submitBtn.innerHTML = '<span>Сообщение отправлено!</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                contactForm.reset();

                setTimeout(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // =========================================================
    // SCROLL-BASED PROGRESS BAR (Optional enhancement)
    // =========================================================
    function createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText =
            'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#3B82F6,#06B6D4);' +
            'z-index:10000;width:0%;transition:width 0.1s linear;pointer-events:none;';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function () {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }

    createScrollProgressBar();

    // =========================================================
    // KEYBOARD NAVIGATION FOR TESTIMONIALS
    // =========================================================
    document.addEventListener('keydown', function (e) {
        if (!sliderContainer) return;

        const isSliderInView = sliderContainer.getBoundingClientRect().top < window.innerHeight &&
                               sliderContainer.getBoundingClientRect().bottom > 0;

        if (!isSliderInView) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // =========================================================
    // PREFERS-REDUCED-MOTION HANDLING
    // =========================================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable parallax
        if (heroVisual) {
            heroVisual.style.transform = 'none';
        }
        // Stop auto-play
        stopAutoPlay();
    }

    // =========================================================
    // INITIALIZATION LOG
    // =========================================================
    console.log('%c NexusTech ', 'background: linear-gradient(135deg, #3B82F6, #06B6D4); color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold;');
    console.log('%c Enterprise IT Solutions | Vanilla JS | Zero Dependencies ', 'color: #94A3B8; font-size: 12px;');

})();
