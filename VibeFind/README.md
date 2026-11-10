# VibeFind — Final Website

A seven-page activity-discovery website for Delhi and Chandigarh Tricity, built with **HTML5, CSS3 and vanilla JavaScript**. No package install, build step or backend is required.

## Start the website

1. Extract the ZIP completely.
2. Open the inner `VibeFind` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Use the navigation to open Explore, Delhi, Chandigarh Tricity, About and Contact.
5. Select any venue card to open its dynamic Experience Detail page.

You can also open `tools/data-check.html` through Live Server to run the 43 original data-integrity checks.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Cinematic homepage, search, city cards, featured listings, one combined activity/mood/shortlist chapter and Area Explorer |
| `explore.html` | Searchable directory with city, region/zone, category, activity, mood and area filters |
| `delhi.html` | Delhi's nine-zone overview, popular area shortcuts and Delhi-only directory |
| `chandigarh.html` | Four-town Tricity overview, popular area shortcuts and Tricity directory |
| `experience.html` | Dynamic detail page selected by `?id=...` |
| `about.html` | Project purpose, principles and coverage |
| `contact.html` | Frontend-only venue suggestion form |

## Discovery features

- **Vibe Shuffle** is available on discovery pages (Home, Explore, Delhi and Tricity). Its floating orbital shortcut appears after the visitor starts scrolling so it does not cover the first-screen hero; it chooses a random record from the real dataset using optional city and category filters.
- The **Area Explorer** shows four popular areas per city by default. The complete searchable area index is available on demand. Delhi and Tricity pages provide five quick-area shortcuts, with the complete searchable Area filter available on demand.
- Search suggestions and venue cards link to the matching record's detail page.
- Saved venues are stored in the browser and can be opened from the Saved drawer.
- Google Maps links use the existing source-backed map URLs.

## Data and transparency

- **258 original records:** 188 Delhi and 70 Chandigarh Tricity.
- **99 specific named areas:** 65 Delhi and 34 Tricity. Twenty Tricity entries have town-level-only locations and are not counted as specific areas.
- The dataset in `js/data/experiences.js` is preserved. Review flags, possible duplicates, approximate locations and source caveats are documented in `docs/DATA-NOTES.md`.
- Venue prices, hours, ratings, reviews, photos and booking details were not present in the source dataset. The site does not invent them.
- Artwork is generated category illustration, not venue photography. Its background palette follows VibeFind’s near-black, charcoal and ultraviolet identity, with restrained lime and amber details.
- The “ideas to explore” research notes remain in `docs/DATA-NOTES.md`; they are not shown as bookable or listed venues.
- The Contact form prepares a message for copying. It does not send data to a server or invent a recipient.

## Cursor and motion

- The custom VibeFind cursor is enabled only for desktop fine-pointer devices. It uses an ultraviolet ring, electric-lime core and contextual hover labels.
- Touch and reduced-motion environments retain native cursor behaviour and use reduced animation.
- Scroll reveals, lighting and transitions are decorative; normal scrolling and keyboard interaction remain available.

## Project structure

- `css/` — design tokens, layout, components, responsive, motion and finishing styles.
- `js/data/` — configuration and the 258 source-derived venue records.
- `js/core/` — search/filter store, utilities and wishlist.
- `js/ui/` — cards, directory, shared navigation and category artwork.
- `js/motion/` — cursor, transitions, reveals, shuffle and polish.
- `js/pages/` — page-specific behaviour.
- `docs/` — data notes, QA report and screenshot guide.
- `tools/` — the original data-integrity checker.
- `_build/` — scripts and retained research/build artefacts; not needed to run the site.

## Browser compatibility note

Google Fonts load when online; system-font fallbacks are included. The site should be opened through Live Server rather than previewed from inside the ZIP. Verify appearance in the browser you will use for submission.
