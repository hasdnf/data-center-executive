/*
 * Back-to-top control.
 * Hidden until the reader has scrolled a meaningful distance; hidden again near
 * the top and whenever the footer or contact section is on screen, so it never
 * covers the footer content or the contact call-to-action.
 * Plain DOM, no dependencies. Fails silently if anything is missing.
 * With JS disabled the control stays hidden (CSS default) and the page is unaffected.
 */
(function () {
    "use strict";

    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    if (!("querySelector" in document) || !window.addEventListener) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var REVEAL_AFTER = 400; // px scrolled before the control appears
    var blockers = [];
    var blocked = false;

    Array.prototype.forEach.call(
        document.querySelectorAll(".site-footer, #contact"),
        function (el) {
            blockers.push(el);
        }
    );

    function atBottomVisible() {
        return blocked;
    }

    function update() {
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        var show = y > REVEAL_AFTER && !atBottomVisible();
        btn.classList.toggle("is-visible", show);
    }

    if ("IntersectionObserver" in window && blockers.length) {
        var observer = new IntersectionObserver(
            function (entries) {
                blocked = entries.some(function (e) {
                    return e.isIntersecting;
                });
                update();
            },
            { threshold: 0 }
        );
        blockers.forEach(function (el) {
            observer.observe(el);
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    btn.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: reduceMotion.matches ? "auto" : "smooth"
        });
    });

    update();
})();
