/* ==========================================================================
   contact-form.js — the site's only way to get in touch.

   Replaces the published email address. Nothing on any page shows an address
   any more; every "get in touch" affordance opens this.

   Self-contained, and consistent with the promise privacy.html makes:
   - no cookies, no localStorage, no sessionStorage, nothing written to the
     device at all
   - no third-party code and no analytics. The one request this file makes goes
     to the owner's own mail endpoint at shearkeygroup.com, which forwards the
     message straight to email — there is no form-handling company in between
   - nothing is sent until the visitor presses Send

   Trigger it from anywhere with:
       <a href="#contact" data-contact-open>…</a>
   and optionally carry an intent:
       <a href="#contact" data-contact-open data-contact-intent="resume">…</a>

   The honeypot field is a real input that is hidden from people and visible
   to naive bots. startedAt is in-memory only and is the second trap: a form
   completed in under two and a half seconds was not completed by a person.
   ========================================================================== */
(function () {
  "use strict";

  if (!document || !document.createElement || !window.addEventListener) return;

  var ENDPOINT = "https://shearkeygroup.com/api/hendrikexec-contact";
  var OPENED = 0;

  var TOPICS = [
    "Owner's agent representation",
    "Short-term or on-demand support",
    "Federal or government contract",
    "Schedule, delay or time impact analysis",
    "Cost, commercial, claims or GMP review",
    "Proposal or source selection",
    "Something else"
  ];

  var RESUME_MESSAGE = "I would like a copy of your resume.";

  var CSS = [
    ".cf-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:flex-start;justify-content:center;",
    "padding:1.25rem;overflow-y:auto;background:rgba(9,13,18,.82);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);",
    "visibility:hidden;opacity:0;pointer-events:none;transition:opacity .18s ease,visibility .18s ease}",
    ".cf-overlay.is-open{visibility:visible;opacity:1;pointer-events:auto}",
    "@media (min-width:768px){.cf-overlay{align-items:center;padding:2rem}}",
    ".cf-dialog{position:relative;width:100%;max-width:44rem;margin:auto;background:#111821;color:#e9eef5;",
    "border:1px solid rgba(255,255,255,.16);border-top:3px solid var(--flag,#f5c451);border-radius:3px;",
    "box-shadow:0 24px 70px rgba(0,0,0,.55);font-family:var(--font-body,inherit);transform:translateY(8px);",
    "transition:transform .18s ease}",
    ".cf-overlay.is-open .cf-dialog{transform:translateY(0)}",
    "@media (prefers-reduced-motion:reduce){.cf-overlay,.cf-dialog{transition:none}}",
    ".cf-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.35rem 1.5rem 0}",
    ".cf-kicker{font-family:var(--font-mono,monospace);font-size:.6875rem;letter-spacing:.14em;text-transform:uppercase;color:var(--flag,#f5c451);margin:0 0 .4rem}",
    ".cf-title{margin:0;font-size:1.3rem;line-height:1.25;color:#fff}",
    ".cf-close{flex:none;width:2.25rem;height:2.25rem;display:grid;place-items:center;background:transparent;",
    "border:1px solid rgba(255,255,255,.25);border-radius:2px;color:#e9eef5;cursor:pointer;font-size:1.1rem;line-height:1}",
    ".cf-close:hover{border-color:var(--flag,#f5c451);color:var(--flag,#f5c451)}",
    ".cf-body{padding:1.1rem 1.5rem 1.5rem}",
    ".cf-note{display:none;margin:0 0 1.1rem;padding:.7rem .85rem;border-left:3px solid var(--flag,#f5c451);",
    "background:rgba(245,196,81,.09);font-size:.875rem}",
    ".cf-note.is-on{display:block}",
    ".cf-row{display:grid;gap:.85rem;margin-bottom:.85rem}",
    "@media (min-width:640px){.cf-row.cf-two{grid-template-columns:1fr 1fr}}",
    ".cf-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.85rem}",
    ".cf-field label{font-family:var(--font-mono,monospace);font-size:.6875rem;letter-spacing:.11em;",
    "text-transform:uppercase;color:rgba(233,238,245,.72)}",
    ".cf-field input,.cf-field select,.cf-field textarea{width:100%;box-sizing:border-box;padding:.6rem .7rem;",
    "background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.22);border-radius:2px;color:#fff;",
    "font:inherit;font-size:.9375rem}",
    ".cf-field textarea{min-height:7.5rem;resize:vertical}",
    ".cf-field input:focus,.cf-field select:focus,.cf-field textarea:focus{outline:2px solid var(--flag,#f5c451);outline-offset:1px;border-color:transparent}",
    ".cf-field select option{color:#111;background:#fff}",
    ".cf-field .cf-hint{font-size:.75rem;color:rgba(233,238,245,.55)}",
    ".cf-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;pointer-events:none}",
    ".cf-foot{display:flex;flex-wrap:wrap;align-items:center;gap:.85rem;margin-top:1.15rem}",
    ".cf-send{padding:.7rem 1.35rem;background:var(--flag,#f5c451);color:#111821;border:1px solid var(--flag,#f5c451);",
    "border-radius:2px;font:inherit;font-weight:600;cursor:pointer}",
    ".cf-send[disabled]{opacity:.55;cursor:progress}",
    ".cf-fine{margin:0;font-size:.75rem;color:rgba(233,238,245,.55);flex:1 1 14rem}",
    ".cf-status{margin:1rem 0 0;padding:.7rem .85rem;border-left:3px solid #e0553f;background:rgba(224,85,63,.12);font-size:.875rem}",
    ".cf-status[hidden]{display:none}",
    ".cf-done{text-align:left}",
    ".cf-done p{margin:0 0 .75rem}",
    ".cf-done strong{color:#fff}",
    ".cf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}"
  ].join("");

  var el = null;          /* overlay */
  var dialog = null;
  var form = null;
  var status = null;
  var lastFocus = null;
  var openedAt = 0;
  var busy = false;

  function h(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (text) n.textContent = text;
    return n;
  }

  function build() {
    var style = h("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    el = h("div", { class: "cf-overlay", role: "presentation" });
    dialog = h("div", {
      class: "cf-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "cf-title"
    });

    var head = h("div", { class: "cf-head" });
    var headText = h("div");
    headText.appendChild(h("p", { class: "cf-kicker", text: "Contact" }));
    headText.appendChild(h("h2", { class: "cf-title", id: "cf-title", text: "Start with the program" }));
    head.appendChild(headText);
    var close = h("button", { class: "cf-close", type: "button", "aria-label": "Close" });
    close.textContent = "\u00d7";
    close.addEventListener("click", hide);
    head.appendChild(close);
    dialog.appendChild(head);

    var body = h("div", { class: "cf-body" });
    var note = h("p", { class: "cf-note", id: "cf-note" });
    body.appendChild(note);

    form = h("form", { novalidate: "novalidate" });

    var two1 = h("div", { class: "cf-row cf-two" });
    two1.appendChild(field("name", "Name", "text", "required"));
    two1.appendChild(field("company", "Company", "text"));
    form.appendChild(two1);

    var two2 = h("div", { class: "cf-row cf-two" });
    two2.appendChild(field("email", "Email", "email", "required"));
    two2.appendChild(field("phone", "Phone", "tel"));
    form.appendChild(two2);

    var topicField = h("div", { class: "cf-field" });
    topicField.appendChild(h("label", { for: "cf-topic", text: "What is this about?" }));
    var sel = h("select", { id: "cf-topic", name: "projectType" });
    sel.appendChild(h("option", { value: "", text: "Choose one\u2026" }));
    TOPICS.forEach(function (t) {
      sel.appendChild(h("option", { value: t, text: t }));
    });
    topicField.appendChild(sel);
    form.appendChild(topicField);

    var msgField = h("div", { class: "cf-field" });
    msgField.appendChild(h("label", { for: "cf-message", text: "The project, the phase, and the decision you are trying to get right" }));
    var ta = h("textarea", { id: "cf-message", name: "message", required: "required" });
    msgField.appendChild(ta);
    msgField.appendChild(h("span", { class: "cf-hint", text: "Plain description is fine. If it is not yet a problem worth a call, say so." }));
    form.appendChild(msgField);

    /* Honeypot. A person never sees it; a bot filling every input will. */
    var hp = h("div", { class: "cf-hp", "aria-hidden": "true" });
    var hpInput = h("input", { type: "text", name: "_honey", id: "cf-honey", tabindex: "-1", autocomplete: "off" });
    var hpLabel = h("label", { for: "cf-honey", text: "Do not fill this in" });
    hp.appendChild(hpLabel);
    hp.appendChild(hpInput);
    form.appendChild(hp);

    var foot = h("div", { class: "cf-foot" });
    var send = h("button", { class: "cf-send", type: "submit", text: "Send" });
    foot.appendChild(send);
    foot.appendChild(h("p", { class: "cf-fine", text: "Nothing is sent until you press Send. This site sets no cookies and stores nothing on your device." }));
    form.appendChild(foot);

    status = h("p", { class: "cf-status", role: "alert", hidden: "hidden" });
    form.appendChild(status);

    form.addEventListener("submit", onSubmit);
    body.appendChild(form);
    dialog.appendChild(body);

    el.appendChild(dialog);
    el.addEventListener("mousedown", function (e) {
      if (e.target === el) hide();
    });
    document.body.appendChild(el);
  }

  function field(name, label, type, required) {
    var wrap = h("div", { class: "cf-field" });
    var id = "cf-" + name;
    wrap.appendChild(h("label", { for: id, text: required ? label + " *" : label }));
    var input = h("input", { id: id, name: name, type: type, autocomplete: "on" });
    if (required) input.setAttribute("required", "required");
    wrap.appendChild(input);
    return wrap;
  }

  function focusables() {
    if (!dialog) return [];
    var nodes = dialog.querySelectorAll(
      'button, a[href], input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return Array.prototype.filter.call(nodes, function (n) {
      return !n.disabled && n.offsetParent !== null;
    });
  }

  function onKeydown(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key !== "Tab" && e.keyCode !== 9) return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function show(intent) {
    if (!el) build();
    if (OPENED === 0) {
      OPENED = 1;
      lastFocus = document.activeElement;
    }
    openedAt = Date.now();

    var note = document.getElementById("cf-note");
    var msg = form.querySelector("#cf-message");
    var topic = form.querySelector("#cf-topic");

    if (intent === "resume") {
      note.textContent = "Requesting a copy of the resume. Add anything you would like it to be read against.";
      note.className = "cf-note is-on";
      if (!msg.value) msg.value = RESUME_MESSAGE + "\n\n";
      if (!topic.value) topic.value = "Owner's agent representation";
      form.setAttribute("data-intent", "resume");
    } else {
      note.textContent = "";
      note.className = "cf-note";
      if (msg.value === RESUME_MESSAGE + "\n\n") msg.value = "";
      form.setAttribute("data-intent", "inquiry");
    }

    status.hidden = true;
    el.className = "cf-overlay is-open";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown, true);

    var target = intent === "resume" ? msg : form.querySelector("#cf-name");
    window.setTimeout(function () {
      if (target) target.focus();
      if (intent === "resume" && msg) {
        try { msg.setSelectionRange(msg.value.length, msg.value.length); } catch (e) { /* ignore */ }
      }
    }, 60);
  }

  function hide() {
    if (!el || el.className.indexOf("is-open") === -1) return;
    el.className = "cf-overlay";
    document.documentElement.style.overflow = "";
    document.removeEventListener("keydown", onKeydown, true);
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (e) { /* ignore */ }
    }
    lastFocus = null;
    OPENED = 0;
  }

  function say(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (busy) return;

    var payload = {
      name: val("name"),
      company: val("company"),
      email: val("email"),
      phone: val("phone"),
      projectType: val("projectType"),
      message: val("message"),
      _honey: val("_honey"),
      intent: form.getAttribute("data-intent") || "inquiry",
      startedAt: openedAt
    };

    if (payload.name.length < 2) return say("Please add your name.");
    if (!/^[^\s@,;:<>"'\\]+@[^\s@,;:<>"'\\]+\.[^\s@,;:<>"'\\]{2,}$/.test(payload.email)) {
      return say("Please check the email address — that one does not look right.");
    }
    if (payload.message.trim().length < 10) {
      return say("Please add a sentence or two about what you need.");
    }

    busy = true;
    var send = form.querySelector(".cf-send");
    send.disabled = true;
    send.textContent = "Sending\u2026";
    status.hidden = true;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().catch(function () { return { ok: false, error: "Unexpected response." }; })
          .then(function (data) { return { status: r.status, data: data }; });
      })
      .then(function (r) {
        if (!r.data || !r.data.ok) {
          throw new Error((r.data && r.data.error) || "The message could not be sent.");
        }
        done(payload);
      })
      .catch(function (err) {
        busy = false;
        send.disabled = false;
        send.textContent = "Send";
        say(err && err.message
          ? err.message
          : "The message could not be sent. Please try again in a few minutes.");
      });
  }

  function done(payload) {
    var body = dialog.querySelector(".cf-body");
    var first = payload.name.split(" ")[0] || "there";
    var html =
      '<p><strong>Sent.</strong> Thank you, ' + esc(first) + ' \u2014 that has gone through and will be read shortly.</p>' +
      (payload.intent === "resume"
        ? "<p>The resume request is with it, so nothing else is needed from you.</p>"
        : "<p>If it turns out I am not the right person for this, I will say so and point you at who is.</p>") +
      '<p style="color:rgba(233,238,245,.6);font-size:.8125rem;margin-top:1rem;">Nothing was stored on your device \u2014 the message went straight to email.</p>' +
      '<p style="margin-top:1.25rem;"><button type="button" class="cf-send" id="cf-close-done">Close</button></p>';
    var wrap = h("div", { class: "cf-done" });
    wrap.innerHTML = html;
    body.replaceChild(wrap, form);
    document.getElementById("cf-close-done").addEventListener("click", hide);
    var btn = document.getElementById("cf-close-done");
    if (btn) btn.focus();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function val(name) {
    var n = form.querySelector('[name="' + name + '"]');
    return n && n.value ? n.value : "";
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.getAttribute && t.hasAttribute("data-contact-open")) {
        e.preventDefault();
        show(t.getAttribute("data-contact-intent") || "inquiry");
        return;
      }
      t = t.parentNode;
    }
  });

  window.addEventListener("hashchange", function () {
    if (window.location.hash === "#contact-form") show("inquiry");
  });

  if (window.location.hash === "#contact-form") {
    window.setTimeout(function () { show("inquiry"); }, 0);
  }

  /* Exposed so the scoping panel can hand its brief straight over. */
  window.hendrikexecContact = {
    open: show,
    openWith: function (text, topic) {
      show("inquiry");
      var msg = form.querySelector("#cf-message");
      var sel = form.querySelector("#cf-topic");
      if (text && msg) msg.value = String(text).slice(0, 6000);
      if (topic && sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === topic) { sel.value = topic; break; }
        }
      }
      if (msg) msg.focus();
    }
  };
})();
