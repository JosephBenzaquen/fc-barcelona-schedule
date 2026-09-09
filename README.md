# FC Barcelona Schedule

A static website showing the FC Barcelona match schedule with kickoff times in
both **Spain** and **New York**.

The full 2026/27 season: all 38 LaLiga matchdays, the Champions League league
phase and knockout ties, and the Copa del Rey rounds. 56 matches from August 2026
to May 2027.

No backend, no database, no login: just `.html`, `.css` and `.js` files that run
entirely in the browser.

## Running it

Double-click `index.html`. It opens in the browser and works straight away.

To serve it over HTTP instead (worth doing if you add to it later):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## What each file does

| File | Contents |
|---|---|
| `index.html` | Page structure |
| `styles.css` | Design: colours, typography, responsive layout |
| `data.js` | **The fixtures.** The only file to edit when the schedule changes |
| `app.js` | Time conversion, filters, and the upcoming/played split |
| `favicon.svg` | Browser tab icon |

## Changing the fixtures

Open `data.js`. The comment at the top walks through adding, editing and deleting
a match, and lists the values each field accepts. Save the file and reload the
page.

## Why the times are not worked out by hand

Each match is stored once, as an instant in time written in ISO 8601 format with
its time zone offset:

```js
kickoff: "2026-10-28T20:00:00+01:00"
```

That string identifies a single moment. `Intl.DateTimeFormat` then writes it out
the way it would look in each city:

```js
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
}).format(new Date(match.kickoff));
```

**Subtracting 6 hours by hand would be wrong in certain weeks.** Spain and the
United States do not move their clocks on the same date, and over a full season
it happens twice, in both directions:

| Period | Spain | New York | Gap |
|---|---|---|---|
| Summer time in both | UTC+2 | UTC−4 | 6 hours |
| **Oct 25 – Nov 1, 2026** — Spain has moved back, New York has not | **UTC+1** | **UTC−4** | **5 hours** |
| Winter time in both | UTC+1 | UTC−5 | 6 hours |
| **Mar 14 – Mar 28, 2027** — New York has moved forward, Spain has not | **UTC+1** | **UTC−4** | **5 hours** |
| Summer time in both | UTC+2 | UTC−4 | 6 hours |

`Intl` knows those rules and applies them on its own. Five matches in the schedule
fall inside those two windows, and the page prints a note on each of those rows:

| Match | Spain | New York | Gap |
|---|---|---|---|
| Deportivo Alavés, Oct 25, 2026 | 18:30 | 13:30 | 5 hours |
| Cultural Leonesa, Oct 28, 2026 | 20:00 | 15:00 | 5 hours |
| Real Madrid, Mar 14, 2027 | 21:00 | 16:00 | 5 hours |
| Bayer Leverkusen, Mar 17, 2027 | 21:00 | 16:00 | 5 hours |
| Deportivo Alavés, Mar 21, 2027 | 18:30 | 13:30 | 5 hours |

Compare the last one with any April match at 18:30, which shows 12:30 in New York.
Same kickoff time in Spain, an hour's difference in New York.

## Design notes

This page is built for a computer screen, not for phones.

- The fixtures are a real `<table>`, so the six columns spread evenly across the
  width of the window. Column widths are percentages rather than fixed sizes, so
  they keep their proportions as the window resizes.
- The table has a minimum width. In a window narrower than that, the table
  scrolls sideways instead of squashing the columns.
- The vertical bar at the left of each row says where the match is played:
  blaugrana stripes for home, a plain bar for away.
- Each competition has its own colour from the club palette: garnet for LaLiga,
  blue for the Champions League, gold for the Copa del Rey.
- The typefaces (Anton and Archivo) load from Google Fonts. With no internet
  connection the page still works, falling back to system fonts.

## Note

The fixtures are sample data for a class project, not the club's official
schedule.

---

Built for *AI Assisted Development of Products and Services*.
