(() => {
  const outlets = {
    hari: { name: 'Hari Nagar', phone: '+919873347347', menu: 'https://woodland-affairs.godirekt.in/spark/app/#/mainpage', image: 'images/amb-hari-green.jpg' },
    dwarka: { name: 'Dwarka', phone: '+919873798727', menu: 'https://woodland-affairs-dwarka.godirekt.in/spark/app/#/mainpage', image: 'images/wa-dwarka.jpg' },
    janakpuri: { name: 'Janakpuri · Eatery Royale', phone: '+919990283002', menu: 'https://eateryroyale.godirekt.in/spark/app/#/mainpage', image: 'images/wa-janakpuri.jpg' }
  };
  let outlet = 'hari', type = 'carte';
  let page = 0, turning = false, turnTimer = 0;
  let swipe = null;
  let leafAnimation = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const results = document.getElementById('menu-results');
  function notebookPage() {
    const pages = window.woodlandMenus[outlet];
    const [heading, dishes] = pages[page];
    const sheet = results.querySelector('.notebook__sheet');
    if (!sheet) return;
    sheet.innerHTML = `<div class="book-page-top"><span class="notebook__eyebrow">${outlets[outlet].name} · À la carte</span><span class="book-chapter-number" aria-hidden="true">${String(page + 1).padStart(2, '0')}</span></div><h3>${heading}</h3><div class="book-divider" aria-hidden="true">✦</div><ul>${dishes.map((dish, index) => `<li><span class="book-dish-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${dish}</span></li>`).join('')}</ul><span class="notebook__folio">WOODLAND AFFAIRS <span>${String(page + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}</span></span>`;
    sheet.scrollTop = 0;
    results.querySelector('[data-page="prev"]').disabled = page === 0;
    results.querySelector('[data-page="next"]').disabled = page === pages.length - 1;
    results.querySelector('.notebook__progress').textContent = `Page ${page + 1} of ${pages.length}`;
    results.querySelectorAll('[data-chapter]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.chapter) === page));
    });
  }
  function turnPage(direction, target) {
    const next = target === undefined ? page + direction : target;
    if (turning || next < 0 || next >= window.woodlandMenus[outlet].length) return;
    if (reduceMotion.matches) { page = next; notebookPage(); return; }
    turning = true;
    const sheet = results.querySelector('.notebook__sheet');
    const previousHTML = sheet.innerHTML;
    const previousScroll = sheet.scrollTop;
    const startAngle = parseFloat(sheet.style.getPropertyValue('--turn-start')) || 0;
    const front = sheet.cloneNode(true);
    page = next;
    notebookPage();
    if (direction < 0) {
      front.innerHTML = sheet.innerHTML;
      sheet.innerHTML = previousHTML;
      sheet.scrollTop = previousScroll;
    }
    front.removeAttribute('aria-live');
    front.className = 'notebook__sheet book-leaf-front';
    front.style.removeProperty('--turn-start');
    const leaf = document.createElement('div');
    leaf.className = 'book-turn-leaf';
    leaf.setAttribute('aria-hidden', 'true');
    leaf.style.cssText = `left:${sheet.offsetLeft}px;top:${sheet.offsetTop}px;width:${sheet.offsetWidth}px;height:${sheet.offsetHeight}px`;
    const back = document.createElement('div');
    back.className = 'book-leaf-back';
    leaf.append(front, back);
    sheet.parentElement.appendChild(leaf);
    front.scrollTop = direction > 0 ? previousScroll : 0;
    sheet.style.removeProperty('--turn-start');
    const animation = leaf.animate([
      { transform:`rotateY(${direction > 0 ? Math.min(0, startAngle) : -180}deg)` },
      { transform:`rotateY(${direction > 0 ? -180 : 0}deg)` }
    ], { duration:900, easing:'cubic-bezier(.22,.65,.18,1)', fill:'forwards' });
    leafAnimation = animation;
    animation.finished.then(() => {
      if (!leaf.isConnected) return;
      notebookPage();
      leaf.remove();
      leafAnimation = null;
      turning = false;
    }).catch(() => { leaf.remove(); });
  }
  function buffetCard(menu, index) {
    return `<details class="buffet-card" ${index === 0 ? 'open' : ''}><summary><span class="buffet-card__number">${String(index + 1).padStart(2, '0')}</span><span class="buffet-card__identity"><strong>${menu.title}</strong><small>${menu.terms}</small></span><span class="buffet-card__toggle" aria-hidden="true">+</span></summary><div class="buffet-card__body">${menu.sections.map(([name, items]) => `<section><h4>${name}</h4><p>${items}</p></section>`).join('')}</div></details>`;
  }
  function render() {
    if (leafAnimation) { leafAnimation.cancel(); leafAnimation = null; }
    clearTimeout(turnTimer);
    turning = false;
    swipe = null;
    const selected = outlets[outlet];
    let body;
    if (type === 'carte') {
      body = `<p class="menu-notice">Turn the pages to explore selected dishes from ${selected.name}. Prices are available in the <a href="${selected.menu}" target="_blank" rel="noopener noreferrer">full digital menu ↗</a>.</p><div class="book-chapters" role="group" aria-label="Menu chapters">${window.woodlandMenus[outlet].map(([heading], index) => `<button type="button" data-chapter="${index}" aria-pressed="${index === page}"><span>${String(index + 1).padStart(2, '0')}</span>${heading}</button>`).join('')}</div><div class="notebook" tabindex="0" aria-label="${selected.name} à la carte menu book" style="--book-photo:url('${selected.image}')"><div class="notebook__inside"><span class="book-edition">WOODLAND AFFAIRS<span>THE DINING COLLECTION</span></span><div class="book-cover-copy"><span class="menu-kicker">${selected.name}</span><h3>Good food,<br><em>page by page.</em></h3><p>Explore the flavours of ${selected.name}.</p></div><span class="book-cover-seal" aria-hidden="true">✦<span>EST. FOR GOOD TIMES</span></span><span class="book-cover-bottom">A LITTLE WILD. A LOT DELICIOUS.</span></div><div class="notebook__sheet" aria-live="polite"></div></div><div class="notebook__controls"><button type="button" data-page="prev" aria-label="Previous menu page">← Previous page</button><span class="notebook__progress"></span><button type="button" data-page="next" aria-label="Next menu page">Next page →</button></div>`;
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
    const chapter = event.target.closest('[data-chapter]');
    if (chapter && Number(chapter.dataset.chapter) !== page) turnPage(Number(chapter.dataset.chapter) > page ? 1 : -1, Number(chapter.dataset.chapter));
  });
  results.addEventListener('keydown', event => {
    if (!event.target.closest('.notebook')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      turnPage(event.key === 'ArrowRight' ? 1 : -1);
    }
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
    if (Math.abs(dx) >= 55) {
      current.sheet.style.setProperty('--turn-start', (Math.max(-0.8, Math.min(0.8, dx / current.sheet.clientWidth)) * 55) + 'deg');
      turnPage(dx < 0 ? 1 : -1);
    }
  }
  results.addEventListener('touchend', finishSwipe, { passive:true });
  results.addEventListener('touchcancel', finishSwipe, { passive:true });
  render();
})();
