# Vibhor संग Deepanshi — wedding invitation

Live: https://vaibhava17.github.io/wedding/

Single-page, mobile-first digital invitation (Hindi + English). Plain HTML/CSS/ES modules, no build step.
Content is taken word for word from the printed card (Thursday 10 Dec 2026, Hotel Seeta Kiran, Civil Lines, Bareilly).

## Run locally

```bash
python3 -m http.server 5174
# open http://127.0.0.1:5174/
```

## Share links

| Link | Effect |
|---|---|
| `/wedding/` | Hindi (default) |
| `/wedding/?lang=en` | English |
| `/wedding/?to=Sharma%20Parivar` | Doors greet "आदरणीय Sharma Parivar" — personalise per family |

## Sections

1. **Gate** — carved doors + 3D marigold toran (sways with cursor / phone tilt). Tap → doors open, petal shower.
2. **Hero** — names in gold, gathbandhan knot, countdown, Save the date.
3. **Patrika** — full card text, auto-scaled to fit one screen. Snaps from the hero.
4. **मांगलिक कार्यक्रम** — scroll moves the day 10:30 → dusk and snaps to each event. The baraat (dhol, shehnai, groom on ghodi) walks from home to the venue, the bride waits for jaimala, they return together for vadhu aagman; lights + moon at night.
5. **विवाह स्थल** — jharokha-framed map, directions, save the date.
6. **बाल आग्रह** — Manvik (illustrated, waving) + handwritten note.
7. **Family** — दर्शनाभिलाषी / विनीत (with call buttons) / स्वागतोत्सुक.
8. **Finale** — save the date 10·12·2026; the baraat arrives at the haveli where the bride waits with the varmala.

## Save the date

- Android / desktop → Google Calendar "add event" (opens the Calendar app on Android).
- iPhone / Mac → `assets/vibhor-deepanshi-wedding.ics` (Calendar "add event" sheet), reminders 1 day and 2 hours before.

## Customise

- **Text**: `js/i18n.js` (`hi` + `en`).
- **Music**: add an mp3 under `assets/audio/` and set `MUSIC_SRC` in `js/main.js`.
- **Characters**: `js/illustrations.js` (hand-built SVG).
- **Colours**: tokens at top of `css/style.css`.

## Tech

three r185 (instanced marigolds, verlet-rope ladis, petals), GSAP 3.15 + ScrollTrigger, Lenis — via CDN import map. Fonts: Rozha One, Tiro Devanagari Hindi, Mukta, Kalam.
