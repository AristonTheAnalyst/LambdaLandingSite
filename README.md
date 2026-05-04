# Lambda Landing Site

Marketing / interest-gauging landing page for **Lambda** — a data-driven framework for resistance training.

Hosted via GitHub Pages at: <https://aristontheanalyst.github.io/LambdaLandingSite/>

## Stack

- Single static `index.html` with embedded CSS and vanilla JS.
- No build step, no dependencies.
- Google Fonts (Inter, JetBrains Mono) loaded via CDN.

## Local preview

Just open `index.html` in a browser, or serve the directory:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Wiring up the waitlist form

The email form currently stores submissions in `localStorage` as a placeholder so the page is testable end-to-end. To actually collect emails, set `FORM_ENDPOINT` near the bottom of `index.html` to your form-handler URL.

Drop-in compatible services (free tiers, no backend needed):

- [Formspree](https://formspree.io) — `https://formspree.io/f/<your-id>`
- [Getform](https://getform.io)
- [Web3Forms](https://web3forms.com)

The submit handler POSTs JSON `{ "email": "..." }` to whatever endpoint you set.
