(function () {
  var f = document.getElementById("support-form");
  if (!f) return;
  var API = "https://uqekeszdgeumwjdbompd.supabase.co/functions/v1/support-message";
  var btn = f.querySelector("button[type=submit]"), out = document.getElementById("support-status");
  f.hidden = false;
  var fb = document.getElementById("support-fallback");
  if (fb) fb.hidden = true;
  function say(t, ok) { out.textContent = t; out.className = "form-status " + (ok ? "ok" : "bad"); }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    btn.disabled = true; say("Sending…", true);
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 15000);
    fetch(API, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: ctl.signal,
      body: JSON.stringify({ email: f.email.value, topic: f.topic.value, message: f.message.value, website: f.website.value })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok, s: r.status }; }); })
      .then(function (r) {
        clearTimeout(t);
        if (r.ok) { f.reset(); f.hidden = true; say("Thanks, your message is on its way. We reply by email.", true); out.setAttribute("tabindex", "-1"); out.focus(); return; }
        btn.disabled = false;
        say(r.s === 429 ? "You've sent a few messages already. Please try again later, or email support@prepaconstable.co.uk." : "That didn't send. Check your email address, or email support@prepaconstable.co.uk instead.", false);
      }).catch(function () { clearTimeout(t); btn.disabled = false; say("That didn't send. Please email support@prepaconstable.co.uk instead.", false); });
  });
})();
