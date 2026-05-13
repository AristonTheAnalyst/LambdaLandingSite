(function () {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

(function initPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) {
        document.body.classList.add('is-ready');
        return;
    }
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function finish() {
        document.body.classList.add('is-ready');
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-busy', 'false');
        loader.setAttribute('aria-label', 'Page loaded');
        loader.addEventListener('transitionend', function onEnd(ev) {
            if (ev.propertyName === 'opacity' && loader.classList.contains('is-hidden')) {
                loader.remove();
            }
        }, { once: true });
    }

    if (reducedMotion) {
        finish();
        return;
    }

    var minMs = 480;
    var started = performance.now();
    function scheduleFinish() {
        var elapsed = performance.now() - started;
        var wait = Math.max(0, minMs - elapsed);
        setTimeout(finish, wait);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleFinish, scheduleFinish);
    } else {
        window.addEventListener('load', scheduleFinish, { once: true });
    }
})();

(function initScrollReveals() {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');
    if (!nodes.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        nodes.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });

    nodes.forEach(function (el) { io.observe(el); });
})();

(function initCarousels() {
    function slideDelta(track) {
        var el = track.firstElementChild;
        if (!el) return 0;
        var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
        return el.getBoundingClientRect().width + gap;
    }

    function updateButtons(track, prev, next) {
        var max = track.scrollWidth - track.clientWidth;
        if (max <= 0) {
            prev.disabled = true;
            next.disabled = true;
            return;
        }
        var x = track.scrollLeft;
        prev.disabled = x <= 2;
        next.disabled = x >= max - 2;
    }

    document.querySelectorAll('.carousel-wrap').forEach(function (wrap) {
        var track = wrap.querySelector('.carousel-track');
        var prev = wrap.querySelector('.carousel-btn--prev');
        var next = wrap.querySelector('.carousel-btn--next');
        if (!track || !prev || !next) return;

        function onScroll() {
            updateButtons(track, prev, next);
        }

        prev.addEventListener('click', function () {
            var d = slideDelta(track);
            if (d) {
                var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                track.scrollBy({ left: -d, behavior: smooth ? 'smooth' : 'auto' });
            }
        });
        next.addEventListener('click', function () {
            var d = slideDelta(track);
            if (d) {
                var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                track.scrollBy({ left: d, behavior: smooth ? 'smooth' : 'auto' });
            }
        });
        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    });
})();

var FORM_ENDPOINT = 'https://formspree.io/f/xlgzvgee';

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function attachForm(form, status) {
    if (!form || !status) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var button = form.querySelector('button');
        var email = input.value.trim();

        if (!isValidEmail(email)) {
            status.textContent = 'Please enter a valid email address.';
            status.className = 'signup-status error';
            return;
        }

        button.disabled = true;
        button.classList.add('is-loading');
        button.setAttribute('aria-busy', 'true');

        try {
            if (FORM_ENDPOINT) {
                var res = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                if (!res.ok) throw new Error('Network error');
            } else {
                var stored = JSON.parse(localStorage.getItem('lambda_waitlist') || '[]');
                stored.push({ email: email, ts: Date.now() });
                localStorage.setItem('lambda_waitlist', JSON.stringify(stored));
                await new Promise(function (r) { setTimeout(r, 400); });
            }
            status.textContent = "You're on the list. We'll be in touch.";
            status.className = 'signup-status success';
            form.reset();
        } catch (err) {
            status.textContent = 'Something went wrong. Try again in a moment.';
            status.className = 'signup-status error';
        } finally {
            button.disabled = false;
            button.classList.remove('is-loading');
            button.setAttribute('aria-busy', 'false');
        }
    });
}

(function initMobileNav() {
    var btn = document.querySelector('.nav-hamburger');
    var nav = btn && btn.closest('nav');
    if (!btn || !nav) return;

    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function open() {
        nav.classList.add('nav--open');
        overlay.classList.add('is-visible');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        nav.classList.remove('nav--open');
        overlay.classList.remove('is-visible');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
        nav.classList.contains('nav--open') ? close() : open();
    });

    overlay.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });
})();

(function initTextSwap() {
    var el = document.getElementById('feature-swap-label');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var labels = ['No bloatware.', 'Just training.'];
    var i = 0;
    var dur = 300;
    setInterval(function () {
        // exit: slide up + fade out
        el.style.transition = 'opacity ' + dur + 'ms ease, transform ' + dur + 'ms ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(function () {
            // instant reposition to below, swap text
            el.style.transition = 'none';
            el.style.transform = 'translateY(10px)';
            i = (i + 1) % labels.length;
            el.textContent = labels[i];
            // force reflow so the browser registers the reset before re-enabling transition
            void el.offsetWidth;
            // enter: slide up + fade in
            el.style.transition = 'opacity ' + dur + 'ms ease, transform ' + dur + 'ms ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, dur + 20);
    }, 2800);
})();

document.querySelectorAll('form.signup').forEach(function (form) {
    var scope = form.closest('.cta-card') || form.parentElement;
    var status = scope.querySelector('.signup-status');
    attachForm(form, status);
});
