# Krpan Margaret DC — Valley Village, CA

Single-page marketing site for Krpan Margaret DC, a chiropractic practice in Valley Village,
Los Angeles. Built with vanilla HTML, CSS and JavaScript — no build step, no dependencies,
no environment variables.

## Files

| File          | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `index.html`  | Entry point — all page sections, meta tags, JSON-LD structured data |
| `styles.css`  | Full stylesheet (design tokens, layout, responsive + print styles) |
| `script.js`   | Mobile nav, sticky header, scroll spy, reveal animations, form validation |
| `favicon.svg` | Favicon placeholder (inline SVG spine mark)                        |

## Sections

Hero with call-to-action · availability card · practice highlights · services overview ·
about the practice · patient testimonials · what to expect on a first visit ·
call-to-action band · contact details and request-a-call-back form · footer.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- The contact form is client-side only. It validates input and confirms the details back to
  the visitor; it does not post to a server or third-party API (none was configured).
- No photography is included — the design relies on typography, colour and inline SVG icons
  rather than unverified stock imagery.
- Accessibility: skip link, semantic landmarks, labelled form fields with inline error
  messaging, visible focus styles, and a `prefers-reduced-motion` fallback.
