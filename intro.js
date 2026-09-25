/* =========================================================
   Woodland Affairs — simple logo intro
   A clean green screen, the logo fades in, then dissolves.
   ========================================================= */
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;

  var finished = false;
  function enterSite() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem('wa_intro_seen', '1'); } catch (e) {}
    intro.classList.add('gone');
    document.body.classList.remove('intro-active');
    document.dispatchEvent(new CustomEvent('wa:enter'));
    setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 1100);
  }
  window.__waEnter = enterSite;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('wa_intro_seen') === '1'; } catch (e) {}
  if (seen) { enterSite(); return; }

  document.body.classList.add('intro-active');

  var skip = intro.querySelector('.intro__skip');
  if (skip) skip.addEventListener('click', enterSite);

  // Reduced motion → hold briefly then reveal
  var DURATION = reduce ? 900 : 2600;
  var bar = intro.querySelector('.intro__bar');
  var start = performance.now();
  (function tick() {
    if (finished) return;
    var p = Math.min((performance.now() - start) / DURATION, 1);
    if (bar) bar.style.width = (p * 100) + '%';
    if (p >= 1) { enterSite(); return; }
    requestAnimationFrame(tick);
  })();
})();
