/* ==========================================================================
   scope-chat.js — "Ask about your project" panel
   ==========================================================================
   Self-contained. No network calls, no trackers, no third-party code.
   It answers the common questions from the same material as the Field Notes
   posts, and walks a visitor through a short scoping intake that composes a
   structured email to Hendrik.

   Why there is no AI here on purpose:
   - privacy.html states the site loads nothing from any other company. A
     hosted chat widget would add a tracker and break that promise.
   - A language model answering on Hendrik's behalf can quote fees, promise
     scope and misstate availability. On a site whose product is judgment,
     that is a liability, not a feature.
   - A scripted branch cannot invent anything.

   To change wording or questions, edit NODES below. Nothing else needs touching.
   ========================================================================== */
(function () {
  "use strict";

  if (!document || !document.createElement || !window.addEventListener) return;

  /* There is no published address on this site any more. A scoping brief is
     handed to the contact form, which owns the delivery. */

  /* ------------------------------------------------------------------ *
   * Content
   * ------------------------------------------------------------------ */

  var START = "start";

  var NODES = {
    start: {
      say: [
        "I can answer the usual questions about owner's agent representation, or take the details of your project and pass them to Hendrik.",
        "Which would help?"
      ],
      chips: [
        { label: "Do I need an owner's agent?", go: "need" },
        { label: "Consultant, or an owner's agent?", go: "consultant" },
        { label: "Can I hire you for just one issue?", go: "shortterm" },
        { label: "What does it cost?", go: "cost" },
        { label: "Scope my project →", go: "s1" }
      ]
    },

    shortterm: {
      say: [
        "Yes — and this is a large part of what the work actually is. Rates can be agreed up front and drawn down only as the project needs them: remote, on site, or a mix. There is no minimum engagement.",
        "That covers one meeting, one review, one negotiation, one phase, or a person placed on your team for as long as the problem lasts. A cost controller to walk a GMP with you. A scheduler to rebuild the logic before a recovery board. Someone across the table through a heavy negotiation.",
        "It also covers assembling the team itself — working out what you actually need across scope, schedule and cost, and staffing it for the duration rather than selling you a bench you will not use.",
        "On government work there is more: federal RFP response development, cost and price volumes, request for equitable adjustment, time impact analysis on a schedule in dispute, and source selection support — from someone who spent twenty years on the evaluating side of that table.",
        "And a la carte when a contract question needs an answer rather than a program: reviewing a proposal before it goes in, working a change order through with the government or with a commercial owner, reading what the contracting officer is actually after, or telling you what the FAR says about a specific situation.",
        "All of it starts with a free consultation. Tell me the issue and I will tell you what it needs, whether I am the right person for it, and what it would cost."
      ],
      links: [
        { label: "Services", href: "/services.html" },
        { label: "Full FAQ", href: "/faq.html" }
      ],
      chips: [
        { label: "Is my project in trouble?", go: "trouble" },
        { label: "Scope my project →", go: "s1" },
        { label: "What does it cost?", go: "cost" },
        { label: "Start again", go: START }
      ]
    },

    trouble: {
      say: [
        "Sooner, always — and the reason is arithmetic rather than preference.",
        "A construction contract is a clock. It starts the day it is signed and runs to the last day of the project, and every day lost inside it is a calendar day of cost. Once lost time starts colliding with other activities and eating the critical path, the cost stops being linear and starts compounding — the same week that looked survivable in month two is a claim in month eight.",
        "That is why indecision is expensive. It is not a neutral position. It is an unpriced decision somebody else will eventually invoice you for.",
        "Signals worth acting on: the date has held for three or more reports while the float quietly disappeared. Someone has started explaining the schedule instead of showing it. The same open item appears each month with a new close date. Change orders are arriving after the work rather than before it. The utility or the AHJ has gone quiet. Or you are being asked to decide something whose consequences are described as \u201cto be determined\u201d.",
        "None of those alone is proof your project is failing. All of them are proof nobody independent is testing it — which is the condition that gets more expensive the longer it holds. If any of that sounds familiar, that is a conversation worth having now rather than at the next report."
      ],
      links: [
        { label: "Full FAQ", href: "/faq.html" },
        { label: "Services", href: "/services.html" }
      ],
      chips: [
        { label: "Scope my project →", go: "s1" },
        { label: "Can I hire you for just one issue?", go: "shortterm" },
        { label: "Start again", go: START }
      ]
    },

    consultant: {
      say: [
        "The deciding factor is not how long the engagement runs. It is whether you are buying an answer, or a period of time.",
        "A consultant is bought for a question: is this schedule credible, is this estimate sound, why did this fail. The deliverable is a finding, and the engagement ends when it arrives.",
        "An owner's agent is bought for a stretch of time in which your interest has to be carried — buyout, energization, commissioning, a recovery. The deliverable is the state of the program, and it includes saying no to the contractor, repeatedly, for weeks.",
        "The test I would use: if a perfect report arrived tomorrow, could your team act on it without further help? If yes, hire the consultant. If no, the report will not survive contact with the program — you need someone to carry it.",
        "One honest limit. A three-week engagement may not earn the standing to challenge a contractor who has been on site for eighteen months. The sensible minimum unit is one phase, not one week."
      ],
      links: [
        { label: "Read the note", href: "/blog/how-to-hire-an-owners-agent.html" },
        { label: "Full FAQ", href: "/faq.html" }
      ],
      chips: [
        { label: "What does it cost?", go: "cost" },
        { label: "Scope my project →", go: "s1" },
        { label: "Start again", go: START }
      ]
    },

    need: {
      say: [
        "Three questions usually settle it.",
        "1. Is anyone currently paid to give you an unwelcome answer?",
        "2. When the power path, the schedule or a change order is reported as healthy, who is verifying that independently?",
        "3. If the program misses Day-1, whose report will you have been reading in the months before it happened?",
        "If the honest answers are \u201cnobody\u201d, \u201cthe party reporting it\u201d and \u201cthe delivery team's\u201d, it is worth pricing."
      ],
      links: [
        { label: "Read the note", href: "/blog/independent-owners-agent-representation.html" }
      ],
      chips: [
        { label: "Is my project in trouble?", go: "trouble" },
        { label: "What does it cost?", go: "cost" },
        { label: "How do you work?", go: "how" },
        { label: "Can I hire you for just one issue?", go: "shortterm" },
        { label: "Scope my project →", go: "s1" },
        { label: "Start again", go: START }
      ]
    },

    cost: {
      say: [
        "Fees are structured one of four ways: percentage of construction cost, monthly retainer, fixed fee, or hourly. Which one is right depends on how bounded the scope is and who carries the schedule risk when a program runs long.",
        "There is no standard package. The engagement is sized to the project and to what you are protecting against \u2014 which is why the answer starts with your scope, not a rate card."
      ],
      links: [
        { label: "Read the note", href: "/blog/how-to-hire-an-owners-agent.html" },
        { label: "Services", href: "/services.html" }
      ],
      chips: [
        { label: "How do you work?", go: "how" },
        { label: "Can I hire you for just one issue?", go: "shortterm" },
        { label: "Scope my project →", go: "s1" },
        { label: "Start again", go: START }
      ]
    },

    how: {
      say: [
        "Retained directly by you. There is no firm between us and nothing else being sold alongside \u2014 no construction, no design, no commissioning, no equipment.",
        "Three shapes: an advisory review on a single high-consequence decision, phase representation (pre-construction and buyout, energization, or commissioning and turnover), or standing representation through closeout.",
        "Where a program genuinely needs bodies rather than judgment, I will help define the roles and staff them rather than sell you my own."
      ],
      links: [
        { label: "Services", href: "/services.html" },
        { label: "FAQ", href: "/faq.html" }
      ],
      chips: [
        { label: "Consultant or owner's agent?", go: "consultant" },
        { label: "Do I need an owner's agent?", go: "need" },
        { label: "Scope my project →", go: "s1" },
        { label: "Start again", go: START }
      ]
    },

    /* ------------------------- scoping intake ------------------------- */

    s1: {
      say: ["Let's get the shape of it. Four quick questions, then your details."],
      ask: "What kind of project is this?",
      chips: [
        { label: "Data center / mission-critical", set: "project", value: "Data center / mission-critical", go: "s2" },
        { label: "Other industrial or commercial", set: "project", value: "Other industrial or commercial", go: "s2" },
        { label: "Multiple sites or a program", set: "project", value: "Multiple sites or a program", go: "s2" }
      ]
    },

    s2: {
      ask: "What stage is it at?",
      chips: [
        { label: "Planning / feasibility", set: "stage", value: "Planning / feasibility", go: "s3" },
        { label: "Pre-construction & buyout", set: "stage", value: "Pre-construction & buyout", go: "s3" },
        { label: "Under construction", set: "stage", value: "Under construction", go: "s3" },
        { label: "Energization", set: "stage", value: "Energization", go: "s3" },
        { label: "Commissioning & turnover", set: "stage", value: "Commissioning & turnover", go: "s3" },
        { label: "Already went wrong", set: "stage", value: "Looking back at a problem", go: "s3" }
      ]
    },

    s3: {
      ask: "Roughly what is the construction value?",
      chips: [
        { label: "Under $5M", set: "value", value: "Under $5M", go: "s4" },
        { label: "$5\u201350M", set: "value", value: "$5-50M", go: "s4" },
        { label: "$50\u2013250M", set: "value", value: "$50-250M", go: "s4" },
        { label: "$250M+", set: "value", value: "$250M+", go: "s4" },
        { label: "Not set yet", set: "value", value: "Not set yet", go: "s4" }
      ]
    },

    s4: {
      ask: "What are you trying to protect against? One line is plenty.",
      free: true,
      set: "concern",
      placeholder: "e.g. Day-1 date slipping, change orders, an unverified schedule\u2026",
      go: "s5"
    },

    s5: {
      ask: "What is the timeline, and what do you want to happen next?",
      free: true,
      set: "timeline",
      placeholder: "e.g. award in Q1, want a second opinion before then",
      go: "s6"
    },

    s6: {
      say: ["Last step \u2014 so Hendrik can reply directly."],
      form: true
    },

    done: {
      say: [
        "That's everything. Your brief is below \u2014 open it in your email client and it arrives with the context already in it, or copy it and send it however you prefer.",
        "Nothing has been sent automatically. Nothing is stored on this site."
      ],
      review: true
    }
  };

  /* ------------------------------------------------------------------ *
   * Styles
   * ------------------------------------------------------------------ */

  var CSS = [
    ".scope-chat-launch{position:fixed;right:1.25rem;bottom:1.25rem;z-index:70;",
    "display:inline-flex;align-items:center;gap:.55rem;padding:.7rem 1rem;",
    "background:var(--flag);color:#fff;border:0;cursor:pointer;",
    "font-family:var(--font-mono);font-size:var(--step--1);letter-spacing:.1em;",
    "text-transform:uppercase;box-shadow:0 6px 24px rgba(15,25,45,.28);}",
    ".scope-chat-launch:hover{filter:brightness(1.08)}",
    ".scope-chat-launch:focus-visible{outline:2px solid var(--navy);outline-offset:3px}",
    ".scope-chat-launch[hidden]{display:none}",
    "body.has-scope-chat .back-to-top{bottom:4.9rem}",

    ".scope-chat{position:fixed;right:1.25rem;bottom:1.25rem;z-index:80;",
    "width:min(24rem,calc(100vw - 2rem));max-height:min(34rem,calc(100vh - 3rem));",
    "display:flex;flex-direction:column;background:var(--paper);",
    "border:1px solid var(--line-strong);box-shadow:0 18px 48px rgba(15,25,45,.3);",
    "font-family:var(--font-display);color:var(--ink);}",
    ".scope-chat[hidden]{display:none}",

    ".scope-chat-head{display:flex;align-items:center;justify-content:space-between;",
    "gap:1rem;padding:.75rem .9rem;background:var(--navy);color:#fff;",
    "border-bottom:1px solid var(--line-light-soft);}",
    ".scope-chat-head h2{margin:0;font-size:var(--step--1);font-weight:800;",
    "letter-spacing:.12em;text-transform:uppercase;}",
    ".scope-chat-head p{margin:.15rem 0 0;font-family:var(--font-serif);",
    "font-size:var(--step--1);color:rgba(255,255,255,.72);}",
    ".scope-chat-close{background:transparent;border:0;color:#fff;cursor:pointer;",
    "font-size:1.1rem;line-height:1;padding:.3rem .45rem;}",
    ".scope-chat-close:hover{color:var(--flag)}",
    ".scope-chat-close:focus-visible{outline:2px solid var(--flag);outline-offset:2px}",

    ".scope-chat-body{flex:1 1 auto;overflow-y:auto;padding:.9rem;",
    "display:flex;flex-direction:column;gap:.55rem;}",
    ".scope-msg{margin:0;font-family:var(--font-serif);font-size:var(--step-0);",
    "line-height:1.45;padding:.55rem .7rem;border-radius:2px;max-width:92%;}",
    ".scope-msg-bot{background:rgba(26,35,51,.055);border-left:2px solid var(--navy);}",
    ".scope-msg-you{background:var(--navy);color:#fff;align-self:flex-end;",
    "font-family:var(--font-display);font-size:var(--step--1);}",

    ".scope-links{display:flex;flex-wrap:wrap;gap:.5rem;margin:.1rem 0 .1rem .2rem;}",
    ".scope-link{font-family:var(--font-mono);font-size:var(--step--1);",
    "letter-spacing:.06em;text-transform:uppercase;color:var(--flag);",
    "border-bottom:1px solid currentColor;text-decoration:none;}",
    ".scope-link:hover{filter:brightness(.85)}",

    ".scope-chips{display:flex;flex-direction:column;gap:.4rem;margin-top:.2rem;}",
    ".scope-chip{text-align:left;background:#fff;border:1px solid var(--line-strong);",
    "padding:.5rem .65rem;cursor:pointer;color:var(--ink);",
    "font-family:var(--font-display);font-size:var(--step--1);font-weight:600;}",
    ".scope-chip:hover{border-color:var(--navy);background:rgba(26,35,51,.04)}",
    ".scope-chip:focus-visible{outline:2px solid var(--flag);outline-offset:2px}",
    ".scope-chip[disabled]{opacity:.45;cursor:default;background:#fff;border-color:var(--line)}",
    ".scope-chip[disabled]:hover{border-color:var(--line);background:#fff}",

    ".scope-form{display:flex;flex-direction:column;gap:.5rem;margin-top:.3rem;}",
    ".scope-form label{font-family:var(--font-mono);font-size:var(--step--1);",
    "letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}",
    ".scope-form input,.scope-form textarea{width:100%;box-sizing:border-box;",
    "padding:.5rem .6rem;border:1px solid var(--line-strong);background:#fff;",
    "font-family:var(--font-serif);font-size:var(--step-0);color:var(--ink);}",
    ".scope-form input:focus,.scope-form textarea:focus{outline:2px solid var(--flag);",
    "outline-offset:1px;border-color:var(--navy);}",
    ".scope-form textarea[disabled],.scope-form input[disabled]{background:rgba(26,35,51,.04);",
    "color:var(--muted);cursor:default;}",
    ".scope-note{margin:0;font-family:var(--font-serif);font-size:var(--step--1);",
    "color:var(--muted);}",

    ".scope-review{margin:.2rem 0 0;padding:.7rem;background:#fff;",
    "border:1px solid var(--line-strong);white-space:pre-wrap;",
    "font-family:var(--font-mono);font-size:var(--step--1);line-height:1.5;",
    "max-height:12rem;overflow-y:auto;}",
    ".scope-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem;}",
    ".scope-error{margin:.3rem 0 0;font-family:var(--font-serif);",
    "font-size:var(--step--1);color:oklch(48% 0.18 25);}",

    "@media (prefers-reduced-motion:no-preference){",
    ".scope-chat{animation:scopeIn .18s ease-out}",
    "@keyframes scopeIn{from{opacity:0;transform:translateY(.5rem)}to{opacity:1;transform:none}}}",
    "@media (max-width:30rem){.scope-chat{right:.5rem;left:.5rem;width:auto;bottom:.5rem}}"
  ].join("");

  /* ------------------------------------------------------------------ *
   * Build
   * ------------------------------------------------------------------ */

  var data = {};
  var current = null;

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
      if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (text != null) n.textContent = text;
    return n;
  }

  function injectStyles() {
    var s = el("style");
    s.setAttribute("data-scope-chat", "");
    s.appendChild(document.createTextNode(CSS));
    document.head.appendChild(s);
  }

  var launch, panel, body, closeBtn, lastFocus;

  function build() {
    injectStyles();

    launch = el("button", {
      "class": "scope-chat-launch",
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      "aria-controls": "scope-chat-panel"
    });
    launch.appendChild(el("span", null, "Ask about your project"));

    panel = el("div", {
      "class": "scope-chat",
      id: "scope-chat-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "scope-chat-title",
      hidden: "hidden"
    });

    var head = el("div", { "class": "scope-chat-head" });
    var titles = el("div");
    titles.appendChild(el("h2", { id: "scope-chat-title" }, "Owner's agent \u2014 ask"));
    titles.appendChild(el("p", null, "Straight answers. Nothing sent until you send it."));
    closeBtn = el("button", {
      "class": "scope-chat-close",
      type: "button",
      "aria-label": "Close"
    }, "\u00d7");
    head.appendChild(titles);
    head.appendChild(closeBtn);

    body = el("div", { "class": "scope-chat-body" });

    panel.appendChild(head);
    panel.appendChild(body);

    document.body.appendChild(launch);
    document.body.appendChild(panel);
    document.body.className += (document.body.className ? " " : "") + "has-scope-chat";
  }

  /* ------------------------------------------------------------------ *
   * Render helpers
   * ------------------------------------------------------------------ */

  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }

  function addMsg(text, kind) {
    var cls = kind === "you" ? "scope-msg scope-msg-you" : "scope-msg scope-msg-bot";
    body.appendChild(el("p", { "class": cls }, text));
    scrollDown();
  }

  function saySequential(lines, after) {
    var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    var reduce = !!(mq && mq.matches);
    if (reduce) {
      for (var i = 0; i < lines.length; i++) addMsg(lines[i], "bot");
      if (after) after();
      return;
    }
    var i2 = 0;
    (function step() {
      if (i2 >= lines.length) { if (after) after(); return; }
      addMsg(lines[i2++], "bot");
      window.setTimeout(step, 180);
    })();
  }

  function addLinks(links) {
    if (!links || !links.length) return;
    var wrap = el("div", { "class": "scope-links" });
    for (var i = 0; i < links.length; i++) {
      wrap.appendChild(el("a", { "class": "scope-link", href: links[i].href }, links[i].label + " \u2192"));
    }
    body.appendChild(wrap);
    scrollDown();
  }

  function lockGroup(node) {
    if (!node) return;
    var btns = node.querySelectorAll(".scope-chip");
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
  }

  function addChips(chips) {
    if (!chips || !chips.length) return;
    var wrap = el("div", { "class": "scope-chips" });
    for (var i = 0; i < chips.length; i++) {
      (function (chip) {
        var b = el("button", { "class": "scope-chip", type: "button" }, chip.label);
        b.addEventListener("click", function () {
          if (b.disabled) return;
          lockGroup(wrap);
          choose(chip);
        });
        wrap.appendChild(b);
      })(chips[i]);
    }
    body.appendChild(wrap);
    scrollDown();
  }

  function choose(chip) {
    if (chip.set) {
      data[chip.set] = chip.value;
      addMsg(chip.label, "you");
    }
    if (chip.go) go(chip.go);
  }

  /* ------------------------------------------------------------------ *
   * Free-text step
   * ------------------------------------------------------------------ */

  function addFree(node) {
    var wrap = el("div", { "class": "scope-form" });
    var input = el("textarea", { rows: "2", placeholder: node.placeholder || "" });
    var b = el("button", { "class": "scope-chip", type: "button" }, "Continue \u2192");
    b.style.alignSelf = "flex-start";
    b.addEventListener("click", function () {
      if (b.disabled) return;
      var v = input.value.trim();
      if (v) data[node.set] = v;
      lockGroup(wrap);
      input.disabled = true;
      addMsg(v || "\u2014 skipped \u2014", "you");
      go(node.go);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); b.click(); }
    });
    wrap.appendChild(input);
    wrap.appendChild(b);
    body.appendChild(wrap);
    scrollDown();
    window.setTimeout(function () { input.focus(); }, 60);
  }

  /* ------------------------------------------------------------------ *
   * Contact form
   * ------------------------------------------------------------------ */

  function addContactForm() {
    var wrap = el("div", { "class": "scope-form" });
    var fields = [
      { id: "sc-name", label: "Your name", key: "name", type: "text" },
      { id: "sc-org", label: "Company", key: "org", type: "text" },
      { id: "sc-email", label: "Email", key: "email", type: "email" }
    ];
    var inputs = {};
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      wrap.appendChild(el("label", { "for": f.id }, f.label));
      var inp = el("input", { id: f.id, type: f.type, autocomplete: f.key === "email" ? "email" : "off" });
      inputs[f.key] = inp;
      wrap.appendChild(inp);
    }
    var err = el("p", { "class": "scope-error", role: "alert" });
    err.hidden = true;
    var b = el("button", { "class": "scope-chip", type: "button" }, "Build my brief \u2192");
    b.style.alignSelf = "flex-start";
    b.addEventListener("click", function () {
      var name = inputs.name.value.trim();
      var email = inputs.email.value.trim();
      if (!name || !email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
        err.textContent = "A name and a working email address, please \u2014 otherwise Hendrik cannot reply.";
        err.hidden = false;
        (!name ? inputs.name : inputs.email).focus();
        return;
      }
      err.hidden = true;
      lockGroup(wrap);
      data.name = name;
      data.org = inputs.org.value.trim();
      data.email = email;
      addMsg(name + (data.org ? ", " + data.org : ""), "you");
      go("done");
    });
    wrap.appendChild(err);
    wrap.appendChild(b);
    body.appendChild(wrap);
    scrollDown();
    window.setTimeout(function () { inputs.name.focus(); }, 60);
  }

  /* ------------------------------------------------------------------ *
   * Brief composition
   * ------------------------------------------------------------------ */

  function brief() {
    var lines = [
      "OWNER'S AGENT INQUIRY",
      "",
      "Project type:    " + (data.project || "\u2014"),
      "Stage:           " + (data.stage || "\u2014"),
      "Construction value: " + (data.value || "\u2014"),
      "",
      "Protecting against:",
      (data.concern || "\u2014"),
      "",
      "Timeline / next step:",
      (data.timeline || "\u2014"),
      "",
      "Name:    " + (data.name || "\u2014"),
      "Company: " + (data.org || "\u2014"),
      "Email:   " + (data.email || "\u2014")
    ];
    return lines.join("\n");
  }

  /* Map the scoping answers onto one of the contact form's topic values. */
  function topicForContact() {
    var s = ((data.project || "") + " " + (data.stage || "")).toLowerCase();
    if (s.indexOf("federal") !== -1 || s.indexOf("government") !== -1) return "Federal or government contract";
    if (s.indexOf("delay") !== -1 || s.indexOf("schedule") !== -1) return "Schedule, delay or time impact analysis";
    if (s.indexOf("cost") !== -1 || s.indexOf("claim") !== -1) return "Cost, commercial, claims or GMP review";
    if (s.indexOf("proposal") !== -1 || s.indexOf("rfp") !== -1) return "Proposal or source selection";
    return "Owner's agent representation";
  }

  function addReview() {
    var pre = el("pre", { "class": "scope-review" }, brief());
    body.appendChild(pre);

    var actions = el("div", { "class": "scope-actions" });

    var mail = el("button", { "class": "scope-chip", type: "button" }, "Send this brief \u2192");
    mail.addEventListener("click", function () {
      if (window.hendrikexecContact && window.hendrikexecContact.openWith) {
        window.hendrikexecContact.openWith(brief(), topicForContact());
        close();
      } else {
        copy.click();
      }
    });

    var copy = el("button", { "class": "scope-chip", type: "button" }, "Copy brief");
    copy.addEventListener("click", function () {
      var text = brief();
      function ok() { copy.textContent = "Copied \u2713"; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = el("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); ok(); } catch (e) { copy.textContent = "Select and copy above"; }
        document.body.removeChild(ta);
      }
    });

    var again = el("button", { "class": "scope-chip", type: "button" }, "Start again");
    again.addEventListener("click", function () {
      data = {};
      body.innerHTML = "";
      go(START);
    });

    actions.appendChild(mail);
    actions.appendChild(copy);
    actions.appendChild(again);
    body.appendChild(actions);
    scrollDown();
  }

  /* ------------------------------------------------------------------ *
   * Navigation
   * ------------------------------------------------------------------ */

  function go(id) {
    var node = NODES[id];
    if (!node) return;
    // "Start again" is a true reset: wipe the transcript and the collected answers,
    // rather than appending a second copy of the opening question underneath the first.
    if (id === START) {
      data = {};
      body.innerHTML = "";
    }
    current = id;

    var after = function () {
      if (node.links) addLinks(node.links);
      if (node.ask) addMsg(node.ask, "bot");
      if (node.form) addContactForm();
      else if (node.free) addFree(node);
      else if (node.review) addReview();
      else addChips(node.chips);
    };

    if (node.say) saySequential(node.say, after);
    else after();
  }

  /* ------------------------------------------------------------------ *
   * Open / close
   * ------------------------------------------------------------------ */

  function open() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    launch.hidden = true;
    launch.setAttribute("aria-expanded", "true");
    if (!current) go(START);
    var focusable = panel.querySelector("button, a[href], input, textarea");
    if (focusable) focusable.focus();
  }

  function close() {
    panel.hidden = true;
    launch.hidden = false;
    launch.setAttribute("aria-expanded", "false");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    else launch.focus();
  }

  function onKey(e) {
    if (e.key === "Escape" && !panel.hidden) { close(); return; }
    if (e.key !== "Tab" || panel.hidden) return;
    var f = panel.querySelectorAll("button, a[href], input, textarea");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function init() {
    build();
    launch.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
