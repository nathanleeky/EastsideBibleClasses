/*!
 * Eastside Bible Classes dashboard
 * Embed on any page with:
 *   <div id="ebc"></div>
 *   <script src="https://nathanleeky.github.io/EastsideBibleClasses/dashboard.js"></script>
 * Data: "Master Tracker (Classes & Teachers)" > "Master: Adult" tab, published to the web as CSV.
 */
(function(){
  var root = document.getElementById("ebc");
  if(!root){ root = document.createElement("div"); root.id = "ebc";
    var me = document.currentScript; (me && me.parentNode ? me.parentNode.insertBefore(root, me) : document.body.appendChild(root)); }
  var base = (document.currentScript && document.currentScript.src || "").replace(/[^\/]*$/, "");
  if(base && !window.EBCFloorplan){
    var fp = document.createElement("script"); fp.src = base + "floorplan.js?v=" + Date.now(); document.head.appendChild(fp);
  }
  root.innerHTML = "<style>\n  #ebc{--bg:#f7f6f2;--card:#fff;--ink:#1f2a33;--muted:#6b7680;--line:#e3e1da;--accent:#2f5d62;--ot:#8a5a2b;--nt:#2f5d62;--top:#6a4c93;\n    font-family:system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;color:var(--ink);background:var(--bg);padding:20px;border-radius:10px;box-sizing:border-box}\n  #ebc *{box-sizing:border-box}\n  #ebc h1{font-size:22px;margin:0 0 2px}\n  #ebc h2{font-size:15px;margin:24px 0 10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}\n  #ebc .sub{color:var(--muted);font-size:13px}\n  #ebc .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:16px}\n  #ebc .stat{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px}\n  #ebc .stat b{display:block;font-size:24px}\n  #ebc .stat span{font-size:12px;color:var(--muted)}\n  #ebc .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}\n  #ebc .card{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:14px}\n  #ebc .card .kind{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}\n  #ebc .card .name{font-size:17px;font-weight:600;margin:4px 0 6px}\n  #ebc .card .meta{font-size:13px;line-height:1.5}\n  #ebc .tag{display:inline-block;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;color:#fff;background:var(--muted)}\n  #ebc .tag.OT{background:var(--ot)} #ebc .tag.NT{background:var(--nt)} #ebc .tag.Topical{background:var(--top)}\n  #ebc .filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}\n  #ebc select,#ebc input{font:inherit;font-size:14px;padding:7px 10px;border:1px solid var(--line);border-radius:6px;background:#fff}\n  #ebc input{flex:1;min-width:160px}\n  #ebc .tablewrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:8px}\n  #ebc table{width:100%;border-collapse:collapse;font-size:13px}\n  #ebc th,#ebc td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}\n  #ebc th{background:#efede6;font-weight:600;white-space:nowrap}\n  #ebc tr:last-child td{border-bottom:0}\n  #ebc .bars div{display:flex;align-items:center;gap:8px;font-size:13px;margin:4px 0}\n  #ebc .bars .lbl{width:150px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  #ebc .bars .bar{height:14px;background:var(--accent);border-radius:3px}\n  #ebc .empty,#ebc .err{color:var(--muted);font-size:14px;padding:12px}\n  #ebc .err{color:#a33}\n</style>\n\n<h1>Eastside Bible Classes</h1>\n<div class=\"sub\" id=\"ebc-updated\">Loading schedule\u2026</div>\n\n<div class=\"stats\" id=\"ebc-stats\"></div>\n\n<h2 id=\"ebc-now-title\">Now Teaching</h2>\n<div class=\"cards\" id=\"ebc-now\"></div>\n\n<h2>Where Classes Meet</h2>\n<div id=\"ebc-map\"></div>\n\n<h2 id=\"ebc-next-title\">Up Next</h2>\n<div class=\"cards\" id=\"ebc-next\"></div>\n\n<h2>All Classes</h2>\n<div class=\"filters\">\n  <select id=\"ebc-year\"><option value=\"\">All years</option></select>\n  <select id=\"ebc-kind\"><option value=\"\">All classes</option></select>\n  <select id=\"ebc-type\"><option value=\"\">All types</option></select>\n  <input id=\"ebc-q\" type=\"search\" placeholder=\"Search teacher, book, title\u2026\">\n</div>\n<div class=\"tablewrap\"><table>\n  <thead><tr><th>Year</th><th>Qtr</th><th>Class</th><th>Title</th><th>Book</th><th>Type</th><th>Teacher(s)</th><th>Notes</th></tr></thead>\n  <tbody id=\"ebc-rows\"></tbody>\n</table></div>\n\n<h2>Most Frequent Teachers</h2>\n<div class=\"bars\" id=\"ebc-teachers\"></div>";

  // ---- CONFIG ----
  // In the sheet: File > Share > Publish to web > pick "Master: Adult" + "Comma-separated values (.csv)" > Publish.
  // Paste the link it gives you here:
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=221404712&single=true&output=csv";

  var rows = [];
  var $ = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };

  // Dates arrive as "9/1/2026"
  function toDate(s){
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s).trim());
    return m ? new Date(+m[3], +m[1]-1, +m[2]) : null;
  }

  // Minimal CSV parser (handles quoted fields with commas/newlines)
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

  function load(text){
    var data = parseCSV(text);
    if(!data.length) return fail("The published sheet came back empty.");
    var cols = data[0].map(function(c){ return c.trim(); });
    var idx = function(name){ return cols.indexOf(name); };
    var I = { year:idx("Year"), q:idx("Q"), start:idx("Start"), end:idx("End"), kind:idx("Kind"),
              teacher:idx("Teacher"), name:idx("Name"), book:idx("Book"), type:idx("Type"),
              loc:idx("Location"), notes:idx("Notes") };
    if(I.year < 0 || I.kind < 0) return fail("Couldn't find the Year/Kind columns. Make sure you published the \"Master: Adult\" tab.");
    var g = function(c, k){ return I[k] > -1 ? (c[I[k]] || "").trim() : ""; };
    rows = data.slice(1).map(function(c){
      return {
        year: g(c,"year"), q: g(c,"q"), start: toDate(g(c,"start")), end: toDate(g(c,"end")),
        kind: g(c,"kind"), teacher: g(c,"teacher"), name: g(c,"name"), book: g(c,"book"),
        type: g(c,"type"), loc: g(c,"loc"), notes: g(c,"notes")
      };
    }).filter(function(r){ return r.year && (r.name || r.teacher || r.kind); });
    render();
    window.__ebcRows = rows;
    try { document.dispatchEvent(new CustomEvent("ebc:data", { detail: rows })); } catch(e) {}
  }

  function fail(msg){
    $("ebc-updated").innerHTML = '<span class="err">' + esc(msg) + '</span>';
  }

  function card(r){
    return '<div class="card"><div class="kind">' + esc(r.kind) + '</div>' +
      '<div class="name">' + esc(r.name || "TBD") + '</div><div class="meta">' +
      (r.teacher ? '<div><b>Teacher:</b> ' + esc(r.teacher) + '</div>' : '') +
      (r.book && r.book !== r.name ? '<div><b>Book:</b> ' + esc(r.book) + '</div>' : '') +
      (r.loc ? '<div><b>Room:</b> ' + esc(r.loc) + '</div>' : '') +
      (r.type ? '<div style="margin-top:6px"><span class="tag ' + esc(r.type) + '">' + esc(r.type) + '</span></div>' : '') +
      '</div></div>';
  }

  function fmt(d){ return d ? d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}) : ""; }

  function render(){
    var today = new Date(); today.setHours(0,0,0,0);

    // Current + next quarter
    var current = rows.filter(function(r){ return r.start && r.end && r.start <= today && today <= r.end; });
    var future = rows.filter(function(r){ return r.start && r.start > today; })
                     .sort(function(a,b){ return a.start - b.start; });
    var nextStart = future.length ? future[0].start.getTime() : null;
    var next = future.filter(function(r){ return r.start.getTime() === nextStart; });

    $("ebc-now-title").textContent = current.length
      ? "Now Teaching \u00b7 " + current[0].year + " " + current[0].q + " (" + fmt(current[0].start) + " \u2013 " + fmt(current[0].end) + ")"
      : "Now Teaching";
    $("ebc-now").innerHTML = current.length ? current.map(card).join("") : '<div class="empty">No classes found for today\'s date.</div>';
    $("ebc-next-title").textContent = next.length ? "Up Next \u00b7 " + next[0].year + " " + next[0].q + " (starts " + fmt(next[0].start) + ")" : "Up Next";
    $("ebc-next").innerHTML = next.length ? next.map(card).join("") : '<div class="empty">Next quarter hasn\'t been scheduled yet.</div>';

    // Teachers (split on commas / "&" / "and")
    var tcount = {};
    rows.forEach(function(r){
      if(r.start && r.start > today) return;
      String(r.teacher).split(/,|&|\band\b/).forEach(function(t){
        t = t.trim(); if(t && !/^tbd$/i.test(t)) tcount[t] = (tcount[t] || 0) + 1;
      });
    });
    var tlist = Object.keys(tcount).map(function(k){ return [k, tcount[k]]; }).sort(function(a,b){ return b[1]-a[1] || a[0].localeCompare(b[0]); });

    // Stats
    var types = {}; rows.forEach(function(r){ if(r.type && r.type !== "TBD") types[r.type] = (types[r.type]||0)+1; });
    var years = uniq(rows.map(function(r){ return r.year; })).sort();
    $("ebc-stats").innerHTML =
      stat(rows.length, "Classes tracked") +
      stat(tlist.length, "Teachers") +
      stat(years.length ? years[0] + "\u2013" + years[years.length-1] : "\u2013", "Years covered") +
      stat(types.OT || 0, "Old Testament") +
      stat(types.NT || 0, "New Testament") +
      stat(types.Topical || 0, "Topical");

    var max = tlist.length ? tlist[0][1] : 1;
    $("ebc-teachers").innerHTML = tlist.slice(0,12).map(function(t){
      return '<div><span class="lbl" title="' + esc(t[0]) + '">' + esc(t[0]) + '</span><span class="bar" style="width:' + Math.max(4, t[1]/max*60) + '%"></span><span>' + t[1] + '</span></div>';
    }).join("");

    // Filters
    fill("ebc-year", years.slice().reverse());
    fill("ebc-kind", uniq(rows.map(function(r){ return r.kind; })).sort());
    fill("ebc-type", uniq(rows.map(function(r){ return r.type; })).sort());
    drawTable();

    $("ebc-updated").textContent = "Live from the Master Tracker \u00b7 loaded " + new Date().toLocaleString();
  }

  function stat(n, label){ return '<div class="stat"><b>' + esc(n) + '</b><span>' + esc(label) + '</span></div>'; }
  function uniq(a){ return a.filter(function(v,i){ return v && a.indexOf(v) === i; }); }
  function fill(id, opts){
    var el = $(id), keep = el.options[0].outerHTML;
    el.innerHTML = keep + opts.map(function(o){ return '<option>' + esc(o) + '</option>'; }).join("");
  }

  function drawTable(){
    var y = $("ebc-year").value, k = $("ebc-kind").value, t = $("ebc-type").value, q = $("ebc-q").value.toLowerCase();
    var list = rows.filter(function(r){
      if(y && r.year !== y) return false;
      if(k && r.kind !== k) return false;
      if(t && r.type !== t) return false;
      if(q && (r.teacher + " " + r.name + " " + r.book + " " + r.notes).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).sort(function(a,b){ return (b.start||0) - (a.start||0) || String(a.kind).localeCompare(b.kind); });
    $("ebc-rows").innerHTML = list.length ? list.map(function(r){
      return '<tr><td>' + esc(r.year) + '</td><td>' + esc(r.q) + '</td><td>' + esc(r.kind) + '</td><td><b>' + esc(r.name) + '</b></td><td>' +
        esc(r.book) + '</td><td>' + (r.type ? '<span class="tag ' + esc(r.type) + '">' + esc(r.type) + '</span>' : '') + '</td><td>' +
        esc(r.teacher) + '</td><td>' + esc(r.notes) + '</td></tr>';
    }).join("") : '<tr><td colspan="8" class="empty">No classes match.</td></tr>';
  }

  ["ebc-year","ebc-kind","ebc-type"].forEach(function(id){ $(id).addEventListener("change", drawTable); });
  $("ebc-q").addEventListener("input", drawTable);

  // Load the published CSV (no Google login involved, so multi-account/Workspace sign-ins don't matter)
  if(CSV_URL.indexOf("http") !== 0){
    fail("Setup needed: paste your published CSV link into CSV_URL at the top of the script.");
  } else {
    fetch(CSV_URL + (CSV_URL.indexOf("?") > -1 ? "&" : "?") + "_=" + Date.now(), { credentials: "omit" })
      .then(function(r){ if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function(t){
        if(/^\s*</.test(t)) throw new Error("got a web page instead of CSV");
        load(t);
      })
      .catch(function(e){ fail("Couldn't load the sheet (" + e.message + "). Check that the tab is published to the web as CSV."); });
  }
})();
