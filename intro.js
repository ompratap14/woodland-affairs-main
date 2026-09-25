/* =========================================================
   Woodland Affairs — logo intro
   A clean green screen, the logo fades in, then flies up into
   its place in the top-left of the navigation as the site opens.
   ========================================================= */
(function () {
  // The landing page always opens on the hero video: no restored scroll position on
  // refresh or back, and a leftover #section in the address doesn't jump past the video.
  // A fresh click on a link like "Restaurants" (index.html#outlets) still goes there.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var navEntry = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (location.hash && navEntry && navEntry.type !== 'navigate') {
    history.replaceState(null, '', location.pathname + location.search);
  }
  if (!location.hash) {
    var toTop = function () {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
    };
    toTop();
    window.addEventListener('load', toTop, { once: true });
  }

  var intro = document.getElementById('intro');
  if (!intro) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FLIGHT = 1150;
  var finished = false;

  // Lift an intro logo part out of the overlay and fly it onto its nav counterpart.
  // Transform-only (translate + scale from the top-left corner) so it stays smooth.
  function fly(from, to, delay) {
    from.style.animation = 'none';
    from.style.opacity = '1';
    from.style.transform = 'none';
    var a = from.getBoundingClientRect();
    var b = to.getBoundingClientRect();
    var flyer = from.cloneNode(true);
    flyer.classList.add('intro-flyer');
    flyer.setAttribute('aria-hidden', 'true');
    flyer.style.cssText = 'left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;';
    document.body.appendChild(flyer);
    from.style.visibility = 'hidden';
    if (!b.width) {
      return flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(function () { return flyer; });
    }
    var s = from.classList.contains('intro__name')
      ? parseFloat(getComputedStyle(to).fontSize) / parseFloat(getComputedStyle(from).fontSize)
      : b.width / a.width;
    var tx = b.left - a.left;
    var ty = b.top + b.height / 2 - (a.top + a.height * s / 2);
    requestAnimationFrame(function () { flyer.classList.add('to-nav'); });
    return flyer.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: 'translate(' + tx * 0.35 + 'px,' + (ty * 0.35 - 14) + 'px) scale(' + (1 - (1 - s) * 0.3) + ')', offset: 0.35 },
      { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')' }
    ], { duration: FLIGHT, delay: delay, easing: 'cubic-bezier(.77,0,.18,1)', fill: 'both' }).finished.then(function () { return flyer; });
  }

  function flyLogoHome() {
    var pairs = [
      [intro.querySelector('.intro__mark'), document.querySelector('.nav .brand__mark')],
      [intro.querySelector('.intro__name'), document.querySelector('.nav .brand__name')]
    ].filter(function (pair) { return pair[0] && pair[1]; });
    if (!pairs.length || !Element.prototype.animate || !window.Promise) return false;
    document.body.classList.add('intro-flight');
    intro.classList.add('flying');
    Promise.all(pairs.map(function (pair, i) { return fly(pair[0], pair[1], i * 70); })).then(function (flyers) {
      // Landed: hand over to the real nav logo and fade the stand-ins away.
      document.body.classList.remove('intro-flight');
      flyers.forEach(function (flyer) {
        flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: 'forwards' }).finished.then(function () { flyer.remove(); });
      });
    }, function () {
      document.body.classList.remove('intro-flight');
      document.querySelectorAll('.intro-flyer').forEach(function (flyer) { flyer.remove(); });
    });
    return true;
  }

  function enterSite(animate) {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem('wa_intro_seen', '1'); } catch (e) {}
    var flying = animate === true && !reduce && flyLogoHome();
    intro.classList.add('gone');
    document.body.classList.remove('intro-active');
    document.dispatchEvent(new CustomEvent('wa:enter'));
    setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, flying ? FLIGHT + 300 : 1100);
  }
  window.__waEnter = enterSite;

  var seen = false;
  try { seen = sessionStorage.getItem('wa_intro_seen') === '1'; } catch (e) {}
  if (seen) { enterSite(); return; }

  document.body.classList.add('intro-active');

  var skip = intro.querySelector('.intro__skip');
  if (skip) skip.addEventListener('click', function () { enterSite(true); });

  // Reduced motion → hold briefly then reveal
  var DURATION = reduce ? 900 : 2600;
  var bar = intro.querySelector('.intro__bar');
  var start = performance.now();
  (function tick() {
    if (finished) return;
    var p = Math.min((performance.now() - start) / DURATION, 1);
    if (bar) bar.style.width = (p * 100) + '%';
    if (p >= 1) { enterSite(true); return; }
    requestAnimationFrame(tick);
  })();
})();
