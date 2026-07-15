/* Republic Command Center — checkbox persistence, progress, question filters */
(function () {
  var PAGE = document.body.dataset.page || "page";
  var NS = "rlx:" + PAGE + ":";

  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---- persisted checkboxes ---- */
  var boxes = $all("input[type=checkbox][data-key]");
  boxes.forEach(function (b) {
    try {
      var v = localStorage.getItem(NS + b.dataset.key);
      if (v === null) { if (b.defaultChecked) localStorage.setItem(NS + b.dataset.key, "1"); }
      else b.checked = v === "1";
    } catch (e) {}
    b.addEventListener("change", function () {
      try { localStorage.setItem(NS + b.dataset.key, b.checked ? "1" : "0"); } catch (e) {}
      refresh();
    });
  });

  /* ---- progress bars ---- */
  function setBar(el, done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    var bar = el.querySelector(".bar>i"); if (bar) bar.style.width = pct + "%";
    var lbl = el.querySelector(".pct"); if (lbl) lbl.textContent = done + "/" + total + " · " + pct + "%";
    var barEl = el.querySelector(".bar");
    if (barEl) { barEl.setAttribute("role", "progressbar"); barEl.setAttribute("aria-valuenow", pct); barEl.setAttribute("aria-valuemin", "0"); barEl.setAttribute("aria-valuemax", "100"); }
  }
  function refresh() {
    $all("[data-scope]").forEach(function (scope) {
      var bs = $all("input[type=checkbox][data-key]", scope);
      var done = bs.filter(function (b) { return b.checked; }).length;
      var target = document.querySelector('.js-prog[data-for="' + scope.dataset.scope + '"]') || scope.querySelector(".js-prog");
      if (target) setBar(target, done, bs.length);
    });
    var done = boxes.filter(function (b) { return b.checked; }).length;
    var top = document.querySelector(".js-pageprog");
    if (top) setBar(top, done, boxes.length);
    try { localStorage.setItem("rlx:meta:" + PAGE, JSON.stringify({ done: done, total: boxes.length, t: Date.now() })); } catch (e) {}
  }
  refresh();

  /* ---- reset ---- */
  var reset = document.querySelector(".js-reset");
  if (reset) reset.addEventListener("click", function () {
    if (!confirm("Reset this dashboard to its published state? (Only affects this browser.)")) return;
    boxes.forEach(function (b) { b.checked = b.defaultChecked; try { localStorage.removeItem(NS + b.dataset.key); } catch (e) {} });
    refresh();
  });

  /* ---- question bank filters ---- */
  var qwrap = document.querySelector(".js-qbank");
  if (qwrap) {
    var items = $all(".q-item", qwrap);
    var groupBtns = $all(".fbtn[data-group]");
    var starBtn = document.querySelector(".fbtn[data-star]");
    var search = document.querySelector(".js-qsearch");
    var count = document.querySelector(".js-qcount");
    var state = { group: "all", star: false, q: "" };
    function apply() {
      var shown = 0;
      items.forEach(function (it) {
        var okG = state.group === "all" || it.dataset.group === state.group;
        var okS = !state.star || it.dataset.star === "1";
        var okQ = !state.q || it.textContent.toLowerCase().indexOf(state.q) !== -1;
        var show = okG && okS && okQ;
        it.classList.toggle("q-hidden", !show);
        if (show) shown++;
      });
      if (count) count.textContent = shown + " of " + items.length + " questions";
    }
    groupBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.group = btn.dataset.group;
        groupBtns.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        apply();
      });
    });
    if (starBtn) starBtn.addEventListener("click", function () {
      state.star = !state.star; starBtn.setAttribute("aria-pressed", state.star ? "true" : "false"); apply();
    });
    if (search) search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); apply(); });
    apply();
  }

  /* ---- hub: aggregate cross-dashboard progress ---- */
  $all(".js-hubprog").forEach(function (el) {
    var key = "rlx:meta:" + el.dataset.hub;
    var meta = null;
    try { meta = JSON.parse(localStorage.getItem(key) || "null"); } catch (e) {}
    if (meta && meta.total) { setBar(el, meta.done, meta.total); }
    else { var lbl = el.querySelector(".pct"); if (lbl) lbl.textContent = "not started"; }
  });
})();
