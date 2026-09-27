# Eastside Bible Classes

Live dashboard of Eastside Church of Christ Bible classes, fed from the Master Tracker Google Sheet.

- `dashboard.js` – the whole dashboard (styles, layout, data loading). Reads the "Master: Adult" tab.
- `floorplan.js` – the "Where Classes Meet" floor plan map. Room shapes and the names that match the sheet's Location column live in the `ROOMS` list at the top. Optionally also reads "Master: Kids", "Kid Demographics" and a "Rooms" tab (see below) to show headcount, capacity and planning-status.
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
