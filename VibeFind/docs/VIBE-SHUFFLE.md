# Vibe Shuffle

Vibe Shuffle is a discovery tool available from Home, Explore, Delhi and Chandigarh Tricity. It helps visitors choose a real listing when they do not know what to do. It is intentionally hidden on About, Contact and individual Experience Detail pages, where it would distract from the page's primary task. The floating orbital shortcut stays out of the initial hero/ticker area and appears as a compact icon after the visitor begins scrolling; on small screens it waits until the visitor has moved beyond the hero.

## How it works
1. Select Anywhere, Delhi or Tricity.
2. Select Anything goes or one of the six VibeFind categories.
3. Select **Find my next plan**.
4. The tool randomly chooses a matching record from `VF.store`; where possible it avoids repeating the immediately previous pick.
5. Open the venue detail page, open its source Maps link if present, or save it.

The feature only uses the existing dataset. It does not claim that a venue is open, available, affordable or accepting bookings.

## Files
- `js/motion/shuffle.js` — behavior and live dataset selection.
- `css/innovations.css` — floating control, modal and result styling.
- `js/ui/nav.js` — mounts the feature only on discovery pages.
