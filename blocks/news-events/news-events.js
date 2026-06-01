export default async function decorate(block) {
  const rows = [...block.children];
  const tabs = [];
  let currentTab = null;

  // Parse rows into tab groups
  // Structure: tab-label row, then card rows, then CTA row, repeat
  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];

    // Check if this is a tab label row (single cell with just text, no image or link)
    const hasImage = firstCell.querySelector('picture, img');
    const hasLink = firstCell.querySelector('a');
    const text = firstCell.textContent.trim();

    if (!hasImage && !hasLink && cells.length === 1 && text.length < 20) {
      // This is a tab label
      currentTab = { label: text, cards: [], cta: null };
      tabs.push(currentTab);
    } else if (currentTab && firstCell.querySelector('.button-wrapper, .button')) {
      // CTA row
      const link = firstCell.querySelector('a');
      if (link) {
        currentTab.cta = { href: link.href, text: link.textContent.trim() };
      }
    } else if (currentTab && cells.length === 2) {
      // Card row: image cell + content cell
      const imgCell = cells[0];
      const contentCell = cells[1];
      const img = imgCell.querySelector('img');
      const h3 = contentCell.querySelector('h3');
      const link = contentCell.querySelector('a');
      const paragraphs = [...contentCell.querySelectorAll('p')];
      const title = h3 ? h3.textContent.trim() : '';
      const href = link ? link.href : '';

      // Get excerpt and date from paragraphs
      let excerpt = '';
      let date = '';
      paragraphs.forEach((p) => {
        const pText = p.textContent.trim();
        if (pText.match(/^\d{1,2}\s\w+\s\d{4}$|^FROM:/)) {
          date = pText;
        } else if (pText.length > 0) {
          excerpt = pText;
        }
      });

      currentTab.cards.push({
        img: img ? img.cloneNode(true) : null,
        title,
        href,
        excerpt,
        date,
      });
    }
  });

  // Build the tabbed UI
  block.textContent = '';

  // Header row: tabs + CTA
  const header = document.createElement('div');
  header.className = 'news-events-header';

  const tabNav = document.createElement('div');
  tabNav.className = 'news-events-tabs';
  const tabList = document.createElement('ul');
  tabList.setAttribute('role', 'tablist');

  // CTA container (shows CTA of active tab)
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'news-events-cta';

  function updateCTA(index) {
    ctaContainer.textContent = '';
    const tab = tabs[index];
    if (tab && tab.cta) {
      const ctaLink = document.createElement('a');
      ctaLink.href = tab.cta.href;
      ctaLink.textContent = tab.cta.text;
      ctaContainer.append(ctaLink);
    }
  }

  tabs.forEach((tab, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `tabpanel-${tab.label.toLowerCase()}`);
    btn.textContent = tab.label;
    if (index === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      // Deactivate all
      tabList.querySelectorAll('[role=tab]').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      block.querySelectorAll('.news-events-panel').forEach((p) => {
        p.classList.remove('active');
      });
      // Activate clicked
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = block.querySelector(`#tabpanel-${tab.label.toLowerCase()}`);
      if (panel) panel.classList.add('active');
      updateCTA(index);
    });
    li.append(btn);
    tabList.append(li);
  });

  tabNav.append(tabList);
  header.append(tabNav);
  header.append(ctaContainer);
  block.append(header);
  updateCTA(0);

  // Tab panels
  tabs.forEach((tab, index) => {
    const panel = document.createElement('div');
    panel.className = `news-events-panel${index === 0 ? ' active' : ''}`;
    panel.id = `tabpanel-${tab.label.toLowerCase()}`;
    panel.setAttribute('role', 'tabpanel');

    // Carousel container
    const carousel = document.createElement('div');
    carousel.className = 'news-events-carousel';

    const track = document.createElement('div');
    track.className = 'news-events-track';

    tab.cards.forEach((card) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'news-events-card';

      if (card.img) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'news-events-card-image';
        const link = document.createElement('a');
        link.href = card.href;
        link.append(card.img);
        imgWrap.append(link);
        cardEl.append(imgWrap);
      }

      const content = document.createElement('div');
      content.className = 'news-events-card-content';

      if (card.title) {
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = card.href;
        a.textContent = card.title;
        h3.append(a);
        content.append(h3);
      }

      if (card.excerpt) {
        const p = document.createElement('p');
        p.className = 'news-events-excerpt';
        p.textContent = card.excerpt;
        content.append(p);
      }

      if (card.date) {
        const time = document.createElement('p');
        time.className = 'news-events-date';
        time.textContent = card.date;
        content.append(time);
      }

      cardEl.append(content);
      track.append(cardEl);
    });

    carousel.append(track);
    panel.append(carousel);

    // Footer row: progress bar + nav arrows
    const footer = document.createElement('div');
    footer.className = 'news-events-footer';

    const progress = document.createElement('div');
    progress.className = 'news-events-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'news-events-progress-bar';
    progress.append(progressBar);
    footer.append(progress);

    const nav = document.createElement('div');
    nav.className = 'news-events-nav';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'news-events-prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.textContent = '\u2039';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'news-events-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.textContent = '\u203A';

    let offset = 0;
    const cardWidth = 370;
    const gap = 24;
    const maxOffset = Math.max(0, tab.cards.length - 3);

    function updateCarousel() {
      track.style.transform = `translateX(-${offset * (cardWidth + gap)}px)`;
      prevBtn.disabled = offset === 0;
      nextBtn.disabled = offset >= maxOffset;
      // Update progress bar
      const pct = maxOffset > 0 ? ((offset + 1) / (maxOffset + 1)) * 100 : 100;
      progressBar.style.width = `${pct}%`;
    }

    prevBtn.addEventListener('click', () => {
      if (offset > 0) { offset -= 1; updateCarousel(); }
    });
    nextBtn.addEventListener('click', () => {
      if (offset < maxOffset) { offset += 1; updateCarousel(); }
    });

    nav.append(prevBtn, nextBtn);
    footer.append(nav);
    panel.append(footer);
    updateCarousel();

    block.append(panel);
  });
}
