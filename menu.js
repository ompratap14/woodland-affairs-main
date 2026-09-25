(() => {
  const outlets = {hari: ['Hari Nagar', '+919873347347'], dwarka: ['Dwarka', '+919873798727'], janakpuri: ['Janakpuri · Eatery Royale', '+919990283002']};
  let outlet = 'hari', type = 'carte';
  // Curated items transcribed from the linked Hari Nagar digital menu, 24 September 2026.
  const groups = {
    'Dal & vegetables': [['Dal Dera Peshawari',395],['Yellow Dal Tadka',375],['Dal Dhaba Style',375],['Mushroom Masala',425],['Mixed Vegetables',425],['Jeera Aloo',375]],
    'Paneer favourites': [['Paneer Methi Malai',450],['Paneer Lababdar',450],['Paneer Butter Masala',450],['Kadhai Paneer',450],['Shahi Paneer',450],['Malai Kofta Red Gravy',475]],
    'From the chicken kitchen': [['Murgh Dhaniya Adraki',525],['Murgh Tikka Lababdar',575],['Murgh Makhanwala',525],['Murgh Makhanwala Boneless',575],['Kadhai Murgh',525],['Chicken Curry',475]],
    'Rice & biryani': [['Steamed Rice',210],['Subz Biryani',275],['Murgh Biryani',425],['Gosht Biryani',495],['Jeera Rice',225],['Vegetable Pulav',250]],
    'Breads for the table': [['Tandoori Roti',45],['Tandoori Roti Buttered',55],['Parantha Laccha',95],['Naan Plain',90],['Naan Buttered',95],['Naan Garlic',110]],
    'Sip & linger': [['WA Special Cappuccino',125],['Tea',95],['Cold Coffee',150],['Oreo Shake',175],['Virgin Mojito',150],['Virgin Pina Colada',175]]
  };
  const proposals = {
    combo: [
      ['The garden table','Suggested vegetarian combo · For two',['Paneer Butter Masala','Dal Dera Peshawari','Four butter naans','Two fresh lime sodas']],
      ['The hearty pairing','Suggested chicken combo · For two',['Murgh Makhanwala','Jeera rice','Four tandoori rotis','Two virgin mojitos']],
      ['A little of everything','Suggested sharing combo · For four',['Kadhai Paneer & Mixed Vegetables','Yellow Dal Tadka','Vegetable pulav & eight rotis','Four iced teas']]
    ],
    buffet: [
      ['The garden gathering','Suggested vegetarian buffet',['Welcome drink','Paneer tikka & vegetable starters','Paneer Lababdar & Dal Dera Peshawari','Seasonal vegetables, rice & breads','Salad, raita & a dessert']],
      ['The woodland feast','Suggested mixed buffet',['Welcome drink','Chicken tikka & vegetarian starters','Murgh Makhanwala & Kadhai Paneer','Dal, rice & assorted breads','Salad, raita & two desserts']],
      ['The celebration table','Suggested event buffet',['Two welcome drink choices','Three starters to share','Two vegetarian mains & a chicken main','Dal, biryani & assorted breads','Salad selection & dessert counter']]
    ]
  };
  function render() {
    const name = outlets[outlet][0];
    const titles = {carte:'À la carte',combo:'Better, together.',buffet:'A feast to remember.'};
    let body;
    if(type === 'carte') {
      body = `<p class="menu-notice">A curated selection from the Hari Nagar digital menu. ${outlet !== 'hari' ? 'Reference menu only for this outlet; branch items and prices need confirmation. ' : 'Confirm current prices and availability with the restaurant. '}<a href="https://woodland-affairs.godirekt.in/spark/app/#/mainpage" target="_blank" rel="noopener">Explore the full original menu ↗</a></p><div class="dish-grid">${Object.entries(groups).map(([title,items]) => `<section class="dish-group"><h3>${title}</h3>${items.map(([item,price]) => `<div class="dish"><span>${item}</span><span>₹${price}</span></div>`).join('')}</section>`).join('')}</div>`;
    } else {
      body = `<div class="proposal-grid">${proposals[type].map(([title,subtitle,items])=>`<article class="proposal"><small>${type === 'combo' ? 'Combo' : 'Buffet'}</small><h3>${title}</h3><p>${subtitle.replace('Suggested ', '')}</p><ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul></article>`).join('')}</div>`;
    }
    document.getElementById('menu-results').innerHTML = `<div class="menu-title"><h2>${titles[type]}</h2><small>${name} / ${type === 'carte' ? 'Selected favourites' : 'The collection'}</small></div>${body}`;
    const call = document.getElementById('outlet-call');
    call.href = 'tel:' + outlets[outlet][1]; call.textContent = 'Speak to ' + name + ' ↗';
    document.dispatchEvent(new Event('wa:menu-rendered'));
  }
  document.querySelectorAll('[data-outlet]').forEach(button=>button.addEventListener('click',()=>{
    outlet=button.dataset.outlet;
    document.querySelectorAll('[data-outlet]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
  }));
  document.querySelectorAll('[data-type]').forEach(button=>button.addEventListener('click',()=>{
    type=button.dataset.type;
    document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
  }));
  render();
})();
