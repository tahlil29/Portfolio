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

const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

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
        if (current && href.includes(`#${current}`) && !link.classList.contains('btn-nav')) {
            link.classList.add('active');
        }
    });
});

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

(() => {
    const nav = document.querySelector('[data-proto-nav]');
    if (!nav) return;

    const titleEl = document.querySelector('[data-proto-title]');
    const bodyEl = document.querySelector('[data-proto-body]');
    const screens = [
        ['Onboarding', 'Personalized questions → interests and goals → path into first value.'],
        ['First lesson', 'First Lesson Preview inserted into existing onboarding — value before habit.'],
        ['Daily challenge', 'Today\'s task: complete your first AI lesson · 5 min · +50 XP.'],
        ['Lesson', '5-minute generative AI lesson with checks and hands-on activity.'],
        ['Reward', '+50 XP · streak · tomorrow\'s challenge teased on the reward screen.'],
        ['Home', 'Action → progress → exploration: challenge first, then streak/XP, then browse.'],
        ['Progress', 'Streak, XP and calendar make returning tomorrow feel earned.']
    ];

    nav.querySelectorAll('button[data-screen]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = Number(btn.dataset.screen);
            nav.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const screen = screens[index];
            if (screen && titleEl) titleEl.textContent = screen[0];
            if (screen && bodyEl) bodyEl.textContent = screen[1];
        });
    });
})();

(() => {
    const root = document.querySelector('[data-growth-root]');
    if (!root) return;

    const chart = root.querySelector('[data-growth-chart]');
    const tooltip = root.querySelector('#growth-tooltip');
    const path = root.querySelector('[data-growth-path]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const milestones = [
        {
            year: '2024',
            title: 'Design',
            highlights: ['Visual design', 'Creative work', 'User-facing digital experiences'],
            scroll: '#experience',
            note: ''
        },
        {
            year: '2025',
            title: 'Development & product building',
            highlights: ['Web development', 'Python / Flask', 'Personal projects', 'Thinking beyond implementation'],
            scroll: '#projects',
            note: ''
        },
        {
            year: '2026',
            title: 'Product operations',
            highlights: ['ToBa Tech', 'Product operations', 'Task & workflow management', 'Stakeholder communication'],
            scroll: '#experience',
            note: ''
        },
        {
            year: '2026',
            title: 'Product strategy',
            highlights: ['Product case studies', 'Retention analysis & UX', 'Experiment design', 'Product & strategy work'],
            scroll: '#work',
            note: ''
        },
        {
            year: '2027',
            title: 'PM / APM · target direction',
            highlights: ['Product Management', 'Associate Product Management', 'Product Operations', 'Discovery → execution ownership'],
            scroll: '#contact',
            note: 'Career direction — not a role already held.'
        }
    ];

    milestones.forEach((m, i) => {
        const sr = root.querySelector(`#growth-tip-${i}`);
        if (sr) sr.textContent = `${m.year} ${m.title}: ${m.highlights.join(', ')}`;
    });

    const renderTooltip = (m, node) => {
        if (!tooltip || !node) return;
        const list = m.highlights.map((h) => `<li>${h}</li>`).join('');
        const note = m.note ? `<p class="growth-tip-note">${m.note}</p>` : '';
        tooltip.innerHTML = `<strong>${m.year} · ${m.title}</strong><ul>${list}</ul>${note}`;
        tooltip.hidden = false;

        const wrap = chart.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        const left = rect.left - wrap.left + rect.width / 2;
        const top = rect.top - wrap.top;
        tooltip.style.left = `${Math.min(Math.max(left, 120), wrap.width - 120)}px`;
        tooltip.style.top = `${Math.max(top - 12, 8)}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
    };

    const hideTooltip = () => {
        if (tooltip) tooltip.hidden = true;
        root.querySelectorAll('.growth-node.is-active').forEach((n) => n.classList.remove('is-active'));
    };

    const goTo = (selector) => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    };

    root.querySelectorAll('.growth-node[data-growth-index]').forEach((node) => {
        const index = Number(node.dataset.growthIndex);
        const m = milestones[index];
        if (!m) return;

        node.addEventListener('mouseenter', () => {
            root.querySelectorAll('.growth-node').forEach((n) => n.classList.remove('is-active'));
            node.classList.add('is-active');
            renderTooltip(m, node);
        });
        node.addEventListener('focus', () => {
            node.classList.add('is-active');
            renderTooltip(m, node);
        });
        node.addEventListener('mouseleave', hideTooltip);
        node.addEventListener('blur', hideTooltip);
        node.addEventListener('click', () => goTo(m.scroll));
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goTo(m.scroll);
            }
        });
    });

    root.querySelectorAll('.growth-mobile .growth-milestone[data-growth-index]').forEach((card) => {
        const index = Number(card.dataset.growthIndex);
        const m = milestones[index];
        if (!m) return;
        const activate = () => goTo(m.scroll);
        card.addEventListener('click', activate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    if (chart && path && !reducedMotion) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                chart.classList.add('is-visible');
                path.style.strokeDashoffset = '0';
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        io.observe(chart);
    } else if (chart) {
        chart.classList.add('is-visible');
        if (path) {
            path.style.strokeDasharray = 'none';
            path.style.strokeDashoffset = '0';
        }
    }
})();
