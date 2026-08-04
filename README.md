Source-code for the Cyprus AI Conference: https://cyprusai.cy/

## Archive convention

The repo root always holds the site for the current/upcoming conference year.
Past years are archived in place under a `/<YEAR>/` folder (e.g. `/2025/`),
which stays live at `cyprusai.cy/<YEAR>/`. When rolling over to a new year:

1. `git mv` the current root site (HTML/CSS/JS/images/gallery/etc.) into a new
   `/<YEAR>/` folder for the year that just concluded.
2. Copy back the reusable, non-year-specific assets (`styles.css`, `script.js`,
   `images/`, `favicon.ico`) to the root for the new year.
3. Reset `index.html`, `speakers.js`, and `programme.js` at the root with the
   new year's content (or empty placeholders until details are confirmed).
4. Cross-link the two: the new root site links to `/<YEAR>/` as the past
   conference, and the archived `/<YEAR>/` site keeps a banner linking back
   to `/`.

`CNAME` and `README.md` stay at the repo root and are not year-specific.

## Cache-busting

`index.html` loads `styles.css`, `speakers.js`, `programme.js`, and `script.js`
with a `?v=N` query string. Bump that number whenever you edit one of those
files so browsers/CDN don't keep serving a stale cached copy after a content
update (e.g. adding speakers or a new programme). Root and `/<YEAR>/` archives
version independently.
