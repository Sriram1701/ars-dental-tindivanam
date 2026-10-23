document.addEventListener("DOMContentLoaded", () => {

    // 1. Mobile Menu Toggle & Auto-Close on Nav Link Click
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active-menu');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active-menu') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });

        // Close mobile menu when clicking any nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active-menu')) {
                    navMenu.classList.remove('active-menu');
                    const icon = hamburger.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active-menu') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active-menu');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // 2. Smooth Scrolling for all Internal Anchor Links with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // 3. Desktop Services Dropdown Toggle
    const desktopViewAllBtn = document.getElementById('services-dropdown-btn');
    const dropdownContent = document.getElementById('services-dropdown-content');

    if (desktopViewAllBtn && dropdownContent) {
        desktopViewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownContent.classList.toggle('show-dropdown');
            const icon = desktopViewAllBtn.querySelector('i');
            if (icon) {
                icon.style.transform = dropdownContent.classList.contains('show-dropdown') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // 3b. Mobile View All Services Toggle (Shows first 2 cards initially, expands all 8 on click)
    const mobileServicesBtn = document.getElementById('mobile-services-btn');
    const servicesGrid = document.querySelector('.services-grid');

    if (mobileServicesBtn && servicesGrid) {
        mobileServicesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isCurrentlyExpanded = servicesGrid.classList.contains('show-all-mobile');

            if (!isCurrentlyExpanded) {
                // Expand all services
                servicesGrid.classList.add('show-all-mobile');
                servicesGrid.querySelectorAll('.service-card').forEach((card, idx) => {
                    card.style.setProperty('--reveal-delay', `${(idx * 0.05).toFixed(2)}s`);
                    card.classList.add('is-revealed');
                });
                if (dropdownContent) {
                    dropdownContent.classList.add('mobile-expanded');
                }
                mobileServicesBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span class="btn-text">Show Less Services</span> <i class="fa-solid fa-chevron-up arrow-icon"></i>';
            } else {
                // Collapse back to initial 2 cards
                servicesGrid.classList.remove('show-all-mobile');
                if (dropdownContent) {
                    dropdownContent.classList.remove('mobile-expanded');
                }
                mobileServicesBtn.innerHTML = '<i class="fa-solid fa-layer-group"></i> <span class="btn-text">View All Services (8)</span> <i class="fa-solid fa-chevron-down arrow-icon"></i>';

                // Smoothly scroll back to services section header
                const toggleBtn = document.getElementById('mobile-services-btn');
                if (toggleBtn) {
                    const headerOffset = 100;
                    const elementPosition = toggleBtn.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // 4. Animated Trust Counters (Count-up on viewport entry)
    const counters = document.querySelectorAll('.counter-number');
    const counterSection = document.querySelector('.counter-section');

    const startCounterAnimation = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '+';
            let current = 0;
            const increment = Math.ceil(target / 60);

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = current.toLocaleString() + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString() + suffix;
                }
            };
            updateCount();
        });
    };

    if (counterSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounterAnimation();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(counterSection);
    }

    // 5. FAQ Accordion Single-Open Logic
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            if (!answer) return;
            const isOpening = !answer.style.maxHeight;

            // Close all other open FAQ answers
            document.querySelectorAll('.faq-question').forEach(otherQuestion => {
                const otherAnswer = otherQuestion.nextElementSibling;
                if (otherAnswer) otherAnswer.style.maxHeight = null;

                const otherIcon = otherQuestion.querySelector('i');
                if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
            });

            // Open clicked FAQ item if it was closed
            if (isOpening) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                const icon = question.querySelector('i');
                if (icon) icon.style.transform = "rotate(180deg)";
            }
        });
    });

    // 6. Infrastructure Gallery Image Rotator (Dr. Gowtham Smile Care & Tooth Clinique Style)
    const clinicGalleryImages = [
        "images/clinic/exterior-entrance.jpg",
        "images/clinic/interior-operatory.jpg",
        "images/clinic/interior-consultation.jpg",
        "images/clinic/interior-chair-close.jpg"
    ];

    let currentGalleryIndex = 0;
    const mainImg = document.querySelector('.main-premium-pic');
    const subImgs = document.querySelectorAll('.sub-premium-pic');

    function rotateClinicImages() {
        if (!mainImg && subImgs.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % clinicGalleryImages.length;

        if (mainImg) {
            mainImg.src = clinicGalleryImages[currentGalleryIndex];
        }

        if (subImgs.length > 0) {
            subImgs.forEach((img, i) => {
                let subIndex = (currentGalleryIndex + 1 + i) % clinicGalleryImages.length;
                img.src = clinicGalleryImages[subIndex];
            });
        }
    }

    if (mainImg || subImgs.length > 0) {
        setInterval(rotateClinicImages, 3000);
    }

    // 7. Lightbox Modal for Gallery & Patient Cases
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCta = document.getElementById('lightbox-cta');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(fullSrc, title, desc) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = fullSrc;
        lightboxImg.alt = title || 'ARS Dental Clinic Preview';
        if (lightboxTitle) lightboxTitle.textContent = title || 'ARS Dental Clinic';
        if (lightboxDesc) lightboxDesc.textContent = desc || 'First Floor, No. 96, Marakkanam Road, Tindivanam';
        
        if (lightboxCta) {
            const encodedTitle = encodeURIComponent(title || 'Dental Consultation');
            lightboxCta.href = `https://wa.me/918015341100?text=Hi%20Doctor%2C%20I%20would%20like%20to%20consult%20about%20${encodedTitle}%20at%20ARS%20Dental%20Clinic%2C%20Tindivanam.`;
        }

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Make Gallery and Patient Roller images clickable into Lightbox
    document.querySelectorAll('.main-premium-pic, .sub-premium-pic, .gallery-photo, .patient-roller-img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const title = img.getAttribute('alt') || 'ARS Dental Clinic Infrastructure';
            openLightbox(img.src, title, 'ARS Dental Clinic • Tindivanam East (Opp. PWD Office)');
        });
    });

    // 8. Universal Image Fallback Handler (Prevents Broken Image Icons)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (!this.getAttribute('data-fallback-applied')) {
                this.setAttribute('data-fallback-applied', 'true');
                if (this.classList.contains('hero-dentist-img') || this.classList.contains('main-premium-pic') || this.classList.contains('sub-premium-pic')) {
                    this.src = 'images/clinic/interior-operatory.jpg';
                } else {
                    this.src = 'images/logo/logo.png';
                }
            }
        });
    });


    // 9. Interactive Hero Before / After Slider Logic
    const heroSlider = document.getElementById('hero-comparison-slider');
    const rangeSlider = document.getElementById('hero-range-slider');

    if (heroSlider && rangeSlider) {
        const updateSlider = (val) => {
            heroSlider.style.setProperty('--slider-pos', `${val}%`);
        };

        rangeSlider.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });

        // Mousemove hover interaction on desktop
        heroSlider.addEventListener('mousemove', (e) => {
            const rect = heroSlider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            let percent = (x / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            rangeSlider.value = percent;
            updateSlider(percent);
        });

        // Gentle auto-demo pulse on load to invite user interaction
        let demoStep = 0;
        const demoValues = [50, 42, 35, 45, 60, 68, 55, 50];
        const runDemo = () => {
            if (demoStep < demoValues.length) {
                rangeSlider.value = demoValues[demoStep];
                updateSlider(demoValues[demoStep]);
                demoStep++;
                setTimeout(runDemo, 140);
            }
        };
        setTimeout(runDemo, 900);
    }



    // 10. High-Performance Scroll-Reveal & Entrance Animation for Text and Photos
    const setupScrollReveal = () => {
        const revealTargets = [
            // Headings & Subtitles across all sections
            { selector: '.section-title', type: 'reveal-text' },
            { selector: '.section-subtitle', type: 'reveal-text' },
            
            // Specialist / Doctor Section (Photo from left, Info from right)
            { selector: '.specialist-photo-side', type: 'reveal-left' },
            { selector: '.specialist-info-side', type: 'reveal-right' },
            
            // Core 3 Service Pillars (Staggered)
            { selector: '.service-pillar-card', type: 'reveal-card', stagger: true },
            
            // 8 Specialized Service Cards (Staggered)
            { selector: '.service-card', type: 'reveal-card', stagger: true },
            
            // Clinic Infrastructure & Gallery Photos (Staggered)
            { selector: '.gallery-card', type: 'reveal-photo', stagger: true },
            
            // Trust Counters
            { selector: '.counter-box', type: 'reveal-card', stagger: true },
            
            // Patient Transformation Marquee Container
            { selector: '.marquee-scroller-container', type: 'reveal-photo' },
            
            // Google Reviews
            { selector: '.review-heading-block', type: 'reveal-text' },
            { selector: '.google-review-btn', type: 'reveal-text' },
            { selector: '.review-slider', type: 'reveal-card' },
            
            // FAQ Accordion Cards (Staggered)
            { selector: '.faq-item', type: 'reveal-card', stagger: true },
            
            // Footer Column Boxes (Staggered)
            { selector: '.footer-col-box', type: 'reveal-card', stagger: true }
        ];

        // IntersectionObserver with threshold & negative margin for anticipation
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealTargets.forEach(group => {
            const elements = document.querySelectorAll(group.selector);
            elements.forEach((el, index) => {
                el.classList.add('reveal-init', group.type);
                if (group.stagger) {
                    const delay = (index % 4) * 0.12;
                    el.style.setProperty('--reveal-delay', `${delay.toFixed(2)}s`);
                }
                revealObserver.observe(el);
            });
        });
    };

    // Run reveal observer after DOM is ready
    setupScrollReveal();

});
