/**
 * Eastside Bible Classes: room assignment saver (Google Apps Script web app).
 * Used by planner.html. Writes a room name into the Location column of "Master: Adult"
 * and the Room # column of "Master: Kids", and returns current values so the planner shows
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
  adult: { sheet: "Master: Adult", loc: "Location", keys: ["Year", "Q", "Kind"] },
  kids:  { sheet: "Master: Kids",  loc: "Room #",   keys: ["Year", "Q", "Age"] }
};

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function headers_(values) {
  return values[0].map(function (h) { return String(h).trim(); });
}

// GET -> { adult: { "<sheet row>": "<location>" }, kids: { ... } }
function doGet() {
  var ss = SpreadsheetApp.openById(SHEET_ID), out = {};
  Object.keys(TABS).forEach(function (k) {
    var t = TABS[k], sh = ss.getSheetByName(t.sheet), map = {};
    if (sh) {
      var values = sh.getDataRange().getValues(), col = headers_(values).indexOf(t.loc);
      if (col > -1) for (var r = 1; r < values.length; r++) map[r + 1] = String(values[r][col]).trim();
    }
    out[k] = map;
  });
  return json_(out);
}

// POST { action:"set", tab:"adult"|"kids", row:<sheet row>, loc:"<room name or empty>", expect:{Year,Q,Kind|Age} }
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var req = JSON.parse(e.postData.contents), t = TABS[req.tab];
    if (req.action !== "set" || !t) throw new Error("bad request");
    var row = Number(req.row), loc = String(req.loc == null ? "" : req.loc).trim();
    if (!(row >= 2) || loc.length > 80) throw new Error("bad row or room name");
    var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(t.sheet);
    if (!sh) throw new Error("tab not found: " + t.sheet);
    var values = sh.getDataRange().getValues(), hdr = headers_(values), col = hdr.indexOf(t.loc);
    if (col < 0) throw new Error("no \"" + t.loc + "\" column");
    if (row > values.length) throw new Error("row not found");
    // Make sure that row is still the class the planner thinks it is (rows may have moved)
    for (var i = 0; i < t.keys.length; i++) {
      var c = hdr.indexOf(t.keys[i]), want = String((req.expect || {})[t.keys[i]] == null ? "" : req.expect[t.keys[i]]).trim();
      if (c < 0 || String(values[row - 1][c]).trim() !== want) throw new Error("the sheet changed, reload the page");
    }
    sh.getRange(row, col + 1).setValue(loc);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}
