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
  //   use:  "class" (can host a class) | "service" (restrooms, stairs, mech; drawn dim, never matched)
  //   at:   [x, y] where the label/pins go (defaults to center)
  // ---------------------------------------------------------------------------
  var ROOMS = [
    // Auditorium wing
    { id:"auditorium", name:"Auditorium", aka:["aud","main auditorium","sanctuary","117"], use:"class",
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
    { id:"stair-uw", name:"", use:"service", r:[957,400,35,150], floor:2 },
    { id:"stair-ue", name:"", use:"service", r:[1495,400,42,150], floor:2 },
    { id:"corr203", name:"Corridor", use:"service", r:[957,528,580,57], floor:2 },
    { id:"stair202", name:"Stair", use:"service", r:[977,585,98,58], floor:2 },
    { id:"c215", name:"Classroom 215", aka:["classroom 215","room 215","215"], use:"class", r:[977,643,98,90], floor:2 },
    { id:"lc214", name:"Large Classroom 214", aka:["large classroom 214","classroom 214","room 214","214"], use:"class", r:[1075,585,167,148], floor:2 },
    { id:"lc213", name:"Large Classroom 213", aka:["large classroom 213","classroom 213","room 213","213"], use:"class", r:[1245,585,167,148], floor:2 },
    { id:"stair200", name:"Stair", use:"service", r:[1412,585,100,58], floor:2 },
    { id:"c212", name:"Classroom 212", aka:["classroom 212","room 212","212"], use:"class", r:[1412,643,100,90], floor:2 },
    { id:"mech201", name:"Mech / Util", use:"service", p:[[952,733],[1537,733],[1537,840],[1445,808],[1222,775],[952,840]], floor:2 },

    // Rear lobby + link to annex
    { id:"rearlobby", name:"Rear Lobby", aka:["rear lobby","141"], use:"class", r:[835,330,113,349], at:[905,505] },
    { id:"rearentry", name:"", use:"service", r:[870,262,78,68] },
    { id:"women144", name:"Women", use:"service", r:[835,679,115,71] },
    { id:"jan143", name:"", use:"service", r:[868,750,82,59] },

    // West classroom wing
    { id:"lc165", name:"Large Classroom 165", aka:["large classroom 165","classroom 165","room 165","165"], use:"class", r:[425,404,174,159] },
    { id:"lc164", name:"Large Classroom 164", aka:["large classroom 164","classroom 164","room 164","164"], use:"class", r:[420,570,179,170] },
    { id:"lc163", name:"Large Classroom 163", aka:["large classroom 163","classroom 163","room 163","163"], use:"class", r:[649,340,181,167] },
    { id:"resource", name:"Resource Room", aka:["resource room","resource","162"], use:"class", r:[649,509,181,109] },
    { id:"mail", name:"Mail Room", use:"service", r:[649,679,118,61] },
    { id:"stor161", name:"", use:"service", r:[769,679,61,61] },
    { id:"an154", name:"Nursery 154", aka:["additional nursery 154","add'l nursery 154","nursery 154","154"], use:"class", r:[521,740,80,69] },
    { id:"an148", name:"Nursery 148", aka:["additional nursery 148","add'l nursery 148","nursery 148","148"], use:"class", r:[649,740,59,69] },
    { id:"men153", name:"Men", use:"service", r:[420,740,101,69] },
    { id:"women145", name:"Women", use:"service", r:[708,740,122,69] },
    { id:"westlobby", name:"West Lobby", aka:["west lobby","lobby 155","155"], use:"class",
      p:[[476,809],[777,809],[777,850],[745,850],[745,890],[710,905],[560,905],[530,890],[520,850],[476,850]], at:[627,857] },
    { id:"stair167", name:"", use:"service", r:[425,368,170,34] },
    { id:"corr159", name:"", use:"service", r:[420,340,229,28] },
    { id:"corr157", name:"", use:"service", r:[599,618,231,61] },
    { id:"corr158", name:"", use:"service", r:[599,368,50,372] },

    // Detached duplex across the street (we rent one side for classes). Not to scale or position.
    { id:"apartments", name:"Apartments", aka:["apartment","appartments","appartment","apts","apt","duplex","the apartments"], use:"class", r:[440,80,250,170], at:[565,172] },

    // Existing annex (north building). Rename these once we know what each room is called.
    { id:"annex1", name:"Annex A", aka:["annex a"], use:"class", r:[950,69,82,150] },
    { id:"annex1b", name:"", use:"service", r:[950,221,82,39] },
    { id:"annex2", name:"Annex B", aka:["annex b"], use:"class", r:[1034,69,132,75] },
    { id:"annex3", name:"Annex C", aka:["annex c"], use:"class", r:[1059,146,107,84] },
    { id:"annex-rr", name:"", use:"service", r:[1059,232,107,28] },
    { id:"annex4", name:"Annex D", aka:["annex d"], use:"class", r:[1168,69,75,75] },
    { id:"annex5", name:"Annex E", aka:["annex e"], use:"class", r:[1168,146,75,114] },
    { id:"annex6", name:"Annex F", aka:["annex f"], use:"class", r:[1270,69,64,75] },
    { id:"annex7", name:"Annex G", aka:["annex g"], use:"class", r:[1270,146,64,54] },
    { id:"annex8", name:"Annex H", aka:["annex h"], use:"class", r:[1270,203,64,57] }
  ];

  // Building outlines (drawn under the rooms as the "slab")
  var SLABS = [
    [[418,339],[830,339],[830,330],[948,330],[948,400],[1540,400],[1540,1284],[950,1284],[950,809],[777,809],[777,905],[476,905],[476,809],[418,809]],
    [[945,64],[1339,64],[1339,262],[945,262]],
    [[870,262],[948,262],[948,330],[870,330]],
    [[440,80],[690,80],[690,250],[440,250]]
  ];
  // Covered drop-offs (dashed, decorative)
  var CANOPIES = [ [530,905,270,230] ];

  var VIEW = { x:400, y:44, w:1170, h:1256 };

  // ---------------------------------------------------------------------------
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
    for(var i = 0; i < ROOMS.length; i++){
      var r = ROOMS[i]; if(r.use !== "class") continue;
      if(r.keys.indexOf(n) > -1) return r;
    }
    // fall back: a room number mentioned anywhere ("Rm 163", "163 - large classroom")
    var num = /\b([12]\d\d)\b/.exec(n);
    if(num) for(var j = 0; j < ROOMS.length; j++){
      if(ROOMS[j].use === "class" && ROOMS[j].keys.indexOf(num[1]) > -1) return ROOMS[j];
    }
    return null;
  }

  function pts(p){ return p.map(function(q){ return q.join(","); }).join(" "); }

  var CSS = [
    "#ebc .fp-wrap{background:#141b24;border-radius:10px;padding:14px;color:#dfe6ee}",
    "#ebc .fp-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:10px}",
    "#ebc .fp-top select{background:#1f2833;color:#dfe6ee;border:1px solid #33404f}",
    "#ebc .fp-legend{font-size:12px;color:#9aa8b8;display:flex;gap:14px;align-items:center}",
    "#ebc .fp-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-2px}",
    "#ebc .fp-scroll{overflow-x:auto;border-radius:8px;background:#0e141b}",
    "#ebc .fp-scroll svg{display:block;width:100%;min-width:720px;height:auto}",
    "#ebc .fp-room{transition:fill .2s}",
    "#ebc .fp-pin{cursor:pointer}",
    "#ebc .fp-pin:hover .fp-dot, #ebc .fp-pin.on .fp-dot{fill:#e8a33d;stroke:#fff}",
    "#ebc .fp-detail{margin-top:10px;min-height:22px;font-size:13px;color:#c9d3de}",
    "#ebc .fp-detail b{color:#fff}",
    "#ebc .fp-off{margin-top:8px;font-size:12px;color:#9aa8b8}"
  ].join("\n");

  function render(rows){
    var host = document.getElementById("ebc-map"); if(!host) return;
    if(!document.getElementById("ebc-fp-css")){
      var st = document.createElement("style"); st.id = "ebc-fp-css"; st.textContent = CSS; document.head.appendChild(st);
    }

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
          '</select><div class="fp-legend"><span><i style="background:#2f6f73"></i>Class meets here</span><span><i style="background:#2a3441"></i>Room</span><span><i style="border:2px dashed #e8a33d;box-sizing:border-box"></i>2nd floor</span></div></div>' +
        '<div class="fp-scroll"></div>' +
        '<div class="fp-detail" id="ebc-fp-detail">Tap a pin for class details.</div>' +
        '<div class="fp-off" id="ebc-fp-off"></div>' +
      '</div>';
    host.querySelector("#ebc-fp-q").addEventListener("change", function(e){
      host.setAttribute("data-q", e.target.value.replace(/ \(now\)$/, "")); render(rows);
    });

    // Classes for the chosen quarter, grouped by room
    var byRoom = {}, unplaced = [];
    rows.filter(function(r){ return (r.year + " " + r.q) === sel; }).forEach(function(r){
      var room = findRoom(r.loc);
      if(room){ (byRoom[room.id] = byRoom[room.id] || []).push(r); }
      else unplaced.push(r);
    });

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", [VIEW.x, VIEW.y, VIEW.w, VIEW.h].join(" "));
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Floor plan showing where classes meet in " + sel);
    var h = [];
    h.push('<defs><filter id="fpglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>');

    // canopies
    CANOPIES.forEach(function(c){
      h.push('<rect x="'+c[0]+'" y="'+c[1]+'" width="'+c[2]+'" height="'+c[3]+'" fill="none" stroke="#3a4757" stroke-width="2" stroke-dasharray="8 6" rx="4"/>');
    });
    // slab shadow (fake wall height) then slab
    SLABS.forEach(function(s){ h.push('<polygon points="'+pts(s.map(function(q){ return [q[0]+7, q[1]+10]; }))+'" fill="#070a0e"/>'); });
    SLABS.forEach(function(s){ h.push('<polygon points="'+pts(s)+'" fill="#1b232d" stroke="#8796a8" stroke-width="5" stroke-linejoin="round"/>'); });

    // rooms
    ROOMS.forEach(function(r){
      var used = !!byRoom[r.id];
      var fill = r.use === "service" ? "#1f2833" : (used ? "#2f6f73" : "#2a3441");
      if(used) h.push('<polygon points="'+pts(r.p)+'" fill="#3fa1a6" opacity=".35" filter="url(#fpglow)"/>');
      h.push('<polygon class="fp-room" points="'+pts(r.p)+'" fill="'+fill+'" stroke="#8796a8" stroke-width="2.5" stroke-linejoin="round"/>');
    });
    // caption for the detached apartment
    h.push('<text x="565" y="272" text-anchor="middle" font-size="11" fill="#7f8fa3" font-family="system-ui,sans-serif" letter-spacing="1">ACROSS THE STREET (DUPLEX)</text>');

    // mark the upper-floor block
    h.push('<rect x="949" y="397" width="591" height="446" fill="none" stroke="#e8a33d" stroke-width="2" stroke-dasharray="10 6" rx="3" opacity=".7"/>');
    h.push('<rect x="1180" y="364" width="126" height="24" rx="12" fill="#e8a33d"/><text x="1243" y="381" text-anchor="middle" font-size="12" font-weight="700" fill="#141b24" font-family="system-ui,sans-serif" letter-spacing="1">2ND FLOOR</text>');

    // faint pew rows in the auditorium, for a sense of place
    var aud = ROOMS.filter(function(r){ return r.id === "auditorium"; })[0];
    h.push('<clipPath id="fpaud"><polygon points="'+pts(aud.p)+'"/></clipPath><g clip-path="url(#fpaud)" stroke="#ffffff" stroke-opacity=".07" stroke-width="3">');
    for(var py = 880; py <= 1150; py += 16){
      var bow = (py - 880) * 0.18;
      h.push('<path d="M975 '+(py - bow)+' Q1243 '+(py + 40 - bow)+' 1512 '+(py - bow)+'" fill="none"/>');
    }
    h.push('</g>');

    // room labels (skip rooms that have pins; the pin shows the room name instead)
    ROOMS.forEach(function(r){
      if(!r.name || byRoom[r.id]) return;
      var big = r.use === "class";
      var xs = r.p.map(function(q){ return q[0]; }), wid = Math.max.apply(0,xs) - Math.min.apply(0,xs);
      var fs = Math.max(7, Math.min(big ? 13 : 10, (wid - 10) / (r.name.length * 0.72)));
      h.push('<text x="'+r.at[0]+'" y="'+(r.at[1]+4)+'" text-anchor="middle" font-size="'+fs.toFixed(1)+'" fill="'+(big ? "#7f8fa3" : "#566476")+'" font-family="system-ui,sans-serif" letter-spacing=".5">'+esc(r.name.toUpperCase())+'</text>');
    });

    // pins
    var pinIndex = [];
    Object.keys(byRoom).forEach(function(id){
      var room = ROOMS.filter(function(r){ return r.id === id; })[0];
      var list = byRoom[id], gap = 58, y0 = room.at[1] - (list.length - 1) * gap / 2;
      h.push('<text x="'+room.at[0]+'" y="'+(y0 - 30)+'" text-anchor="middle" font-size="11" fill="#9fd3d6" font-family="system-ui,sans-serif" letter-spacing="1">'+esc(room.name.toUpperCase())+'</text>');
      list.forEach(function(c, i){
        var x = room.at[0], y = y0 + i * gap, idx = pinIndex.push(c) - 1;
        var title = (c.name && !/^\s*tbd\s*$/i.test(c.name)) ? c.name : (c.kind ? c.kind + " (TBD)" : "Class");
        if(title.length > 28) title = title.slice(0, 26) + "\u2026";
        h.push('<g class="fp-pin" data-i="'+idx+'" tabindex="0">' +
          '<circle class="fp-dot" cx="'+x+'" cy="'+y+'" r="15" fill="#10161d" stroke="#9fd3d6" stroke-width="2"/>' +
          // little open-book icon
          '<path d="M'+(x-8)+' '+(y-4)+' q4 -3 8 0 q4 -3 8 0 v10 q-4 -3 -8 0 q-4 -3 -8 0 z M'+x+' '+(y-4)+' v10" fill="none" stroke="#e6edf3" stroke-width="1.6" stroke-linejoin="round"/>' +
          '<text x="'+x+'" y="'+(y+31)+'" text-anchor="middle" font-size="13" font-weight="600" fill="#f1f5f9" font-family="system-ui,sans-serif" paint-order="stroke" stroke="#0e141b" stroke-width="4">'+esc(title)+'</text>' +
        '</g>');
      });
    });

    svg.innerHTML = h.join("");
    host.querySelector(".fp-scroll").appendChild(svg);

    var detail = host.querySelector("#ebc-fp-detail");
    function show(g){
      [].forEach.call(svg.querySelectorAll(".fp-pin.on"), function(el){ el.classList.remove("on"); });
      g.classList.add("on");
      var c = pinIndex[+g.getAttribute("data-i")];
      detail.innerHTML = '<b>' + esc(c.name || "TBD") + '</b> \u00b7 ' + esc(c.kind) +
        (c.teacher ? ' \u00b7 ' + esc(c.teacher) : '') + (c.book && c.book !== c.name ? ' \u00b7 ' + esc(c.book) : '') +
        (c.loc ? ' \u00b7 <span style="color:#9fd3d6">' + esc(c.loc) + '</span>' : '');
    }
    [].forEach.call(svg.querySelectorAll(".fp-pin"), function(g){
      g.addEventListener("click", function(){ show(g); });
      g.addEventListener("mouseenter", function(){ show(g); });
      g.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); show(g); } });
    });

    host.querySelector("#ebc-fp-off").innerHTML = unplaced.length
      ? "Not on this map: " + unplaced.map(function(c){
          return esc(c.name || c.kind) + " (" + esc(c.loc || "no location") + ")"; }).join(" \u00b7 ")
      : "";
  }

  window.EBCFloorplan = { render: render, rooms: ROOMS, findRoom: findRoom };
  if(window.__ebcRows) render(window.__ebcRows);
  document.addEventListener("ebc:data", function(e){ render(e.detail); });
})();
