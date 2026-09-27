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
    [[425,58],[755,58],[755,294],[425,294]]
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

  var CSS = [
    "#ebc .fp-wrap{background:#141b24;border-radius:10px;padding:14px;color:#dfe6ee}",
    "#ebc .fp-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:10px}",
    "#ebc .fp-top select{background:#1f2833;color:#dfe6ee;border:1px solid #33404f}",
    "#ebc .fp-legend{font-size:12px;color:#9aa8b8;display:flex;gap:14px;align-items:center}",
    "#ebc .fp-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-2px}",
    "#ebc .fp-body{display:grid;grid-template-columns:minmax(0,640px) minmax(240px,1fr);gap:14px;align-items:start}",
    "#ebc .fp-scroll{overflow-x:auto;border-radius:8px;background:#0e141b}",
    "#ebc .fp-scroll svg{display:block;width:100%;height:auto}",
    "#ebc .fp-list{display:flex;flex-direction:column;gap:6px;max-height:690px;overflow-y:auto}",
    "#ebc .fp-item{background:#1b232d;border:1px solid #2a3542;border-radius:8px;padding:9px 11px;cursor:pointer;text-align:left;color:inherit;font:inherit;width:100%}",
    "#ebc .fp-item:hover,#ebc .fp-item.on{border-color:#e8a33d;background:#222c38}",
    "#ebc .fp-item .rm{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9fd3d6}",
    "#ebc .fp-item .ti{font-size:14px;font-weight:600;color:#f1f5f9;margin:2px 0}",
    "#ebc .fp-item .me{font-size:12px;color:#9aa8b8}",
    "#ebc .fp-item.off{cursor:default;opacity:.75}",
    "#ebc .fp-item.off .rm{color:#e8a33d}",
    "#ebc .fp-empty{font-size:13px;color:#9aa8b8;padding:8px}",
    "@media (max-width:820px){#ebc .fp-body{grid-template-columns:1fr}#ebc .fp-scroll svg{min-width:600px;max-height:none}#ebc .fp-list{max-height:none}}",
    "#ebc .fp-room{transition:fill .2s}",
    "#ebc .fp-pin{cursor:pointer}",
    "#ebc .fp-pin:hover .fp-dot, #ebc .fp-pin.on .fp-dot{fill:#e8a33d;stroke:#fff}",
    "#ebc .fp-hint{margin-top:8px;font-size:12px;color:#7f8fa3}"
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
          '</select><div class="fp-legend"><span><i style="background:#2f6f73"></i>Class meets here</span><span><i style="background:#3a4a5e"></i>Classroom</span><span><i style="background:#1e252e;border:1px solid #3a4757;box-sizing:border-box"></i>Other</span><span><i style="border:2px dashed #e8a33d;box-sizing:border-box"></i>2nd floor</span></div></div>' +
        '<div class="fp-body"><div class="fp-scroll"></div><div class="fp-list" id="ebc-fp-list"></div></div>' +
        '<div class="fp-hint">Hover or tap a pin or a class to match them up.</div>' +
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
      var fill = used ? "#2f6f73" : (r.use === "class" ? "#3a4a5e" : "#1e252e");
      if(used) h.push('<polygon points="'+pts(r.p)+'" fill="#3fa1a6" opacity=".35" filter="url(#fpglow)"/>');
      h.push('<polygon class="fp-room" points="'+pts(r.p)+'" fill="'+fill+'" stroke="#8796a8" stroke-width="2.5" stroke-linejoin="round"/>');
    });
    // caption for the detached apartment
    h.push('<text x="590" y="316" text-anchor="middle" font-size="15" fill="#7f8fa3" font-family="system-ui,sans-serif" letter-spacing="1">APARTMENT \u00b7 ACROSS THE STREET</text>');

    // mark the upper-floor block
    h.push('<rect x="949" y="397" width="591" height="446" fill="none" stroke="#e8a33d" stroke-width="2" stroke-dasharray="10 6" rx="3" opacity=".7"/>');
    h.push('<rect x="1163" y="358" width="160" height="30" rx="15" fill="#e8a33d"/><text x="1243" y="379" text-anchor="middle" font-size="16" font-weight="700" fill="#141b24" font-family="system-ui,sans-serif" letter-spacing="1">2ND FLOOR</text>');

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
      var big = r.use !== "service";
      var xs = r.p.map(function(q){ return q[0]; }), wid = Math.max.apply(0,xs) - Math.min.apply(0,xs);
      var fs = Math.max(9, Math.min(big ? 14 : 11, (wid - 8) / (r.name.length * 0.66)));
      h.push('<text x="'+r.at[0]+'" y="'+(r.at[1]+4)+'" text-anchor="middle" font-size="'+fs.toFixed(1)+'" fill="'+(r.use === "class" ? "#c3d0de" : big ? "#7f8fa3" : "#566476")+'" font-family="system-ui,sans-serif" letter-spacing=".5">'+esc(r.name.toUpperCase())+'</text>');
    });

    // pins
    var pinIndex = [], pinRoom = [];
    Object.keys(byRoom).forEach(function(id){
      var room = ROOMS.filter(function(r){ return r.id === id; })[0];
      var list = byRoom[id], n = list.length;
      var xs = room.p.map(function(q){ return q[0]; }), ys = room.p.map(function(q){ return q[1]; });
      var top = Math.min.apply(0, ys), bottom = Math.max.apply(0, ys), wid = Math.max.apply(0, xs) - Math.min.apply(0, xs);
      // space for pins: below a title band at the top of the room
      var areaTop = top + 30, areaBot = bottom - 6;
      var gap = Math.max(46, Math.min(66, (areaBot - areaTop) / n));
      var mid = Math.min((areaTop + areaBot) / 2, room.at[1] + 10);
      var y0 = mid - (n - 1) * gap / 2 - 11;            // circle sits above its label, so nudge up
      var titleY = Math.max(top + 19, y0 - 36);         // tag sits just above the pins, never outside the room
      var tfs = Math.max(10, Math.min(14, (wid - 8) / (room.name.length * 0.7)));
      h.push('<text x="'+room.at[0]+'" y="'+titleY+'" text-anchor="middle" font-size="'+tfs.toFixed(1)+'" fill="#9fd3d6" font-family="system-ui,sans-serif" letter-spacing="1">'+esc(room.name.toUpperCase())+'</text>');
      list.forEach(function(c, i){
        var x = room.at[0], y = y0 + i * gap, idx = pinIndex.push(c) - 1; pinRoom[idx] = room.name + (room.apt ? " (Apartment)" : room.floor === 2 ? " (2nd floor)" : "");
        var title = (c.name && !/^\s*tbd\s*$/i.test(c.name)) ? c.name : (c.kind ? c.kind + " (TBD)" : "Class");
        if(title.length > 24) title = title.slice(0, 22) + "…";
        var lfs = Math.max(13, Math.min(16, (wid + 36) / (title.length * 0.58)));
        h.push('<g class="fp-pin" data-i="'+idx+'" tabindex="0">' +
          '<circle class="fp-dot" cx="'+x+'" cy="'+y+'" r="15" fill="#10161d" stroke="#9fd3d6" stroke-width="2.2"/>' +
          // little open-book icon
          '<path d="M'+(x-7)+' '+(y-4)+' q3.5 -2.6 7 0 q3.5 -2.6 7 0 v9 q-3.5 -2.6 -7 0 q-3.5 -2.6 -7 0 z M'+x+' '+(y-4)+' v9" fill="none" stroke="#e6edf3" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<text x="'+x+'" y="'+(y + 17 + lfs)+'" text-anchor="middle" font-size="'+lfs.toFixed(1)+'" font-weight="600" fill="#f1f5f9" font-family="system-ui,sans-serif" paint-order="stroke" stroke="#0e141b" stroke-width="4">'+esc(title)+'</text>' +
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
      return '<button type="button" class="fp-item' + (i < 0 ? ' off' : '') + '"' + (i < 0 ? '' : ' data-i="' + i + '"') + '>' +
        '<div class="rm">' + esc(room) + '</div><div class="ti">' + esc(title) + '</div><div class="me">' + esc(meta) + '</div></button>';
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

  window.EBCFloorplan = { render: render, rooms: ROOMS, findRoom: findRoom };
  if(window.__ebcRows) render(window.__ebcRows);
  document.addEventListener("ebc:data", function(e){ render(e.detail); });
})();
