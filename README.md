# Eastside Bible Classes

Live dashboard of Eastside Church of Christ Bible classes, fed from the Master Tracker Google Sheet.

- `dashboard.js` – the whole dashboard (styles, layout, data loading)
- `floorplan.js` – the "Where Classes Meet" floor plan map. Room shapes and the names that match the sheet's Location column live in the `ROOMS` list at the top.
- `index.html` – preview page: https://nathanleeky.github.io/EastsideBibleClasses/

## Embed (WordPress / Elementor HTML widget)

```html
<div id="ebc"></div>
<script src="https://nathanleeky.github.io/EastsideBibleClasses/dashboard.js"></script>
```

Changes pushed to `main` go live within about a minute.
