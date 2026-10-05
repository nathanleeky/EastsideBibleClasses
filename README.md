# Eastside Bible Classes

Live dashboard of Eastside Church of Christ Bible classes, fed from the Master Tracker Google Sheet.

- `dashboard.js` – the whole dashboard (styles, layout, data loading). Reads the "Master: Adult" tab.
- `floorplan.js` – the "Where Classes Meet" floor plan map. The map is drawn as areas (West Wing, 2nd Floor, Auditorium, Annex, Apartment) that reflow from desktop to phone. Room shapes and the names that match the sheet's Location column live in the `ROOMS` list at the top. Optionally also reads "Master: Kids", "Kid Demographics" and a "Rooms" tab (see below) to show headcount, capacity and planning-status.
- `planner.html`, `planner.js`, `planner.css` – the room planner (see below). Reuses the room list, capacities and headcount rules from `floorplan.js`.
- `apps-script/Code.gs` – the small Google Apps Script that saves room assignments back to the sheet.
- `index.html` – preview page: https://nathanleeky.github.io/EastsideBibleClasses/

## Embed (WordPress / Elementor HTML widget)

```html
<div id="ebc"></div>
<script src="https://nathanleeky.github.io/EastsideBibleClasses/dashboard.js"></script>
```

Changes pushed to `main` go live within about a minute.

## Historical record + future planning

The sheet doubles as a log of classes already taught and a place to sketch out future
quarters. Two optional pieces:

**Status column** (Master: Adult and Master: Kids) — add a column called `Status` with one
of `Idea`, `Planned`, `Confirmed`, `Completed`. Leave it blank for anything already taught;
blank is treated as `Confirmed`. A row marked `Idea` or `Planned` still shows up on the map
(so the planners can see it), but is left out of "Now Teaching" / "Up Next" and out of
teacher-frequency stats, since it isn't real yet.

**Est. Headcount column** (Master: Adult) — for adult/college classes only (kids' and
middle/high school headcount is worked out automatically from grade tags + demographics,
see below), add a column called `Est. Headcount` with a plain number. Leave blank for
classes you don't want a capacity check on.

**Rooms tab** — a new tab with columns `Room`, `Capacity`, `Notes`. `Room` is matched the
same way the Location column is (e.g. `213`, `Annex A`, `Auditorium`, `Apartment Living
Room`). Until this tab exists, the map falls back to seeded capacity numbers from the
architect's stated legal occupancy for the rooms we know; anything on this tab overrides
those.

Once "Master: Kids", "Kid Demographics" and "Rooms" are published to the web the same way
"Master: Adult" was (File > Share > Publish to web > pick the tab > CSV > Publish), paste
the three links into the `KIDS_CSV_URL`, `DEMO_CSV_URL` and `ROOMS_CSV_URL` constants near
the top of `floorplan.js`. Until then the map just skips headcount/capacity/status info and
works exactly as it did before.

Kids' classes get their expected headcount from their `Age` tag (e.g. "3rd - 5th grades",
"Kindergarten") summed across the matching rows of Kid Demographics for the right
June-May school year; Middle School / High School classes use grades 6-8 / 9-12 the same
way. A room's fill color and each pin's badge turn amber ("Tight fit") or red ("Over
capacity") once expected headcount gets close to or exceeds that room's capacity.

## Room planner

`planner.html` is a phone-first page for assigning each quarter's classes to rooms: a class list
("Needs a room" / "Placed"), a bottom sheet with rooms ranked best-fit first, and a floor map
(Main, 2nd floor, Annex, Apartment) with a pick mode that colors rooms by fit. Every change shows
an Undo toast. Link to it or embed it in an iframe: https://nathanleeky.github.io/EastsideBibleClasses/planner.html

Where things come from:

- **Classes, teachers, headcounts, capacities:** the same tabs the map already reads (Master: Adult,
  Master: Kids, Kid Demographics, Rooms). To change a room's capacity, edit the Rooms tab.
- **Assignments:** the `Location` column on Master: Adult and the `Room #` column on Master: Kids.
  The planner writes the room's name there (e.g. `Large Classroom 163`, `Apartment Living Room`),
  so the dashboard and map keep working as before.
- **Add a quarter:** pick "+ Add quarter..." in the quarter menu, enter the year, quarter and dates. A quarter is
  saved to the sheet once you add its first class.
- **Add a class:** "+ Add a class" on the class list appends a row to Master: Adult or Master: Kids (new classes
  default to status Planned, which keeps them off the dashboard's Now Teaching / Up Next until you set Confirmed).
- **Edit a class:** "Edit details" in a class's sheet changes teacher, class name, book, type, expected headcount,
  notes and status. Year, quarter and age group stay editable only in the sheet.
- Expected attendance can be nudged in the class sheet to see how rooms re-rank. That is for
  planning only and is not saved.

**Turn on saving (one time).** Until this is done the planner runs as a preview and changes reset on reload.

1. Go to script.google.com (signed in as an account that can edit the Master Tracker) > New project.
   Paste in `apps-script/Code.gs` and replace `PASTE_SHEET_ID_HERE` with the sheet's ID (the text between
   `/d/` and `/edit` in its address). If your tabs aren't named `Master: Adult` / `Master: Kids`, change the `TABS` list at the top.
2. Deploy > New deployment > type **Web app**. Execute as **Me**, who has access **Anyone**. Deploy and
   approve the permissions.
3. Copy the web app URL (ends in `/exec`) into `SCRIPT_URL` at the top of `planner.js`, and push to `main`.

There is no password: anyone who has the page can change room assignments, add classes and edit the
fields above, and nothing else in the sheet. The script also checks that a row is still the same class (Year, Q, Kind/Age)
before writing, so a sheet that was re-sorted can't send a room to the wrong class.

**After updating `Code.gs`:** paste the new version into your Apps Script project (keep your `SHEET_ID`), then
Deploy > Manage deployments > pencil > New version > Deploy. The web app URL stays the same.
