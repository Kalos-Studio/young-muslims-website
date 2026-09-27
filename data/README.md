# NeighborNet data

The map is generated from committed CSV files so builds do not depend on a
third-party website or geocoding service.

- `neighbornets.csv` is the Brothers roster supplied to the project.
- `brother-neighbornets-source.csv` is the normalized public roster scraped
  from <https://ymsite.com/ym-locations/>.
- `brother-neighbornets-additions.csv` contains only scraped Brothers chapters
  that are not already in `neighbornets.csv`. Calgary is deliberately excluded.
- `sister-neighbornets-source.csv` is the normalized public roster scraped from
  <https://ymsisters.com/locations/>.
- `sister-neighbornets.csv` adds reviewed, city-level coordinates to that
  source roster. It is the Sisters input used by the app.

To refresh the Sisters roster deliberately:

```bash
bun run scrape:sister-neighbornets
bun run geocode:sister-neighbornets
bun run generate:neighbornets
```

To refresh the Brothers additions deliberately:

```bash
bun run scrape:brother-neighbornets
bun run geocode:brother-neighbornets
bun run generate:neighbornets
```

The scraper reads only the visible, state-based chapter lists. It ignores the
older hidden Official, Expansion, and regional lists that remain in the source
page markup.

The geocoder first preserves reviewed coordinates, then reuses matching
Brothers chapter coordinates, then applies explicit overrides for ambiguous
chapter names. Only unmatched locations are sent to Nominatim, one at a time
with a delay, and the returned coordinates and attribution are cached in the
committed CSV. Review new geocoder results before merging, especially acronyms,
regional names, and neighborhood names.

The source page warns that its roster may not always be current. A refresh
should therefore be reviewed against the chapter Instagram accounts or with
the YM Sisters national team before publishing removals or status changes.
