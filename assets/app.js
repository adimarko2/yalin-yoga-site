(function () {
  "use strict";
  var Y = window.YALIN;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- זמן בישראל ---------- */
  function nowIL() {
    var parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var date = new Date(+parts.year, +parts.month - 1, +parts.day);
    return { date: date, day: date.getDay(), minutes: (+parts.hour % 24) * 60 + (+parts.minute) };
  }
  function toMin(t) { var a = t.split(":"); return +a[0] * 60 + +a[1]; }
  function fmtDate(d) { return d.getDate() + "." + (d.getMonth() + 1); }
  function className(c) { return "אשטנגה ל" + c.level; }

  /* ---------- קישורים ---------- */
  var waBase = "https://wa.me/" + Y.whatsapp;
  var waHello = waBase + "?text=" + encodeURIComponent("היי ילין, יש לי שאלה על השיעורים 🌿");
  $("#topWa").href = waHello;
  $("#endWa").href = waHello;
  $("#footPhone").href = "tel:" + Y.phone.replace(/-/g, "");
  $("#footPhone").textContent = Y.phone;
  $("#footIg").href = "https://www.instagram.com/" + Y.instagram + "/";
  $("#payNow").href = Y.paybox;

  /* ---------- מחירון ---------- */
  $("#priceList").innerHTML = Y.prices.map(function (p) {
    return '<div class="price' + (p.best ? " price--best" : "") + '">' +
      (p.best ? '<span class="price__tag">הכי משתלם</span>' : "") +
      "<div><h3>" + p.title + "</h3><p>" + p.note + "</p></div>" +
      '<div class="price__num"><b>' + p.price + ' ₪</b><small>' + p.unit + "</small></div></div>";
  }).join("");

  /* ---------- לו"ז ---------- */
  var now = nowIL();
  var chips = $("#dayChips"), track = $("#dayTrack");
  var chipHtml = "", panelHtml = "";
  for (var d = 0; d < 7; d++) {
    var list = Y.classes.filter(function (c) { return c.day === d; });
    var isToday = d === now.day;
    chipHtml += '<button class="chip' + (isToday ? " is-today" : "") + (list.length ? "" : " is-empty") +
      '" role="tab" data-day="' + d + '" aria-selected="false"><b>' + Y.short[d] + "</b><small>" +
      (isToday ? "היום" : (list.length === 1 ? "1 שיעור" : list.length ? list.length + " שיעורים" : "לפי ביקוש")) + "</small></button>";

    panelHtml += '<div class="daypanel" data-day="' + d + '" role="tabpanel"><p class="daypanel__title">יום ' + Y.days[d] + "</p>";
    if (list.length) {
      panelHtml += list.map(function (c, i) {
        var lv = c.level === "מתחילים" ? "lvl-b" : "lvl-a";
        return '<article class="class"><div class="class__time">' + c.time + "</div>" +
          '<div class="class__name">אשטנגה<span class="class__lvl ' + lv + '">' + c.level + "</span></div>" +
          '<div class="class__meta">' + Y.duration + " · עד " + Y.maxPeople + " משתתפים</div>" +
          '<button class="btn btn--main" data-book="' + Y.classes.indexOf(c) + '">שריון מקום</button></article>';
      }).join("");
    } else {
      panelHtml += '<div class="empty"><p>בסוף השבוע שיעורים נפתחים לפי ביקוש.</p>' +
        '<a class="btn btn--ghost" target="_blank" rel="noopener" href="' + waBase + "?text=" +
        encodeURIComponent("היי ילין, אשמח לשיעור ביום " + Y.days[d] + " 🌿") + '">לבקש שיעור בוואטסאפ</a></div>';
    }
    panelHtml += "</div>";
  }
  chips.innerHTML = chipHtml;
  track.innerHTML = panelHtml;
  var panels = $$(".daypanel", track);

  function setActive(d) {
    $$(".chip", chips).forEach(function (c) { c.setAttribute("aria-selected", +c.dataset.day === d ? "true" : "false"); });
  }
  function goTo(d, smooth) {
    var p = panels[d], pr = p.getBoundingClientRect(), tr = track.getBoundingClientRect();
    track.scrollBy({ left: (pr.left + pr.width / 2) - (tr.left + tr.width / 2), behavior: smooth ? "smooth" : "auto" });
    setActive(d);
  }
  chips.addEventListener("click", function (e) {
    var c = e.target.closest(".chip"); if (c) goTo(+c.dataset.day, true);
  });
  var ticking = false;
  track.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var tr = track.getBoundingClientRect(), mid = tr.left + tr.width / 2, best = 0, bestDist = 1e9;
      panels.forEach(function (p, i) {
        var r = p.getBoundingClientRect(), dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive(best);
      $("#swipeHint").style.opacity = "0";
    });
  }, { passive: true });
  goTo(now.day, false);
  window.addEventListener("load", function () { goTo(now.day, false); });

  /* ---------- השיעורים הקרובים ---------- */
  function upcoming() {
    var out = [];
    for (var i = 0; i < 8; i++) {
      var date = new Date(now.date.getFullYear(), now.date.getMonth(), now.date.getDate() + i);
      Y.classes.forEach(function (c, idx) {
        if (c.day !== date.getDay()) return;
        if (i === 0 && toMin(c.time) <= now.minutes) return;
        out.push({ idx: idx, c: c, date: date, i: i });
      });
    }
    return out.sort(function (a, b) { return a.i - b.i || toMin(a.c.time) - toMin(b.c.time); }).slice(0, 9);
  }
  function nextOf(idx) {
    var u = upcoming().filter(function (o) { return o.idx === idx; });
    return u[0];
  }
  function whenText(o) {
    var dayWord = o.i === 0 ? "היום" : o.i === 1 ? "מחר" : "יום " + Y.days[o.c.day];
    return dayWord + ", " + fmtDate(o.date) + " בשעה " + o.c.time;
  }

  /* ---------- חלון ההרשמה ---------- */
  var sheet = $("#sheet"), step = 1, chosen = null;
  var steps = $$(".step", sheet), dots = $$("#stepDots i");

  function show(n) {
    step = n;
    steps.forEach(function (s) { s.classList.toggle("is-on", +s.dataset.step === n); });
    dots.forEach(function (dt, i) { dt.classList.toggle("on", i < Math.min(n, 4)); });
    $("#sheetBack").hidden = n === 1 || n === 5;
    $(".sheet__body", sheet).scrollTop = 0;
    if (n === 3) sizePad();
  }
  function open(idx) {
    renderPick();
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (idx != null && nextOf(idx)) { choose(nextOf(idx)); } else { show(1); }
  }
  function close() {
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function choose(o) {
    chosen = o;
    $("#chosenLine").textContent = className(o.c) + " · " + whenText(o);
    show(2);
  }
  function renderPick() {
    var u = upcoming();
    $("#pickList").innerHTML = u.map(function (o, k) {
      return '<button type="button" data-k="' + k + '"><span><b>' + className(o.c) + "</b><small>" +
        (o.i === 0 ? "היום" : o.i === 1 ? "מחר" : "יום " + Y.days[o.c.day]) + ", " + fmtDate(o.date) +
        "</small></span><em>" + o.c.time + "</em></button>";
    }).join("");
    $$("#pickList button").forEach(function (b) {
      b.addEventListener("click", function () { choose(u[+b.dataset.k]); });
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-book]");
    if (b) { e.preventDefault(); open(b.dataset.book === "" ? null : +b.dataset.book); return; }
    if (e.target.closest("[data-close]")) { close(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet.classList.contains("is-open")) close(); });
  $("#sheetBack").addEventListener("click", function () { if (step > 1) show(step - 1); });

  function radio(name) { return $('input[name="' + name + '"]:checked').value; }

  $$("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (step === 2) {
        var name = $("#fName").value.trim(), phone = $("#fPhone").value.replace(/\D/g, "");
        if (!name) return err(2, "חסר שם מלא");
        if (phone.length < 9) return err(2, "נראה שחסרה ספרה במספר הטלפון");
        err(2, ""); show(3);
      } else if (step === 3) {
        if (radio("hInj") === "כן" && !$("#fInj").value.trim()) return err(3, "ספרו לי בכמה מילים, כדי שאדע להתאים לכם את התרגול");
        if (!$("#fDecl").checked) return err(3, "צריך לסמן שקראתם ואישרתם את ההצהרה");
        if (!hasInk) return err(3, "חסרה חתימה באצבע");
        err(3, "");
        var first = radio("first") === "כן";
        $("#priceLine").textContent = first ? "שיעור מתוך 4 הראשונים: 25 ₪" : "שיעור בודד 50 ₪, או מתוך המנוי שלך";
        show(4); buildMsg();
      }
    });
  });
  function err(n, msg) { $("#err" + n).textContent = msg; return false; }

  $$('input[name="hInj"]').forEach(function (r) {
    r.addEventListener("change", function () { $("#injWrap").hidden = radio("hInj") !== "כן"; });
  });

  /* ---------- חתימה באצבע (לא נשמרת) ---------- */
  var pad = $("#signPad"), ctx = pad.getContext("2d"), hasInk = false, drawing = false;
  function sizePad() {
    var r = pad.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    pad.width = r.width * dpr; pad.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1f4e6b";
    hasInk = false;
    $("#signDate").textContent = "תאריך: " + fmtDate(now.date) + "." + now.date.getFullYear();
  }
  function pt(e) { var r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  pad.addEventListener("pointerdown", function (e) { drawing = true; pad.setPointerCapture(e.pointerId); var p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  pad.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasInk = true; });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) { pad.addEventListener(t, function () { drawing = false; }); });
  $("#signClear").addEventListener("click", sizePad);

  /* קישור ישיר: /book או ?book=1 פותח את קביעת השיעור */
  if (/[?&]book=1/.test(location.search) || location.hash === "#book") open(null);

  /* ---------- שליחה בוואטסאפ ---------- */
  function buildMsg() {
    var pay = radio("pay"), inj = radio("hInj");
    // כל שורה מתחילה במילה בעברית, כדי שההודעה תוצג נכון בוואטסאפ
    var lines = [
      "היי ילין, אני רוצה לשריין מקום בשיעור 🌿",
      "שיעור: " + className(chosen.c),
      "מתי: " + whenText(chosen),
      "שם: " + $("#fName").value.trim(),
      "טלפון: " + $("#fPhone").value.trim(),
      "פעם ראשונה אצלך: " + radio("first"),
      "פציעה או מצב רפואי: " + (inj === "כן" ? "כן, " + $("#fInj").value.trim() : "אין"),
      "הריון: " + radio("hPreg"),
      "הצהרת בריאות: אישרתי וחתמתי באתר",
      "תשלום: " + pay
    ];
    $("#sendBtn").href = waBase + "?text=" + encodeURIComponent(lines.join("\n"));
  }
  $$('input[name="pay"]').forEach(function (r) { r.addEventListener("change", buildMsg); });
  // קישור רגיל ולא window.open, כדי שלא ייחסם בטלפון
  $("#sendBtn").addEventListener("click", function () {
    buildMsg();
    $("#payNow").hidden = radio("pay") !== "פייבוקס";
    setTimeout(function () { show(5); }, 300);
  });
})();
