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
  if(!document.getElementById("ebc-font")){ var fl = document.createElement("link"); fl.id = "ebc-font"; fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"; document.head.appendChild(fl); }
  var base = (document.currentScript && document.currentScript.src || "").replace(/[^\/]*$/, "");
  if(base && !window.EBCFloorplan){
    var fp = document.createElement("script"); fp.src = base + "floorplan.js?v=" + Date.now(); document.head.appendChild(fp);
  }
  root.innerHTML = "<style>\n#ebc{--bg:#f9fafb;--card:#fff;--ink:#111827;--ink2:#374151;--muted:#6b7280;--faint:#9ca3af;--line:#e5e7eb;--line2:#f3f4f6;--accent:#0b8ed8;--accent-soft:#e0f2fe;\n  font-family:Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif;color:var(--ink);background:var(--bg);padding:32px;border-radius:12px;box-sizing:border-box}\n#ebc *{box-sizing:border-box}\n#ebc h1{font-size:24px;font-weight:700;letter-spacing:-.01em;margin:0 0 6px}\n#ebc h2{font-size:17px;font-weight:600;margin:36px 0 14px;color:var(--ink)}\n#ebc h2 small{font-size:14px;font-weight:400;color:var(--muted);margin-left:10px}\n#ebc .sub{color:var(--muted);font-size:14px}\n#ebc .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:24px}\n#ebc .stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;position:relative}\n#ebc .stat span{display:block;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--ink2);margin-bottom:10px;padding-right:44px;min-height:30px}\n#ebc .stat b{display:block;font-size:28px;font-weight:700;line-height:1;white-space:nowrap}\n#ebc .stat i{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:8px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center}\n#ebc .stat i img{width:18px;height:18px;display:block}\n#ebc .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}\n#ebc .card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column}\n#ebc .card .ban{height:96px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;background:#f9fafb;color:#4b5563}\n#ebc .card .ban small{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}\n#ebc .card .ban strong{font-size:22px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#ebc .card .ban.OT{background:#fff7ed;color:#c2410c} #ebc .card .ban.NT{background:#f0f9ff;color:#0369a1} #ebc .card .ban.Topical{background:#f5f3ff;color:#6d28d9}\n#ebc .card .bd{padding:16px 18px 18px;display:flex;flex-direction:column;gap:10px;flex:1}\n#ebc .card .top{display:flex;justify-content:space-between;align-items:center;gap:8px}\n#ebc .card .kind{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}\n#ebc .card .name{font-size:16px;font-weight:600;line-height:1.35}\n#ebc .card .meta{font-size:14px;color:var(--muted);line-height:1.5;margin-top:auto}\n#ebc .tag{display:inline-block;font-size:12px;font-weight:500;padding:2px 10px;border-radius:999px;color:#4b5563;background:#f3f4f6;white-space:nowrap}\n#ebc .tag.OT{background:#ffedd5;color:#c2410c} #ebc .tag.NT{background:#e0f2fe;color:#0369a1} #ebc .tag.Topical{background:#ede9fe;color:#6d28d9}\n#ebc .tag.draft{background:#fef3c7;color:#b45309;margin-left:8px}\n#ebc .filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}\n#ebc select,#ebc input{font:inherit;font-size:14px;font-weight:500;color:var(--ink2);padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:#fff;outline:none}\n#ebc input{flex:1;min-width:200px;font-weight:400;color:var(--ink)}\n#ebc input:focus,#ebc select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}\n#ebc .tablewrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:12px}\n#ebc table{width:100%;border-collapse:collapse;font-size:14px}\n#ebc th,#ebc td{text-align:left;padding:14px 10px;border-bottom:1px solid var(--line2);vertical-align:top;color:var(--muted)}\n#ebc th:first-child,#ebc td:first-child{padding-left:16px}\n#ebc th{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);white-space:nowrap}\n#ebc td b{font-size:15px;font-weight:600;color:var(--ink)}\n#ebc tr:last-child td{border-bottom:0}\n#ebc .bars{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px 40px}\n#ebc .bars div{display:grid;grid-template-columns:150px minmax(0,1fr) 28px;align-items:center;gap:12px;font-size:14px}\n#ebc .bars .lbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink2);font-weight:500}\n#ebc .bars .track{height:8px;background:var(--line2);border-radius:999px;overflow:hidden}\n#ebc .bars .bar{display:block;height:100%;background:var(--accent);border-radius:999px}\n#ebc .bars .n{text-align:right;color:var(--muted)}\n#ebc .empty,#ebc .err{color:var(--muted);font-size:14px;padding:16px}\n#ebc .cards .empty{background:#fff;border:1px dashed #d1d5db;border-radius:12px;text-align:center;grid-column:1/-1;padding:28px}\n#ebc .err{color:#b91c1c}\n@media (max-width:640px){\n#ebc{padding:16px}\n#ebc h1{font-size:21px}\n#ebc h2{font-size:16px;margin:28px 0 12px}\n#ebc .stats{grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}\n#ebc .stat{padding:14px;border-radius:14px}\n#ebc .stat span{font-size:10.5px;padding-right:34px;min-height:0;margin-bottom:14px}\n#ebc .stat b{font-size:22px}\n#ebc .stat i{top:14px;right:14px;width:30px;height:30px;border-radius:9px}\n#ebc .stat i img{width:15px;height:15px}\n#ebc .cards{grid-template-columns:1fr;gap:10px}\n#ebc .card{border-radius:14px}\n#ebc .card .ban{height:auto;padding:12px 14px;gap:4px}\n#ebc .card .ban strong{font-size:19px;white-space:normal;overflow-wrap:anywhere}\n#ebc .card .bd{padding:12px 14px}\n#ebc .filters{border-radius:14px;padding:10px 12px}\n#ebc select,#ebc input{padding:10px 12px;font-size:16px}\n#ebc input{min-width:0;width:100%;flex:1 1 100%}\n#ebc .tablewrap,#ebc .bars{border-radius:14px}\n#ebc .bars{grid-template-columns:1fr;padding:14px 16px;gap:14px}\n#ebc .bars div{grid-template-columns:110px minmax(0,1fr) 24px;gap:8px;font-size:13px}\n#ebc th,#ebc td{padding:11px 8px;font-size:13px}\n#ebc th:first-child,#ebc td:first-child{padding-left:12px}\n}\n</style>\n<h1>Eastside Bible Classes</h1>\n<div class=\"sub\" id=\"ebc-updated\">Loading schedule\u2026</div>\n<div class=\"stats\" id=\"ebc-stats\"></div>\n<h2 id=\"ebc-now-title\">Now Teaching</h2>\n<div class=\"cards\" id=\"ebc-now\"></div>\n<h2>Where Classes Meet</h2>\n<div id=\"ebc-map\"></div>\n<h2 id=\"ebc-next-title\">Up Next</h2>\n<div class=\"cards\" id=\"ebc-next\"></div>\n<h2>All Classes</h2>\n<div class=\"filters\">\n  <input id=\"ebc-q\" type=\"search\" placeholder=\"Search teacher, book, title\u2026\">\n  <select id=\"ebc-year\"><option value=\"\">All years</option></select>\n  <select id=\"ebc-kind\"><option value=\"\">All classes</option></select>\n  <select id=\"ebc-type\"><option value=\"\">All types</option></select>\n</div>\n<div class=\"tablewrap\"><table>\n  <thead><tr><th>Year</th><th>Qtr</th><th>Title</th><th>Class</th><th>Book</th><th>Type</th><th>Notes</th></tr></thead>\n  <tbody id=\"ebc-rows\"></tbody>\n</table></div>\n<h2>Most Frequent Teachers</h2>\n<div class=\"bars\" id=\"ebc-teachers\"></div>";

  // ---- CONFIG ----
  // In the sheet: File > Share > Publish to web > pick "Master: Adult" + "Comma-separated values (.csv)" > Publish.
  // Paste the link it gives you here:
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJiH5iDHu2UgeZkPtzBWYq7NWn57DsXteYL6NFNkfCmEWmDIxqUAcCwokBObwozxOaUh-dCEf9Gcx/pub?gid=221404712&single=true&output=csv";

  var rows = [], kidRows = [];
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
              loc:idx("Location"), notes:idx("Notes"), status:idx("Status"), est:idx("Est. Headcount") };
    if(I.year < 0 || I.kind < 0) return fail("Couldn't find the Year/Kind columns. Make sure you published the \"Master: Adult\" tab.");
    var g = function(c, k){ return I[k] > -1 ? (c[I[k]] || "").trim() : ""; };
    rows = data.slice(1).map(function(c){
      return {
        year: g(c,"year"), q: g(c,"q"), start: toDate(g(c,"start")), end: toDate(g(c,"end")),
        kind: g(c,"kind"), teacher: g(c,"teacher"), name: g(c,"name"), book: g(c,"book"),
        type: g(c,"type"), loc: g(c,"loc"), notes: g(c,"notes"),
        status: g(c,"status") || "Confirmed", est: g(c,"est")
      };
    }).filter(function(r){ return r.year && (r.name || r.teacher || r.kind); });
    render();
    window.__ebcRows = rows;
    try { document.dispatchEvent(new CustomEvent("ebc:data", { detail: rows })); } catch(e) {}
  }

  // Kids classes (Master: Kids tab) are loaded independently by floorplan.js, which
  // may finish before or after this script. Pick them up whichever way, and merge
  // them into every dashboard view alongside the Adult rows.
  function normKid(r){
    return { year:r.year, q:r.q, start:r.start, end:r.end, kind:r.kind, teacher:r.teacher,
              name:r.name, book:r.book, type:r.type, loc:r.loc, notes:r.notes,
              status:r.status, est:r.est || "", isKid:true };
  }
  function takeKids(list){
    kidRows = (list || []).map(normKid);
    if(rows.length) render();
  }
  if(window.EBCFloorplan && window.EBCFloorplan.kids().length) takeKids(window.EBCFloorplan.kids());
  document.addEventListener("ebc:kids", function(e){ takeKids(e.detail); });

  function fail(msg){
    $("ebc-updated").innerHTML = '<span class="err">' + esc(msg) + '</span>';
  }

  var TYPE_LABEL = { OT:"Old Testament", NT:"New Testament", Topical:"Topical" };
  function card(r){
    var t = r.type && r.type !== "TBD" ? r.type : "";
    var banLabel = TYPE_LABEL[t] || (r.isKid ? "Kids Class" : "Bible Class");
    return '<div class="card"><div class="ban ' + esc(t) + '"><small>' + esc(banLabel) + '</small><strong>' + esc(r.book || r.name || "TBD") + '</strong></div>' +
      '<div class="bd"><div class="top"><span class="kind">' + esc(r.kind) + '</span>' + (t ? '<span class="tag ' + esc(t) + '">' + esc(t) + '</span>' : '') + '</div>' +
      '<div class="name">' + esc(r.name || "Title TBD") + '</div><div class="meta">' +
      (r.teacher ? '<div>' + esc(r.teacher) + '</div>' : '') +
      (r.loc ? '<div>Room ' + esc(r.loc.replace(/^room\s*/i, "")) + '</div>' : '') +
      '</div></div></div>';
  }

  function fmt(d){ return d ? d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}) : ""; }

  function render(){
    var today = new Date(); today.setHours(0,0,0,0);
    var all = rows.concat(kidRows);

    // Current + next quarter (drafts still being planned - Status "Idea"/"Planned" - don't show here yet)
    var settled = function(r){ return r.status !== "Idea" && r.status !== "Planned"; };
    var current = all.filter(function(r){ return settled(r) && r.start && r.end && r.start <= today && today <= r.end; });
    var future = all.filter(function(r){ return settled(r) && r.start && r.start > today; })
                     .sort(function(a,b){ return a.start - b.start; });
    var nextStart = future.length ? future[0].start.getTime() : null;
    var next = future.filter(function(r){ return r.start.getTime() === nextStart; });

    $("ebc-now-title").innerHTML = current.length
      ? "Now Teaching<small>" + esc(current[0].year + " " + current[0].q + " \u00b7 " + fmt(current[0].start) + " \u2013 " + fmt(current[0].end)) + "</small>"
      : "Now Teaching";
    $("ebc-now").innerHTML = current.length ? current.map(card).join("") : '<div class="empty">No classes found for today\'s date.</div>';
    $("ebc-next-title").innerHTML = next.length ? "Up Next<small>" + esc(next[0].year + " " + next[0].q + " \u00b7 starts " + fmt(next[0].start)) + "</small>" : "Up Next";
    $("ebc-next").innerHTML = next.length ? next.map(card).join("") : '<div class="empty">Next quarter hasn\'t been scheduled yet.</div>';

    // Teachers (split on commas / "&" / "and")
    var tcount = {};
    all.forEach(function(r){
      if(r.start && r.start > today) return;
      String(r.teacher).split(/,|&|\band\b/).forEach(function(t){
        t = t.trim(); if(t && !/^tbd$/i.test(t)) tcount[t] = (tcount[t] || 0) + 1;
      });
    });
    var tlist = Object.keys(tcount).map(function(k){ return [k, tcount[k]]; }).sort(function(a,b){ return b[1]-a[1] || a[0].localeCompare(b[0]); });

    // Stats
    var types = {}; all.forEach(function(r){ if(r.type && r.type !== "TBD") types[r.type] = (types[r.type]||0)+1; });
    var years = uniq(all.map(function(r){ return r.year; })).sort(function(a,b){ return (+a) - (+b); });
    $("ebc-stats").innerHTML =
      stat(all.length, "Classes tracked", "book-open") +
      stat(tlist.length, "Teachers", "users") +
      stat(years.length ? years[0] + "\u2013" + years[years.length-1] : "\u2013", "Years covered", "calendar") +
      stat(types.OT || 0, "Old Testament", "scroll-text") +
      stat(types.NT || 0, "New Testament", "book-marked") +
      stat(types.Topical || 0, "Topical", "tags");

    var max = tlist.length ? tlist[0][1] : 1;
    $("ebc-teachers").innerHTML = tlist.slice(0,12).map(function(t){
      return '<div><span class="lbl" title="' + esc(t[0]) + '">' + esc(t[0]) + '</span><span class="track"><span class="bar" style="width:' + Math.max(4, t[1]/max*100) + '%"></span></span><span class="n">' + t[1] + '</span></div>';
    }).join("");

    // Filters
    fill("ebc-year", years.slice().reverse());
    fill("ebc-kind", uniq(all.map(function(r){ return r.kind; })).sort());
    fill("ebc-type", uniq(all.map(function(r){ return r.type; })).sort());
    drawTable();

    $("ebc-updated").textContent = "Live from the Master Tracker \u00b7 loaded " + new Date().toLocaleString();
  }

  function stat(n, label, icon){ return '<div class="stat"><div><span>' + esc(label) + '</span><b>' + esc(n) + '</b></div><i><img alt="" src="https://api.iconify.design/lucide/' + icon + '.svg?color=%230b8ed8"></i></div>'; }
  function uniq(a){ return a.filter(function(v,i){ return v && a.indexOf(v) === i; }); }
  function fill(id, opts){
    var el = $(id), keep = el.options[0].outerHTML;
    el.innerHTML = keep + opts.map(function(o){ return '<option>' + esc(o) + '</option>'; }).join("");
  }

  function drawTable(){
    var y = $("ebc-year").value, k = $("ebc-kind").value, t = $("ebc-type").value, q = $("ebc-q").value.toLowerCase();
    var list = rows.concat(kidRows).filter(function(r){
      if(y && r.year !== y) return false;
      if(k && r.kind !== k) return false;
      if(t && r.type !== t) return false;
      if(q && (r.teacher + " " + r.name + " " + r.book + " " + r.notes).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).sort(function(a,b){ return (b.start||0) - (a.start||0) || String(a.kind).localeCompare(b.kind); });
    $("ebc-rows").innerHTML = list.length ? list.map(function(r){
      var draft = r.status && r.status !== "Confirmed" && r.status !== "Completed";
      return '<tr><td>' + esc(r.year) + '</td><td>' + esc(r.q) + '</td><td><b>' + esc(r.name || "Title TBD") + '</b>' +
        (draft ? '<span class="tag draft">' + esc(r.status) + '</span>' : '') + (r.teacher ? '<div style="font-size:13px;color:#9ca3af;margin-top:3px">' + esc(r.teacher) + '</div>' : '') + '</td><td>' +
        esc(r.kind) + '</td><td>' + esc(r.book) + '</td><td>' + (r.type ? '<span class="tag ' + esc(r.type) + '">' + esc(r.type) + '</span>' : '') + '</td><td style="font-size:13px;color:#9ca3af">' +
        esc(r.notes) + '</td></tr>';
    }).join("") : '<tr><td colspan="7" class="empty">No classes match.</td></tr>';
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
