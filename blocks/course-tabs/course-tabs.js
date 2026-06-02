export default async function decorate(block) {
  const rows = [...block.children];

  // First N rows are tab labels, remaining rows are tab content panels
  const tabLabels = [];
  const tabPanels = [];

  // First row: if all cells are short plain text with no block content, it's the tab labels row
  const firstRow = rows[0];
  const firstRowCells = firstRow ? [...firstRow.children] : [];
  const isLabelsRow = firstRowCells.length > 0 && firstRowCells.every((cell) => {
    const text = cell.textContent.trim();
    return text.length < 60 && !cell.querySelector('h1,h2,h3,h4,h5,h6,ul,ol,picture,img,a') && cell.querySelectorAll('p').length <= 1;
  });

  if (isLabelsRow) {
    firstRowCells.forEach((cell) => {
      tabLabels.push({ label: cell.textContent.trim(), row: firstRow });
    });
    rows.slice(1).forEach((row) => tabPanels.push({ row }));
  } else {
    rows.forEach((row) => tabPanels.push({ row }));
  }

  // Build tab UI
  const tabContainer = document.createElement('div');
  tabContainer.className = 'course-tabs__container';

  // Tab navigation
  const tabNav = document.createElement('div');
  tabNav.className = 'course-tabs__nav';
  tabNav.setAttribute('role', 'tablist');

  tabLabels.forEach((tab, i) => {
    const button = document.createElement('button');
    button.className = 'course-tabs__tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `course-tab-panel-${i}`);
    button.id = `course-tab-${i}`;
    button.textContent = tab.label;
    if (i === 0) button.classList.add('active');
    tabNav.appendChild(button);
    tab.row.remove();
  });

  // Tab panels
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'course-tabs__panels';

  tabPanels.forEach((panel, i) => {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'course-tabs__panel';
    panelDiv.setAttribute('role', 'tabpanel');
    panelDiv.setAttribute('aria-labelledby', `course-tab-${i}`);
    panelDiv.id = `course-tab-panel-${i}`;
    if (i !== 0) panelDiv.hidden = true;

    // Move content from original row into the panel
    const cells = [...panel.row.children];
    const contentFragment = document.createDocumentFragment();
    cells.forEach((cell) => {
      contentFragment.append(...cell.childNodes);
    });
    // Remove tab-identifier paragraphs (e.g. "tab-major-overview")
    [...contentFragment.querySelectorAll('p')].forEach((p) => {
      if (/^tab-/.test(p.textContent.trim())) p.remove();
    });

    // Split content by H2 headings into sections with alternating backgrounds
    const tempDiv = document.createElement('div');
    tempDiv.append(contentFragment);
    const children = [...tempDiv.childNodes];

    const sections = [];
    let currentSection = [];

    children.forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'H2' && currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
      currentSection.push(node);
    });
    if (currentSection.length > 0) sections.push(currentSection);

    sections.forEach((sectionNodes, si) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'course-tabs__section';
      if (si % 2 === 1) sectionDiv.classList.add('course-tabs__section--alt');

      const inner = document.createElement('div');
      inner.className = 'course-tabs__section-inner';
      sectionNodes.forEach((n) => inner.appendChild(n));

      // Detect "Why study" section: has h2 + multiple h3+p pairs, no lists
      const h2 = inner.querySelector('h2');
      const h3s = inner.querySelectorAll('h3');
      const lists = inner.querySelectorAll('ul, ol');
      if (h2 && h3s.length >= 3 && lists.length === 0) {
        sectionDiv.classList.add('course-tabs__section--value-props');
        // Create grid from h3+p pairs
        const grid = document.createElement('div');
        grid.className = 'course-tabs__value-props-grid';
        h3s.forEach((h3El) => {
          const prop = document.createElement('div');
          prop.className = 'course-tabs__value-prop';
          const nextP = h3El.nextElementSibling;
          prop.appendChild(h3El);
          if (nextP && nextP.tagName === 'P') prop.appendChild(nextP);
          grid.appendChild(prop);
        });
        inner.appendChild(grid);
      }

      sectionDiv.appendChild(inner);
      panelDiv.appendChild(sectionDiv);
    });

    panel.row.remove();
    panelsContainer.appendChild(panelDiv);
  });

  tabContainer.appendChild(tabNav);
  tabContainer.appendChild(panelsContainer);
  block.textContent = '';
  block.appendChild(tabContainer);

  // Tab switching
  tabNav.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('[role="tab"]');
    if (!clickedTab) return;

    const tabs = tabNav.querySelectorAll('[role="tab"]');
    const panels = panelsContainer.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('active');
    });
    panels.forEach((p) => { p.hidden = true; });

    clickedTab.setAttribute('aria-selected', 'true');
    clickedTab.classList.add('active');
    const index = [...tabs].indexOf(clickedTab);
    panels[index].hidden = false;
  });

  // Keyboard navigation
  tabNav.addEventListener('keydown', (e) => {
    const tabs = [...tabNav.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;

    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;

    if (next >= 0) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  });
}
