/*
 * FAQ auto-contract.
 *
 * When a reader opens a FAQ entry and then scrolls past it, the entry closes
 * itself, so the page does not stay stretched open behind them and the topics
 * further down stay reachable.
 *
 * Two details that make it feel like nothing happened rather than like the page
 * moved under you:
 *
 *   1. It waits. An entry has to be completely out of view for DWELL_MS before
 *      it closes, so flicking past something and flicking back does not lose it.
 *   2. It keeps your place. Closing an entry that sits above the viewport makes
 *      the page shorter, which would pull the paragraph you are reading upwards.
 *      The scroll position is corrected by exactly that much, so the text in
 *      front of you does not move. An entry below the viewport needs no
 *      correction, because collapsing it cannot shift anything you can see.
 *
 * Never closes an entry you are working inside, and never fires while the tab is
 * in the background.
 *
 * Self-contained: no dependencies, no network requests, no cookies, nothing
 * written to the device. Consistent with what privacy.html publishes. With
 * JavaScript disabled the page is unaffected and every entry behaves natively.
 */

(function () {
    "use strict";

    var DWELL_MS = 1100;

    if (!window.IntersectionObserver) return;

    var entries = document.querySelectorAll("details.faq-entry");
    if (!entries.length) return;

    var timers = new WeakMap();

    function collapse(el) {
        if (!el.open) return;

        // Never close something the reader has put their cursor or focus into.
        if (el.contains(document.activeElement)) return;

        // Not while the tab is hidden; the reader is not looking.
        if (document.hidden) return;

        var above = el.getBoundingClientRect().bottom <= 0;
        var heightBefore = above ? document.documentElement.scrollHeight : 0;

        el.open = false;

        if (!above) return;

        var shrinkage = heightBefore - document.documentElement.scrollHeight;
        if (shrinkage <= 0) return;

        // scrollBy honours scroll-behavior, which a future stylesheet change
        // could set to smooth. Pin it to instant so the correction cannot be
        // seen as an animation.
        var root = document.documentElement;
        var previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollBy(0, -shrinkage);
        root.style.scrollBehavior = previous;
    }

    var observer = new IntersectionObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
            var el = records[i].target;
            var pending = timers.get(el);

            if (!records[i].isIntersecting && el.open) {
                if (pending) continue;
                timers.set(el, window.setTimeout(function () {
                    timers.delete(el);
                    collapse(el);
                }, DWELL_MS));
            } else if (pending) {
                window.clearTimeout(pending);
                timers.delete(el);
            }
        }
    }, { threshold: 0 });

    for (var i = 0; i < entries.length; i++) {
        observer.observe(entries[i]);
    }

    // Entries opened by keyboard while the page is not scrolled should not be
    // yanked shut by a stray layout change; re-check visibility on focus.
    document.addEventListener("focusin", function (event) {
        var el = event.target.closest ? event.target.closest("details.faq-entry") : null;
        if (!el) return;
        var pending = timers.get(el);
        if (pending) {
            window.clearTimeout(pending);
            timers.delete(el);
        }
    });
})();
