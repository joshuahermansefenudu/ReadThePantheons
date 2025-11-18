// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Supabase client setup
    let supabaseClient = null;
    if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!email) return;

            if (!supabaseClient) {
                alert('Subscription service is temporarily unavailable. Please try again later.');
                return;
            }

            const payload = { email };

            try {
                const { error } = await supabaseClient
                    .from('newsletter_signups')
                    .insert(payload);

                if (error) throw error;

                showToast('Thanks! You\'re officially on the list.');
                newsletterForm.reset();
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            }
        });
    }

    // Add scroll effect to header
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
        
        lastScroll = currentScroll;
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const body = document.body;
    if (!body.classList.contains('chapter-page')) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Handle tier card buttons
    const tierButtons = document.querySelectorAll('.tier-card .btn-tier');
    const tierModals = {
        initiate: document.getElementById('tierModalInitiate'),
        pantheon: document.getElementById('tierModalPantheon')
    };

    // Founding Circle overlay handling (chapter pages)
    const foundingOverlay = document.getElementById('foundingCircleOverlay');
    const overlayTriggers = document.querySelectorAll('[data-overlay-trigger="founding-circle"]');

    const openFoundingOverlay = () => {
        if (!foundingOverlay) return;
        foundingOverlay.classList.add('active');
        foundingOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        const firstButton = foundingOverlay.querySelector('.btn-tier');
        if (firstButton) firstButton.focus();
    };

    const closeFoundingOverlay = () => {
        if (!foundingOverlay) return;
        foundingOverlay.classList.remove('active');
        foundingOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    };

    overlayTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openFoundingOverlay();
        });
    });

    if (foundingOverlay) {
        const overlayClose = foundingOverlay.querySelector('.founding-overlay-close');
        overlayClose?.addEventListener('click', closeFoundingOverlay);

        foundingOverlay.addEventListener('click', (event) => {
            if (event.target === foundingOverlay) {
                closeFoundingOverlay();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && foundingOverlay.classList.contains('active')) {
                closeFoundingOverlay();
            }
        });
    }

    const openTierModal = (tier) => {
        const modal = tierModals[tier];
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    };

    const closeTierModal = (modal) => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    };

    const paymentLinks = {
        initiate: 'https://buy.stripe.com/6oU7sL6VobAugL32TVbQY00',
        pantheon: 'https://buy.stripe.com/aFacN54Ng9sm8exdyzbQY01'
    };

    tierButtons.forEach(button => {
        const tier = button.dataset.tier;
        button.addEventListener('click', () => openTierModal(tier));
    });

    const tierTableMap = {
        initiate: 'initiate_tier_signups',
        pantheon: 'pantheon_tier_signups'
    };

    Object.entries(tierModals).forEach(([tier, modal]) => {
        if (!modal) return;
        const closeBtn = modal.querySelector('.tier-modal-close');
        const form = modal.querySelector('form');
        closeBtn.addEventListener('click', () => closeTierModal(modal));
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeTierModal(modal);
            }
        });
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const stripeUrl = paymentLinks[tier];
            const payload = {
                name: form.querySelector('input[name="name"]').value.trim(),
                email: form.querySelector('input[name="email"]').value.trim(),
                phone: form.querySelector('input[name="phone"]').value.trim() || null
            };

            if (!payload.email || !payload.name) {
                alert('Please fill out the required fields.');
                return;
            }

            if (supabaseClient && tierTableMap[tier]) {
                try {
                    await supabaseClient
                        .from(tierTableMap[tier])
                        .insert(payload);
                } catch (err) {
                    console.error('Supabase insert failed', err);
                }
            }

            closeTierModal(modal);
            if (stripeUrl) {
                window.open(stripeUrl, '_blank', 'noopener');
            }
        });
        form.dataset.tier = tier;
    });

    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        const primaryNavLinks = primaryNav.querySelectorAll('a');

        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('is-open');
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMenu();
            } else {
                menuToggle.setAttribute('aria-expanded', 'true');
                primaryNav.classList.add('is-open');
                document.body.classList.add('menu-open');
            }
        });

        primaryNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.getAttribute('aria-expanded') === 'true') {
                    closeMenu();
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1200) {
                closeMenu();
            }
        });
    }

    // Accordion handling on chapter page
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    const scrollAccordionIntoView = (item) => {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offsetTop = item.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    };

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isOpen = item.classList.contains('open');
            accordionTriggers.forEach(btn => btn.closest('.accordion-item').classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
                requestAnimationFrame(() => scrollAccordionIntoView(item));
            }
        });
    });

    // Scroll-to-top button for chapter pages
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        const toggleScrollTopVisibility = () => {
            if (window.pageYOffset > 250) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleScrollTopVisibility);
        toggleScrollTopVisibility();
    }
});


    const showToast = (message) => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('toast-visible');
        setTimeout(() => toast.classList.remove('toast-visible'), 3000);
    };
