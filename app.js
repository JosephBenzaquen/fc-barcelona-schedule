/* =============================================================================
   PAGE LOGIC

   This file reads the MATCHES array (defined in data.js), converts every kickoff
   to the time in Spain and in New York, splits the fixtures into upcoming and
   played, and draws the tables.

   To change the schedule, edit data.js and leave this file alone.
   ========================================================================== */

"use strict";


/* -----------------------------------------------------------------------------
   1. CONSTANTS
   -------------------------------------------------------------------------- */

// Time zones, named as they are in the IANA time zone database.
const ZONE_SPAIN = "Europe/Madrid";
const ZONE_NEW_YORK = "America/New_York";

// The moment the page is opened. This is what decides past from future.
const NOW = new Date();

// A match runs about 105 minutes including the break. We allow 2 hours so a
// match in progress is not filed under "played" while it is still being played.
const MATCH_LENGTH_MS = 2 * 60 * 60 * 1000;

// The usual gap between Spain and New York. When a match falls in a week where
// this does not hold, because of the daylight saving changes, the page says so.
const USUAL_GAP = 6;


/* -----------------------------------------------------------------------------
   2. DATE AND TIME FORMATTERS

   Intl.DateTimeFormat takes an instant (a Date object) and writes it out the way
   it would look in whichever time zone you name. It carries the full history of
   clock changes for every country, so there is never any need to add or subtract
   hours by hand.
   -------------------------------------------------------------------------- */

const LOCALE = "en-US";

// Kickoff as seen from Spain. Example: "21:00"
const timeInSpain = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_SPAIN,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

// The very same instant as seen from New York. Example: "15:00"
const timeInNewYork = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_NEW_YORK,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

// Short date for the table rows. Example: "Sun, Sep 13"
const shortDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_SPAIN,
  weekday: "short",
  month: "short",
  day: "numeric"
});

// Same, plus the year, for matches outside the current year.
const shortDateWithYear = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_SPAIN,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric"
});

// Full date for the featured match. Example: "Sunday, September 13, 2026"
const fullDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_SPAIN,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

// Date without the weekday, for the footer.
const plainDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_SPAIN,
  month: "long",
  day: "numeric",
  year: "numeric"
});

// Calendar date as YYYY-MM-DD in each zone. Comparing the two tells us whether
// the same instant lands on a different day depending on where you watch from.
const dayInSpain = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE_SPAIN,
  year: "numeric", month: "2-digit", day: "2-digit"
});

const dayInNewYork = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE_NEW_YORK,
  year: "numeric", month: "2-digit", day: "2-digit"
});

// Month and day in New York, to print when it differs.
const shortDateNewYork = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ZONE_NEW_YORK,
  month: "short",
  day: "numeric"
});


/* -----------------------------------------------------------------------------
   3. HELPERS
   -------------------------------------------------------------------------- */

/**
 * How many hours a zone sits ahead of UTC at that particular instant. Madrid
 * gives 2 in summer and 1 in winter.
 *
 * This is used only to FLAG the weeks where the gap between the two cities is
 * not the usual one. The times shown on screen come from Intl, not from here.
 */
function offsetHours(date, zone) {
  const text = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset"
  }).format(date);

  // The text ends in something like "GMT+02:00" or "GMT-04:00".
  const parts = text.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!parts) return null;

  const sign = parts[1] === "-" ? -1 : 1;
  return sign * (Number(parts[2]) + Number(parts[3]) / 60);
}

/** Hours between Spain and New York for a given kickoff. */
function gapBetweenCities(date) {
  const spain = offsetHours(date, ZONE_SPAIN);
  const newYork = offsetHours(date, ZONE_NEW_YORK);
  if (spain === null || newYork === null) return null;
  return spain - newYork;
}

/** Turns a competition name into a CSS class suffix. */
function competitionClass(competition) {
  if (competition === "LaLiga") return "competition--laliga";
  if (competition === "Champions League") return "competition--champions";
  if (competition === "Copa del Rey") return "competition--copa";
  return "";
}

/**
 * Escapes the characters that mean something in HTML. Good habit whenever HTML
 * is built by joining strings together.
 */
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Reads as "today", "tomorrow", "in 5 days". */
function howSoon(date) {
  const today = dayInSpain.format(NOW);
  const day = dayInSpain.format(date);
  if (today === day) return "today";

  const days = Math.round((new Date(day) - new Date(today)) / 86400000);
  if (days === 1) return "tomorrow";
  if (days < 0) return "";
  if (days < 7) return "in " + days + " days";
  if (days < 14) return "next week";
  return "in " + Math.round(days / 7) + " weeks";
}


/* -----------------------------------------------------------------------------
   4. PREPARING THE DATA

   Each plain object from data.js becomes a fuller one, with the kickoff already
   turned into a Date and both city times already worked out.
   -------------------------------------------------------------------------- */

const nowMs = NOW.getTime();
const currentYear = Number(dayInSpain.format(NOW).slice(0, 4));

const matches = MATCHES
  .map(function (row) {
    // new Date() understands ISO 8601 with a time zone offset and stores it as a
    // universal instant. From here on the offset written in the text no longer
    // matters: it is the same moment for everyone on earth.
    const kickoff = new Date(row.kickoff);
    const endMs = kickoff.getTime() + MATCH_LENGTH_MS;
    const year = Number(dayInSpain.format(kickoff).slice(0, 4));

    return {
      kickoff: kickoff,
      opponent: row.opponent,
      competition: row.competition,
      venue: row.venue,

      played: endMs < nowMs,
      live: kickoff.getTime() <= nowMs && nowMs <= endMs,

      dateText: year === currentYear
        ? shortDate.format(kickoff)
        : shortDateWithYear.format(kickoff),
      fullDateText: fullDate.format(kickoff),
      spainText: timeInSpain.format(kickoff),
      newYorkText: timeInNewYork.format(kickoff),

      // If the match lands on a different calendar day in New York, we keep that
      // date to print next to the time.
      otherDayInNewYork: dayInSpain.format(kickoff) !== dayInNewYork.format(kickoff)
        ? shortDateNewYork.format(kickoff)
        : null,

      gap: gapBetweenCities(kickoff)
    };
  })
  // Oldest first.
  .sort(function (a, b) { return a.kickoff - b.kickoff; });


/* -----------------------------------------------------------------------------
   5. DRAWING THE PAGE
   -------------------------------------------------------------------------- */

const rowsUpcoming = document.getElementById("rows-upcoming");
const rowsPlayed = document.getElementById("rows-played");
const countUpcoming = document.getElementById("count-upcoming");
const countPlayed = document.getElementById("count-played");
const feature = document.getElementById("feature");
const footReference = document.getElementById("foot-reference");

/** The pair of clocks used in the featured card. */
function clocksHTML(match) {
  return '' +
    '<div class="clocks">' +
      '<div class="clock">' +
        '<span class="clock__time">' + match.spainText + "</span>" +
        '<span class="clock__city">Spain</span>' +
      "</div>" +
      '<div class="clock">' +
        '<span class="clock__time">' + match.newYorkText + "</span>" +
        '<span class="clock__city">New York</span>' +
      "</div>" +
    "</div>";
}

/** One table row, plus a note row underneath when the time gap is unusual. */
function rowHTML(match) {
  const classes = ["fixture", "fixture--" + match.venue];
  if (match.played) classes.push("fixture--past");
  if (match.live) classes.push("fixture--live");

  // The note only appears in the weeks where the gap is not the usual one.
  const unusualGap = match.gap !== null && match.gap !== USUAL_GAP;
  if (unusualGap) classes.push("fixture--noted");

  const note = unusualGap
    ? '<tr class="note"><td colspan="6"><p>' +
      "That week Spain runs " + match.gap + " hours ahead of New York rather than " +
      USUAL_GAP + ", because the two countries change their clocks on different " +
      "dates.</p></td></tr>"
    : "";

  const live = match.live ? '<span class="live">Live now</span>' : "";

  const otherDay = match.otherDayInNewYork
    ? '<span class="other-day">' + escapeHTML(match.otherDayInNewYork) + "</span>"
    : "";

  return '' +
    '<tr class="' + classes.join(" ") + '">' +
      '<td class="cell-date">' +
        '<time datetime="' + match.kickoff.toISOString() + '">' +
          escapeHTML(match.dateText) +
        "</time>" +
      "</td>" +
      '<td class="cell-opponent">' + escapeHTML(match.opponent) + live + "</td>" +
      '<td class="cell-competition">' +
        '<span class="competition ' + competitionClass(match.competition) + '">' +
          escapeHTML(match.competition) +
        "</span>" +
      "</td>" +
      '<td class="cell-venue">' +
        (match.venue === "home" ? "Home" : "Away") +
      "</td>" +
      '<td class="cell-time">' +
        '<span class="time">' + match.spainText + "</span>" +
      "</td>" +
      '<td class="cell-time">' +
        '<span class="time">' + match.newYorkText + "</span>" + otherDay +
      "</td>" +
    "</tr>" +
    note;
}

/** Fills a table body, or writes a message when there is nothing to show. */
function fillTable(element, collection, emptyMessage) {
  if (collection.length === 0) {
    element.innerHTML =
      '<tr class="empty"><td colspan="6">' + emptyMessage + "</td></tr>";
    return;
  }
  element.innerHTML = collection.map(rowHTML).join("");
}

/** Fills the big card at the top with the next match. */
function fillFeature(match) {
  if (!match) {
    feature.innerHTML =
      '<div class="card"><div>' +
        '<p class="card__label">No matches left on the schedule.</p>' +
        '<div class="card__opponent">See you next season</div>' +
      "</div></div>";
    return;
  }

  const label = match.live
    ? "Being played right now"
    : "Next match, " + howSoon(match.kickoff);

  const where = match.venue === "home"
    ? "Home, at Spotify Camp Nou"
    : "Away from home";

  const gap = match.gap !== null
    ? "Spain runs " + match.gap + " hours ahead that day"
    : "";

  feature.innerHTML = '' +
    '<div class="card">' +
      "<div>" +
        '<p class="card__label">' + escapeHTML(label) + "</p>" +
        '<div class="card__opponent">' + escapeHTML(match.opponent) + "</div>" +
        '<div class="card__facts">' +
          "<span>" + escapeHTML(match.fullDateText) + "</span>" +
          '<span class="competition ' + competitionClass(match.competition) + '">' +
            escapeHTML(match.competition) +
          "</span>" +
          "<span>" + where + "</span>" +
          "<span>" + gap + "</span>" +
        "</div>" +
      "</div>" +
      clocksHTML(match) +
    "</div>";
}

/** Redraws the whole page for the chosen competition. */
function draw(chosenCompetition) {
  const visible = chosenCompetition === "all"
    ? matches
    : matches.filter(function (m) { return m.competition === chosenCompetition; });

  const upcoming = visible.filter(function (m) { return !m.played; });

  // Played matches read better most recent first.
  const played = visible
    .filter(function (m) { return m.played; })
    .reverse();

  countUpcoming.textContent = upcoming.length;
  countPlayed.textContent = played.length;

  fillTable(rowsUpcoming, upcoming, "No upcoming matches in this competition.");
  fillTable(rowsPlayed, played, "No matches played yet in this competition.");

  // The featured card always shows the next match of the whole season. The
  // filter does not change it.
  fillFeature(matches.filter(function (m) { return !m.played; })[0]);
}


/* -----------------------------------------------------------------------------
   6. FILTERS
   -------------------------------------------------------------------------- */

const buttons = document.querySelectorAll(".filter");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    buttons.forEach(function (other) {
      const on = other === button;
      other.classList.toggle("filter--on", on);
      other.setAttribute("aria-pressed", String(on));
    });
    draw(button.dataset.competition);
  });
});


/* -----------------------------------------------------------------------------
   7. START
   -------------------------------------------------------------------------- */

draw("all");

// Noting when everything was worked out helps make sense of the split between
// upcoming and played.
footReference.textContent =
  "Times calculated on " + plainDate.format(NOW) +
  " at " + timeInSpain.format(NOW) + " in Spain, which was " +
  timeInNewYork.format(NOW) + " in New York.";
