/**
 * Eastside Bible Classes: room assignment saver (Google Apps Script web app).
 * Used by planner.html. It can (1) set a class's room (Location on "Master: Adult", Room # on
 * "Master: Kids"), (2) edit a class's teacher, name, book, type, headcount, notes and status,
 * and (3) add a new class row. It also returns current room values so the planner shows
 * changes right away instead of waiting for the published CSV to refresh.
 *
 * Setup is in README.md ("Room planner"). Create a project at script.google.com (any Google
 * account with edit access to the sheet), paste this in, set SHEET_ID below, then
 * Deploy > New deployment > Web app.
 */
// Paste your Master Tracker sheet's ID here. It's the long text in the sheet's address between
// /d/ and /edit, e.g. https://docs.google.com/spreadsheets/d/THIS_PART/edit
// (This lets the script live in any Google account that can edit the sheet.)
var SHEET_ID = "PASTE_SHEET_ID_HERE";

var TABS = {
  adult: {
    sheet: "Master: Adult",
    // field -> header names to look for (first one found wins)
    cols: { year: ["Year"], q: ["Q"], start: ["Start"], end: ["End"], kind: ["Kind"], teacher: ["Teacher"],
            name: ["Name", "Class Name"], book: ["Book"], type: ["Type"], loc: ["Location"], notes: ["Notes"],
            status: ["Status"], est: ["Est. Headcount"] },
    identity: ["year", "q", "kind"],                       // must still match before we edit a row
    editable: ["teacher", "name", "book", "type", "loc", "notes", "status", "est"],
    addable: ["year", "q", "start", "end", "kind", "teacher", "name", "book", "type", "notes", "status", "est"]
  },
  kids: {
    sheet: "Master: Kids",
    cols: { year: ["Year"], q: ["Q"], start: ["Start"], end: ["End"], age: ["Age"], teacher: ["Teachers"],
            name: ["Class Name"], loc: ["Room #"], notes: ["Notes"], status: ["Status"] },
    identity: ["year", "q", "age"],
    editable: ["teacher", "name", "loc", "notes", "status"],
    addable: ["year", "q", "start", "end", "age", "teacher", "name", "notes", "status"]
  }
};
var NUMERIC = { year: true, est: true };

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function headers_(values) {
  return values[0].map(function (h) { return String(h).trim(); });
}

// Column index for a field, or -1 if the tab has no such column
function col_(t, hdr, field) {
  var names = t.cols[field] || [];
  for (var i = 0; i < names.length; i++) {
    var c = hdr.indexOf(names[i]);
    if (c > -1) return c;
  }
  return -1;
}

// Turn a value from the planner into something safe to write, or throw
function clean_(field, v) {
  v = String(v == null ? "" : v).trim();
  if (v.length > 200) throw new Error(field + " is too long");
  if (/^[=+\-@]/.test(v) && !(field === "est" || field === "year")) throw new Error(field + " can't start with = + - or @");
  if (field === "year") {
    if (!/^(20\d\d)$/.test(v)) throw new Error("bad year");
    return Number(v);
  }
  if (field === "q" && !/^Q[1-4]$/.test(v)) throw new Error("bad quarter");
  if ((field === "start" || field === "end") && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v)) throw new Error("bad date");
  if (field === "est") {
    if (v === "") return "";
    if (!/^\d{1,3}$/.test(v)) throw new Error("bad headcount");
    return Number(v);
  }
  return v;
}

// GET -> { adult: { "<sheet row>": "<location>" }, kids: { ... } }
function doGet() {
  var ss = SpreadsheetApp.openById(SHEET_ID), out = {};
  Object.keys(TABS).forEach(function (k) {
    var t = TABS[k], sh = ss.getSheetByName(t.sheet), map = {};
    if (sh) {
      var values = sh.getDataRange().getValues(), col = col_(t, headers_(values), "loc");
      if (col > -1) for (var r = 1; r < values.length; r++) map[r + 1] = String(values[r][col]).trim();
    }
    out[k] = map;
  });
  return json_(out);
}

// POST { action, tab:"adult"|"kids", ... }
//   set:  row, loc, expect                 (set a room; the original planner request)
//   edit: row, fields:{teacher,...}, expect (change some fields on a row)
//   add:  fields:{year,q,start,end,kind|age,...}  (append a new class row)
// `expect` is { year, q, kind|age } and must still match the sheet row, so a re-sorted sheet can't
// send a change to the wrong class.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var req = JSON.parse(e.postData.contents), t = TABS[req.tab];
    if (!t) throw new Error("bad request");
    var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(t.sheet);
    if (!sh) throw new Error("tab not found: " + t.sheet);
    var values = sh.getDataRange().getValues(), hdr = headers_(values);

    if (req.action === "add") {
      var f = req.fields || {}, rowVals = [], i;
      for (i = 0; i < hdr.length; i++) rowVals.push("");
      t.addable.forEach(function (field) {
        if (f[field] == null || f[field] === "") return;
        var c = col_(t, hdr, field);
        if (c < 0) throw new Error("no column for " + field);
        rowVals[c] = clean_(field, f[field]);
      });
      var need = t.identity.concat(["start", "end"]);
      need.forEach(function (field) { if (rowVals[col_(t, hdr, field)] === "") throw new Error("missing " + field); });
      sh.appendRow(rowVals);
      return json_({ ok: true, row: sh.getLastRow() });
    }

    var row = Number(req.row);
    if (!(row >= 2) || row > values.length) throw new Error("row not found");
    var want = {};
    Object.keys(req.expect || {}).forEach(function (k) { want[k.toLowerCase()] = String(req.expect[k] == null ? "" : req.expect[k]).trim(); });
    t.identity.forEach(function (field) {
      var c = col_(t, hdr, field);
      if (c < 0 || String(values[row - 1][c]).trim() !== (want[field] || "")) throw new Error("the sheet changed, reload the page");
    });

    var changes = req.action === "set" ? { loc: req.loc } : req.action === "edit" ? (req.fields || {}) : null;
    if (!changes) throw new Error("bad request");
    Object.keys(changes).forEach(function (field) {
      if (t.editable.indexOf(field) < 0) throw new Error(field + " can't be edited here");
      var c = col_(t, hdr, field);
      if (c < 0) throw new Error("no column for " + field);
      var v = field === "loc" ? String(changes[field] == null ? "" : changes[field]).trim() : clean_(field, changes[field]);
      if (field === "loc" && (v.length > 80 || /^[=+\-@]/.test(v))) throw new Error("bad room name");
      sh.getRange(row, c + 1).setValue(v);
    });
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}
