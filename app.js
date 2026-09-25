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

  // A single delegated, frame-limited tilt controller. Idle pages do no animation work.
  var depthMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var depthPointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  var depthTarget = null, depthFrame = 0, depthX = 0, depthY = 0, depthRect;
  var depthSelector = '.o-card, .c-card, .func, .mcat, .gitem__media, .split__media, .proposal';
  function clearDepth() {
    cancelAnimationFrame(depthFrame);
    depthFrame = 0;
    if (depthTarget) {
      depthTarget.classList.remove('depth-active');
      depthTarget.style.removeProperty('--depth-x');
      depthTarget.style.removeProperty('--depth-y');
    }
    depthTarget = null;
  }
  document.addEventListener('pointermove', function (event) {
    if (depthMotion.matches || !depthPointer.matches || event.pointerType === 'touch') return;
    var target = event.target.closest(depthSelector);
    if (!target) { if (depthTarget) clearDepth(); return; }
    if (target !== depthTarget) {
      clearDepth();
      depthTarget = target;
      depthRect = target.getBoundingClientRect();
    }
    depthX = Math.max(-1, Math.min(1, (event.clientX - depthRect.left) / depthRect.width * 2 - 1));
    depthY = Math.max(-1, Math.min(1, (event.clientY - depthRect.top) / depthRect.height * 2 - 1));
    if (!depthFrame) depthFrame = requestAnimationFrame(function () {
      depthFrame = 0;
      if (!depthTarget) return;
      depthTarget.style.setProperty('--depth-x', (-depthY * 3).toFixed(2) + 'deg');
      depthTarget.style.setProperty('--depth-y', (depthX * 3).toFixed(2) + 'deg');
      depthTarget.classList.add('depth-active');
    });
  }, { passive:true });
  document.addEventListener('pointerout', function (event) { if (!event.relatedTarget) clearDepth(); });
  window.addEventListener('blur', clearDepth);
  window.addEventListener('scroll', function () { if (depthTarget) clearDepth(); }, { passive:true });
  depthMotion.addEventListener('change', clearDepth);
  depthPointer.addEventListener('change', clearDepth);
})();
