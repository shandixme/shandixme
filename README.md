# shandixme.com

Static site: plain HTML, CSS and two small scripts. No build step.

## Files

- `index.html` — home (hero sky, works inventory, contact)
- `about.html` — bio and experience
- `work-unfed-time.html` — project page; copy this file to make a new project page
- `css/style.css` — shared styles (cursor, twinkle, inventory slots)
- `js/main.js` — inventory clicks, twinkling stars, pixel photo hover, cursor star trail
- `js/intro.js` — opening animation on the home page (pixel desktop computer). To remove it, delete the two lines marked "opening animation" in the `<head>` of `index.html`
- `img/` — cursor images, site icon (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`); put photos here
- `CNAME` — tells GitHub Pages the site lives at shandixme.com

## Editing text

Open the `.html` file in any text editor, search for the sentence, retype it, save, upload.
Anything in `[square brackets]` is a placeholder waiting for your content.

## Adding a photo

1. Put the file in `img/`, e.g. `img/unfed-time-01.jpg`.
2. Replace a placeholder box's text, e.g. `[main exhibition photo]`, with
   `<img src="img/unfed-time-01.jpg" alt="Describe the photo" style="width:100%;height:100%;object-fit:cover;image-rendering:auto">`

## Adding a work

1. Copy `work-unfed-time.html`, rename it (e.g. `work-colour-consumption.html`), edit its text.
2. In `index.html`, find the `WORKS` comment. Each work is one `<button class="slot" …>`.
   Set `data-href="work-colour-consumption.html"` on that work's button
   (an empty `data-href=""` hides the "Open project" button).
   To add another work, copy a whole `<button>…</button>` block and change its
   `data-no`, `data-title`, `data-meta`, and the two `<span>` texts.
