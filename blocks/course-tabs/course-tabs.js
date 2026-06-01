async function decorateNestedBlocks(panel) {
  const { loadBlock } = await import('../../scripts/aem.js');
  const nestedBlocks = [...panel.querySelectorAll('[class]:not([data-block-status])')].filter((el) => {
    const classes = [...el.classList];
    return classes.some((c) => c !== 'icon' && !c.startsWith('icon-'));
  });
  for (const nested of nestedBlocks) {
    nested.dataset.blockName = nested.className.split(' ')[0];
    nested.dataset.blockStatus = 'initialized';
    try {
      await loadBlock(nested);
    } catch (e) {
      // ignore if block not found
    }
  }
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row = tab navigation labels
  const tabNav = rows[0];
  const tabButtons = [...tabNav.children];

  // Remaining rows = tab panels (each has: [id-cell, content-cell])
  const tabPanels = rows.slice(1);

  // Activate first tab by default
  if (tabButtons.length > 0) {
    tabButtons[0].classList.add('active');
  }
  if (tabPanels.length > 0) {
    tabPanels[0].classList.add('active');
  }

  // Add click handlers
  tabButtons.forEach((btn, index) => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('tabindex', index === 0 ? '0' : '-1');

    btn.addEventListener('click', () => {
      // Deactivate all
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });
      tabPanels.forEach((p) => p.classList.remove('active'));

      // Activate clicked
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
      if (tabPanels[index]) {
        tabPanels[index].classList.add('active');
      }
    });
  });

  // Set role attributes on panels
  tabPanels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
  });

  // Decorate any nested blocks (e.g. article-cards inside tab content)
  for (const panel of tabPanels) {
    await decorateNestedBlocks(panel);
  }

  // Add ARIA role to tab nav
  tabNav.setAttribute('role', 'tablist');

  // Enhance the "Why study at Curtin?" section with card layout
  tabPanels.forEach((panel) => {
    const contentCell = panel.querySelector('div:last-child');
    if (!contentCell) return;

    // Find the "Why study at Curtin?" heading and create card grid
    const headings = [...contentCell.querySelectorAll('h2')];
    const whyHeading = headings.find((h) => h.textContent.includes('Why study at Curtin'));
    if (!whyHeading) return;

    // Collect the cards (h3 + p pairs after "Why study at Curtin?")
    const cards = [];
    let el = whyHeading.nextElementSibling;
    while (el && el.tagName !== 'H2') {
      if (el.tagName === 'H3') {
        const cardTitle = el.textContent.trim();
        const nextEl = el.nextElementSibling;
        const cardDesc = (nextEl && nextEl.tagName === 'P') ? nextEl.textContent.trim() : '';
        cards.push({ title: cardTitle, desc: cardDesc });
      }
      el = el.nextElementSibling;
    }

    if (cards.length === 0) return;

    // Build the card grid
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'why-study-cards';
    cards.forEach((card) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card-item';
      cardEl.innerHTML = `<h3>${card.title}</h3><p>${card.desc}</p>`;
      cardsContainer.appendChild(cardEl);
    });

    // Remove original elements and insert card grid
    const elementsToRemove = [];
    let current = whyHeading;
    while (current && current.tagName !== 'H2') {
      elementsToRemove.push(current);
      current = current.nextElementSibling;
    }
    // Also handle case where next heading follows
    if (current && current !== whyHeading) {
      // Don't remove the next H2
    }

    // Insert cards after removing originals
    const insertPoint = whyHeading;
    elementsToRemove.forEach((removeEl) => {
      if (removeEl !== whyHeading) removeEl.remove();
    });
    whyHeading.after(cardsContainer);

    // Remove the individual h3/p that are now in cards
    let removeEl = cardsContainer.nextElementSibling;
    while (removeEl && removeEl.tagName !== 'H2') {
      const next = removeEl.nextElementSibling;
      removeEl.remove();
      removeEl = next;
    }
  });
}
