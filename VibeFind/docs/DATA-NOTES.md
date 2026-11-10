# VibeFind data notes

**Source of truth:** `js/data/experiences.js` (258 records). Generated deterministically from the three source files by `_build/extract.py` then `_build/build_data.py`. The site itself needs no build step; the Python scripts are a dev-time record of how the data was produced.

## Counts
| | Delhi | Tricity | Total |
|---|---|---|---|
| Records | 188 (`del-001`..`del-188`) | 70 (`chd-001`..`chd-070`) | 258 |
| Area groups | 65 | 38 (34 specific + 4 placeholder labels) | |
| Zones / regions | 9 | 4 | |
| Category tags | 202 (12 multi-tagged) | 73 (3 multi-tagged) | |

Record IDs map to source IDs by number: `del-017` = `v17-...` in `delhi.html`; `chd-017` = `v17-...` in `chandigarh.html`. Every record keeps a full `rawSource` object (original id, zone, area, tags, type line, activities, address, links).

## Not in the source (all null / empty on purpose)
Prices (0/258), descriptions, venue photos, opening hours, ratings, reviews, coordinates, booking links. Price UI stays hidden while `VF.store.pricedCount` is 0. "Ideas to explore" (11 Delhi, 14 Tricity) are stored in `meta.ideas`, never as listings.

## Derived fields (rule-based, traceable)
- **subcategories**: regex over activity text only. `subcategoryEvidence` records the matched term and the activity line. Records with no match stay `unspecified` (8 gaming records). Original category tags are never changed.
- **addressPrecision** (`exact` / `locality` / `city`): heuristic on address text, not verified. 171+36 exact, 17+15 locality, 19 city.
- **directionsUrl**: built from the same name + address query as the original map URL. No coordinates invented.
- **links[].kind**: `listing` (aggregator), `operator` (brand/operator domain), `mall`, `government`, `unclassified`. Nothing is `official`; `checked` is false everywhere.
- **brand**: set only where a brand appears on 2+ records.
- **moods / featured**: taken only from the source "Quick picks" lists (48 records).

## Review flags (kept, never auto-fixed)
- **Possible duplicates:** `del-169` and `del-172` (EOD Adventure Park name variants, same address); `del-170` Bowling Alley is likely inside EOD; `chd-048` HopUp and `chd-049` WOOP (near-identical Singhpura address and activities).
- **Area vs address mismatches:** `del-167` (V3S Mall, Laxmi Nagar vs Nirman Vihar), `del-160` (V3S in address), `del-186` Cue Zone, `del-180` The billiards, `del-104` Dave & Buster's (Tilak Nagar vs Tagore Garden), `chd-046` Hot Shots Paintball.
- **Typos preserved:** `del-149` TBR address ends "110019ne" (also in map URL); `Glitch Gafe` (`del-108`); `Gammer Hub` (`del-185`).
- **`del-150`** "Used Snooker Pool Table India" may be a seller, not a venue.
- **DDA complexes** carry a Gaming tag because of billiards; they are multi-sport complexes.
- **Placeholder areas** (Tricity): "Across Chandigarh" (5), "Mohali" (2), "Zirakpur" (8), "Panchkula" (5) = 20 records. Shown as "Area not specified", excluded from the specific-area index.
- **Place-name areas:** Morni Hills; Mohali Phase 7 address references Sector 61.
- **Category oddities kept:** café records tagged Art; Interactive mixes museums, zoo, Rock Garden.
- The homepage copy mentions "Social Experiences" and "Outdoor Activities" (old index.html). Neither exists as source data, so no listings are shown for them.

## Changing data
Edit the record in `experiences.js`, then add an entry to its `corrections` array (what, why, date). Run `tools/data-check.html`.
