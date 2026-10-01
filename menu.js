(() => {
  const outlets = {
    hari: { name: 'Hari Nagar', phone: '+919873347347', menu: 'https://woodland-affairs.godirekt.in/spark/app/#/mainpage', image: 'images/amb-hari-green.jpg' },
    dwarka: { name: 'Dwarka', phone: '+919873798727', menu: 'https://woodland-affairs-dwarka.godirekt.in/spark/app/#/mainpage', image: 'images/wa-dwarka.jpg' },
    janakpuri: { name: 'Janakpuri · Eatery Royale', phone: '+919990283002', menu: 'https://eateryroyale.godirekt.in/spark/app/#/mainpage', image: 'images/wa-janakpuri.jpg' }
  };
  let outlet = 'hari', type = 'carte';
  let page = 0, turning = false, turnTimer = 0;
  let swipe = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const results = document.getElementById('menu-results');
  function notebookPage() {
    const pages = window.woodlandMenus[outlet];
    const [heading, dishes] = pages[page];
    const sheet = results.querySelector('.notebook__sheet');
    if (!sheet) return;
    sheet.innerHTML = `<span class="notebook__eyebrow">${outlets[outlet].name} · À la carte</span><h3>${heading}</h3><ul>${dishes.map(dish => `<li>${dish}</li>`).join('')}</ul><span class="notebook__folio">${String(page + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}</span>`;
    sheet.scrollTop = 0;
    results.querySelector('[data-page="prev"]').disabled = page === 0;
    results.querySelector('[data-page="next"]').disabled = page === pages.length - 1;
    results.querySelector('.notebook__progress').textContent = `Page ${page + 1} of ${pages.length}`;
  }
  function turnPage(direction) {
    const next = page + direction;
    if (turning || next < 0 || next >= window.woodlandMenus[outlet].length) return;
    if (reduceMotion.matches) { page = next; notebookPage(); return; }
    turning = true;
    const sheet = results.querySelector('.notebook__sheet');
    sheet.classList.add(direction > 0 ? 'turn-forward' : 'turn-backward');
    turnTimer = setTimeout(() => {
      page = next;
      notebookPage();
      turnTimer = setTimeout(() => {
        sheet.classList.remove('turn-forward', 'turn-backward');
        turning = false;
      }, 310);
    }, 290);
  }
  function buffetCard(menu, index) {
    return `<details class="buffet-card" ${index === 0 ? 'open' : ''}><summary><span class="buffet-card__number">${String(index + 1).padStart(2, '0')}</span><span class="buffet-card__identity"><strong>${menu.title}</strong><small>${menu.terms}</small></span><span class="buffet-card__toggle" aria-hidden="true">+</span></summary><div class="buffet-card__body">${menu.sections.map(([name, items]) => `<section><h4>${name}</h4><p>${items}</p></section>`).join('')}</div></details>`;
  }
  function render() {
    clearTimeout(turnTimer);
    turning = false;
    swipe = null;
    const selected = outlets[outlet];
    let body;
    if (type === 'carte') {
      body = `<p class="menu-notice">Turn the pages to explore selected dishes from ${selected.name}. Prices are available in the <a href="${selected.menu}" target="_blank" rel="noopener noreferrer">full digital menu ↗</a>.</p><div class="notebook" aria-label="${selected.name} à la carte notebook"><div class="notebook__inside"><span class="menu-kicker">The menu book</span><h3>Good food,<br><em>page by page.</em></h3><p>Explore the flavours of ${selected.name}.</p><span class="notebook__swipe-hint" aria-hidden="true">← Swipe the pages →</span><span class="notebook__ornament" aria-hidden="true">✳</span></div><div class="notebook__sheet" aria-live="polite"></div></div><div class="notebook__controls"><button type="button" data-page="prev" aria-label="Previous menu page">← Previous page</button><span class="notebook__progress"></span><button type="button" data-page="next" aria-label="Next menu page">Next page →</button></div>`;
    } else {
      body = outlet === 'janakpuri'
        ? `<div class="buffet-unavailable"><h3>Planning a buffet in Janakpuri?</h3><p>The supplied buffet packages apply to Hari Nagar and Dwarka. Contact Eatery Royale for its current group dining options.</p><a class="btn btn--brass" href="tel:${selected.phone}">Call Eatery Royale ↗</a></div>`
        : `<p class="menu-notice">These five packages are for Hari Nagar and Dwarka. Select a package to see its dishes and terms. Please confirm availability when booking.</p><div class="buffet-list">${window.woodlandBuffets.map(buffetCard).join('')}</div>`;
    }
    results.innerHTML = `<div class="menu-title"><h2>${type === 'carte' ? 'À la carte' : 'Buffet menus'}</h2><small>${selected.name} / ${type === 'carte' ? 'Selected dishes' : 'Group dining'}</small></div>${body}`;
    if (type === 'carte') notebookPage();
    const call = document.getElementById('outlet-call');
    call.href = 'tel:' + selected.phone;
    call.textContent = 'Speak to ' + selected.name + ' ↗';
    document.dispatchEvent(new Event('wa:menu-rendered'));
  }
  document.querySelectorAll('[data-outlet]').forEach(button => button.addEventListener('click', () => {
    outlet = button.dataset.outlet;
    page = 0;
    document.querySelectorAll('[data-outlet]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {
    type = button.dataset.type;
    document.querySelectorAll('[data-type]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  results.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (button) turnPage(button.dataset.page === 'next' ? 1 : -1);
  });
  results.addEventListener('touchstart', event => {
    const sheet = event.target.closest('.notebook__sheet');
    if (!sheet || turning || event.touches.length !== 1) return;
    swipe = { sheet, x:event.touches[0].clientX, y:event.touches[0].clientY, dragging:false };
  }, { passive:true });
  results.addEventListener('touchmove', event => {
    if (!swipe || event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - swipe.x;
    const dy = event.touches[0].clientY - swipe.y;
    if (!swipe.dragging && Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx) * 1.2) { swipe = null; return; }
    if (Math.abs(dx) < 8) return;
    const direction = dx < 0 ? 1 : -1;
    if (page + direction < 0 || page + direction >= window.woodlandMenus[outlet].length) return;
    event.preventDefault();
    swipe.dragging = true;
    swipe.sheet.classList.add('is-dragging');
    swipe.sheet.style.setProperty('--drag', String(Math.max(-0.8, Math.min(0.8, dx / swipe.sheet.clientWidth))));
  }, { passive:false });
  function finishSwipe(event) {
    if (!swipe) return;
    const current = swipe;
    swipe = null;
    current.sheet.classList.remove('is-dragging');
    current.sheet.style.removeProperty('--drag');
    if (event.type === 'touchcancel' || !current.dragging || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - current.x;
    if (Math.abs(dx) >= 55) turnPage(dx < 0 ? 1 : -1);
  }
  results.addEventListener('touchend', finishSwipe, { passive:true });
  results.addEventListener('touchcancel', finishSwipe, { passive:true });
  render();
})();
