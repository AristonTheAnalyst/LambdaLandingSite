(function () {
    'use strict';

    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* ---------- Waitlist ---------- */

    var FORM_ENDPOINT = 'https://formspree.io/f/xlgzvgee';
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setStatus(status, message, state) {
        status.textContent = message;
        status.classList.toggle('is-error', state === 'error');
        status.classList.toggle('is-success', state === 'success');
    }

    document.querySelectorAll('[data-waitlist]').forEach(function (form) {
        var input = form.querySelector('input[type="email"]');
        var button = form.querySelector('button[type="submit"]');
        var status = form.querySelector('.form-status');

        if (!input || !button || !status) return;

        input.addEventListener('input', function () {
            if (input.getAttribute('aria-invalid') === 'true') {
                input.removeAttribute('aria-invalid');
            }

            if (status.textContent) {
                setStatus(status, '', '');
            }
        });

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            if (button.disabled) return;

            var email = input.value.trim();

            if (!EMAIL_PATTERN.test(email)) {
                input.setAttribute('aria-invalid', 'true');
                setStatus(status, 'Please enter a valid email address.', 'error');
                input.focus();
                return;
            }

            input.removeAttribute('aria-invalid');
            setStatus(status, '', '');
            button.disabled = true;
            button.classList.add('is-loading');
            button.setAttribute('aria-busy', 'true');
            form.setAttribute('aria-busy', 'true');

            try {
                if (window.location.protocol === 'file:') {
                    // Local preview only: there is no server to receive the POST.
                    var stored = JSON.parse(localStorage.getItem('lambda_waitlist') || '[]');
                    stored.push({ email: email, ts: Date.now() });
                    localStorage.setItem('lambda_waitlist', JSON.stringify(stored));
                } else {
                    var response = await fetch(FORM_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ email: email })
                    });

                    if (!response.ok) {
                        throw new Error('Formspree responded ' + response.status);
                    }
                }

                setStatus(status, 'You’re on the list. We’ll be in touch.', 'success');
                form.reset();
            } catch (error) {
                setStatus(
                    status,
                    'Something went wrong. Try again in a moment, or email contact@lambda-training.com.',
                    'error'
                );
            } finally {
                button.disabled = false;
                button.classList.remove('is-loading');
                button.setAttribute('aria-busy', 'false');
                form.removeAttribute('aria-busy');
            }
        });
    });

    /* ---------- Privacy contents scrollspy ---------- */

    (function initTocScrollspy() {
        var links = Array.prototype.slice.call(
            document.querySelectorAll('.legal-toc a[href^="#"]')
        );

        if (!links.length) return;

        var entries = links
            .map(function (link) {
                var target = document.getElementById(link.getAttribute('href').slice(1));
                return target ? { link: link, target: target } : null;
            })
            .filter(Boolean);

        if (!entries.length) return;

        var ticking = false;

        function setCurrent(entry) {
            entries.forEach(function (item) {
                var active = item === entry;
                item.link.classList.toggle('is-active', active);

                if (active) {
                    item.link.setAttribute('aria-current', 'location');
                } else {
                    item.link.removeAttribute('aria-current');
                }
            });
        }

        function update() {
            ticking = false;

            var probe = 96;
            var current = entries[0];

            entries.forEach(function (entry) {
                if (entry.target.getBoundingClientRect().top <= probe) {
                    current = entry;
                }
            });

            var atBottom =
                window.innerHeight + window.pageYOffset >=
                document.documentElement.scrollHeight - 4;

            if (atBottom) {
                current = entries[entries.length - 1];
            }

            setCurrent(current);
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        window.addEventListener('hashchange', onScroll);
        update();
    })();
})();
