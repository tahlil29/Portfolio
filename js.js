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
