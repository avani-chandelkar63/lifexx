# Area Explorer — final compact treatment

## What changed

### Homepage
The previous long neighbourhood word cloud is replaced with two city panels. Each panel shows four high-count areas by default. The complete searchable index opens only when the visitor asks for it. The Delhi index contains 65 specific areas; the Tricity index contains 34 specific areas.

### Delhi and Chandigarh Tricity pages
The long area strip is reduced to five popular area shortcuts, with listing counts. The **Find another area** control opens the directory's searchable Area filter. Visitors can still reach all areas; the shortcuts are only a starting point.

### Directory filters
The Area group is collapsed by default unless an area is already selected. When opened, the list is searchable and shows matching record counts.

## Data handling
- No venue records or area slugs were edited.
- Delhi: 65 specific named areas across 9 zones.
- Tricity: 34 specific named areas; the source data has 38 area groups including 4 town-level placeholder labels.
- Twenty Tricity records have town-level-only locations and are not represented as specific areas.
- Total records remain 258 (188 Delhi, 70 Tricity).
- Research-only ideas remain documented in `DATA-NOTES.md`; they are not presented as available venues.

## Checks performed
- The full Delhi and Tricity area lists render (65 and 34 items).
- Searching `Rohini` in the Delhi area index returns the matching area.
- Delhi page renders 9 zone controls and 5 quick-area shortcuts.
- Tricity page renders 4 region panels and 5 quick-area shortcuts.
- The data checker passes 43/43 checks.
