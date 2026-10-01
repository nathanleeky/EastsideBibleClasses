/*!
 * Eastside Bible Classes: floor plan map
 * Loaded automatically by dashboard.js. Shows each quarter's classes on a simplified
 * floor plan, placed by the sheet's "Location" column.
 *
 * To make a new location name land on a room, add it to that room's "aka" list below.
 * Coordinates are traced from the 4/3/26 construction package, sheet A-0.3 (lower floor).
 */
(function(){
  // ---------------------------------------------------------------------------
  // ROOMS
  //   id:   unique key
  //   name: label drawn on the map
  //   aka:  other names the sheet's Location column might use (case/spacing ignored)
  //   r:    [x, y, width, height]  or  p: [[x,y], ...] polygon
  //   use:  "class" (a classroom) | "space" (lobby, nursery, etc.: can host a class but drawn darker)
  //         | "service" (restrooms, stairs, mech; darkest, never matched)
  //   at:   [x, y] where the label/pins go (defaults to center)
  // ---------------------------------------------------------------------------
  var ROOMS = [
    // Auditorium wing
    { id:"auditorium", name:"Auditorium", aka:["aud","main auditorium","sanctuary","117"], use:"space",
      p:[[947,840],[1540,840],[1540,1146],[1488,1146],[1417,1172],[1394,1221],[1099,1221],[1087,1172],[1004,1146],[947,1146]], at:[1243,1000] },
    { id:"pulpit", name:"Pulpit", use:"service", p:[[1110,1188],[1383,1188],[1394,1221],[1099,1221]], at:[1246,1206] },
    { id:"baptistry", name:"", use:"service", r:[1159,1221,178,62] },
    { id:"chair", name:"Chair Storage", use:"service", r:[950,1146,54,109] },
    { id:"mech102", name:"Mech", use:"service", p:[[1004,1146],[1087,1172],[1087,1255],[1004,1255]] },
    { id:"mech114", name:"Mech", use:"service", p:[[1417,1172],[1488,1146],[1488,1255],[1417,1255]] },
    { id:"commprep", name:"Comm. Prep", use:"service", r:[1488,1146,49,109] },
    { id:"hall-south", name:"", use:"service", r:[950,1255,587,29] },

    // UPPER FLOOR classroom block (sheet A-0.3 upper floor), drawn in place of the ground-floor
    // offices/lobby/nurseries it sits above. Those ground-floor rooms aren't used for classes.
    { id:"c208", name:"Classroom 208", aka:["classroom 208","room 208","208"], use:"class", r:[992,400,108,125], floor:2 },
    { id:"c209", name:"Classroom 209", aka:["classroom 209","room 209","209"], use:"class", r:[1102,400,105,125], floor:2 },
    { id:"rr-up", name:"Restrooms", use:"service", r:[1210,400,67,128], floor:2 },
    { id:"c210", name:"Classroom 210", aka:["classroom 210","room 210","210"], use:"class", r:[1280,400,105,125], floor:2 },
    { id:"c211", name:"Classroom 211", aka:["classroom 211","room 211","211"], use:"class", r:[1387,400,108,125], floor:2 },
    { id:"stair-uw", name:"Stair", use:"service", r:[957,400,35,150], floor:2 },
    { id:"stair-ue", name:"Stair", use:"service", r:[1495,400,42,150], floor:2 },
    { id:"corr203", name:"Corridor", use:"service", r:[957,528,580,57], floor:2 },
    { id:"c215", name:"Classroom 215", aka:["classroom 215","room 215","215"], use:"class", r:[977,585,98,148], floor:2 },
    { id:"lc214", name:"Large Classroom 214", aka:["large classroom 214","classroom 214","room 214","214"], use:"class", r:[1075,585,167,148], floor:2 },
    { id:"lc213", name:"Large Classroom 213", aka:["large classroom 213","classroom 213","room 213","213"], use:"class", r:[1245,585,167,148], floor:2 },
    { id:"c212", name:"Classroom 212", aka:["classroom 212","room 212","212"], use:"class", r:[1412,585,100,148], floor:2 },
    { id:"mech201", name:"Mech / Util", use:"service", p:[[952,733],[1537,733],[1537,840],[1445,808],[1222,775],[952,840]], floor:2 },

    // Rear lobby + link to annex
    { id:"rearlobby", name:"Rear Lobby", aka:["rear lobby","141"], use:"space", r:[835,330,113,349], at:[905,505] },
    { id:"rearentry", name:"", use:"service", r:[870,262,78,68] },
    { id:"women144", name:"Women", use:"service", r:[835,679,115,71] },
    { id:"jan143", name:"", use:"service", r:[868,750,82,59] },

    // West classroom wing
    { id:"lc165", name:"Large Classroom 165", aka:["large classroom 165","classroom 165","room 165","165"], use:"class", r:[425,404,174,159] },
    { id:"lc164", name:"Large Classroom 164", aka:["large classroom 164","classroom 164","room 164","164"], use:"class", r:[420,570,179,170] },
    { id:"lc163", name:"Large Classroom 163", aka:["large classroom 163","classroom 163","room 163","163"], use:"class", r:[649,340,181,167] },
    { id:"resource", name:"Resource Room", aka:["resource room","resource","162"], use:"space", r:[649,509,181,109] },
    { id:"mail", name:"Mail Room", use:"service", r:[649,679,118,61] },
    { id:"stor161", name:"", use:"service", r:[769,679,61,61] },
    { id:"an154", name:"Nursery 154", aka:["additional nursery 154","add'l nursery 154","nursery 154","154"], use:"space", r:[521,740,80,69] },
    { id:"an148", name:"Nursery 148", aka:["additional nursery 148","add'l nursery 148","nursery 148","148"], use:"space", r:[649,740,59,69] },
    { id:"men153", name:"Men", use:"service", r:[420,740,101,69] },
    { id:"women145", name:"Women", use:"service", r:[708,740,122,69] },
    { id:"westlobby", name:"West Lobby", aka:["west lobby","lobby 155","155"], use:"space",
      p:[[476,809],[777,809],[777,850],[745,850],[745,890],[710,905],[560,905],[530,890],[520,850],[476,850]], at:[627,857] },
    { id:"stair167", name:"", use:"service", r:[425,368,170,34] },
    { id:"corr159", name:"", use:"service", r:[420,340,229,28] },
    { id:"corr157", name:"", use:"service", r:[599,618,231,61] },
    { id:"corr158", name:"", use:"service", r:[599,368,50,372] },

    // Detached duplex across the street (we rent one side for classes). Not to scale or position.
    { id:"apt-up", name:"Upstairs", aka:["upstairs"], use:"class", r:[425,58,234,92], apt:1 },
    { id:"apt-living", name:"Living Room", aka:["living room","living","front room"], use:"class", r:[425,150,234,144], apt:1 },
    { id:"apt-bed1", name:"Bedroom 1", aka:["bedroom 1","bed 1","br 1","bedroom one","downstairs bedroom 1"], use:"class", r:[659,58,96,92], apt:1 },
    { id:"apt-bed2", name:"Bedroom 2", aka:["bedroom 2","bed 2","br 2","bedroom two","downstairs bedroom 2"], use:"class", r:[659,150,96,144], apt:1 },

    // Existing annex (north building) - the kids' room numbers used on Master: Kids
    { id:"annex1", name:"Room 8", aka:["room 8","annex a"], use:"class", r:[950,69,82,150] },
    { id:"annex1b", name:"Storage Closet", use:"service", r:[950,221,82,39] },
    { id:"annex2", name:"Room 6", aka:["room 6","annex b"], use:"class", r:[1034,69,132,75] },
    { id:"annex3", name:"Room 7", aka:["room 7","annex c"], use:"class", r:[1059,146,107,84] },
    { id:"annex-rr", name:"Restrooms", use:"service", r:[1059,232,107,28] },
    { id:"annex4", name:"Room 4", aka:["room 4","annex d"], use:"class", r:[1168,69,75,75] },
    { id:"annex5", name:"Room 5", aka:["room 5","annex e"], use:"class", r:[1168,146,75,114] },
    { id:"annex6", name:"Room 3", aka:["room 3","annex f"], use:"class", r:[1270,69,64,75] },
    { id:"annex7", name:"Copier Room", aka:["copier room","copier","annex g"], use:"service", r:[1270,146,64,54] },
    { id:"annex8", name:"Room 1", aka:["room 1","annex h"], use:"class", r:[1270,203,64,57] }
  ];

  // Building outlines (drawn under the rooms as the "slab")
  var SLABS = [
    [[418,339],[830,339],[830,330],[948,330],[948,400],[1540,400],[1540,1284],[950,1284],[950,809],[777,809],[777,905],[476,905],[476,809],[418,809]],
    [[945,64],[1339,64],[1339,262],[945,262]],
    [[870,262],[948,262],[948,330],[870,330]],
    [[425,58],[755,58],[755,294],[425,294]]
  ];
  // Covered drop-offs (dashed, decorative)
  var CANOPIES = [ [530,905,270,230] ];

  var VIEW = { x:400, y:44, w:1170, h:1256 };

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

  var CSS = [
    "#ebc .fp-wrap{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;color:#111827}",
    "#ebc .fp-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:12px}",
    "#ebc .fp-legend{font-size:12px;color:#6b7280;display:flex;flex-wrap:wrap;gap:14px;align-items:center}",
    "#ebc .fp-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-2px}",
    "#ebc .fp-body{display:grid;grid-template-columns:minmax(0,640px) minmax(240px,1fr);gap:16px;align-items:start}",
    "#ebc .fp-scroll{overflow-x:auto;border-radius:10px;background:#f9fafb;border:1px solid #f3f4f6}",
    "#ebc .fp-scroll svg{display:block;width:100%;height:auto}",
    "#ebc .fp-scroll svg text{font-family:Inter,system-ui,sans-serif}",
    "#ebc .fp-list{display:flex;flex-direction:column;gap:8px;max-height:690px;overflow-y:auto}",
    "#ebc .fp-item{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;cursor:pointer;text-align:left;color:inherit;font:inherit;width:100%}",
    "#ebc .fp-item:hover,#ebc .fp-item.on{border-color:#0b8ed8;background:#f0f9ff}",
    "#ebc .fp-item .rm{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#0b8ed8}",
    "#ebc .fp-item .ti{font-size:14px;font-weight:600;color:#111827;margin:2px 0}",
    "#ebc .fp-item .me{font-size:12px;color:#6b7280}",
    "#ebc .fp-item.off{cursor:default;opacity:.8}",
    "#ebc .fp-item.off .rm{color:#b45309}",
    "#ebc .fp-empty{font-size:13px;color:#6b7280;padding:8px}",
    "@media (max-width:820px){#ebc .fp-body{grid-template-columns:1fr}#ebc .fp-scroll svg{min-width:600px;max-height:none}#ebc .fp-list{max-height:none}}",
    "#ebc .fp-room{transition:fill .2s}",
    "#ebc .fp-pin{cursor:pointer}",
    "#ebc .fp-pin:hover .fp-dot, #ebc .fp-pin.on .fp-dot{fill:#0b8ed8;stroke:#0b8ed8}",
    "#ebc .fp-pin:hover path, #ebc .fp-pin.on path{stroke:#fff}",
    "#ebc .fp-hint{margin-top:10px;font-size:12px;color:#9ca3af}",
    "#ebc .fp-warn{margin:0 0 12px;font-size:12.5px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:8px 12px}",
    "#ebc .fp-chip{display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border-radius:999px;margin-left:6px;vertical-align:1px}",
    "#ebc .fp-chip.ok{background:#d1fae5;color:#047857}",
    "#ebc .fp-chip.tight{background:#fef3c7;color:#b45309}",
    "#ebc .fp-chip.over{background:#fee2e2;color:#b91c1c}",
    "#ebc .fp-chip.status{background:#f3f4f6;color:#4b5563;text-transform:uppercase}",
    "#ebc .fp-item .badges{margin-top:4px}"
  ].join("\n");

  function render(rows){
    var host = document.getElementById("ebc-map"); if(!host) return;
    if(!document.getElementById("ebc-fp-css")){
      var st = document.createElement("style"); st.id = "ebc-fp-css"; st.textContent = CSS; document.head.appendChild(st);
    }
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

    host.innerHTML =
      '<div class="fp-wrap">' +
        '<div class="fp-top"><select id="ebc-fp-q">' + qlist.map(function(q){
            return '<option' + (q === sel ? ' selected' : '') + '>' + esc(q) + (q === current ? ' (now)' : '') + '</option>'; }).join("") +
          '</select><div class="fp-legend"><span><i style="background:#e0f2fe"></i>Class meets here</span><span><i style="background:#f1f5f9"></i>Classroom</span><span><i style="background:#fafafa;border:1px solid #cbd5e1;box-sizing:border-box"></i>Other</span><span><i style="border:2px dashed #f59e0b;box-sizing:border-box"></i>2nd floor</span><span><i style="background:#fef3c7"></i>Tight fit</span><span><i style="background:#fee2e2"></i>Over capacity</span></div></div>' +
        '<div id="ebc-fp-warn"></div>' +
        '<div class="fp-body"><div class="fp-scroll"></div><div class="fp-list" id="ebc-fp-list"></div></div>' +
        '<div class="fp-hint">Hover or tap a pin or a class to match them up.</div>' +
      '</div>';
    host.querySelector("#ebc-fp-q").addEventListener("change", function(e){
      host.setAttribute("data-q", e.target.value.replace(/ \(now\)$/, "")); render(lastRows);
    });

    // Classes for the chosen quarter, grouped by room, each with headcount/capacity/fit worked out
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
    Object.keys(byRoom).forEach(function(id){
      var room = ROOMS.filter(function(r){ return r.id === id; })[0], list = byRoom[id];
      var total = 0, any = false;
      list.forEach(function(c){ if(c.headcount != null){ total += c.headcount; any = true; } });
      var cap = capacityOf(id);
      if(any && cap != null && total > cap) warnings.push((room.name || id) + ": " + total + " expected, room seats " + cap);
      list.forEach(function(c){
        var title = (c.name && !/^\s*tbd\s*$/i.test(c.name)) ? c.name : (c.kind || "Class");
        if(c.status === "Idea" || c.status === "Planned") warnings.push(title + " (" + room.name + ") is still \"" + c.status + "\", not confirmed");
      });
    });
    var mismatched = unplaced.filter(function(r){ return r.loc; }).length;
    if(mismatched) warnings.push(mismatched + " class" + (mismatched > 1 ? "es" : "") + " list a Location that doesn't match a room on the map yet");
    host.querySelector("#ebc-fp-warn").innerHTML = warnings.length
      ? '<div class="fp-warn">\u26a0\ufe0f ' + warnings.map(esc).join(' &nbsp;\u00b7&nbsp; ') + '</div>' : "";

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", [VIEW.x, VIEW.y, VIEW.w, VIEW.h].join(" "));
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Floor plan showing where classes meet in " + sel);
    var h = [];
    h.push('<defs><filter id="fpglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>');

    // canopies
    CANOPIES.forEach(function(c){
      h.push('<rect x="'+c[0]+'" y="'+c[1]+'" width="'+c[2]+'" height="'+c[3]+'" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8 6" rx="4"/>');
    });
    // slab shadow (fake wall height) then slab
    SLABS.forEach(function(s){ h.push('<polygon points="'+pts(s.map(function(q){ return [q[0]+7, q[1]+10]; }))+'" fill="#e5e7eb"/>'); });
    SLABS.forEach(function(s){ h.push('<polygon points="'+pts(s)+'" fill="#ffffff" stroke="#cbd5e1" stroke-width="5" stroke-linejoin="round"/>'); });

    // rooms (tinted amber/red instead of teal when this quarter's headcount is tight/over capacity)
    var FIT_GLOW = { ok:"#0b8ed8", tight:"#d97706", over:"#dc2626" }, FIT_FILL = { ok:"#e0f2fe", tight:"#fef3c7", over:"#fee2e2" };
    ROOMS.forEach(function(r){
      var used = !!byRoom[r.id];
      var worst = used ? (byRoom[r.id].some(function(c){ return c.fit === "over"; }) ? "over" : byRoom[r.id].some(function(c){ return c.fit === "tight"; }) ? "tight" : "ok") : null;
      var fill = used ? FIT_FILL[worst] : (r.use === "class" ? "#f1f5f9" : "#fafafa");
      if(used) h.push('<polygon points="'+pts(r.p)+'" fill="'+FIT_GLOW[worst]+'" opacity=".35" filter="url(#fpglow)"/>');
      h.push('<polygon class="fp-room" points="'+pts(r.p)+'" fill="'+fill+'" stroke="#cbd5e1" stroke-width="2.5" stroke-linejoin="round"/>');
    });
    // caption for the detached apartment
    h.push('<text x="590" y="316" text-anchor="middle" font-size="15" fill="#94a3b8" font-family="Inter,system-ui,sans-serif" letter-spacing="1">APARTMENT \u00b7 ACROSS THE STREET</text>');

    // mark the upper-floor block
    h.push('<rect x="949" y="397" width="591" height="446" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="10 6" rx="3" opacity=".7"/>');
    h.push('<rect x="1163" y="358" width="160" height="30" rx="15" fill="#f59e0b"/><text x="1243" y="379" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff" font-family="Inter,system-ui,sans-serif" letter-spacing="1">2ND FLOOR</text>');

    // faint pew rows in the auditorium, for a sense of place
    var aud = ROOMS.filter(function(r){ return r.id === "auditorium"; })[0];
    h.push('<clipPath id="fpaud"><polygon points="'+pts(aud.p)+'"/></clipPath><g clip-path="url(#fpaud)" stroke="#0f172a" stroke-opacity=".06" stroke-width="3">');
    for(var py = 880; py <= 1150; py += 16){
      var bow = (py - 880) * 0.18;
      h.push('<path d="M975 '+(py - bow)+' Q1243 '+(py + 40 - bow)+' 1512 '+(py - bow)+'" fill="none"/>');
    }
    h.push('</g>');

    // room labels (skip rooms that have pins; the pin shows the room name instead)
    ROOMS.forEach(function(r){
      if(!r.name || byRoom[r.id]) return;
      var big = r.use !== "service";
      var xs = r.p.map(function(q){ return q[0]; }), wid = Math.max.apply(0,xs) - Math.min.apply(0,xs);
      var fs = Math.max(big ? 9 : 6.5, Math.min(big ? 14 : 11, (wid - 6) / (r.name.length * (big ? 0.66 : 0.72))));
      h.push('<text x="'+r.at[0]+'" y="'+(r.at[1]+4)+'" text-anchor="middle" font-size="'+fs.toFixed(1)+'" fill="'+(r.use === "class" ? "#475569" : big ? "#94a3b8" : "#9ca3af")+'" font-family="Inter,system-ui,sans-serif"'+(big ? ' letter-spacing=".5"' : '')+'>'+esc(r.name.toUpperCase())+'</text>');
    });

    // pins
    var pinIndex = [], pinRoom = [];
    Object.keys(byRoom).forEach(function(id){
      var room = ROOMS.filter(function(r){ return r.id === id; })[0];
      var list = byRoom[id], n = list.length;
      var xs = room.p.map(function(q){ return q[0]; }), ys = room.p.map(function(q){ return q[1]; });
      var top = Math.min.apply(0, ys), bottom = Math.max.apply(0, ys), wid = Math.max.apply(0, xs) - Math.min.apply(0, xs);
      // space for pins: below a title band at the top of the room (a bit more when a
      // headcount/status line is going to print under each pin's title)
      var hasSub = list.some(function(c){ return c.headcount != null || c.status === "Idea" || c.status === "Planned"; });
      var areaTop = top + 30, areaBot = bottom - 6;
      var gap = Math.max(hasSub ? 62 : 46, Math.min(hasSub ? 84 : 66, (areaBot - areaTop) / n));
      var mid = Math.min((areaTop + areaBot) / 2, room.at[1] + 10);
      var y0 = mid - (n - 1) * gap / 2 - 11;            // circle sits above its label, so nudge up
      var titleY = Math.max(top + 19, y0 - (hasSub ? 40 : 36)); // tag sits just above the pins, never outside the room
      var tfs = Math.max(10, Math.min(14, (wid - 8) / (room.name.length * 0.7)));
      h.push('<text x="'+room.at[0]+'" y="'+titleY+'" text-anchor="middle" font-size="'+tfs.toFixed(1)+'" fill="#0b8ed8" font-family="Inter,system-ui,sans-serif" letter-spacing="1">'+esc(room.name.toUpperCase())+'</text>');
      var FIT_TXT = { ok:"#047857", tight:"#d97706", over:"#dc2626" };
      list.forEach(function(c, i){
        var x = room.at[0], y = y0 + i * gap, idx = pinIndex.push(c) - 1; pinRoom[idx] = room.name + (room.apt ? " (Apartment)" : room.floor === 2 ? " (2nd floor)" : "");
        // Just the age group on the pin - that's what matters at a glance here.
        var title = (c.isKid ? (c.age || c.kind) : c.kind) || "Class";
        if(title.length > 24) title = title.slice(0, 22) + "\u2026";
        var draft = c.status === "Idea" || c.status === "Planned";
        var sub = c.headcount != null ? (c.headcount + (c.cap != null ? " / " + c.cap : "")) + (draft ? " \u00b7 " + c.status : "") : (draft ? c.status : "");
        var lfs = Math.max(13, Math.min(16, (wid + 36) / (title.length * 0.58)));
        h.push('<g class="fp-pin" data-i="'+idx+'" tabindex="0">' +
          '<circle class="fp-dot" cx="'+x+'" cy="'+y+'" r="15" fill="#ffffff" stroke="#0b8ed8" stroke-width="2.2"' + (draft ? ' stroke-dasharray="4 3"' : '') + '/>' +
          // little open-book icon
          '<path d="M'+(x-7)+' '+(y-4)+' q3.5 -2.6 7 0 q3.5 -2.6 7 0 v9 q-3.5 -2.6 -7 0 q-3.5 -2.6 -7 0 z M'+x+' '+(y-4)+' v9" fill="none" stroke="#0b8ed8" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<text x="'+x+'" y="'+(y + 17 + lfs)+'" text-anchor="middle" font-size="'+lfs.toFixed(1)+'" font-weight="600" fill="#111827" font-family="Inter,system-ui,sans-serif" paint-order="stroke" stroke="#ffffff" stroke-width="4">'+esc(title)+'</text>' +
          (sub ? '<text x="'+x+'" y="'+(y + 28 + lfs)+'" text-anchor="middle" font-size="10.5" font-weight="600" fill="'+(c.fit ? FIT_TXT[c.fit] : "#6b7280")+'" font-family="Inter,system-ui,sans-serif" paint-order="stroke" stroke="#ffffff" stroke-width="4">'+esc(sub)+'</text>' : '') +
        '</g>');
      });
    });

    svg.innerHTML = h.join("");
    host.querySelector(".fp-scroll").appendChild(svg);

    // side list: placed classes (linked to pins) then any that aren't on the map
    var list = host.querySelector("#ebc-fp-list");
    var item = function(c, room, i){
      var meta = [c.kind, c.teacher].filter(Boolean).join(" \u00b7 ");
      var title = (c.name && !/^\s*tbd\s*$/i.test(c.name)) ? c.name : "Title TBD";
      var badges = "";
      if(c.headcount != null) badges += '<span class="fp-chip ' + (c.fit || "ok") + '">' + c.headcount + (c.cap != null ? " / " + c.cap : "") + '</span>';
      if(c.status && c.status !== "Confirmed" && c.status !== "Completed") badges += '<span class="fp-chip status">' + esc(c.status) + '</span>';
      return '<button type="button" class="fp-item' + (i < 0 ? ' off' : '') + '"' + (i < 0 ? '' : ' data-i="' + i + '"') + '>' +
        '<div class="rm">' + esc(room) + '</div><div class="ti">' + esc(title) + '</div><div class="me">' + esc(meta) + '</div>' +
        (badges ? '<div class="badges">' + badges + '</div>' : '') + '</button>';
    };
    list.innerHTML = (pinIndex.map(function(c, i){ return item(c, pinRoom[i], i); }).join("") +
      unplaced.map(function(c){ return item(c, "Not on map: " + (c.loc || "no location"), -1); }).join("")) ||
      '<div class="fp-empty">No classes scheduled for this quarter yet.</div>';

    function select(i){
      [].forEach.call(host.querySelectorAll(".fp-pin.on,.fp-item.on"), function(el){ el.classList.remove("on"); });
      var pin = svg.querySelector('.fp-pin[data-i="' + i + '"]'), it = list.querySelector('.fp-item[data-i="' + i + '"]');
      if(pin) pin.classList.add("on");
      if(it){ it.classList.add("on"); if(list.scrollHeight > list.clientHeight) it.scrollIntoView({ block:"nearest" }); }
    }
    [].forEach.call(host.querySelectorAll(".fp-pin,.fp-item[data-i]"), function(el){
      var i = el.getAttribute("data-i");
      el.addEventListener("click", function(){ select(i); });
      el.addEventListener("mouseenter", function(){ select(i); });
      el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); select(i); } });
    });
  }

  window.EBCFloorplan = {
    render: render, rooms: ROOMS, findRoom: findRoom,
    refresh: function(){ if(lastRows) render(lastRows); }
  };
  if(window.__ebcRows) render(window.__ebcRows);
  document.addEventListener("ebc:data", function(e){ render(e.detail); });
})();
