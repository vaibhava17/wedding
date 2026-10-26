# CLAUDE.md

Wedding invitation site for Vibhor संग Deepanshi (real family wedding, 10 Dec 2026, Bareilly). Hosted on GitHub Pages: https://vaibhava17.github.io/wedding/ (repo `vaibhava17/wedding`, push via `git@github-personal:`, commits as vaibhava17).

## Stack

No build. `index.html` + `css/style.css` + ES modules in `js/`; three / gsap / lenis pinned via CDN import map in `index.html`. Serve: `python3 -m http.server 5174`.

## Files

- `js/i18n.js` — ALL copy, `hi` + `en`. Elements use `data-i18n` (+ `data-i18n-html` when value has `<br>`), attrs via `data-i18n-attr="attr:key"`.
- `js/main.js` — gate, hero, patrika fit-to-screen, day/sky journey + procession, snapping, save-the-date, finale.
- `js/floral.js` — three.js marigold toran + petals (ortho camera in CSS px).
- `js/illustrations.js` — SVG characters (groom on horse, bride, dholi, trumpeter, haveli, kid).
- `assets/vibhor-deepanshi-wedding.ics` — static calendar file (CRLF line endings, keep them).

## Rules

- Card text is exact (spellings like गुरूवार, गनेश, आर्शीवाद kept as printed) — don't "fix" Hindi without asking.
- Public repo contains family phone numbers + address (approved by user for GitHub Pages).
- Other functions (haldi, mehendi etc.) will be separate cards — not on this page.
- Test on mobile width (390×844) first; verify via headless Chrome with a separate `--user-data-dir`, never the user's browser.
- Don't commit/push unless asked.
