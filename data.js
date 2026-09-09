/* =============================================================================
   MATCH DATA — 2026/27 SEASON
   =============================================================================

   This file holds the data only. To change the schedule, this is the only file
   you need to touch.

   What is in here: all 38 LaLiga matchdays, the 8 Champions League league-phase
   matches plus knockout ties, and the Copa del Rey rounds. 56 matches in total,
   running from August 2026 to May 2027.

   -----------------------------------------------------------------------------
   HOW TO ADD A MATCH
   -----------------------------------------------------------------------------

   Copy this block and paste it inside the square brackets [ ], separated by a
   comma:

       {
         kickoff: "2026-11-04T21:00:00+01:00",
         opponent: "Chelsea FC",
         competition: "Champions League",
         venue: "home"
       },

   The order you write them in does not matter: the page sorts them for you.

   -----------------------------------------------------------------------------
   WHAT EACH FIELD MEANS
   -----------------------------------------------------------------------------

   kickoff       The exact moment the match starts, in ISO 8601 format WITH a
                 time zone offset. It looks like this:

                     2026-11-04T21:00:00+01:00
                     |--------| |------| |----|
                      Y  M  D   H  M  S   offset from UTC

                 Always write it as the local time in Spain (where the match is
                 announced) followed by the matching offset:

                     +02:00  ->  summer time in Spain
                     +01:00  ->  winter time in Spain

                 Spain switches on the last Sunday in March and the last Sunday
                 in October. For this season that means:

                     up to Oct 25, 2026 ................ +02:00
                     Oct 25, 2026 to Mar 28, 2027 ...... +01:00
                     from Mar 28, 2027 ................. +02:00

                 IMPORTANT: do not work out the New York time yourself, and do
                 not subtract hours by hand. The gap is NOT always 6 hours,
                 because Spain and the United States change their clocks on
                 different dates. It happens twice a season, in both directions:

                     Oct 25 - Nov 1, 2026    Spain already on winter time,
                                             New York still on summer time
                                             -> gap of 5 hours

                     Mar 14 - Mar 28, 2027   New York already on summer time,
                                             Spain still on winter time
                                             -> gap of 5 hours

                 app.js does the conversion with Intl.DateTimeFormat, which knows
                 those rules, gets it right, and prints a note on the rows that
                 fall inside those two windows. Five matches below do.

   opponent      The other team's name, exactly as you want it displayed.

   competition   Must be EXACTLY one of these three strings, including
                 capitalisation (this is what the filter buttons match against):

                     "LaLiga"
                     "Champions League"
                     "Copa del Rey"

                 To add a new competition (say "Supercopa"), you also need to add
                 a filter button in index.html and a colour in styles.css.

   venue         Where Barça plays. Only two possible values, lowercase:

                     "home"  ->  at Spotify Camp Nou
                     "away"  ->  at the opponent's ground

   -----------------------------------------------------------------------------
   HOW TO EDIT OR DELETE A MATCH
   -----------------------------------------------------------------------------

   Edit:    change the value between the quotes and save the file.
   Delete:  remove the whole { ... } block and the comma after it.

   Once saved, reload the page in the browser (Cmd+R). Nothing to compile and
   nothing to install.

   NOTE: these fixtures are sample data for a class project. Both the opponents
   and the dates are plausible but invented, and the knockout rounds assume a run
   that has not happened. The real schedule is published at fcbarcelona.com.

   ========================================================================== */

const MATCHES = [

  /* ===========================================================================
     AUGUST 2026 — the season opens
     ======================================================================== */

  // LaLiga matchday 1
  {
    kickoff: "2026-08-16T21:30:00+02:00",
    opponent: "Real Betis",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 2
  {
    kickoff: "2026-08-23T19:30:00+02:00",
    opponent: "Rayo Vallecano",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 3
  {
    kickoff: "2026-08-30T21:00:00+02:00",
    opponent: "Valencia CF",
    competition: "LaLiga",
    venue: "home"
  },

  /* ===========================================================================
     SEPTEMBER 2026
     ======================================================================== */

  // LaLiga matchday 4 — midweek round
  {
    kickoff: "2026-09-02T20:00:00+02:00",
    opponent: "Girona FC",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 5
  {
    kickoff: "2026-09-13T18:30:00+02:00",
    opponent: "Sevilla FC",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 1
  {
    kickoff: "2026-09-16T21:00:00+02:00",
    opponent: "Inter Milan",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 6
  {
    kickoff: "2026-09-20T21:00:00+02:00",
    opponent: "Atlético de Madrid",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 7 — midweek round
  {
    kickoff: "2026-09-23T19:00:00+02:00",
    opponent: "CA Osasuna",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 8
  {
    kickoff: "2026-09-27T18:30:00+02:00",
    opponent: "Real Sociedad",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 2
  {
    kickoff: "2026-09-30T18:45:00+02:00",
    opponent: "Bayern Munich",
    competition: "Champions League",
    venue: "home"
  },

  /* ===========================================================================
     OCTOBER 2026
     Spain moves to winter time on the 25th. New York does not follow until
     November 1, so the last week of October runs on a 5 hour gap.
     ======================================================================== */

  // LaLiga matchday 9
  {
    kickoff: "2026-10-04T16:15:00+02:00",
    opponent: "Athletic Club",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 10 — El Clásico
  {
    kickoff: "2026-10-18T21:00:00+02:00",
    opponent: "Real Madrid",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 3
  {
    kickoff: "2026-10-21T21:00:00+02:00",
    opponent: "Arsenal FC",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 11 — first match on winter time. 5 hour gap.
  {
    kickoff: "2026-10-25T18:30:00+01:00",
    opponent: "Deportivo Alavés",
    competition: "LaLiga",
    venue: "away"
  },
  // Copa del Rey, second round. Still inside the 5 hour window.
  {
    kickoff: "2026-10-28T20:00:00+01:00",
    opponent: "Cultural Leonesa",
    competition: "Copa del Rey",
    venue: "away"
  },

  /* ===========================================================================
     NOVEMBER 2026 — New York moves to winter time on the 1st, so the gap is
     back to the usual 6 hours from here on
     ======================================================================== */

  // LaLiga matchday 12
  {
    kickoff: "2026-11-01T21:00:00+01:00",
    opponent: "Elche CF",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 4
  {
    kickoff: "2026-11-04T21:00:00+01:00",
    opponent: "Chelsea FC",
    competition: "Champions League",
    venue: "home"
  },
  // LaLiga matchday 13
  {
    kickoff: "2026-11-08T16:15:00+01:00",
    opponent: "RC Celta de Vigo",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 14
  {
    kickoff: "2026-11-22T21:00:00+01:00",
    opponent: "Villarreal CF",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 5
  {
    kickoff: "2026-11-25T21:00:00+01:00",
    opponent: "PSV Eindhoven",
    competition: "Champions League",
    venue: "home"
  },
  // LaLiga matchday 15
  {
    kickoff: "2026-11-29T18:30:00+01:00",
    opponent: "Levante UD",
    competition: "LaLiga",
    venue: "away"
  },

  /* ===========================================================================
     DECEMBER 2026
     ======================================================================== */

  // Copa del Rey, round of 32
  {
    kickoff: "2026-12-02T21:00:00+01:00",
    opponent: "Real Zaragoza",
    competition: "Copa del Rey",
    venue: "away"
  },
  // LaLiga matchday 16
  {
    kickoff: "2026-12-06T16:15:00+01:00",
    opponent: "RCD Mallorca",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 6
  {
    kickoff: "2026-12-09T18:45:00+01:00",
    opponent: "SSC Napoli",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 17 — the Barcelona derby
  {
    kickoff: "2026-12-13T21:00:00+01:00",
    opponent: "RCD Espanyol",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 18 — last match before the winter break
  {
    kickoff: "2026-12-20T18:30:00+01:00",
    opponent: "Getafe CF",
    competition: "LaLiga",
    venue: "away"
  },

  /* ===========================================================================
     JANUARY 2027 — second half of the league begins, with the same nineteen
     opponents in reverse: whoever was at home is now away
     ======================================================================== */

  // LaLiga matchday 19
  {
    kickoff: "2027-01-03T18:30:00+01:00",
    opponent: "Real Oviedo",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 20
  {
    kickoff: "2027-01-10T21:00:00+01:00",
    opponent: "Real Betis",
    competition: "LaLiga",
    venue: "away"
  },
  // Copa del Rey, round of 16
  {
    kickoff: "2027-01-13T19:00:00+01:00",
    opponent: "CD Mirandés",
    competition: "Copa del Rey",
    venue: "away"
  },
  // LaLiga matchday 21
  {
    kickoff: "2027-01-17T18:30:00+01:00",
    opponent: "Rayo Vallecano",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League league phase, match 7
  {
    kickoff: "2027-01-20T21:00:00+01:00",
    opponent: "Sporting CP",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 22
  {
    kickoff: "2027-01-24T16:15:00+01:00",
    opponent: "Valencia CF",
    competition: "LaLiga",
    venue: "away"
  },
  // Champions League league phase, match 8 — last one before the knockouts
  {
    kickoff: "2027-01-28T21:00:00+01:00",
    opponent: "Ajax",
    competition: "Champions League",
    venue: "home"
  },
  // LaLiga matchday 23
  {
    kickoff: "2027-01-31T21:00:00+01:00",
    opponent: "Girona FC",
    competition: "LaLiga",
    venue: "home"
  },

  /* ===========================================================================
     FEBRUARY 2027
     ======================================================================== */

  // Copa del Rey, quarter-final
  {
    kickoff: "2027-02-03T21:00:00+01:00",
    opponent: "Deportivo de La Coruña",
    competition: "Copa del Rey",
    venue: "away"
  },
  // LaLiga matchday 24
  {
    kickoff: "2027-02-07T18:30:00+01:00",
    opponent: "Sevilla FC",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 25
  {
    kickoff: "2027-02-14T21:00:00+01:00",
    opponent: "Atlético de Madrid",
    competition: "LaLiga",
    venue: "home"
  },
  // Copa del Rey, semi-final first leg
  {
    kickoff: "2027-02-17T21:00:00+01:00",
    opponent: "Athletic Club",
    competition: "Copa del Rey",
    venue: "away"
  },
  // LaLiga matchday 26
  {
    kickoff: "2027-02-21T16:15:00+01:00",
    opponent: "CA Osasuna",
    competition: "LaLiga",
    venue: "away"
  },
  // Copa del Rey, semi-final second leg
  {
    kickoff: "2027-02-24T21:00:00+01:00",
    opponent: "Athletic Club",
    competition: "Copa del Rey",
    venue: "home"
  },
  // LaLiga matchday 27
  {
    kickoff: "2027-02-28T18:30:00+01:00",
    opponent: "Real Sociedad",
    competition: "LaLiga",
    venue: "away"
  },

  /* ===========================================================================
     MARCH 2027
     New York moves to summer time on the 14th, Spain not until the 28th. For
     those two weeks the gap drops to 5 hours again, this time the other way
     round. Three matches fall inside the window.
     ======================================================================== */

  // LaLiga matchday 28
  {
    kickoff: "2027-03-07T21:00:00+01:00",
    opponent: "Athletic Club",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League, round of 16 first leg
  {
    kickoff: "2027-03-09T21:00:00+01:00",
    opponent: "Bayer Leverkusen",
    competition: "Champions League",
    venue: "home"
  },
  // LaLiga matchday 29 — El Clásico. 5 hour gap.
  {
    kickoff: "2027-03-14T21:00:00+01:00",
    opponent: "Real Madrid",
    competition: "LaLiga",
    venue: "away"
  },
  // Champions League, round of 16 second leg. 5 hour gap.
  {
    kickoff: "2027-03-17T21:00:00+01:00",
    opponent: "Bayer Leverkusen",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 30. Still inside the 5 hour window.
  {
    kickoff: "2027-03-21T18:30:00+01:00",
    opponent: "Deportivo Alavés",
    competition: "LaLiga",
    venue: "home"
  },

  /* ===========================================================================
     APRIL 2027 — Spain is on summer time from March 28, so the gap is back to
     the usual 6 hours
     ======================================================================== */

  // LaLiga matchday 31
  {
    kickoff: "2027-04-04T21:00:00+02:00",
    opponent: "Elche CF",
    competition: "LaLiga",
    venue: "away"
  },
  // Champions League, quarter-final first leg
  {
    kickoff: "2027-04-07T21:00:00+02:00",
    opponent: "Manchester City",
    competition: "Champions League",
    venue: "away"
  },
  // LaLiga matchday 32
  {
    kickoff: "2027-04-11T18:30:00+02:00",
    opponent: "RC Celta de Vigo",
    competition: "LaLiga",
    venue: "home"
  },
  // Champions League, quarter-final second leg
  {
    kickoff: "2027-04-14T21:00:00+02:00",
    opponent: "Manchester City",
    competition: "Champions League",
    venue: "home"
  },
  // LaLiga matchday 33
  {
    kickoff: "2027-04-18T16:15:00+02:00",
    opponent: "Villarreal CF",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 34 — midweek round
  {
    kickoff: "2027-04-21T21:00:00+02:00",
    opponent: "Levante UD",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 35
  {
    kickoff: "2027-04-25T18:30:00+02:00",
    opponent: "RCD Mallorca",
    competition: "LaLiga",
    venue: "away"
  },

  /* ===========================================================================
     MAY 2027 — the run-in
     ======================================================================== */

  // LaLiga matchday 36 — the derby, this time away
  {
    kickoff: "2027-05-02T21:00:00+02:00",
    opponent: "RCD Espanyol",
    competition: "LaLiga",
    venue: "away"
  },
  // LaLiga matchday 37
  {
    kickoff: "2027-05-09T18:30:00+02:00",
    opponent: "Getafe CF",
    competition: "LaLiga",
    venue: "home"
  },
  // LaLiga matchday 38 — last match of the season
  {
    kickoff: "2027-05-16T18:00:00+02:00",
    opponent: "Real Oviedo",
    competition: "LaLiga",
    venue: "away"
  }

];
