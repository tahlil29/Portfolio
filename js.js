// Billboard — idle sway + phone scale-to-fit (full board, not stacked)
(() => {
    const board = document.querySelector('[data-pin-board]');
    const fit = document.querySelector('.board-fit');
    if (!board) return;

    requestAnimationFrame(() => board.classList.add('is-live'));

    const fitBoard = () => {
        if (!fit) return;
        const mq = window.matchMedia('(max-width: 900px)');
        if (!mq.matches) {
            fit.style.removeProperty('--board-scale');
            fit.style.removeProperty('--board-natural-height');
            fit.style.height = '';
            return;
        }

        const designWidth = parseFloat(getComputedStyle(fit).getPropertyValue('--board-design-width')) || 980;
        const available = fit.clientWidth || (window.innerWidth - 16);
        const scale = Math.min(1, available / designWidth);
        fit.style.setProperty('--board-scale', String(scale));

        // Measure natural height without the scaled wrapper constraint
        fit.style.height = 'auto';
        const inner = board.querySelector('.board') || board;
        const shellStyles = getComputedStyle(board);
        const padY = (parseFloat(shellStyles.paddingTop) || 0) + (parseFloat(shellStyles.paddingBottom) || 0);
        const naturalHeight = (inner.scrollHeight || inner.offsetHeight) + padY;

        if (naturalHeight > 0) {
            fit.style.setProperty('--board-natural-height', `${naturalHeight}px`);
            fit.style.height = `${naturalHeight * scale}px`;
        }
    };

    const scheduleFit = () => requestAnimationFrame(fitBoard);

    scheduleFit();
    window.addEventListener('resize', scheduleFit);
    window.addEventListener('orientationchange', scheduleFit);
    if (document.fonts?.ready) document.fonts.ready.then(scheduleFit);
    window.addEventListener('load', scheduleFit);
})();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

function applyTheme(theme) {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        if (metaTheme) metaTheme.setAttribute('content', '#121110');
    } else {
        root.removeAttribute('data-theme');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        if (metaTheme) metaTheme.setAttribute('content', '#1c1917');
    }
}

applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        updateNavbarOnScroll();
    });
}

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

function updateNavbarOnScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('is-scrolled');
    } else {
        navbar.classList.remove('is-scrolled');
    }
}

window.addEventListener('scroll', updateNavbarOnScroll);
updateNavbarOnScroll();

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// (Skill ring charts removed — clean skill name layout)

// Active Link Highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (current && href.includes(current) && !link.classList.contains('btn-nav')) {
            link.classList.add('active');
        }
    });
});

// Carousels — projects & case studies
function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = [...carousel.querySelectorAll('.carousel-slide')];
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        if (!track || !slides.length) return;

        let index = 0;
        const autoplayMs = Number(carousel.dataset.autoplay) || 0;
        let timer = null;

        function visibleCount() {
            const first = slides[0];
            if (!first) return 1;
            const slideWidth = first.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            const viewport = carousel.querySelector('.carousel-viewport').clientWidth;
            return Math.max(1, Math.round((viewport + gap) / (slideWidth + gap)));
        }

        function maxIndex() {
            return Math.max(0, slides.length - visibleCount());
        }

        function update() {
            index = Math.min(Math.max(index, 0), maxIndex());
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
        }

        function next() {
            index = index >= maxIndex() ? 0 : index + 1;
            update();
        }

        function prev() {
            index = index <= 0 ? maxIndex() : index - 1;
            update();
        }

        function startAutoplay() {
            if (!autoplayMs) return;
            stopAutoplay();
            timer = setInterval(next, autoplayMs);
        }

        function stopAutoplay() {
            if (timer) clearInterval(timer);
            timer = null;
        }

        prevBtn?.addEventListener('click', () => {
            prev();
            startAutoplay();
        });
        nextBtn?.addEventListener('click', () => {
            next();
            startAutoplay();
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        window.addEventListener('resize', update);

        update();
        startAutoplay();
    });
}

initCarousels();

// Experience smooth area graph
const expObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const block = entry.target;
        const path = block.querySelector('[data-path]');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            path.getBoundingClientRect();
            block.classList.add('is-on');
            path.style.strokeDashoffset = '0';
        } else {
            block.classList.add('is-on');
        }
        observer.unobserve(block);
    });
}, { threshold: 0.3 });

document.querySelectorAll('.exp-bento').forEach(block => {
    expObserver.observe(block);

    const svg = block.querySelector('.exp-area-chart');
    const wrap = block.querySelector('[data-chart-wrap]');
    const points = [...block.querySelectorAll('[data-point]')];
    const crosshair = block.querySelector('[data-crosshair]');
    const markerRing = block.querySelector('.exp-marker-ring');
    const markerDot = block.querySelector('.exp-marker-dot');
    const footDate = block.querySelector('[data-exp-date]');
    const footMetric = block.querySelector('[data-exp-metric]');
    const floatLabel = block.querySelector('[data-float-label]');
    const floatName = block.querySelector('[data-float-name]');
    let activePoint = null;

    const placeFloat = (x, y) => {
        if (!floatLabel || !svg || !wrap) return;
        const rect = svg.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const left = ((Number(x) / 880) * rect.width) + (rect.left - wrapRect.left);
        const top = ((Number(y) / 260) * rect.height) + (rect.top - wrapRect.top);
        floatLabel.style.left = `${left}px`;
        floatLabel.style.top = `${top}px`;
    };

    const activate = (point, showFloat = true) => {
        if (!point || point === activePoint) {
            if (showFloat && floatLabel) floatLabel.classList.add('is-visible');
            return;
        }
        activePoint = point;
        points.forEach(p => p.classList.remove('is-active'));
        point.classList.add('is-active');

        const x = point.getAttribute('data-x');
        const y = point.getAttribute('data-y');
        const name = point.getAttribute('data-name') || '';
        const date = point.getAttribute('data-date') || '';
        const note = point.getAttribute('data-note') || '';

        if (crosshair) {
            crosshair.setAttribute('x1', x);
            crosshair.setAttribute('x2', x);
        }
        if (markerRing && markerDot) {
            markerRing.setAttribute('cx', x);
            markerRing.setAttribute('cy', y);
            markerDot.setAttribute('cx', x);
            markerDot.setAttribute('cy', y);
        }
        if (footDate) footDate.textContent = date;
        if (footMetric) footMetric.textContent = note;
        if (floatName) floatName.textContent = name;
        placeFloat(x, y);
        if (floatLabel) {
            if (showFloat) floatLabel.classList.add('is-visible');
            else floatLabel.classList.remove('is-visible');
        }
    };

    const nearestFromEvent = (event) => {
        if (!svg) return points[0];
        const ctm = svg.getScreenCTM();
        if (!ctm) return points[0];
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const loc = pt.matrixTransform(ctm.inverse());
        let nearest = points[0];
        let best = Infinity;
        points.forEach(p => {
            const dx = Math.abs(Number(p.getAttribute('data-x')) - loc.x);
            if (dx < best) {
                best = dx;
                nearest = p;
            }
        });
        return nearest;
    };

    if (wrap) {
        wrap.addEventListener('mousemove', (event) => {
            activate(nearestFromEvent(event), true);
        });
        wrap.addEventListener('mouseleave', () => {
            if (floatLabel) floatLabel.classList.remove('is-visible');
        });
        wrap.addEventListener('touchmove', (event) => {
            if (!event.touches?.[0]) return;
            const touch = event.touches[0];
            activate(nearestFromEvent(touch), true);
        }, { passive: true });
    }

    window.addEventListener('resize', () => {
        if (activePoint) {
            placeFloat(activePoint.getAttribute('data-x'), activePoint.getAttribute('data-y'));
        }
    });

    const initial = block.querySelector('.exp-hit.is-active') || points[4] || points[0];
    if (initial) activate(initial, false);
});

// Contact form — AJAX FormSubmit with inline status
(() => {
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMessage');
    if (!form || !btn || !msg) return;

    const showMessage = (text, type) => {
        msg.hidden = false;
        msg.textContent = text;
        msg.classList.remove('is-success', 'is-error');
        msg.classList.add(type === 'success' ? 'is-success' : 'is-error');
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value) return;

        btn.disabled = true;
        const original = btn.innerHTML;
        btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
        msg.hidden = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                form.reset();
                showMessage('Message sent — I’ll get back to you soon.', 'success');
            } else {
                showMessage('Couldn’t send right now. Email me directly instead.', 'error');
            }
        } catch (_) {
            showMessage('Network issue. Try again or email me directly.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = original;
        }
    });
})();
