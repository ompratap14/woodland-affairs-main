(function () {
  'use strict';
  var pageName = location.pathname.split('/').pop().replace(/\.html$/, '');
  var pageStyle = ['gallery', 'menu', 'celebrate', 'contact'].indexOf(pageName) >= 0 ? pageName : 'home';
  document.body.dataset.motionPage = pageStyle;
  // Keep the existing poster visible until a real video frame can be painted.
  // Never hold up the welcome or navigation while a slow connection buffers.
  var film = document.querySelector('.hero__media video');
  if (film) {
    var filmVisible = true;
    function syncFilm() {
      if (document.hidden || !filmVisible || document.body.classList.contains('intro-active')) film.pause();
      else film.play().catch(function () {});
    }
    document.addEventListener('wa:enter', syncFilm);
    document.addEventListener('visibilitychange', syncFilm);
    if ('IntersectionObserver' in window) {
      var filmObserver = new IntersectionObserver(function (entries) { filmVisible = entries[0].isIntersecting; syncFilm(); }, { threshold:0 });
      filmObserver.observe(film);
    }
    syncFilm();
    var waitingForFrame = false;
    function revealFilm() {
      if (waitingForFrame || film.classList.contains('film-ready')) return;
      waitingForFrame = true;
      function showFrame() {
        waitingForFrame = false;
        if (!film.error && film.readyState >= 2) film.classList.add('film-ready');
      }
      if ('requestVideoFrameCallback' in film) film.requestVideoFrameCallback(showFrame);
      else requestAnimationFrame(showFrame);
    }
    film.addEventListener('playing', revealFilm);
    film.addEventListener('error', function () { film.classList.remove('film-ready'); });
    if (!film.paused && film.readyState >= 2) revealFilm();
  }
  if (!('IntersectionObserver' in window)) return;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var scenes = [];

  function piece(element, x, delay, image) {
    if (!element) return;
    element.classList.add('motion-piece');
    element.style.setProperty('--entrance-x', x + 'px');
    element.style.setProperty('--entrance-delay', delay + 'ms');
    if (image) {
      element.classList.add('motion-image');
      if (x < 0) element.classList.add('from-left');
    }
    var animateWords = (pageStyle === 'home' || pageStyle === 'celebrate') && !motion.matches && window.innerWidth > 760;
    (animateWords ? element.querySelectorAll('h2, h3') : []).forEach(function (heading) {
      var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      var nodes = [], node, index = 0;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach(function (textNode) {
        var fragment = document.createDocumentFragment();
        textNode.textContent.split(/(\s+)/).forEach(function (word) {
          if (!word.trim()) { fragment.appendChild(document.createTextNode(word)); return; }
          var mask = document.createElement('span');
          var inner = document.createElement('span');
          mask.className = 'motion-word-mask';
          inner.className = 'motion-word';
          inner.style.setProperty('--word-index', Math.min(index++, 12));
          inner.textContent = word;
          mask.appendChild(inner);
          fragment.appendChild(mask);
        });
        textNode.replaceWith(fragment);
      });
    });
  }

  document.querySelectorAll('main .split').forEach(function (scene) {
    var reverse = scene.classList.contains('split--reverse');
    piece(scene.querySelector('.split__media'), reverse ? 100 : -100, 0, true);
    piece(scene.querySelector('.split__body'), reverse ? -80 : 80, 140, false);
    scenes.push(scene);
  });
  document.querySelectorAll('main .sec-head, main .reviews__score, main .reviews__body, main .cta-strip').forEach(function (element) {
    piece(element, element.matches('.reviews__score') ? -64 : 48, 0, false);
    scenes.push(element);
  });
  document.querySelectorAll('main .o-card, main .mcat, main .teaser-grid figure').forEach(function (element) {
    var siblings = Array.from(element.parentElement.children);
    var index = siblings.indexOf(element);
    piece(element, index % 2 ? 55 : -55, (index % 3) * 90, element.matches('figure, .mcat'));
    scenes.push(element);
  });
  function show(scene) {
    if (scene.classList.contains('motion-piece')) scene.classList.add('is-visible');
    scene.querySelectorAll('.motion-piece').forEach(function (element) { element.classList.add('is-visible'); });
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  // Begin after the scene enters the screen, so the movement is visible.
  // A zero threshold also works for sections taller than the viewport.
  }, { threshold:0, rootMargin:'0px 0px -64px 0px' });
  document.body.classList.add('cinematic');
  scenes.forEach(function (scene) {
    if (motion.matches) show(scene);
    else observer.observe(scene);
  });
  // Include each page's own cards and text, plus freshly rendered menu results.
  function registerPageContent() {
    scenes = scenes.filter(function (scene) {
      if (scene.isConnected) return true;
      observer.unobserve(scene);
      return false;
    });
    document.querySelectorAll('main .scroll-entry:not(.motion-piece)').forEach(function (element, index) {
      var image = element.matches('.gitem__media, .func, .spread figure, .more-gallery__item');
      var text = element.matches('.gitem__body, .contact-side, .menu-intro__copy, .step-heading, .type-heading, .dish-group, .menu-ending');
      piece(element, image ? 65 : text ? -55 : index % 2 ? 48 : -48, (index % 3) * 60, image);
      scenes.push(element);
      if (motion.matches) show(element);
      else observer.observe(element);
    });
  }
  registerPageContent();
  document.addEventListener('wa:menu-rendered', registerPageContent);
  document.addEventListener('focusin', function (event) {
    var scene = event.target.closest('.split, .motion-piece');
    if (scene) show(scene);
  });
  motion.addEventListener('change', function () {
    if (motion.matches) { scenes.forEach(show); observer.disconnect(); }
  });
})();
