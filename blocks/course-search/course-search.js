export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: Heading (h2) — leave as-is
  // Row 1: Search placeholder text — transform into search bar
  // Row 2: Study areas heading (h4) — leave as-is
  // Rows 3+: Study area tiles (each row has up to 4 cells)

  // Transform Row 1 into a functional search bar
  const searchRow = rows[1];
  if (searchRow) {
    const placeholderText = searchRow.textContent.trim();
    searchRow.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'search-bar-container';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'search-icon';
    iconWrap.innerHTML = '<span class="icon icon-magnify-thick"><img data-icon-name="magnify-thick" src="/icons/magnify-thick.svg" alt="" loading="lazy"></span>';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = placeholderText;
    input.setAttribute('aria-label', 'Search courses');

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Search';
    button.addEventListener('click', () => {
      window.location.href = '/study/game-design-and-art';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = '/study/game-design-and-art';
      }
    });

    container.append(iconWrap, input, button);
    searchRow.append(container);
  }

  // Transform Row 2 into study areas heading
  const headingRow = rows[2];
  if (headingRow) {
    headingRow.className = 'study-areas-heading';
  }

  // Transform study area rows (3+) into a single grid
  const gridContainer = document.createElement('div');
  gridContainer.className = 'study-areas-grid';

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    const cells = [...row.children];
    cells.forEach((cell) => {
      const link = cell.querySelector('a');
      if (!link) return;

      const areaLink = document.createElement('a');
      areaLink.href = link.href;
      areaLink.setAttribute('aria-label', `explore ${link.textContent.trim()}`);

      const icon = cell.querySelector('.icon');
      if (icon) areaLink.append(icon.cloneNode(true));

      const textSpan = document.createElement('span');
      textSpan.textContent = link.textContent.trim();
      areaLink.append(textSpan);

      gridContainer.append(areaLink);
    });
    row.remove();
  }

  block.append(gridContainer);
}
