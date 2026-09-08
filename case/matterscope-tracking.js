/* Hosted synthetic demo only. Never reads document, checklist, or runtime content. */
(function () {
  "use strict";
  if (location.origin !== "https://pauljump.github.io" || location.pathname !== "/case/matterscope-demo.html") return;
  var endpoint = "https://pulse.polyfeeds.dev/api/ingest";
  var params = new URLSearchParams(location.search);
  var campaign = {};
  ["source", "medium", "campaign", "term", "content"].forEach(function (key) {
    var value = params.get("utm_" + key);
    if (value) campaign[key] = value.slice(0, 120);
  });
  var id;
  try {
    id = localStorage.getItem("pulse_visitor_id") || crypto.randomUUID();
    localStorage.setItem("pulse_visitor_id", id);
  } catch (_) {}
  var referrer;
  try { var ref = new URL(document.referrer); referrer = ref.origin + ref.pathname; } catch (_) {}
  function send(event, props) {
    try {
      var body = JSON.stringify(Object.assign({ property: "matterscope-demo", event: event,
        path: location.pathname, landingPath: location.pathname, visitorId: id,
        referrer: referrer, props: props || {} }, campaign));
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return;
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain" }, body: body, keepalive: true }).catch(function () {});
    } catch (_) {}
  }
  send("page_view");
  var activeMs = 0, activeSince = document.visibilityState === "visible" ? Date.now() : null;
  function pause() {
    if (activeSince !== null) { activeMs += Date.now() - activeSince; activeSince = null; }
    send("page_dwell", { dwellMs: activeMs });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") pause();
    else if (activeSince === null) activeSince = Date.now();
  });
  window.addEventListener("pagehide", pause);
  window.addEventListener("pageshow", function () {
    if (document.visibilityState === "visible" && activeSince === null) activeSince = Date.now();
  });
  document.addEventListener("click", function (event) {
    var el = event.target && event.target.closest && event.target.closest("button, a[href]");
    if (!el) return;
    if (el.matches("a[href]")) {
      try {
        var url = new URL(el.href, location.href);
        if (url.origin === "https://github.com" && url.pathname === "/pauljump/matterscope") {
          send("outbound:github.com", { targetPath: url.pathname });
        }
      } catch (_) {}
    } else if (el.id === "download") send("demo:download-draft");
    else if (el.matches(".source-link")) send("demo:read-source");
    else if (el.hasAttribute("data-item")) send("demo:checklist-item");
    else if (el.hasAttribute("data-doc")) send("demo:document");
    else {
      var tab = el.getAttribute("data-tab") || el.getAttribute("data-open");
      if (["checklist", "packet", "evidence"].includes(tab)) send("demo:tab", { tab: tab });
    }
  });
})();
