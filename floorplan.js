/*!
 * Eastside Bible Classes: floor plan map (v2)
 * Loaded automatically by dashboard.js. Shows each quarter's classes on a simplified,
 * responsive plan, placed by the sheet's "Location" column.
 *
 * The building is drawn as separate areas (West Wing, 2nd Floor, Auditorium, Annex,
 * Apartment). Each area is laid out with HTML boxes so labels never overflow and
 * the plan reflows from desktop (two columns + class list) down to phones (one column).
 *
 * To make a new location name land on a room, add it to that room's "aka" list below.
 * Room coordinates are in each area's own units (see that area's "box").
 */
(function(){
  // AREAS: box = [x, y, width, height] that the area's rooms are measured in.
  var ZONES = [
    { id:"west",   name:"West Wing",  sub:"Ground floor",      box:[420,340,410,336] },
    { id:"second", name:"2nd Floor",  sub:"Upstairs",          box:[957,400,580,335] },
    { id:"aud",    name:"Auditorium", sub:"Ground floor",      box:[0,0,580,200] },
    { id:"annex",  name:"Annex",      sub:"North building",    box:[950,69,389,193] },
    { id:"apt",    name:"Apartment",  sub:"Across the street", box:[425,58,330,236] }
  ];

  // Two-column layout on wider screens (stacked on phones)
  var COLS = [["apt","west"],["annex","second","aud"]];

  // ROOMS
  //   id: unique key · name: label · aka: other Location names (case/spacing ignored)
  //   z: area id · r: [x, y, width, height] in that area's units
  //   use: "class" | "space" (can host a class) | "service" (never matched)
  var ROOMS = [
    // West wing
    { id:"lc165", z:"west", name:"Large Classroom 165", aka:["large classroom 165","classroom 165","room 165","165"], use:"class", r:[420,340,179,162] },
    { id:"lc164", z:"west", name:"Large Classroom 164", aka:["large classroom 164","classroom 164","room 164","164"], use:"class", r:[420,506,179,170] },
    { id:"lc163", z:"west", name:"Large Classroom 163", aka:["large classroom 163","classroom 163","room 163","163"], use:"class", r:[649,340,181,167] },
    { id:"resource", z:"west", name:"Resource Room", aka:["resource room","resource","162"], use:"space", r:[649,509,181,109] },

    // 2nd floor classroom block
    { id:"stair-uw", z:"second", name:"", use:"service", r:[957,400,35,125], floor:2 },
    { id:"c208", z:"second", name:"Classroom 208", aka:["classroom 208","room 208","208"], use:"class", r:[992,400,108,125], floor:2 },
    { id:"c209", z:"second", name:"Classroom 209", aka:["classroom 209","room 209","209"], use:"class", r:[1100,400,108,125], floor:2 },
    { id:"rr-up", z:"second", name:"Restrooms", use:"service", vert:1, r:[1208,400,72,125], floor:2 },
    { id:"c210", z:"second", name:"Classroom 210", aka:["classroom 210","room 210","210"], use:"class", r:[1280,400,107,125], floor:2 },
    { id:"c211", z:"second", name:"Classroom 211", aka:["classroom 211","room 211","211"], use:"class", r:[1387,400,108,125], floor:2 },
    { id:"stair-ue", z:"second", name:"", use:"service", r:[1495,400,42,125], floor:2 },
    { id:"corr203", z:"second", name:"", use:"service", r:[957,528,580,54], floor:2 },
    { id:"c215", z:"second", name:"Classroom 215", aka:["classroom 215","room 215","215"], use:"class", r:[957,585,118,150], floor:2 },
    { id:"lc214", z:"second", name:"Large Classroom 214", aka:["large classroom 214","classroom 214","room 214","214"], use:"class", r:[1075,585,170,150], floor:2 },
    { id:"lc213", z:"second", name:"Large Classroom 213", aka:["large classroom 213","classroom 213","room 213","213"], use:"class", r:[1245,585,167,150], floor:2 },
    { id:"c212", z:"second", name:"Classroom 212", aka:["classroom 212","room 212","212"], use:"class", r:[1412,585,125,150], floor:2 },

    // Auditorium
    { id:"auditorium", z:"aud", name:"Auditorium", aka:["aud","main auditorium","sanctuary","117"], use:"space", r:[0,0,580,200] },

    // Annex (north building): the kids' room numbers used on Master: Kids
    { id:"annex1", z:"annex", name:"Room 8", aka:["room 8","annex a"], use:"class", r:[950,69,82,150] },
    { id:"annex1b", z:"annex", name:"Storage", use:"service", r:[950,221,82,41] },
    { id:"annex2", z:"annex", name:"Room 6", aka:["room 6","annex b"], use:"class", r:[1034,69,132,75] },
    { id:"annex3", z:"annex", name:"Room 7", aka:["room 7","annex c"], use:"class", r:[1059,146,107,84] },
    { id:"annex-rr", z:"annex", name:"Restrooms", use:"service", r:[1059,232,107,30] },
    { id:"annex4", z:"annex", name:"Room 4", aka:["room 4","annex d"], use:"class", r:[1168,69,75,75] },
    { id:"annex5", z:"annex", name:"Room 5", aka:["room 5","annex e"], use:"class", r:[1168,146,75,116] },
    { id:"annex6", z:"annex", name:"Room 3", aka:["room 3","annex f"], use:"class", r:[1270,69,69,75] },
    { id:"annex7", z:"annex", name:"Copier", aka:["copier room","copier","annex g"], use:"service", r:[1270,146,69,54] },
    { id:"annex8", z:"annex", name:"Room 1", aka:["room 1","annex h"], use:"class", r:[1270,202,69,60] },

    // Duplex across the street (we rent one side for classes)
    { id:"apt-up", z:"apt", name:"Upstairs", aka:["upstairs"], use:"class", r:[425,58,234,92], apt:1 },
    { id:"apt-bed1", z:"apt", name:"Bedroom 1", aka:["bedroom 1","bed 1","br 1","bedroom one","downstairs bedroom 1"], use:"class", r:[659,58,96,92], apt:1 },
    { id:"apt-living", z:"apt", name:"Living Room", aka:["living room","living","front room"], use:"class", r:[425,150,234,144], apt:1 },
    { id:"apt-bed2", z:"apt", name:"Bedroom 2", aka:["bedroom 2","bed 2","br 2","bedroom two","downstairs bedroom 2"], use:"class", r:[659,150,96,144], apt:1 }
  ];

  // ---------------------------------------------------------------------------
  // PLANNING DATA (optional). Publish each of these three tabs to the web as CSV,
  // the same way "Master: Adult" was published (File > Share > Publish to web >
  // pick the tab + "Comma-separated values (.csv)" > Publish), then paste the
  // links below. Until a link is filled in, the map just skips that piece
  // (kids' classes, headcount, capacity/status badges) and works as before.
  //   KIDS_CSV_URL  <- "Master: Kids" tab
  //   DEMO_CSV_URL  <- "Kid Demographics" tab
  //   ROOMS_CSV_URL <- "Rooms" tab (Room, Capacity, Notes columns; "Room" matched
  //                    the same way the Location column is, e.g. "213", "Annex A")
  var KIDS_CSV_URL  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=528702078&single=true&output=csv";
  var DEMO_CSV_URL  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=617467103&single=true&output=csv";
  var ROOMS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=748914120&single=true&output=csv";

  // Ordered grade ladder used to turn a free-text age/grade tag ("3rd - 5th grades",
  // "Middle School") into a span of Kid Demographics rows to add up.
  var GRADES = [
    { key:"baby1", label:"Baby 1", test:/\bbab(y|ies)\s*1\b/ },
    { key:"baby2", label:"Baby 2", test:/\bbab(y|ies)\s*2\b/ },
    { key:"toddler", label:"Toddler", test:/\btoddlers?\b/ },
    { key:"preschool", label:"Preschool", test:/\bpreschool\b/ },
    { key:"prek", label:"Pre K", test:/\bpre\s*-?\s*k\b/ },
    { key:"k", label:"Kindergarten", test:/\bkindergarten\b/ },
    { key:"g1", label:"1st Grade", test:/\b1st\b/ },
    { key:"g2", label:"2nd Grade", test:/\b2nd\b/ },
    { key:"g3", label:"3rd Grade", test:/\b3rd\b/ },
    { key:"g4", label:"4th Grade", test:/\b4th\b/ },
    { key:"g5", label:"5th Grade", test:/\b5th\b/ },
    { key:"g6", label:"6th Grade", test:/\b6th\b/ },
    { key:"g7", label:"7th Grade", test:/\b7th\b/ },
    { key:"g8", label:"8th Grade", test:/\b8th\b/ },
    { key:"g9", label:"9th Grade", test:/\b9th\b/ },
    { key:"g10", label:"10th Grade", test:/\b10th\b/ },
    { key:"g11", label:"11th Grade", test:/\b11th\b/ },
    { key:"g12", label:"12th Grade", test:/\b12th\b/ }
  ];
  // Starting-point capacities from the architect's stated legal occupancy figures;
  // edit the actual numbers on the Rooms tab once it exists -- these are just the
  // fallback used until then (or for any room the Rooms tab doesn't mention).
  var DEFAULT_CAP = {
    lc163:40, lc165:40, lc164:41, lc213:33, lc214:33,
    c208:19, c209:19, c210:19, c211:19, c212:19, c215:19,
    auditorium:150,
    annex1:20, annex2:20, annex3:20, annex4:20, annex5:20, annex6:20, annex7:20, annex8:20,
    "apt-up":10, "apt-living":10, "apt-bed1":8, "apt-bed2":8
  };

  var NS = "http://www.w3.org/2000/svg";
  var norm = function(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };

  ROOMS.forEach(function(r){
    if(r.r){ var x=r.r[0], y=r.r[1], w=r.r[2], h=r.r[3]; r.p = [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]; }
    if(!r.at){
      var xs = r.p.map(function(p){ return p[0]; }), ys = r.p.map(function(p){ return p[1]; });
      r.at = [(Math.min.apply(0,xs)+Math.max.apply(0,xs))/2, (Math.min.apply(0,ys)+Math.max.apply(0,ys))/2];
    }
    r.keys = [norm(r.name)].concat((r.aka || []).map(norm)).filter(Boolean);
  });

  function findRoom(loc){
    var n = norm(loc); if(!n) return null;
    var APT = /\b(ap+art?ments?|apts?|duplex)\b/;
    if(APT.test(n)){
      var rest = n.replace(APT, " ").replace(/\s+/g, " ").trim();
      var apts = ROOMS.filter(function(r){ return r.apt; });
      for(var a = 0; a < apts.length; a++) if(rest && apts[a].keys.indexOf(rest) > -1) return apts[a];
      return apts.filter(function(r){ return r.id === "apt-living"; })[0];   // plain "Apartments" -> Living Room
    }
    for(var i = 0; i < ROOMS.length; i++){
      var r = ROOMS[i]; if(r.use === "service") continue;
      if(r.keys.indexOf(n) > -1) return r;
    }
    // fall back: a room number mentioned anywhere ("Rm 163", "163 - large classroom")
    var num = /\b([12]\d\d)\b/.exec(n);
    if(num) for(var j = 0; j < ROOMS.length; j++){
      if(ROOMS[j].use !== "service" && ROOMS[j].keys.indexOf(num[1]) > -1) return ROOMS[j];
    }
    return null;
  }

  function pts(p){ return p.map(function(q){ return q.join(","); }).join(" "); }

  // ---------------------------------------------------------------------------
  // Planning data: kids' classes, demographics-based headcount, room capacity.
  // Loaded independently of the adult rows dashboard.js hands us, so the map
  // still works with just Master: Adult if the rest hasn't been set up yet.
  var toDate = function(s){
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s).trim());
    return m ? new Date(+m[3], +m[1]-1, +m[2]) : null;
  };
  function parseCSV(text){
    var out = [], row = [], f = "", q = false;
    for(var i = 0; i < text.length; i++){
      var ch = text[i];
      if(q){
        if(ch === '"'){ if(text[i+1] === '"'){ f += '"'; i++; } else q = false; }
        else f += ch;
      } else if(ch === '"') q = true;
      else if(ch === ','){ row.push(f); f = ""; }
      else if(ch === '\n' || ch === '\r'){
        if(ch === '\r' && text[i+1] === '\n') i++;
        row.push(f); out.push(row); row = []; f = "";
      } else f += ch;
    }
    if(f || row.length){ row.push(f); out.push(row); }
    return out;
  }
  function csvObjects(text){
    var data = parseCSV(text); if(!data.length) return { cols:[], list:[] };
    var cols = data[0].map(function(c){ return c.trim(); });
    var list = data.slice(1).map(function(c){
      var o = {}; cols.forEach(function(name, i){ o[name] = (c[i] || "").trim(); }); return o;
    }).filter(function(o){ return Object.keys(o).some(function(k){ return o[k]; }); });
    return { cols:cols, list:list };
  }

  // A "school year" runs June - May; label it by the calendar year its June falls in,
  // to match the Kid Demographics column headers ("2026 (June - May)").
  function schoolYearLabel(d){ if(!d) return null; return d.getFullYear() - (d.getMonth() < 5 ? 1 : 0); }

  function gradeRange(text){
    var n = norm(text), idxs = [];
    GRADES.forEach(function(g, i){ if(g.test.test(n)) idxs.push(i); });
    if(!idxs.length) return null;
    return GRADES.slice(Math.min.apply(0, idxs), Math.max.apply(0, idxs) + 1);
  }
  var MIDDLE = GRADES.slice(11, 14), HIGH = GRADES.slice(14, 18); // g6-g8, g9-g12

  var PLAN = { kids:[], demo:null, demoCols:{}, todayLabel:schoolYearLabel(new Date()), cap:{}, loaded:0 };
  var lastRows = null;

  function headcountFor(range, label){
    if(!range || !PLAN.demo) return null;
    var col = PLAN.demoCols[label] || (label === PLAN.todayLabel ? "Now" : null);
    if(!col) return null;
    var total = 0, any = false;
    range.forEach(function(g){
      var v = PLAN.demo[g.key] && PLAN.demo[g.key][col];
      if(v !== undefined && v !== ""){ total += (+v || 0); any = true; }
    });
    return any ? total : null;
  }

  function loadCSV(url, cb){
    if(!url || url.indexOf("http") !== 0) return;
    fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + "_=" + Date.now(), { credentials:"omit" })
      .then(function(r){ return r.text(); }).then(cb).catch(function(){});
  }
  loadCSV(KIDS_CSV_URL, function(text){
    var t = csvObjects(text);
    PLAN.kids = t.list.map(function(o){
      return {
        year:o.Year||"", q:o.Q||"", start:toDate(o.Start), end:toDate(o.End),
        kind:"Kids: " + (o.Age||""), age:o.Age||"", teacher:o.Teachers||"", name:o["Class Name"]||"",
        book:"", type:"", loc:o["Room #"]||"", notes:o.Notes||"", status:o.Status || "Confirmed", isKid:true
      };
    }).filter(function(r){ return r.year; });
    PLAN.loaded++; if(window.EBCFloorplan) window.EBCFloorplan.refresh();
    try { document.dispatchEvent(new CustomEvent("ebc:kids", { detail: PLAN.kids })); } catch(e) {}
  });
  loadCSV(DEMO_CSV_URL, function(text){
    var t = csvObjects(text); if(!t.cols.length) return;
    var yearCol = t.cols[0];
    t.cols.forEach(function(h){ var m = /\b(20\d\d)\b/.exec(h); if(m) PLAN.demoCols[+m[1]] = h; });
    var demo = {};
    t.list.forEach(function(row){
      var range = gradeRange(row[yearCol]);
      if(!range || range.length !== 1) return; // demographics rows are single grades
      demo[range[0].key] = row;
    });
    PLAN.demo = demo;
    PLAN.loaded++; if(window.EBCFloorplan) window.EBCFloorplan.refresh();
  });
  loadCSV(ROOMS_CSV_URL, function(text){
    var t = csvObjects(text);
    var cap = {};
    t.list.forEach(function(o){
      var room = findRoom(o.Room);
      if(room && o.Capacity !== "") cap[room.id] = +o.Capacity || null;
    });
    PLAN.cap = cap;
    PLAN.loaded++; if(window.EBCFloorplan) window.EBCFloorplan.refresh();
  });
  function capacityOf(id){ return PLAN.cap[id] != null ? PLAN.cap[id] : (DEFAULT_CAP[id] != null ? DEFAULT_CAP[id] : null); }

  function headcountOfRow(r){
    if(r.est){ var n = +r.est; if(n) return n; }
    var label = schoolYearLabel(r.start);
    var range = r.isKid ? gradeRange(r.age) : (r.kind === "Middle School" ? MIDDLE : r.kind === "High School" ? HIGH : null);
    return range ? headcountFor(range, label) : null;
  }


  var CSS = "#ebc .fp-wrap{container:fpw/inline-size;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:16px;color:#111827}\n#ebc .fp-top{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between}\n#ebc .fp-legend{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:#6b7280}\n#ebc .fp-legend span{display:inline-flex;align-items:center;gap:6px}\n#ebc .fp-legend i{width:12px;height:12px;border-radius:3px;border:1.5px solid;box-sizing:border-box}\n#ebc .fp-warn{border:1px solid #fde68a;background:#fffbeb;border-radius:10px;font-size:13px;color:#92400e}\n#ebc .fp-warn summary{cursor:pointer;padding:10px 14px;font-weight:600;list-style:none;display:flex;align-items:center;gap:8px}\n#ebc .fp-warn summary::-webkit-details-marker{display:none}\n#ebc .fp-warn summary:before{content:\"\";width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0}\n#ebc .fp-warn summary:after{content:\"Show\";margin-left:auto;font-weight:500;color:#b45309}\n#ebc .fp-warn[open] summary:after{content:\"Hide\"}\n#ebc .fp-warn ul{margin:0;padding:0 14px 12px 30px;display:flex;flex-direction:column;gap:4px}\n#ebc .fp-body{display:grid;grid-template-columns:minmax(0,1fr);gap:20px;align-items:start}\n#ebc .fp-map{display:grid;gap:18px 16px;grid-template-columns:minmax(0,1fr);grid-template-areas:\"west\" \"second\" \"aud\" \"annex\" \"apt\";align-items:start}\n#ebc .fp-col{display:contents}\n#ebc .fp-zone{display:flex;flex-direction:column;gap:8px;min-width:0}\n#ebc .fp-zone header{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px}\n#ebc .fp-zone header b,#ebc .fp-zone header span{white-space:nowrap}\n#ebc .fp-zone header b{font-size:13px;font-weight:600;color:#111827}\n#ebc .fp-zone header span{font-size:12px;color:#9ca3af}\n#ebc .fp-plan{position:relative;background:#f9fafb;border:1px solid #eef0f3;border-radius:10px}\n#ebc .fp-in{position:absolute;inset:6px;container-type:inline-size}\n#ebc .fp-rm{position:absolute;box-sizing:border-box;background:#fff;border:1px solid #e2e8f0;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:2px;overflow:hidden;text-align:center;line-height:1.15;transition:background .15s,border-color .15s,box-shadow .15s}\n#ebc .fp-rm .m{font-size:clamp(10px,3cqw,15px);font-weight:600;color:#334155}\n#ebc .fp-rm .s{font-size:clamp(8px,2cqw,11px);color:#94a3b8}\n#ebc .fp-rm.u-space{border-style:dashed;border-color:#cbd5e1}\n#ebc .fp-rm.u-service{background:#f1f3f5;border-color:#f1f3f5}\n#ebc .fp-rm.u-service .m{font-size:clamp(7px,1.8cqw,10px);font-weight:500;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em}\n#ebc .fp-rm.v .m{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap}\n#ebc .fp-rm.act{cursor:pointer;background:#e0f2fe;border:1.5px solid #0b8ed8}\n#ebc .fp-rm.act .m{color:#0369a1}\n#ebc .fp-rm.act .s{display:none}\n#ebc .fp-rm.act.f-tight{background:#fef3c7;border-color:#f59e0b}\n#ebc .fp-rm.act.f-tight .m{color:#b45309}\n#ebc .fp-rm.act.f-over{background:#fee2e2;border-color:#ef4444}\n#ebc .fp-rm.act.f-over .m{color:#b91c1c}\n#ebc .fp-rm.act:hover,#ebc .fp-rm.act.on,#ebc .fp-rm.act:focus-visible{box-shadow:0 0 0 3px rgba(11,142,216,.28);z-index:2;outline:none}\n#ebc .fp-rm .bd{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:100%}\n#ebc .fp-b{font-style:normal;display:inline-flex;align-items:center;justify-content:center;min-width:clamp(16px,4.4cqw,22px);height:clamp(16px,4.4cqw,22px);padding:0 4px;box-sizing:border-box;border-radius:999px;background:#0b8ed8;color:#fff;font-size:clamp(9px,2.4cqw,12px);font-weight:600;font-variant-numeric:tabular-nums;flex-shrink:0}\n#ebc .fp-b.f-tight{background:#d97706}\n#ebc .fp-b.f-over{background:#dc2626}\n#ebc .fp-b.d{background:#fff;color:#0b8ed8;border:1.5px dashed #0b8ed8}\n#ebc .fp-b.x{background:#f3f4f6;color:#9ca3af}\n#ebc .fp-rm .fp-b.on{box-shadow:0 0 0 2px #fff,0 0 0 3.5px #111827}\n#ebc .fp-pop{display:none}\n#ebc .fp-pop.show{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid #bae6fd;border-radius:10px;background:#f0f9ff}\n#ebc .fp-pop-h{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;color:#0369a1}\n#ebc .fp-pop-h button{font:inherit;font-size:12px;font-weight:500;color:#6b7280;background:none;border:0;padding:4px 6px;cursor:pointer}\n#ebc .fp-side{display:flex;flex-direction:column;gap:10px;min-width:0}\n#ebc .fp-side-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:13px;color:#6b7280}\n#ebc .fp-side-h span{white-space:nowrap}\n#ebc .fp-side-h b{font-size:13px;font-weight:600;color:#111827}\n#ebc .fp-list{position:relative;display:flex;flex-direction:column;gap:8px}\n#ebc .fp-item{display:flex;gap:12px;align-items:flex-start;text-align:left;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px;font:inherit;color:inherit;width:100%;box-sizing:border-box;cursor:pointer;transition:border-color .15s,background .15s}\n#ebc .fp-item:hover,#ebc .fp-item.on{border-color:#0b8ed8;background:#f0f9ff}\n#ebc .fp-item.static{cursor:default}\n#ebc .fp-item.static:hover{border-color:#e5e7eb;background:#fff}\n#ebc .fp-item .fp-b{width:24px;height:24px;min-width:24px;font-size:12px;margin-top:1px}\n#ebc .fp-item .tx{min-width:0;display:flex;flex-direction:column;gap:2px}\n#ebc .fp-item .rm{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#0b8ed8}\n#ebc .fp-item.off .rm{color:#b45309}\n#ebc .fp-item .ti{font-size:14px;font-weight:600;color:#111827;line-height:1.3}\n#ebc .fp-item .me{font-size:12px;color:#6b7280}\n#ebc .fp-item .badges{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}\n#ebc .fp-chip{display:inline-block;white-space:nowrap;font-size:11px;font-weight:600;padding:1px 8px;border-radius:999px}\n#ebc .fp-chip.ok{background:#d1fae5;color:#047857}\n#ebc .fp-chip.tight{background:#fef3c7;color:#b45309}\n#ebc .fp-chip.over{background:#fee2e2;color:#b91c1c}\n#ebc .fp-chip.status{background:#f3f4f6;color:#4b5563;text-transform:uppercase}\n#ebc .fp-empty{font-size:13px;color:#6b7280;padding:16px;border:1px dashed #d1d5db;border-radius:10px;text-align:center}\n#ebc .fp-hint{font-size:12px;color:#9ca3af}\n@container fpw (min-width:600px){#ebc .fp-map{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:none;align-items:stretch}#ebc .fp-col{display:flex;flex-direction:column;gap:18px;min-width:0}#ebc .fp-col>.fp-zone:last-child{flex:1 1 auto}#ebc .fp-col>.fp-zone:last-child .fp-plan{flex:1 1 auto}}\n@container fpw (min-width:980px){#ebc .fp-body{grid-template-columns:minmax(0,1fr) 300px;align-items:stretch}#ebc .fp-side{height:0;min-height:100%}#ebc .fp-list{flex:1 1 0;min-height:0;overflow-y:auto;padding-right:4px}#ebc .fp-pop.show{display:none}}";

  function lab(r){
    var m = /^(.*?)\s*(\d{3})$/.exec(r.name);
    return (m && m[1]) ? { m:m[2], s:m[1] } : { m:r.name, s:"" };
  }
  var pct = function(v){ return (Math.round(v * 1000) / 1000) + "%"; };
  var isDraft = function(c){ return c.status === "Idea" || c.status === "Planned"; };
  var titleOf = function(c){ return (c.name && !/^\s*tbd\s*$/i.test(c.name)) ? c.name : "Title TBD"; };

  function render(rows){
    var host = document.getElementById("ebc-map"); if(!host) return;
    var st = document.getElementById("ebc-fp-css");
    if(!st){ st = document.createElement("style"); st.id = "ebc-fp-css"; document.head.appendChild(st); }
    if(st.textContent !== CSS) st.textContent = CSS;
    lastRows = rows;
    rows = rows.concat(PLAN.kids);

    // Quarters available, newest first; default to the one covering today
    var today = new Date(); today.setHours(0,0,0,0);
    var quarters = {}, current = null;
    rows.forEach(function(r){
      if(!r.year || !r.q) return;
      var k = r.year + " " + r.q;
      if(!quarters[k]) quarters[k] = r.start || new Date(+r.year, 0, 1);
      if(r.start && r.end && r.start <= today && today <= r.end) current = k;
    });
    var qlist = Object.keys(quarters).sort(function(a,b){ return quarters[b] - quarters[a]; });
    if(!qlist.length){ host.innerHTML = ""; return; }
    var sel = host.getAttribute("data-q") || current || qlist[0];

    // Classes for the chosen quarter, grouped by room, with headcount/capacity/fit
    var byRoom = {}, unplaced = [], warnings = [];
    rows.filter(function(r){ return (r.year + " " + r.q) === sel; }).forEach(function(r){
      var room = findRoom(r.loc);
      r.status = r.status || "Confirmed";
      r.headcount = headcountOfRow(r);
      if(room){
        r.cap = capacityOf(room.id);
        r.fit = (r.headcount != null && r.cap != null) ? (r.headcount > r.cap ? "over" : (r.headcount >= r.cap * 0.85 ? "tight" : "ok")) : null;
        (byRoom[room.id] = byRoom[room.id] || []).push(r);
      } else unplaced.push(r);
    });
    var roomById = {}; ROOMS.forEach(function(r){ roomById[r.id] = r; });
    var zoneById = {}; ZONES.forEach(function(z){ zoneById[z.id] = z; });
    Object.keys(byRoom).forEach(function(id){
      var room = roomById[id], list = byRoom[id], total = 0, any = false;
      list.forEach(function(c){ if(c.headcount != null){ total += c.headcount; any = true; } });
      var cap = capacityOf(id);
      if(any && cap != null && total > cap) warnings.push(room.name + ": " + total + " expected, room seats " + cap);
      list.forEach(function(c){ if(isDraft(c)) warnings.push(titleOf(c) + " (" + room.name + ") is still \u201c" + c.status + "\u201d, not confirmed"); });
    });
    var mismatched = unplaced.filter(function(r){ return r.loc; });
    mismatched.forEach(function(r){ warnings.push("\u201c" + r.loc + "\u201d (" + titleOf(r) + ") doesn\u2019t match a room on the map"); });

    // Number classes in map order: area by area, room by room
    var placed = [];
    ZONES.forEach(function(z){ ROOMS.forEach(function(r){
      if(r.z === z.id && byRoom[r.id]) byRoom[r.id].forEach(function(c){ c._room = r; c._i = placed.push(c) - 1; });
    }); });
    var worst = function(id){
      var l = byRoom[id];
      return l.some(function(c){ return c.fit === "over"; }) ? "over" : l.some(function(c){ return c.fit === "tight"; }) ? "tight" : "ok";
    };
    var badge = function(c){ return '<i class="fp-b f-' + (c.fit || "ok") + (isDraft(c) ? " d" : "") + '" data-i="' + c._i + '">' + (c._i + 1) + '</i>'; };
    var roomLabel = function(r){ return r.name + " \u00b7 " + zoneById[r.z].name; };

    var zoneHtml = {};
    ZONES.forEach(function(z){
      var b = z.box;
      var rooms = ROOMS.filter(function(r){ return r.z === z.id; }).map(function(r){
        var list = byRoom[r.id], L = lab(r);
        var style = "left:calc(" + pct((r.r[0]-b[0])/b[2]*100) + " + 1.5px);top:calc(" + pct((r.r[1]-b[1])/b[3]*100) + " + 1.5px);" +
          "width:calc(" + pct(r.r[2]/b[2]*100) + " - 3px);height:calc(" + pct(r.r[3]/b[3]*100) + " - 3px)";
        return '<div class="fp-rm u-' + r.use + (r.vert ? " v" : "") + (list ? " act f-" + worst(r.id) : "") + '" data-room="' + r.id + '" style="' + style + '"' +
          (list ? ' tabindex="0" role="button" aria-label="' + esc(r.name + ": " + list.length + " class" + (list.length > 1 ? "es" : "")) + '"' : "") + '>' +
          '<span class="m">' + esc(L.m) + '</span>' + (L.s ? '<span class="s">' + esc(L.s) + '</span>' : "") +
          (list ? '<span class="bd">' + list.map(badge).join("") + '</span>' : "") + '</div>';
      }).join("");
      zoneHtml[z.id] = '<section class="fp-zone" style="grid-area:' + z.id + '"><header><b>' + esc(z.name) + '</b><span>' + esc(z.sub) + '</span></header>' +
        '<div class="fp-plan" style="aspect-ratio:' + (b[2] + 12) + ' / ' + (b[3] + 12) + '"><div class="fp-in">' + rooms + '</div></div>' +
        '<div class="fp-pop" data-zone="' + z.id + '"></div></section>';
    });
    var zonesHtml = COLS.map(function(col){
      return '<div class="fp-col">' + col.map(function(id){ return zoneHtml[id] || ""; }).join("") + '</div>';
    }).join("");

    var item = function(c, room, tag){
      var meta = [c.kind, c.teacher].filter(Boolean).join(" \u00b7 "), chips = "";
      if(c.headcount != null) chips += '<span class="fp-chip ' + (c.fit || "ok") + '">' + c.headcount + (c.cap != null ? " / " + c.cap : "") + ' expected</span>';
      if(c.status && c.status !== "Confirmed" && c.status !== "Completed") chips += '<span class="fp-chip status">' + esc(c.status) + '</span>';
      var off = c._i == null;
      return '<' + tag + (tag === "button" ? ' type="button"' : "") + ' class="fp-item' + (off ? " off" : "") + (tag === "div" ? " static" : "") + '"' +
        (off ? "" : ' data-i="' + c._i + '" data-room="' + c._room.id + '"') + '>' +
        (off ? '<i class="fp-b x">?</i>' : badge(c)) +
        '<span class="tx"><span class="rm">' + esc(room) + '</span><span class="ti">' + esc(titleOf(c)) + '</span>' +
        (meta ? '<span class="me">' + esc(meta) + '</span>' : "") + (chips ? '<span class="badges">' + chips + '</span>' : "") + '</span></' + tag + '>';
    };
    var listHtml = placed.map(function(c){ return item(c, roomLabel(c._room), "button"); }).join("") +
      unplaced.map(function(c){ return item(c, c.loc ? "Not on map: " + c.loc : "No location yet", "div"); }).join("");
    var nRooms = Object.keys(byRoom).length;

    host.innerHTML =
      '<div class="fp-wrap">' +
        '<div class="fp-top"><select id="ebc-fp-q" aria-label="Quarter">' + qlist.map(function(q){
            return '<option value="' + esc(q) + '"' + (q === sel ? " selected" : "") + '>' + esc(q) + (q === current ? " (now)" : "") + '</option>'; }).join("") + '</select>' +
          '<div class="fp-legend">' +
            '<span><i style="background:#e0f2fe;border-color:#0b8ed8"></i>Class meets here</span>' +
            '<span><i style="background:#fef3c7;border-color:#f59e0b"></i>Tight fit</span>' +
            '<span><i style="background:#fee2e2;border-color:#ef4444"></i>Over capacity</span>' +
            '<span><i style="background:#fff;border-color:#e2e8f0"></i>Open room</span>' +
          '</div></div>' +
        (warnings.length ? '<details class="fp-warn"><summary>' + warnings.length + (warnings.length > 1 ? " things" : " thing") + ' to check</summary><ul>' +
          warnings.map(function(w){ return "<li>" + esc(w) + "</li>"; }).join("") + '</ul></details>' : "") +
        '<div class="fp-body"><div class="fp-map">' + zonesHtml + '</div>' +
          '<div class="fp-side"><div class="fp-side-h"><b>' + esc(sel) + '</b><span>' + placed.length + " class" + (placed.length === 1 ? "" : "es") + " in " + nRooms + " room" + (nRooms === 1 ? "" : "s") + '</span></div>' +
            '<div class="fp-list">' + (listHtml || '<div class="fp-empty">No classes scheduled for this quarter yet.</div>') + '</div>' +
            '<div class="fp-hint">Tap a highlighted room or a class to match them up.</div></div>' +
        '</div>' +
      '</div>';

    host.querySelector("#ebc-fp-q").addEventListener("change", function(e){ host.setAttribute("data-q", e.target.value); render(lastRows); });

    var all = function(q){ return [].slice.call(host.querySelectorAll(q)); };
    var list = host.querySelector(".fp-list");
    function clear(){
      all(".on").forEach(function(e){ e.classList.remove("on"); });
      all(".fp-pop.show").forEach(function(p){ p.classList.remove("show"); p.innerHTML = ""; });
    }
    function reveal(el){ if(el && list.scrollHeight > list.clientHeight + 2) list.scrollTop = Math.max(0, el.offsetTop - 8); }
    function selRoom(id, pop){
      clear();
      var rm = host.querySelector('.fp-rm[data-room="' + id + '"]'); if(rm) rm.classList.add("on");
      var its = all('.fp-list .fp-item[data-room="' + id + '"]');
      its.forEach(function(e){ e.classList.add("on"); }); reveal(its[0]);
      if(pop){
        var r = roomById[id], p = host.querySelector('.fp-pop[data-zone="' + r.z + '"]');
        p.innerHTML = '<div class="fp-pop-h"><span>' + esc(r.name) + '</span><button type="button" aria-label="Close">Close</button></div>' +
          byRoom[id].map(function(c){ return item(c, r.name, "div"); }).join("");
        p.classList.add("show");
        p.querySelector("button").addEventListener("click", clear);
      }
    }
    function selItem(i){
      clear();
      var c = placed[i]; if(!c) return;
      all('.fp-list .fp-item[data-i="' + i + '"], .fp-rm .fp-b[data-i="' + i + '"]').forEach(function(e){ e.classList.add("on"); });
      var rm = host.querySelector('.fp-rm[data-room="' + c._room.id + '"]'); if(rm) rm.classList.add("on");
    }
    all(".fp-rm.act").forEach(function(el){
      var id = el.getAttribute("data-room");
      el.addEventListener("click", function(){ selRoom(id, true); });
      el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); selRoom(id, true); } });
    });
    all(".fp-list .fp-item[data-i]").forEach(function(el){
      var i = +el.getAttribute("data-i");
      el.addEventListener("mouseenter", function(){ selItem(i); });
      el.addEventListener("focus", function(){ selItem(i); });
      el.addEventListener("click", function(){ selItem(i); });
    });
  }

  window.EBCFloorplan = {
    render: render, rooms: ROOMS, zones: ZONES, findRoom: findRoom,
    kids: function(){ return PLAN.kids; },
    refresh: function(){
      try { document.dispatchEvent(new CustomEvent("ebc:plan")); } catch(e) {}
      if(lastRows) render(lastRows);
    },
    // Used by dashboard.js (kids) and planner.html (rooms, capacity, headcount)
    capacityOf: capacityOf, headcountOfRow: headcountOfRow, parseCSV: parseCSV, findRoomByLoc: findRoom,
    urls: { kids: KIDS_CSV_URL, demo: DEMO_CSV_URL, rooms: ROOMS_CSV_URL }
  };
  if(window.__ebcRows) render(window.__ebcRows);
  document.addEventListener("ebc:data", function(e){ render(e.detail); });
})();
