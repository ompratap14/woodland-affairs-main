(function () {
  // Outlet selection opens a draft WhatsApp conversation; no message is sent automatically.
  var bookingTriggers = document.querySelectorAll('.fab-call');
  if (bookingTriggers.length && typeof HTMLDialogElement !== 'undefined') {
    var bookingDialog = document.createElement('dialog');
    bookingDialog.className = 'booking-dialog';
    bookingDialog.setAttribute('aria-labelledby', 'booking-title');
    bookingDialog.setAttribute('aria-describedby', 'booking-description');
    bookingDialog.innerHTML = '<button class="booking-close" type="button" aria-label="Close restaurant chooser">×</button>' +
      '<p class="eyebrow">Your next gathering</p><h2 id="booking-title">Choose your restaurant.</h2>' +
      '<p id="booking-description">Select an outlet to continue on WhatsApp and arrange your table.</p><div class="booking-outlets"></div>';
    var bookingOutlets = [
      ['Hari Nagar', 'Woodland Affairs', '919873347347'],
      ['Dwarka', 'Woodland Affairs', '919873798727'],
      ['Janakpuri', 'Eatery Royale', '919990283002']
    ];
    bookingOutlets.forEach(function (outlet) {
      var link = document.createElement('a');
      var message = 'Hello ' + outlet[1] + ' ' + outlet[0] + '! I would like to enquire about booking a table. Please help me with availability.';
      link.href = 'https://wa.me/' + outlet[2] + '?text=' + encodeURIComponent(message);
      link.innerHTML = '<span><small>' + outlet[1] + '</small><strong>' + outlet[0] + '</strong></span><span class="booking-action">WhatsApp ↗</span>';
      bookingDialog.querySelector('.booking-outlets').appendChild(link);
    });
    document.body.appendChild(bookingDialog);
    var bookingOpener;
    bookingTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        bookingOpener = trigger;
        bookingDialog.showModal();
      });
    });
    bookingDialog.querySelector('.booking-close').addEventListener('click', function () { bookingDialog.close(); });
    bookingDialog.addEventListener('click', function (event) {
      var rect = bookingDialog.getBoundingClientRect();
      if (event.target === bookingDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) bookingDialog.close();
    });
    bookingDialog.addEventListener('close', function () { if (bookingOpener) bookingOpener.focus(); });
  }
  var nav = document.querySelector('.nav');

  // Mobile menu toggle
  var toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    function setMenuOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }
    toggle.addEventListener('click', function () { setMenuOpen(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) { setMenuOpen(false); toggle.focus(); }
    });
    nav.querySelectorAll('.nav__panel a').forEach(function (a) {
      a.addEventListener('click', function () { setMenuOpen(false); });
    });
  }

  // Solid navbar on scroll (transparent over hero)
  if (nav && !nav.classList.contains('always-solid')) {
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add('solid');
      else nav.classList.remove('solid');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Opposing scroll entrances. Observe only until visible; no scroll polling.
  var revealMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pendingReveals = new Set();
  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) finishReveal(entry.target);
    });
  }, { threshold:0, rootMargin:'0px 0px -32px 0px' }) : null;
  function finishReveal(element) {
    element.classList.add('scroll-arrived');
    pendingReveals.delete(element);
    if (revealObserver) revealObserver.unobserve(element);
  }
  function prepareReveals() {
    // Remove the former parent animation so children can enter independently.
    document.querySelectorAll('[data-reveal]').forEach(function (element) {
      element.removeAttribute('data-reveal');
      element.classList.add('in');
    });
    pendingReveals.forEach(function (element) {
      if (!element.isConnected) { revealObserver.unobserve(element); pendingReveals.delete(element); }
    });
    var selectors = '.sec-head, .split__media, .split__body, .gitem__media, .gitem__body, .o-card, .c-card, .func, .mcat, .teaser-grid figure, .spread figure, .more-gallery__item, .care .item, .reviews__score, .reviews__body, .cta-strip, .contact-side, .menu-intro__copy, .food-stage, .step-heading, .outlet-picker button, .type-heading, .dish-group, .proposal, .menu-ending, .enq-phones a';
    document.querySelectorAll(selectors).forEach(function (element, index) {
      if (element.classList.contains('scroll-entry')) return;
      var text = element.matches('.sec-head, .split__body, .gitem__body, .reviews__body, .menu-intro__copy, .step-heading, .type-heading, .menu-ending');
      var media = element.matches('.split__media, .gitem__media, .reviews__score, .food-stage');
      element.classList.add('scroll-entry');
      element.dataset.enter = text ? 'left' : media ? 'right' : index % 2 ? 'left' : 'right';
      if (!revealObserver || revealMotion.matches) { finishReveal(element); return; }
      pendingReveals.add(element);
      revealObserver.observe(element);
    });
  }
  prepareReveals();
  document.addEventListener('wa:menu-rendered', prepareReveals);
  document.addEventListener('focusin', function (event) {
    var entry = event.target.closest('.scroll-entry');
    if (entry) finishReveal(entry);
  });
  revealMotion.addEventListener('change', function () {
    if (revealMotion.matches) pendingReveals.forEach(finishReveal);
  });

  // Hero entrance — plays after the 3D intro dollies away (or immediately if no intro)
  var hero = document.querySelector('.hero');
  function playHero() { if (hero) hero.classList.add('in'); }
  if (document.getElementById('intro')) {
    document.addEventListener('wa:enter', playHero);
  } else {
    // slight delay so the reveal reads as intentional
    setTimeout(playHero, 120);
  }

  // Hero parallax (subtle drift of the media on scroll)
  var heroMedia = document.querySelector('.hero__media');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroMedia && !reduce) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroMedia.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.05)';
    }, { passive: true });
  }

  // Pointer-driven 3D. Cards spring toward the cursor, lift off the page, catch a moving
  // glare and let their photo drift for parallax; the hero and menu food stage split into
  // layers that move at different depths. One rAF loop runs only while something is still
  // settling, so idle pages do no animation work.
  var depthMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var depthPointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  var depthSelector = '.o-card, .c-card, .func, .mcat, .gitem__media, .split__media, .proposal, .outlet-picker button';
  var depthScenes = [
    { root:'.hero', layers:[['.hero__media', -16], ['.hero__inner', 8], ['.hero__badge', 18]] },
    { root:'.food-stage', layers:[['.stage-orbit', -10], ['.food-stage__main', 14], ['.food-stage__small', 30], ['.stage-seal', 42]] }
  ];
  var DEPTH_EASE = 0.12;
  var depthCards = new Map(), depthHover = null, depthFrame = 0;
  var sceneStates = [], sceneHover = null;
  depthScenes.forEach(function (scene) {
    var root = document.querySelector(scene.root);
    if (!root) return;
    sceneStates.push({
      root:root, x:0, y:0, tx:0, ty:0, live:false,
      layers:scene.layers.map(function (layer) { return [root.querySelector(layer[0]), layer[1]]; }).filter(function (layer) { return layer[0]; })
    });
  });
  function depthEnabled(event) {
    return !depthMotion.matches && depthPointer.matches && (!event || event.pointerType !== 'touch');
  }
  function depthKick() { if (!depthFrame) depthFrame = requestAnimationFrame(depthTick); }
  function cardState(card) {
    var state = depthCards.get(card);
    if (state) return state;
    state = { x:0, y:0, l:0, tx:0, ty:0, tl:0 };
    if (!card.querySelector(':scope > .depth-glare')) {
      var glare = document.createElement('span');
      glare.className = 'depth-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }
    card.classList.add('depth-active');
    depthCards.set(card, state);
    return state;
  }
  function releaseCard(card) {
    var state = card && depthCards.get(card);
    if (state) { state.tx = 0; state.ty = 0; state.tl = 0; depthKick(); }
  }
  function releaseAll() {
    depthCards.forEach(function (state, card) { releaseCard(card); });
    sceneStates.forEach(function (scene) { scene.tx = 0; scene.ty = 0; });
    depthHover = null; sceneHover = null;
    depthKick();
  }
  function depthTick() {
    depthFrame = 0;
    var moving = false;
    depthCards.forEach(function (s, card) {
      s.x += (s.tx - s.x) * DEPTH_EASE;
      s.y += (s.ty - s.y) * DEPTH_EASE;
      s.l += (s.tl - s.l) * DEPTH_EASE;
      if (!s.tl && Math.abs(s.x) < 0.004 && Math.abs(s.y) < 0.004 && s.l < 0.004) {
        card.classList.remove('depth-active');
        ['--dx', '--dy', '--dl', '--gx', '--gy'].forEach(function (name) { card.style.removeProperty(name); });
        depthCards.delete(card);
        return;
      }
      moving = true;
      card.style.setProperty('--dx', s.x.toFixed(4));
      card.style.setProperty('--dy', s.y.toFixed(4));
      card.style.setProperty('--dl', s.l.toFixed(4));
      card.style.setProperty('--gx', ((s.x + 1) * 50).toFixed(1) + '%');
      card.style.setProperty('--gy', ((s.y + 1) * 50).toFixed(1) + '%');
    });
    sceneStates.forEach(function (scene) {
      if (!scene.live && !scene.tx && !scene.ty) return;
      scene.x += (scene.tx - scene.x) * DEPTH_EASE * 0.7;
      scene.y += (scene.ty - scene.y) * DEPTH_EASE * 0.7;
      var settled = !scene.tx && !scene.ty && Math.abs(scene.x) < 0.002 && Math.abs(scene.y) < 0.002;
      scene.layers.forEach(function (layer) {
        layer[0].style.translate = settled ? '' : (scene.x * layer[1]).toFixed(2) + 'px ' + (scene.y * layer[1]).toFixed(2) + 'px';
      });
      scene.live = !settled;
      if (scene.live) moving = true;
    });
    if (moving) depthKick();
  }
  document.addEventListener('pointermove', function (event) {
    if (!depthEnabled(event)) return;
    var card = event.target.closest(depthSelector);
    if (depthHover && depthHover !== card) releaseCard(depthHover);
    depthHover = card;
    if (card) {
      var rect = card.getBoundingClientRect();
      var s = cardState(card);
      s.tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      s.ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      s.tl = 1;
    }
    var scene = null;
    for (var i = 0; i < sceneStates.length; i++) if (sceneStates[i].root.contains(event.target)) scene = sceneStates[i];
    if (sceneHover && sceneHover !== scene) { sceneHover.tx = 0; sceneHover.ty = 0; }
    sceneHover = scene;
    if (scene) {
      var box = scene.root.getBoundingClientRect();
      scene.tx = (event.clientX - box.left) / box.width * 2 - 1;
      scene.ty = (event.clientY - box.top) / box.height * 2 - 1;
      scene.live = true;
    }
    depthKick();
  }, { passive:true });
  document.addEventListener('pointerout', function (event) { if (!event.relatedTarget) releaseAll(); });
  window.addEventListener('blur', releaseAll);
  window.addEventListener('scroll', function () { if (depthHover) { releaseCard(depthHover); depthHover = null; } }, { passive:true });
  depthMotion.addEventListener('change', releaseAll);
  depthPointer.addEventListener('change', releaseAll);
})();
