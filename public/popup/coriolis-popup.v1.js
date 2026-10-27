(function () {
"use strict";
var C = window.CORIOLIS_POPUP;
if (!C || !C.site) return;
var DENY = ["/privacy", "/terms", "/unsubscribe", "/confirmed", "/api"];
var DAY14 = 12096e5;
var t0 = Date.now(), trig = "unknown", opened = 0, busy = 0, force = 0, tOpen = 0;
var root = null, prevOv = "", prevPad = "", prevF = null, cssOk = 0;
try { force = /(?:^|[?&])popup=1(?:&|$)/.test(location.search || "") ? 1 : 0; } catch (e) {}
var SITE = String(C.site), LANE = String(C.lane || ""), EP = String(C.endpoint || "/api/popup");
function copy() { return C.copy && typeof C.copy === "object" ? C.copy : {}; }
function esc(s) {
return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function cssHref() {
var n = document.querySelector('script[src*="coriolis-popup.v"]');
return n && n.src ? n.src.replace(/\.js(\?.*)?$/, ".css$1") : "/popup/coriolis-popup.v1.css";
}
function desktop() {
return typeof matchMedia === "function" && matchMedia("(pointer: fine)").matches && innerWidth >= 1024;
}
function path() { var p = (location.pathname || "/").replace(/\/$/, ""); return p || "/"; }
function denied() {
var list = DENY.concat(C.denyPaths || []), p = path(), i, d;
for (i = 0; i < list.length; i++) {
d = String(list[i] || "");
if (d && (p === d || p.indexOf(d + "/") === 0)) return 1;
}
return 0;
}
function typing() {
var el = document.activeElement;
if (!el || !el.tagName) return 0;
if (el.tagName === "TEXTAREA") return 1;
if (el.tagName === "INPUT") {
return ["button", "submit", "checkbox", "radio", "file", "hidden"].indexOf((el.type || "text").toLowerCase()) < 0 ? 1 : 0;
}
return el.isContentEditable ? 1 : 0;
}
function depth() {
var max = document.documentElement.scrollHeight - innerHeight;
return max <= 0 ? 0 : Math.min(1, Math.max(0, scrollY / max));
}
function sg(st, k) { try { return { ok: 1, v: st.getItem(k) }; } catch (e) { return { ok: 0, v: null }; } }
function ss(st, k, v) { try { st.setItem(k, v); return 1; } catch (e) { return 0; } }
function capBlocks() {
var s = SITE, done = sg(localStorage, "cpop:" + s + ":done");
if (done.ok) {
if (done.v === "1") return 1;
var seen = sg(localStorage, "cpop:" + s + ":seen");
if (seen.ok && seen.v) { var n = parseInt(seen.v, 10); if (n && Date.now() - n < DAY14) return 1; }
return 0;
}
var sess = sg(sessionStorage, "cpop:" + s + ":sess");
return sess.ok ? (sess.v === "1" ? 1 : 0) : 1;
}
function writeCap(kind, val) {
if (!ss(localStorage, "cpop:" + SITE + ":" + kind, val)) ss(sessionStorage, "cpop:" + SITE + ":sess", "1");
}
function captureLand() {
if (sg(sessionStorage, "cpop:land").v) return;
ss(sessionStorage, "cpop:land", JSON.stringify({ path: path(), search: location.search || "", ref: document.referrer || "" }));
}
function land() {
try { var raw = sg(sessionStorage, "cpop:land").v; if (raw) return JSON.parse(raw); } catch (e) {}
return { path: path(), search: location.search || "", ref: document.referrer || "" };
}
function parseSearch(search) {
var utm = {}, gclid = "";
try {
var sp = new URLSearchParams(search || "");
gclid = sp.get("gclid") || "";
["source", "medium", "campaign", "term", "content"].forEach(function (k) {
var v = sp.get("utm_" + k); if (v) utm[k] = v;
});
} catch (e) {}
return { utm: utm, gclid: gclid };
}
function refHost(ref) { if (!ref) return ""; try { return new URL(ref).host; } catch (e) { return ""; } }
function track(name) {
var s = SITE, ln = LANE;
try { if (window.dataLayer && typeof window.dataLayer.push === "function") window.dataLayer.push({ event: name, popup_site: s, popup_lane: ln, popup_trigger: trig }); } catch (e) {}
try { if (typeof window.gtag === "function") window.gtag("event", name, { popup_site: s, popup_lane: ln, popup_trigger: trig }); } catch (e) {}
try { window.dispatchEvent(new CustomEvent("coriolis:popup", { detail: { name: name, site: s, lane: ln, trigger: trig } })); } catch (e) {}
}
function loadCss(done) {
if (cssOk || document.querySelector("link[data-cpop]")) { cssOk = 1; done(); return; }
var link = document.createElement("link"), once = 0;
link.rel = "stylesheet";
link.href = cssHref();
link.setAttribute("data-cpop", "1");
function fin() { if (once) return; once = 1; cssOk = 1; done(); }
link.addEventListener("load", fin);
link.addEventListener("error", fin);
setTimeout(fin, 1500);
document.head.appendChild(link);
}
function jfetch(url, opts, cb) {
fetch(url, opts)
.then(function (res) { return res.json().then(function (j) { cb({ ok: res.ok, j: j }); }); })
.catch(function () { cb(null); });
}
function tabs(el) {
return Array.prototype.slice.call(el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])')).filter(function (n) {
return !n.hasAttribute("aria-hidden") && String(n.className || "").indexOf("cpop-hp") < 0 && (n.offsetParent !== null || n === document.activeElement);
});
}
function onKey(e) {
if (e.key === "Escape") { close(); return; }
if (e.key !== "Tab" || !root) return;
var nodes = tabs(root);
if (!nodes.length) return;
var first = nodes[0], last = nodes[nodes.length - 1];
if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function close() {
if (!root) return;
track("popup_close");
if (root.parentNode) root.parentNode.removeChild(root);
root = null;
document.body.style.overflow = prevOv;
document.body.style.paddingRight = prevPad;
removeEventListener("keydown", onKey);
if (prevF && prevF.focus) { try { prevF.focus(); } catch (e) {} }
prevF = null;
}
function consentHtml(text, url) {
return esc(text || "").replace(/Privacy policy/g, '<a class="cpop-privacy" href="' + esc(url || "/privacy") + '">Privacy policy</a>');
}
function extraHtml() {
var fields = C.fields && C.fields.length ? C.fields : [], html = "", i, f, name, id, label;
for (i = 0; i < fields.length; i++) {
f = fields[i] || {};
name = String(f.name || "");
if (!name) continue;
id = "cpop-f-" + name;
label = String(f.label || name);
html += '<label class="cpop-sr" for="' + esc(id) + '">' + esc(label) + '</label><input class="cpop-input" id="' + esc(id) + '" placeholder="' + esc(label) + '" data-cpop-field="' + esc(name) + '"/>';
}
var ctas = C.ctas && C.ctas.length ? C.ctas : [], chtml = "";
for (i = 0; i < ctas.length; i++) {
f = ctas[i] || {};
chtml += '<a class="cpop-cta-link" data-cpop-cta href="' + esc(f.href || "#") + '">' + esc(f.label || "") + "</a>";
}
return { fields: html, ctas: chtml ? '<div class="cpop-ctas">' + chtml + "</div>" : "" };
}
var ERR = "Could not sign you up. Try again.";
function showOk() {
if (!root) return;
var suc = copy().success, ok = suc && typeof suc === "object" ? suc : {};
var h = root.querySelector(".cpop-headline"), b = root.querySelector(".cpop-lede");
var form = root.querySelector(".cpop-form"), cons = root.querySelector(".cpop-consent"), ctas = root.querySelector(".cpop-ctas");
if (h) h.textContent = ok.headline || "You're in.";
if (b) b.textContent = ok.body || "Check your inbox.";
if (form && form.parentNode) form.parentNode.removeChild(form);
if (cons && cons.parentNode) cons.parentNode.removeChild(cons);
if (ctas && ctas.parentNode) ctas.parentNode.removeChild(ctas);
var x = root.querySelector(".cpop-x");
if (x && x.focus) x.focus();
}
function openDialog() {
if (opened) return;
opened = 1;
busy = 0;
if (!force) writeCap("seen", String(Date.now()));
prevF = document.activeElement;
tOpen = Date.now();
var c = copy(), extra = extraHtml(), el = document.createElement("div");
el.className = "cpop";
el.setAttribute("role", "dialog");
el.setAttribute("aria-modal", "true");
el.setAttribute("aria-labelledby", "cpop-title");
el.innerHTML = '<button type="button" class="cpop-scrim" aria-label="Close" data-cpop-close></button><div class="cpop-stage"><article class="cpop-card"><button type="button" class="cpop-x" aria-label="Close" data-cpop-close>&times;</button><div class="cpop-copy"><p class="cpop-eyebrow">' + esc(c.eyebrow || "") + '</p><h2 id="cpop-title" class="cpop-headline">' + esc(c.headline || "") + '</h2><p class="cpop-lede">' + esc(c.body || "") + '</p><form class="cpop-form" data-cpop-form><label class="cpop-sr" for="cpop-email">Email</label><input class="cpop-input" id="cpop-email" type="email" name="email" autocomplete="email" required placeholder="you@store.com"/>' + extra.fields + '<input class="cpop-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"/><button type="submit" class="cpop-cta" data-cpop-submit>' + esc(c.button || "Sign up") + '</button><p class="cpop-error" role="alert" data-cpop-error hidden></p></form><p class="cpop-consent">' + consentHtml(c.consent || "", C.privacyUrl || "/privacy") + "</p>" + extra.ctas + "</div></article></div>";
document.body.appendChild(el);
root = el;
prevOv = document.body.style.overflow;
prevPad = document.body.style.paddingRight;
var sb = innerWidth - document.documentElement.clientWidth;
document.body.style.overflow = "hidden";
if (sb > 0) document.body.style.paddingRight = sb + "px";
requestAnimationFrame(function () { el.className = "cpop cpop-in"; });
var i, closes = el.querySelectorAll("[data-cpop-close]"), links = el.querySelectorAll("[data-cpop-cta]");
for (i = 0; i < closes.length; i++) closes[i].addEventListener("click", close);
addEventListener("keydown", onKey);
for (i = 0; i < links.length; i++) links[i].addEventListener("click", function () { track("popup_cta"); });
var form = el.querySelector("[data-cpop-form]");
var emailIn = el.querySelector("#cpop-email");
var btn = el.querySelector("[data-cpop-submit]");
var err = el.querySelector("[data-cpop-error]");
if (emailIn && emailIn.focus) setTimeout(function () { emailIn.focus(); }, 40);
form.addEventListener("submit", function (ev) {
ev.preventDefault();
var extraF = {}, fs = el.querySelectorAll("[data-cpop-field]"), fi, hp = el.querySelector('input[name="website"]'), L = land(), parsed = parseSearch(L.search);
for (fi = 0; fi < fs.length; fi++) extraF[fs[fi].getAttribute("data-cpop-field")] = (fs[fi].value || "").trim();
if (err) { err.hidden = true; err.textContent = ""; }
if (btn) { btn.disabled = true; btn.textContent = "Sending"; }
function fail(msg) {
if (err) { err.hidden = false; err.textContent = msg; }
if (btn) { btn.disabled = false; btn.textContent = c.button || "Sign up"; }
}
jfetch(EP, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
email: (emailIn && emailIn.value ? emailIn.value : "").trim(),
fields: extraF,
website: hp && hp.value ? hp.value : "",
t: Date.now() - tOpen,
page: path(),
landing: L.path || path(),
referrer: refHost(L.ref),
utm: parsed.utm,
gclid: parsed.gclid || ""
}) }, function (x) {
if (!x || !x.ok || !x.j || x.j.ok !== true) { fail((x && x.j && x.j.error) || ERR); return; }
writeCap("done", "1");
track("popup_submit");
showOk();
});
});
track("popup_view");
}
function fire(kind) {
if (opened || busy) return;
if (!force && (denied() || capBlocks())) return;
if (typing()) return;
busy = 1;
trig = kind;
jfetch(EP, { method: "GET" }, function (x) {
if (!(x && x.ok && x.j && x.j.ok === true && x.j.enabled === true)) { busy = 0; return; }
loadCss(openDialog);
});
}
captureLand();
function boot() {
if (force) { fire("force"); return; }
if (denied() || capBlocks()) return;
if (desktop()) {
document.addEventListener("mouseout", function (e) {
if (Date.now() - t0 < 5000 || e.clientY > 0 || e.relatedTarget) return;
fire("exit");
});
return;
}
setTimeout(function () { fire("timer"); }, 20000);
addEventListener("scroll", function () { if (depth() >= 0.5) fire("scroll"); }, { passive: true });
}
if (typeof requestIdleCallback === "function") requestIdleCallback(boot, { timeout: 2000 });
else setTimeout(boot, 2000);
})();
