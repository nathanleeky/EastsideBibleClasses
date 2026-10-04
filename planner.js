/*!
 * Eastside Bible Classes: room planner (planner.html)
 * Assign each quarter's classes to rooms from a phone. Rooms, capacities and headcounts come
 * from floorplan.js (same data as the "Where Classes Meet" map). Assignments are the sheet's
 * Location column (Master: Adult) and Room # column (Master: Kids), saved through the
 * Apps Script web app in apps-script/Code.gs. See README.md for setup.
 */
(function(){
  var EBC = window.EBCFloorplan;
  if(!EBC){ document.getElementById("main").innerHTML = '<p class="empty">Couldn\'t load floorplan.js.</p>'; return; }

  // Published "Master: Adult" CSV (same link as dashboard.js; the kids/demo/rooms links live in floorplan.js)
  var ADULT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=221404712&single=true&output=csv";
  // Paste the Apps Script web app URL (ends in /exec) here to turn saving on. Until then
  // the planner works as a preview: changes last until you reload.
  var SCRIPT_URL = window.EBC_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwRnUD7NRCFuxs3MWVj1mitxAmj_uZUVsBG2Oy9L4qSCRH4ORX1TNZlZeAok2yalMeC/exec";

  var TIGHT = 0.9;           // at or above this share of capacity = "tight"
  var rows = [];             // every class, adult + kids, all quarters
  var state = { q:"", view:"classes", filter:"all", floor:"main", pick:null, sheet:null, smallOpen:false, nocapOpen:false, toast:null, extraQ:{} };
  var loadError = "", lastSheetKey = null, toastTimer = null, saveChain = Promise.resolve();

  var $ = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
  var toDate = function(s){ var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s).trim()); return m ? new Date(+m[3], +m[1]-1, +m[2]) : null; };

  // ---------------------------------------------------------------------------
  // Rooms (from floorplan.js)
  var ROOMS = EBC.rooms.filter(function(r){ return r.use !== "service"; });
  var FLOORS = [
    { key:"main",   label:"Main",      where:"Main floor", min:660, mul:1.75 },
    { key:"second", label:"2nd floor", where:"2nd floor",  min:0,   mul:1.55 },
    { key:"annex",  label:"Annex",     where:"Annex",      min:0,   mul:1.05 },
    { key:"apt",    label:"Apartment", where:"Apartment",  min:0,   mul:1.0 }
  ];
  function floorKey(r){ return r.apt ? "apt" : r.floor === 2 ? "second" : /^annex/.test(r.id) ? "annex" : "main"; }
  EBC.rooms.forEach(function(r){ r.fk = floorKey(r); });
  function floorOf(key){ return FLOORS.filter(function(f){ return f.key === key; })[0] || FLOORS[0]; }
  function whereOf(r){ return floorOf(r.fk).where; }
  function roomName(r){ return r.apt ? r.name + " (Apartment)" : r.name; }
  function locName(r){ return r.apt ? "Apartment " + r.name : r.name; }   // what we write to the sheet
  function roomById(id){ for(var i = 0; i < EBC.rooms.length; i++) if(EBC.rooms[i].id === id) return EBC.rooms[i]; return null; }
  function capOf(r){ var c = EBC.capacityOf(r.id); return c == null ? null : c; }

  // ---------------------------------------------------------------------------
  // Classes
  function ageLabel(c){ return c.isKid ? (c.age ? "Kids · " + c.age : "Kids") : (c.kind || "Class"); }
  function clsName(c){ return c.name && !/^\s*tbd\s*$/i.test(c.name) ? c.name : ageLabel(c); }
  function clsTitle(c){ return c.name && !/^\s*tbd\s*$/i.test(c.name) ? c.name : "Title TBD"; }
  function teachersOf(c){ return c.teacher && !/^\s*tbd\s*$/i.test(c.teacher) ? c.teacher : "No teacher yet"; }
  function isYoung(c){ return /bab(y|ies)|toddler|preschool|pre\s*-?\s*k\b|nursery/i.test(c.age || ""); }
  function sizeOf(c){ if(c.sizeOverride != null) return c.sizeOverride; var n = EBC.headcountOfRow(c); return n == null ? null : n; }
  function roomOf(c){ return c.loc ? EBC.findRoomByLoc(c.loc) : null; }
  function qKey(c){ return c.year + " " + c.q; }
  function qClasses(){ return rows.filter(function(c){ return qKey(c) === state.q; }); }
  function classById(id){ for(var i = 0; i < rows.length; i++) if(rows[i].id === id) return rows[i]; return null; }
  function occupants(roomId){ return qClasses().filter(function(c){ var r = roomOf(c); return r && r.id === roomId; }); }

  // ---------------------------------------------------------------------------
  // Fit
  function fitOf(size, cap){
    if(cap == null) return { s:"nocap" };
    if(size == null) return { s:"unknown" };
    if(size > cap) return { s:"small", over:size - cap };
    return { s: size / cap >= TIGHT ? "tight" : "good", big: cap >= size * 3 && cap - size >= 15 };
  }
  function fits(f){ return f.s === "good" || f.s === "tight" || f.s === "unknown"; }
  function rank(c, r){
    var f = fitOf(sizeOf(c), capOf(r)), k = 0;
    if(f.s === "tight") k += 1;
    if(f.big) k += 2;
    if(isYoung(c) && r.fk === "second") k += 0.5;
    return k * 1000 + (capOf(r) || 0);
  }
  function fitPill(size, cap, best){
    var f = fitOf(size, cap);
    if(best) return '<span class="pill best">Best fit</span>';
    if(f.s === "small") return '<span class="pill bad">Short by ' + f.over + '</span>';
    if(f.s === "tight") return '<span class="pill tight">' + size + ' / ' + cap + ' · tight</span>';
    if(f.s === "good") return '<span class="pill good">' + size + ' / ' + cap + '</span>';
    return '<span class="pill plain">' + (cap != null ? 'holds ' + cap : 'no capacity set') + '</span>';
  }
  function badgeFor(c, r){
    var size = sizeOf(c), cap = capOf(r), f = fitOf(size, cap);
    if(f.s === "small") return '<span class="pill bad">' + size + ' / ' + cap + ' · over</span>';
    if(f.s === "tight") return '<span class="pill tight">' + size + ' / ' + cap + ' · tight</span>';
    if(f.s === "good") return '<span class="pill good">' + size + ' / ' + cap + '</span>';
    if(f.s === "unknown") return '<span class="pill plain">holds ' + cap + '</span>';
    return '<span class="pill plain">' + (size != null ? size + ' expected' : 'no headcount') + '</span>';
  }

  var ICON_X = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14"/></svg>';
  var ICON_MAP = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M2 4.5l4.5-1.5 5 1.5L16 3v10.5l-4.5 1.5-5-1.5L2 15z"/><path d="M6.5 3v10.5M11.5 4.5V15"/></svg>';

  // ---------------------------------------------------------------------------
  // Loading
  function fetchCSV(url){
    return fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + "_=" + Date.now(), { credentials:"omit" })
      .then(function(r){ if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function(t){ if(/^\s*</.test(t)) throw new Error("got a web page instead of CSV"); return EBC.parseCSV(t); });
  }
  // data[i] is sheet row i + 1 (row 1 = headers)
  function rowFrom(src, sheetRow, v){
    var kid = src === "kids";
    return { id:src + ":" + sheetRow, src:src, sheetRow:sheetRow, isKid:kid,
      year:v.year, q:v.q, startRaw:v.start || "", endRaw:v.end || "", start:toDate(v.start || ""), end:toDate(v.end || ""),
      kind: kid ? "Kids: " + (v.age || "") : (v.kind || ""), age: kid ? (v.age || "") : "",
      teacher:v.teacher || "", name:v.name || "", book:v.book || "", type:v.type || "", notes:v.notes || "", loc:v.loc || "",
      statusRaw:v.status || "", status:v.status || "Confirmed", est:v.est || "" };
  }
  function toRows(data, src){
    if(!data.length) return [];
    var cols = data[0].map(function(c){ return c.trim(); });
    var ix = function(n){ return cols.indexOf(n); };
    var K = src === "adult"
      ? { year:ix("Year"), q:ix("Q"), start:ix("Start"), end:ix("End"), kind:ix("Kind"), teacher:ix("Teacher"), name:ix("Class Name") > -1 ? ix("Class Name") : ix("Name"), book:ix("Book"), type:ix("Type"), loc:ix("Location"), notes:ix("Notes"), status:ix("Status"), est:ix("Est. Headcount") }
      : { year:ix("Year"), q:ix("Q"), start:ix("Start"), end:ix("End"), age:ix("Age"), teacher:ix("Teachers"), name:ix("Class Name"), loc:ix("Room #"), notes:ix("Notes"), status:ix("Status") };
    var out = [];
    data.slice(1).forEach(function(c, i){
      var v = {};
      Object.keys(K).forEach(function(k){ v[k] = K[k] > -1 ? (c[K[k]] || "").trim() : ""; });
      if(!v.year) return;
      if(src === "adult" && !v.kind && !v.name) return;
      out.push(rowFrom(src, i + 2, v));
    });
    return out;
  }
  // Fresh locations straight from the script, so changes show up without waiting for the CSV to republish
  function overlayLocations(){
    if(!SCRIPT_URL) return Promise.resolve();
    return fetch(SCRIPT_URL).then(function(r){ return r.json(); }).then(function(d){
      rows.forEach(function(c){ var t = d && d[c.src]; if(t && t[c.sheetRow] != null) c.loc = String(t[c.sheetRow]).trim(); });
    }).catch(function(){});
  }

  function load(){
    Promise.all([
      fetchCSV(ADULT_CSV_URL).then(function(d){ return toRows(d, "adult"); }),
      fetchCSV(EBC.urls.kids).then(function(d){ return toRows(d, "kids"); }).catch(function(){ return []; })
    ]).then(function(res){
      rows = res[0].concat(res[1]);
      return overlayLocations();
    }).then(function(){
      pickQuarter(); render();
    }).catch(function(e){
      loadError = "Couldn't load the sheet (" + e.message + "). Check that the tabs are published to the web as CSV.";
      render();
    });
  }
  function quarters(){
    var q = {}, today = new Date(); today.setHours(0,0,0,0);
    var now = null;
    Object.keys(state.extraQ).forEach(function(k){ q[k] = state.extraQ[k].start; });
    rows.forEach(function(c){
      if(!c.q) return;
      var k = qKey(c);
      if(!q[k]) q[k] = c.start || new Date(+c.year, 0, 1);
      if(c.start && c.end && c.start <= today && today <= c.end) now = k;
    });
    var list = Object.keys(q).sort(function(a, b){ return q[b] - q[a]; });
    return { list:list, now:now };
  }
  function pickQuarter(){
    var qs = quarters();
    if(!qs.list.length) return;
    if(qs.list.indexOf(state.q) < 0) state.q = qs.now || qs.list[0];
  }
  document.addEventListener("ebc:plan", function(){ if(rows.length) render(); });

  // ---------------------------------------------------------------------------
  // Saving
  function send(body){
    if(!SCRIPT_URL) return Promise.reject(new Error("saving isn't set up yet"));
    return fetch(SCRIPT_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body:JSON.stringify(body) })
      .then(function(r){ return r.json(); })
      .then(function(d){ if(!d || !d.ok) throw new Error(d && d.error || "save failed"); return d; });
  }
  function expectOf(c){ return c.src === "adult" ? { year:c.year, q:c.q, kind:c.kind } : { year:c.year, q:c.q, age:c.age }; }
  function post(c, loc){ return send({ action:"set", tab:c.src, row:c.sheetRow, loc:loc, expect:expectOf(c) }); }
  // changes: [{ c, loc }]. UI updates right away; if the save fails the old value comes back.
  function apply(changes, msg){
    var prev = changes.map(function(ch){ return { c:ch.c, loc:ch.c.loc }; });
    changes.forEach(function(ch){ ch.c.loc = ch.loc; });
    showToast(msg, prev);
    if(!SCRIPT_URL) return;
    changes.forEach(function(ch, i){
      saveChain = saveChain.then(function(){ return post(ch.c, ch.loc); }).catch(function(e){
        ch.c.loc = prev[i].loc;
        showToast("Couldn't save " + clsName(ch.c) + " (" + e.message + "). Put it back.", null);
        render();
      });
    });
  }
  function assign(cid, rid){
    var c = classById(cid), r = roomById(rid); if(!c || !r) return;
    var changes = [{ c:c, loc:locName(r) }], bumped = [];
    occupants(rid).forEach(function(o){ if(o.id !== cid){ changes.push({ c:o, loc:"" }); bumped.push(o); } });
    var msg = clsName(c) + " → " + roomName(r);
    if(bumped.length) msg += " · " + (bumped.length === 1 ? clsName(bumped[0]) : bumped.length + " classes") + " needs a room";
    state.sheet = null; state.pick = null;
    if(state.view === "map") state.floor = r.fk;
    apply(changes, msg);
    render();
  }
  function unassign(cid){
    var c = classById(cid); if(!c) return;
    state.sheet = null;
    apply([{ c:c, loc:"" }], clsName(c) + " needs a room again");
    render();
  }
  function showToast(msg, prev){
    state.toast = { msg:msg, prev:prev };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ state.toast = null; renderToast(); }, 6000);
  }
  function undo(){
    var t = state.toast; state.toast = null; clearTimeout(toastTimer);
    if(t && t.prev){
      var changes = t.prev.map(function(p){ return { c:p.c, loc:p.loc }; });
      changes.forEach(function(ch){ ch.c.loc = ch.loc; });
      if(SCRIPT_URL) changes.forEach(function(ch){ saveChain = saveChain.then(function(){ return post(ch.c, ch.loc); }).catch(function(){ showToast("Couldn't save the undo. Check the sheet.", null); renderToast(); }); });
    }
    render();
  }

  // ---------------------------------------------------------------------------
  // Classes view
  function classRow(c){
    var r = roomOf(c), size = sizeOf(c), side, sub = teachersOf(c);
    if(r) side = '<span class="room-name">' + esc(roomName(r)) + '</span>' + badgeFor(c, r);
    else {
      side = '<span class="assign-btn">Assign room</span>';
      sub += ' · ' + (size != null ? size + ' expected' : 'no headcount');
      if(c.loc && !/^\s*tbd\s*$/i.test(c.loc)) sub += ' · sheet says "' + c.loc + '"';
    }
    return '<button class="cls" data-do="class" data-c="' + esc(c.id) + '">' +
      '<span class="cls-main"><span class="cls-age">' + esc(ageLabel(c)) + '</span>' +
      '<span class="cls-title">' + esc(clsTitle(c)) + '</span><span class="cls-sub">' + esc(sub) + '</span></span>' +
      '<span class="cls-side">' + side + '</span></button>';
  }
  function classesHTML(){
    var list = qClasses(), need = list.filter(function(c){ return !roomOf(c); }), placed = list.filter(function(c){ return roomOf(c); });
    var addBtn = '<div class="add-row"><button class="btn secondary" data-do="addclass">+ Add a class to ' + esc(state.q) + '</button></div>';
    if(!list.length) return '<div class="summary"><p class="empty">No classes in ' + esc(state.q) + ' yet.</p></div>' + addBtn;
    var pct = Math.round(placed.length / list.length * 100);
    var head = need.length ? '<strong>' + need.length + '</strong> of ' + list.length + ' classes need a room' : 'All <strong>' + list.length + '</strong> classes have a room';
    var html = '<section class="summary" aria-label="Progress"><div class="line">' + head + '</div><div class="bar"><span style="width:' + pct + '%"></span></div></section>';
    function chip(k, label, n){ return '<button class="chip" data-do="filter" data-f="' + k + '" aria-pressed="' + (state.filter === k) + '">' + label + ' <i>' + n + '</i></button>'; }
    html += '<div class="chips" role="group" aria-label="Filter">' + chip("all", "All", list.length) + chip("need", "Needs a room", need.length) + chip("placed", "Placed", placed.length) + '</div>' + addBtn;
    if(state.filter !== "placed"){
      html += '<div class="sec-h"><h2>Needs a room</h2><span>' + need.length + '</span></div>';
      html += need.length ? '<div class="group">' + need.map(classRow).join("") + '</div>' : '<div class="group"><p class="empty">Every class has a room.</p></div>';
    }
    if(state.filter !== "need"){
      html += '<div class="sec-h"><h2>Placed</h2><span>' + placed.length + '</span></div>';
      html += placed.length ? '<div class="group">' + placed.map(classRow).join("") + '</div>' : '<div class="group"><p class="empty">Nothing placed yet. Tap a class to pick a room.</p></div>';
    }
    return html;
  }

  // ---------------------------------------------------------------------------
  // Map view
  function bbox(p){
    var xs = p.map(function(q){ return q[0]; }), ys = p.map(function(q){ return q[1]; });
    return { x0:Math.min.apply(0, xs), x1:Math.max.apply(0, xs), y0:Math.min.apply(0, ys), y1:Math.max.apply(0, ys) };
  }
  function pts(p){ return p.map(function(q){ return q.join(","); }).join(" "); }
  function trunc(t, w, fs){ var m = Math.max(3, Math.floor((w - 8) / (fs * 0.56))); return t.length > m ? t.slice(0, m - 1) + "…" : t; }
  function shortOf(c){ return c.isKid ? (c.age || "Kids") : (c.kind || "Class"); }
  function textLines(r, lines){
    var b = bbox(r.p), w = b.x1 - b.x0, lh = 0, i;
    for(i = 0; i < lines.length; i++) lh += lines[i].fs + 4;
    var y = r.at[1] - lh / 2, out = "";
    for(i = 0; i < lines.length; i++){
      var l = lines[i], fs = Math.max(l.fs * 0.65, Math.min(l.fs, (w - 8) / (l.t.length * 0.6)));
      out += '<text class="' + l.c + '" font-size="' + fs.toFixed(1) + '" x="' + r.at[0] + '" y="' + (y + l.fs * 0.85).toFixed(1) + '" text-anchor="middle">' + esc(trunc(l.t, w, fs)) + '</text>';
      y += l.fs + 4;
    }
    return out;
  }
  function roomSVG(r, mul){
    var fs = 11 * mul, fs2 = 10 * mul, pc = state.pick ? classById(state.pick) : null;
    if(r.use === "service"){
      return '<g class="rm is-space"><polygon class="shape" points="' + pts(r.p) + '"/>' +
        (r.name ? textLines(r, [{ t:r.name, c:"t-sub", fs:8 * mul }]) : "") + '</g>';
    }
    var o = occupants(r.id), cap = capOf(r), st, lines, label, nameLine = { t:r.name.replace(/^Large Classroom /, "Large ").replace(/^Classroom /, "Rm "), c:"t-name", fs:fs };
    var capTxt = cap != null ? "holds " + cap : "no capacity set";
    if(pc){
      var f = fitOf(sizeOf(pc), cap), here = roomOf(pc);
      if(here && here.id === r.id){ st = "is-current"; lines = [nameLine, { t:"current", c:"t-sub", fs:fs2 }]; label = roomName(r) + ", current room"; }
      else if(f.s === "small"){ st = "is-small"; lines = [nameLine, { t:capTxt, c:"t-sub", fs:fs2 }]; label = roomName(r) + ", too small, " + capTxt; }
      else if(o.length){ st = "is-taken"; lines = [nameLine, { t:o.length > 1 ? o.length + " classes" : shortOf(o[0]), c:"t-sub", fs:fs2 }]; label = roomName(r) + ", in use. Tap to replace"; }
      else { st = f.s === "tight" ? "is-tight" : f.s === "good" ? "is-good" : "is-open"; lines = [nameLine, { t:capTxt, c:"t-sub", fs:fs2 }]; label = roomName(r) + ", " + (f.s === "tight" ? "tight fit, " : f.s === "good" ? "fits, " : "") + capTxt; }
    } else if(o.length){
      st = "is-occ";
      lines = [nameLine];
      if(o.length === 1){
        var fo = fitOf(sizeOf(o[0]), cap);
        lines.push({ t:shortOf(o[0]), c:"t-cls", fs:fs + 1 });
        if(sizeOf(o[0]) != null && cap != null) lines.push({ t:sizeOf(o[0]) + "/" + cap, c:"t-sub" + (fo.s === "small" ? " over" : ""), fs:fs2 });
      } else lines.push({ t:o.length + " classes", c:"t-cls", fs:fs + 1 });
      label = roomName(r) + ", " + o.map(clsName).join(" and ");
    } else {
      st = "is-open"; lines = [nameLine, { t:cap != null ? cap + " seats" : "", c:"t-sub", fs:fs2 }]; label = roomName(r) + ", open, " + capTxt;
    }
    return '<g class="rm ' + st + '" data-do="' + (pc ? "pickroom" : "room") + '" data-r="' + r.id + '" tabindex="0" role="button" aria-label="' + esc(label) + '">' +
      '<polygon class="shape" points="' + pts(r.p) + '"/>' + textLines(r, lines.filter(function(l){ return l.t; })) + '</g>';
  }
  function floorTabBadge(fl){
    var pc = state.pick ? classById(state.pick) : null, n = 0, here = pc ? roomOf(pc) : null;
    ROOMS.filter(function(r){ return r.fk === fl.key; }).forEach(function(r){
      if(pc){ if((!here || here.id !== r.id) && !occupants(r.id).length && fits(fitOf(sizeOf(pc), capOf(r))) && capOf(r) != null) n++; }
      else if(occupants(r.id).length) n++;
    });
    return n ? '<b' + (pc ? ' class="fit"' : '') + '>' + n + '</b>' : "";
  }
  // Building outlines for each floor come from the same slabs floorplan.js draws (indexes into its SLABS list)
  var SLAB_POLYS = {
    main:  [[[418,339],[830,339],[830,330],[948,330],[948,400],[1540,400],[1540,1284],[950,1284],[950,809],[777,809],[777,905],[476,905],[476,809],[418,809]], [[870,262],[948,262],[948,330],[870,330]]],
    annex: [[[945,64],[1339,64],[1339,262],[945,262]]],
    apt:   [[[425,58],[755,58],[755,294],[425,294]]],
    second:[]
  };
  function mapHTML(){
    var fl = floorOf(state.floor), pc = state.pick;
    var tabs = '<div class="floor-tabs" role="group" aria-label="Floor">' + FLOORS.map(function(f){
      return '<button class="chip" data-do="floor" data-fl="' + f.key + '" aria-pressed="' + (state.floor === f.key) + '">' + f.label + floorTabBadge(f) + '</button>';
    }).join("") + '</div>';
    var legend = pc
      ? '<span><i class="l-good"></i>Fits</span><span><i class="l-tight"></i>Tight</span><span><i class="l-small"></i>Too small</span><span><i class="l-taken"></i>In use</span>'
      : '<span><i class="l-occ"></i>Class meets here</span><span><i class="l-open"></i>Open room</span><span><i class="l-space"></i>Not a classroom</span>';
    var rooms = EBC.rooms.filter(function(r){ return r.fk === fl.key; });
    var all = []; rooms.forEach(function(r){ all = all.concat(r.p); });
    var slabs = SLAB_POLYS[fl.key] || [];
    slabs.forEach(function(s){ all = all.concat(s); });
    var b = bbox(all), pad = 14, vb = [b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + 2 * pad, b.y1 - b.y0 + 2 * pad];
    var svg = '<svg class="plan" viewBox="' + vb.join(" ") + '" role="group" aria-label="' + esc(fl.where) + ' floor plan"' + (fl.min ? ' style="min-width:' + fl.min + 'px"' : "") + '>';
    if(fl.key === "second") svg += '<rect class="slab" x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '" rx="10"/>';
    slabs.forEach(function(s){ svg += '<polygon class="slab" points="' + pts(s) + '"/>'; });
    svg += rooms.map(function(r){ return roomSVG(r, fl.mul); }).join("");
    if(fl.key === "apt") svg += '<text class="cap-note" font-size="14" x="590" y="316" text-anchor="middle">APARTMENT · ACROSS THE STREET</text>';
    svg += '</svg>';
    var hint = fl.min ? '<p class="map-hint">Scroll sideways to see the whole floor.</p>' : "";
    return tabs + '<div class="legend">' + legend + '</div><div class="map-card">' + svg + '</div>' + hint;
  }

  // ---------------------------------------------------------------------------
  // Sheets
  function optRow(c, r, mode, best){
    var f = fitOf(sizeOf(c), capOf(r)), o = occupants(r.id).filter(function(x){ return x.id !== c.id; }), notes = [];
    if(isYoung(c) && r.fk === "second") notes.push('<span class="warn">Stairs</span>');
    if(f.big) notes.push("Much larger than needed");
    if(mode === "taken") notes.push("In use by " + esc(o.map(shortOf).join(", ")));
    var meta = esc(whereOf(r)) + (capOf(r) != null ? " · holds " + capOf(r) : " · capacity not set") + (notes.length ? " · " + notes.join(" · ") : "");
    var side;
    if(mode === "small") side = '<span class="pill bad">Short by ' + f.over + '</span>';
    else if(mode === "taken") side = fitPill(sizeOf(c), capOf(r), false) + '<span class="opt-act">Replace</span>';
    else side = fitPill(sizeOf(c), capOf(r), best);
    var dis = mode === "small" ? " disabled" : "";
    return '<button class="opt" data-do="assign" data-c="' + esc(c.id) + '" data-r="' + r.id + '"' + dis + '><span class="opt-main"><span class="opt-name">' + esc(roomName(r)) + '</span><span class="opt-meta">' + meta + '</span></span><span class="opt-side">' + side + '</span></button>';
  }
  function classSheet(c){
    var cr = roomOf(c), size = sizeOf(c);
    var cand = ROOMS.filter(function(r){ return !cr || r.id !== cr.id; }).map(function(r){
      return { r:r, f:fitOf(size, capOf(r)), o:occupants(r.id).filter(function(x){ return x.id !== c.id; }) };
    });
    function byRank(a, b){ return rank(c, a.r) - rank(c, b.r); }
    var open = cand.filter(function(x){ return fits(x.f) && x.f.s !== "nocap" && !x.o.length; }).sort(byRank);
    var taken = cand.filter(function(x){ return fits(x.f) && x.o.length; }).sort(byRank);
    var small = cand.filter(function(x){ return x.f.s === "small"; }).sort(function(a, b){ return capOf(b.r) - capOf(a.r); });
    var nocap = cand.filter(function(x){ return x.f.s === "nocap"; });
    var bestId = null;
    if(size != null) for(var i = 0; i < open.length; i++) if(rank(c, open[i].r) < 1000){ bestId = open[i].r.id; break; }

    var head = '<div class="sheet-head"><div class="grab"></div><div class="head-row"><div><div class="eyebrow" style="color:var(--accent)">' + esc(ageLabel(c)) + '</div><h2 id="sheet-title">' + esc(clsTitle(c)) + '</h2></div>' +
      '<button class="x" data-do="close" aria-label="Close">' + ICON_X + '</button></div><p class="sub">' + esc(teachersOf(c)) + '</p></div>';
    var body = '<div class="block"><div class="row"><div><strong>Expected attendance</strong><div class="hint">Rooms re-rank as this changes. Planning only, not saved.</div></div>' +
      '<div class="stepper"><button data-do="size" data-c="' + esc(c.id) + '" data-d="-1" aria-label="Fewer people">−</button><output aria-live="polite">' + (size == null ? "–" : size) + '</output><button data-do="size" data-c="' + esc(c.id) + '" data-d="1" aria-label="More people">+</button></div></div></div>';
    if(cr){
      body += '<div class="current-card"><div class="row"><div><div class="eyebrow">Now in</div><strong>' + esc(roomName(cr)) + '</strong></div>' + badgeFor(c, cr) + '</div>' +
        '<button class="btn quiet" data-do="unassign" data-c="' + esc(c.id) + '">Remove from room</button></div>';
    }
    body += '<button class="btn secondary" data-do="pickmap" data-c="' + esc(c.id) + '">' + ICON_MAP + ' Choose on the map</button>' +
      '<button class="btn secondary" data-do="editclass" data-c="' + esc(c.id) + '">Edit details</button>';
    body += '<div class="block"><h3>' + (cr ? "Move to another room" : "Open rooms that fit") + '</h3>';
    body += open.length ? '<div class="group">' + open.map(function(x){ return optRow(c, x.r, "open", x.r.id === bestId); }).join("") + '</div>'
      : '<div class="group"><p class="empty">No open room holds ' + size + ' people. Lower the count or free up a room.</p></div>';
    body += '</div>';
    if(taken.length) body += '<div class="block"><h3>In use by another class</h3><div class="group">' + taken.map(function(x){ return optRow(c, x.r, "taken", false); }).join("") + '</div></div>';
    if(small.length) body += '<details data-small ' + (state.smallOpen ? "open" : "") + '><summary>Too small for ' + size + ' (' + small.length + ')</summary><div class="group">' + small.map(function(x){ return optRow(c, x.r, "small", false); }).join("") + '</div></details>';
    if(nocap.length) body += '<details data-nocap ' + (state.nocapOpen ? "open" : "") + '><summary>Capacity not set (' + nocap.length + ')</summary><div class="group">' + nocap.map(function(x){ return optRow(c, x.r, x.o.length ? "taken" : "open", false); }).join("") + '</div></details>';
    return head + '<div class="sheet-body">' + body + '</div>';
  }
  function roomSheet(r){
    var o = occupants(r.id), cap = capOf(r);
    var list = qClasses().filter(function(c){ return !o.some(function(x){ return x.id === c.id; }); });
    var okc = list.filter(function(c){ return fits(fitOf(sizeOf(c), cap)) || cap == null; }).sort(function(a, b){
      return (roomOf(a) ? 1 : 0) - (roomOf(b) ? 1 : 0) || (sizeOf(b) || 0) - (sizeOf(a) || 0);
    });
    var tooBig = list.filter(function(c){ return fitOf(sizeOf(c), cap).s === "small"; }).sort(function(a, b){ return sizeOf(a) - sizeOf(b); });
    function classOpt(c, dis){
      var cr = roomOf(c), side;
      if(dis) side = '<span class="pill bad">Short by ' + fitOf(sizeOf(c), cap).over + '</span>';
      else side = fitPill(sizeOf(c), cap, false) + '<span class="opt-act">' + (cr ? "Move here" : "Assign") + '</span>';
      var sz = sizeOf(c);
      return '<button class="opt" data-do="assign" data-c="' + esc(c.id) + '" data-r="' + r.id + '"' + (dis ? " disabled" : "") + '><span class="opt-main"><span class="opt-name">' + esc(clsName(c)) + '</span><span class="opt-meta">' + esc(ageLabel(c)) + ' · ' + (sz != null ? sz + " expected" : "no headcount") + ' · ' + (cr ? "now in " + esc(roomName(cr)) : "needs a room") + '</span></span><span class="opt-side">' + side + '</span></button>';
    }
    var head = '<div class="sheet-head"><div class="grab"></div><div class="head-row"><div><div class="eyebrow">' + esc(whereOf(r)) + '</div><h2 id="sheet-title">' + esc(roomName(r)) + '</h2></div>' +
      '<button class="x" data-do="close" aria-label="Close">' + ICON_X + '</button></div><p class="sub">' + (cap != null ? "Holds " + cap : "Capacity not set. Add it on the Rooms tab.") + '</p></div>';
    var body = "";
    o.forEach(function(c){
      body += '<div class="current-card"><div class="row"><div><div class="eyebrow">Class meets here</div><strong>' + esc(clsName(c)) + '</strong><div class="hint">' + esc(ageLabel(c)) + '</div></div>' + badgeFor(c, r) + '</div>' +
        '<button class="btn quiet" data-do="unassign" data-c="' + esc(c.id) + '">Remove from room</button></div>';
    });
    body += '<div class="block"><h3>' + (o.length ? "Swap in a class that fits" : "Classes that fit") + '</h3>';
    body += okc.length ? '<div class="group">' + okc.map(function(c){ return classOpt(c, false); }).join("") + '</div>' : '<div class="group"><p class="empty">No class in this quarter fits ' + cap + ' seats.</p></div>';
    body += '</div>';
    if(tooBig.length) body += '<details data-small ' + (state.smallOpen ? "open" : "") + '><summary>Too large for this room (' + tooBig.length + ')</summary><div class="group">' + tooBig.map(function(c){ return classOpt(c, true); }).join("") + '</div></details>';
    return head + '<div class="sheet-body">' + body + '</div>';
  }

  // ---------------------------------------------------------------------------
  // Forms: add a quarter, add a class, edit a class
  function field(label, input, cls){ return '<label class="field' + (cls ? " " + cls : "") + '"><span>' + label + '</span>' + input + '</label>'; }
  function options(list, cur){
    if(cur && list.indexOf(cur) < 0) list = list.concat([cur]);
    return list.map(function(o){ return '<option value="' + esc(o) + '"' + (o === cur ? " selected" : "") + '>' + esc(o || "(blank)") + '</option>'; }).join("");
  }
  function formSheet(title, eyebrow, formId, body, label){
    return '<div class="sheet-head"><div class="grab"></div><div class="head-row"><div><div class="eyebrow">' + esc(eyebrow) + '</div><h2 id="sheet-title">' + esc(title) + '</h2></div>' +
      '<button class="x" data-do="close" aria-label="Close">' + ICON_X + '</button></div></div>' +
      '<form class="sheet-body" data-form="' + esc(formId) + '" novalidate>' + body +
      '<p class="form-err" id="form-err" role="alert" hidden></p>' +
      '<button class="btn primary" type="submit" data-label="' + esc(label) + '">' + esc(label) + '</button></form>';
  }
  function formError(f, msg){ var el = f.querySelector("#form-err"); el.textContent = msg; el.hidden = !msg; }
  function setBusy(f, b){ var btn = f.querySelector("button[type=submit]"); btn.disabled = b; btn.textContent = b ? "Saving\u2026" : btn.getAttribute("data-label"); }
  function val(f, id){ var el = f.querySelector("#" + id); return el ? el.value.trim() : ""; }
  function fmtDate(d){ return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear(); }
  function isoDate(d){ var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (x < 10 ? "0" : "") + x; }
  function fromISO(v){ var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function uniq(a){ return a.filter(function(v, i){ return v && a.indexOf(v) === i; }); }

  function quarterInfo(key){
    if(state.extraQ[key]) return state.extraQ[key];
    for(var i = 0; i < rows.length; i++) if(qKey(rows[i]) === key && rows[i].startRaw) return { year:rows[i].year, q:rows[i].q, startRaw:rows[i].startRaw, endRaw:rows[i].endRaw };
    var p = key.split(" "); return { year:p[0], q:p[1], startRaw:"", endRaw:"" };
  }
  function nextQuarter(){
    var latest = quarters().list[0], d = new Date();
    if(!latest) return { year:d.getFullYear(), q:"Q1", start:d, end:new Date(d.getFullYear(), d.getMonth() + 3, 0) };
    var info = quarterInfo(latest), n = +String(info.q).replace(/\D/g, "") || 4, e = toDate(info.endRaw || "");
    var start = e ? new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1) : d;
    return { year:+info.year + (n === 4 ? 1 : 0), q:"Q" + (n % 4 + 1), start:start, end:new Date(start.getFullYear(), start.getMonth() + 3, 0) };
  }

  function quarterSheet(){
    var n = nextQuarter();
    var body = field("Year", '<input id="f-year" type="number" inputmode="numeric" min="2000" max="2099" value="' + n.year + '">') +
      field("Quarter", '<select id="f-q">' + options(["Q1", "Q2", "Q3", "Q4"], n.q) + '</select>') +
      field("Starts", '<input id="f-start" type="date" value="' + isoDate(n.start) + '">') +
      field("Ends", '<input id="f-end" type="date" value="' + isoDate(n.end) + '">') +
      '<p class="hint-p">The quarter is saved to the sheet when you add its first class.</p>';
    return formSheet("Add a quarter", "New quarter", "quarter", body, "Create quarter");
  }
  function submitQuarter(f){
    var y = +val(f, "f-year"), q = val(f, "f-q"), st = fromISO(val(f, "f-start")), en = fromISO(val(f, "f-end"));
    if(!(y >= 2000 && y <= 2099)) return formError(f, "Enter a four-digit year.");
    if(!st || !en || en <= st) return formError(f, "Pick a start date, and an end date after it.");
    var key = y + " " + q;
    if(quarters().list.indexOf(key) < 0) state.extraQ[key] = { year:String(y), q:q, start:st, end:en, startRaw:fmtDate(st), endRaw:fmtDate(en) };
    state.q = key; state.view = "classes"; state.sheet = null;
    showToast(key + " is ready. Add its first class to save it to the sheet.", null);
    render();
  }

  function addSheet(){
    var kinds = uniq(["Adult", "College", "High School", "Middle School"].concat(rows.filter(function(c){ return !c.isKid; }).map(function(c){ return c.kind; })));
    var ages = uniq(rows.filter(function(c){ return c.isKid; }).map(function(c){ return c.age; }));
    var dl = function(id, list){ return '<datalist id="' + id + '">' + list.map(function(v){ return '<option value="' + esc(v) + '">'; }).join("") + '</datalist>'; };
    var body = '<div class="seg seg-radio" role="radiogroup" aria-label="Which tab"><label><input type="radio" name="grp" value="adult" checked><span>Adults &amp; teens</span></label><label><input type="radio" name="grp" value="kids"><span>Kids</span></label></div>' +
      field("Age group", '<input id="f-group" list="dl-adult" autocomplete="off" placeholder="e.g. Adult, High School, 3rd - 5th grades">') +
      field("Class name (optional)", '<input id="f-name" placeholder="Leave blank for TBD">') +
      field("Teachers (optional)", '<input id="f-teacher">') +
      field("Book (optional)", '<input id="f-book">', "adult-only") +
      field("Type", '<select id="f-type">' + options(["", "OT", "NT", "Topical"], "") + '</select>', "adult-only") +
      field("Expected headcount (optional)", '<input id="f-est" type="number" inputmode="numeric" min="0" max="999">', "adult-only") +
      field("Status", '<select id="f-status">' + options(["Idea", "Planned", "Confirmed"], "Planned") + '</select>') +
      '<p class="hint-p">Planned and Idea classes stay off the dashboard\'s Now Teaching and Up Next until you set them to Confirmed.</p>' +
      dl("dl-adult", kinds) + dl("dl-kids", ages);
    return formSheet("Add a class", state.q, "add", body, "Add class");
  }
  function submitAdd(f){
    var info = quarterInfo(state.q), tab = f.querySelector("input[name=grp]:checked").value, group = val(f, "f-group");
    if(!group) return formError(f, "Pick an age group.");
    if(!info.startRaw || !info.endRaw) return formError(f, "This quarter has no start and end dates. Create it with + Add quarter first.");
    var fields = { year:info.year, q:info.q, start:info.startRaw, end:info.endRaw, name:val(f, "f-name") || "TBD", teacher:val(f, "f-teacher"), status:val(f, "f-status") };
    fields[tab === "adult" ? "kind" : "age"] = group;
    if(tab === "adult"){ fields.book = val(f, "f-book"); fields.type = val(f, "f-type"); fields.est = val(f, "f-est"); }
    var dupe = qClasses().some(function(c){ return c.src === tab && (tab === "adult" ? c.kind : c.age).toLowerCase() === group.toLowerCase(); });
    if(dupe && !window.confirm("There's already a " + group + " class in " + state.q + ". Add another?")) return;
    setBusy(f, true);
    send({ action:"add", tab:tab, fields:fields }).then(function(d){
      rows.push(rowFrom(tab, d.row, fields));
      delete state.extraQ[state.q];
      state.sheet = null;
      showToast("Added " + group + " to " + state.q, null);
      render();
    }).catch(function(e){ setBusy(f, false); formError(f, "Couldn't save (" + e.message + ")."); });
  }

  function editSheet(c){
    var adult = !c.isKid;
    var body = field("Teachers", '<input id="f-teacher" value="' + esc(c.teacher) + '">') +
      field("Class name", '<input id="f-name" value="' + esc(c.name) + '">') +
      (adult ? field("Book", '<input id="f-book" value="' + esc(c.book) + '">') +
               field("Type", '<select id="f-type">' + options(["", "OT", "NT", "Topical", "TBD"], c.type) + '</select>') +
               field("Expected headcount", '<input id="f-est" type="number" inputmode="numeric" min="0" max="999" value="' + esc(c.est) + '">') : "") +
      field("Notes", '<textarea id="f-notes">' + esc(c.notes) + '</textarea>') +
      field("Status", '<select id="f-status">' + options(["", "Idea", "Planned", "Confirmed", "Completed"], c.statusRaw) + '</select>') +
      '<p class="hint-p">Blank status counts as Confirmed. Year, quarter and age group can only be changed in the sheet.</p>';
    return formSheet(clsTitle(c), ageLabel(c) + " \u00b7 " + c.year + " " + c.q, "edit:" + c.id, body, "Save changes");
  }
  function submitEdit(f, c){
    if(!c) return;
    var map = { teacher:["f-teacher", c.teacher], name:["f-name", c.name], book:["f-book", c.book], type:["f-type", c.type], est:["f-est", c.est], notes:["f-notes", c.notes], status:["f-status", c.statusRaw] };
    var changed = {}, n = 0;
    Object.keys(map).forEach(function(k){
      if(!f.querySelector("#" + map[k][0])) return;
      var v = val(f, map[k][0]);
      if(v !== map[k][1]){ changed[k] = v; n++; }
    });
    if(!n){ state.sheet = null; render(); return; }
    setBusy(f, true);
    send({ action:"edit", tab:c.src, row:c.sheetRow, expect:expectOf(c), fields:changed }).then(function(){
      Object.keys(changed).forEach(function(k){ if(k === "status"){ c.statusRaw = changed[k]; c.status = changed[k] || "Confirmed"; } else c[k] = changed[k]; });
      if("est" in changed) delete c.sizeOverride;
      state.sheet = null;
      showToast("Saved changes to " + clsName(c), null);
      render();
    }).catch(function(e){ setBusy(f, false); formError(f, "Couldn't save (" + e.message + ")."); });
  }
  document.addEventListener("submit", function(e){
    var f = e.target, id = f && f.getAttribute && f.getAttribute("data-form");
    if(!id) return;
    e.preventDefault(); formError(f, "");
    if(id === "quarter") submitQuarter(f);
    else if(id === "add") submitAdd(f);
    else if(id.indexOf("edit:") === 0) submitEdit(f, classById(id.slice(5)));
  });
  document.addEventListener("change", function(e){
    var t = e.target; if(!t || t.name !== "grp") return;
    var kids = t.value === "kids", f = t.form;
    [].forEach.call(f.querySelectorAll(".adult-only"), function(el){ el.hidden = kids; });
    f.querySelector("#f-group").setAttribute("list", kids ? "dl-kids" : "dl-adult");
  });

  // ---------------------------------------------------------------------------
  // Render
  function renderHeader(){
    var qs = quarters(), sel = $("quarter");
    sel.innerHTML = qs.list.map(function(k){ return '<option value="' + esc(k) + '">' + esc(k) + (k === qs.now ? " · now" : "") + '</option>'; }).join("") + '<option value="__add">+ Add quarter…</option>';
    sel.value = state.q;
    $("tab-classes").setAttribute("aria-selected", state.view === "classes");
    $("tab-map").setAttribute("aria-selected", state.view === "map");
    var pb = $("pickbar"), pc = state.pick ? classById(state.pick) : null;
    if(pc){
      var n = sizeOf(pc);
      pb.hidden = false;
      pb.innerHTML = '<div><strong>Placing ' + esc(clsName(pc)) + '</strong><span>' + (n != null ? n + " people · " : "") + 'tap a green or amber room</span></div><button class="link" data-do="cancelpick">Cancel</button>';
    } else { pb.hidden = true; pb.innerHTML = ""; }
  }
  function renderSheet(){
    var root = $("sheet-root"), s = state.sheet;
    var prev = root.querySelector(".sheet-body"), sc = prev ? prev.scrollTop : 0;
    if(!s){ root.innerHTML = ""; lastSheetKey = null; document.documentElement.style.overflow = ""; return; }
    var key = s.t + ":" + s.id, fresh = key !== lastSheetKey, inner;
    var isForm = s.t === "quarter" || s.t === "add" || s.t === "edit";
    if(isForm && !fresh) return;   // don't wipe what's being typed
    if(isForm){ state.toast = null; clearTimeout(toastTimer); }   // keep the toast off the Save button
    if(s.t === "class"){ var c = classById(s.id); if(!c){ state.sheet = null; return renderSheet(); } inner = classSheet(c); }
    else if(s.t === "quarter") inner = quarterSheet();
    else if(s.t === "add") inner = addSheet();
    else if(s.t === "edit"){ var ec = classById(s.id); if(!ec){ state.sheet = null; return renderSheet(); } inner = editSheet(ec); }
    else inner = roomSheet(roomById(s.id));
    root.innerHTML = '<div class="backdrop" data-do="close"></div><div class="sheet' + (fresh ? " enter" : "") + '" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">' + inner + '</div>';
    var body = root.querySelector(".sheet-body");
    if(body) body.scrollTop = fresh ? 0 : sc;
    if(fresh){ var sh = root.querySelector(".sheet"); if(sh) sh.focus({ preventScroll:true }); }
    lastSheetKey = key;
    document.documentElement.style.overflow = "hidden";
  }
  function renderToast(){
    var t = state.toast;
    $("toast-root").innerHTML = t ? '<div class="toast" role="status"><span>' + esc(t.msg) + '</span>' + (t.prev ? '<button data-do="undo">Undo</button>' : "") + '</div>' : "";
  }
  function render(){
    renderHeader();
    var note = "";
    if(loadError) note = '<div class="banner err">' + esc(loadError) + '</div>';
    else if(!SCRIPT_URL && rows.length) note = '<div class="banner">Preview mode: changes aren\'t saved to the sheet yet and will reset when you reload.</div>';
    var main = !rows.length ? (loadError ? "" : '<p class="empty">Loading classes…</p>') : state.view === "classes" ? classesHTML() : mapHTML();
    $("main").innerHTML = note + main;
    renderSheet();
    renderToast();
  }

  // ---------------------------------------------------------------------------
  // Events
  document.addEventListener("click", function(e){
    var el = e.target.closest ? e.target.closest("[data-do]") : null;
    if(!el) return;
    var d = el.dataset;
    switch(d.do){
      case "view": state.view = d.v; state.pick = null; render(); window.scrollTo(0, 0); break;
      case "filter": state.filter = d.f; render(); break;
      case "floor": state.floor = d.fl; render(); break;
      case "class": state.sheet = { t:"class", id:d.c }; render(); break;
      case "room": state.sheet = { t:"room", id:d.r }; render(); break;
      case "pickroom": {
        var pc = classById(state.pick), r = roomById(d.r); if(!pc || !r) break;
        var here = roomOf(pc), f = fitOf(sizeOf(pc), capOf(r));
        if(here && here.id === r.id){ showToast(clsName(pc) + " is already in " + roomName(r), null); renderToast(); break; }
        if(f.s === "small"){ showToast(roomName(r) + " holds " + capOf(r) + ". " + clsName(pc) + " needs " + sizeOf(pc) + ".", null); renderToast(); break; }
        assign(pc.id, r.id); break;
      }
      case "assign": assign(d.c, d.r); break;
      case "unassign": unassign(d.c); break;
      case "size": { var c = classById(d.c), cur = sizeOf(c); c.sizeOverride = cur == null ? 10 : Math.max(1, Math.min(999, cur + Number(d.d))); render(); break; }
      case "pickmap": {
        var cc = classById(d.c), best = roomOf(cc);
        if(!best){
          var cand = ROOMS.filter(function(x){ return capOf(x) != null && !occupants(x.id).length && fits(fitOf(sizeOf(cc), capOf(x))); }).sort(function(a, b){ return rank(cc, a) - rank(cc, b); });
          best = cand[0] || null;
        }
        state.pick = cc.id; state.view = "map"; state.sheet = null; if(best) state.floor = best.fk;
        render(); window.scrollTo(0, 0); break;
      }
      case "cancelpick": state.pick = null; render(); break;
      case "addclass": state.sheet = { t:"add", id:state.q }; render(); break;
      case "editclass": state.sheet = { t:"edit", id:d.c }; render(); break;
      case "undo": undo(); break;
      case "close": state.sheet = null; render(); break;
    }
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){ if(state.sheet){ state.sheet = null; render(); } else if(state.pick){ state.pick = null; render(); } return; }
    var t = e.target;
    if((e.key === "Enter" || e.key === " ") && t && t.getAttribute && t.getAttribute("role") === "button" && String(t.tagName).toLowerCase() === "g"){
      e.preventDefault(); t.dispatchEvent(new MouseEvent("click", { bubbles:true }));
    }
  });
  document.addEventListener("toggle", function(e){
    var t = e.target; if(!t || !t.hasAttribute) return;
    if(t.hasAttribute("data-small")) state.smallOpen = t.open;
    if(t.hasAttribute("data-nocap")) state.nocapOpen = t.open;
  }, true);
  $("quarter").addEventListener("change", function(e){
    if(e.target.value === "__add"){ e.target.value = state.q; state.sheet = { t:"quarter", id:"new" }; render(); return; }
    state.q = e.target.value; state.sheet = null; state.pick = null; state.toast = null; render(); });

  load();
  window.__planner = { state:state, rows:function(){ return rows; }, locName:locName };
})();
