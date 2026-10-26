# Lambda Landing Site

Two-page marketing site for **Lambda** — a data-driven framework for resistance training.

- **`index.html`** — landing page: the training loop, app previews, methodology and the early-access waitlist.
- **`privacy.html`** — privacy policy, linked from the footer on both pages and structured around the App Store App Privacy data categories.

Hosted via GitHub Pages at <https://lambda-training.com> (`CNAME`).

## Design

The site mirrors the Lambda app's design system: charcoal grounds, warm cream ink, amber for PRs and brand emphasis, Manrope for UI text and JetBrains Mono for data and uppercase micro-labels. Colours, radii, spacing and component recipes follow `lib/core/styles/` and the design skills in the app repository.

- Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no analytics.
- Fonts loaded from Google Fonts (Manrope, JetBrains Mono).
- App mockups are built from semantic HTML and CSS — no screenshots.

## Local preview

Open `index.html` directly, or serve the directory:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Waitlist

Both forms post to Formspree:

```html
<form action="https://formspree.io/f/xlgzvgee" method="POST" data-waitlist novalidate>
```

With JavaScript enabled, `site.js` intercepts the submit, validates the address and POSTs JSON `{ "email": "..." }` to `FORM_ENDPOINT`; the `action`/`method` attributes are the no-JavaScript fallback.

When the page is opened from `file://`, submissions are stored in `localStorage` under `lambda_waitlist` so the form can be tested without a server. To point the forms at a different handler, change both the form `action` attributes in `index.html` and `FORM_ENDPOINT` in `site.js`.

## Repository contents

- `index.html`, `privacy.html` — the two pages.
- `styles.css` — all site styles and design tokens.
- `site.js` — waitlist handling, footer year, privacy-policy contents scrollspy.
- `favicon.svg` — amber Lambda mark on a dark rounded square.
- `copywrite.md` — earlier copy deck, kept for reference; the site no longer uses it.
