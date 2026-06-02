export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: Tags — authored as "<strong>Primary</strong> Secondary"
  if (rows[0]) {
    const cell = rows[0].querySelector('div');
    if (cell) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'tags';
      const strong = cell.querySelector('strong');
      if (strong) {
        const primary = document.createElement('span');
        primary.className = 'tag tag--primary';
        primary.textContent = strong.textContent.trim();
        tagsContainer.appendChild(primary);
        // Remaining text nodes = secondary tags (split by space/comma if needed)
        const remaining = cell.textContent.replace(strong.textContent, '').trim();
        if (remaining) {
          const secondary = document.createElement('span');
          secondary.className = 'tag tag--secondary';
          secondary.textContent = remaining;
          tagsContainer.appendChild(secondary);
        }
      } else {
        // Fallback: split by pipe
        cell.textContent.split('|').map((t) => t.trim()).filter(Boolean).forEach((name, i) => {
          const span = document.createElement('span');
          span.className = i === 0 ? 'tag tag--primary' : 'tag tag--secondary';
          span.textContent = name;
          tagsContainer.appendChild(span);
        });
      }
      cell.innerHTML = '';
      cell.appendChild(tagsContainer);
    }
  }

  // Row 2 (index 2): Key info header — build header with Favourite button on the right
  if (rows[2]) {
    const cells = [...rows[2].children];
    const headerDiv = document.createElement('div');
    headerDiv.className = 'key-info-header';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'key-info-title';
    const h3 = cells[0]?.querySelector('h3');
    if (h3) titleDiv.appendChild(h3);

    const favDiv = document.createElement('div');
    favDiv.className = 'key-info-favourite';
    const favText = cells[1]?.textContent?.trim();
    if (favText) {
      const favBtn = document.createElement('button');
      favBtn.className = 'favourite-btn';
      favBtn.setAttribute('aria-label', favText);
      favBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${favText}`;
      favDiv.appendChild(favBtn);
    }

    headerDiv.appendChild(titleDiv);
    headerDiv.appendChild(favDiv);
    rows[2].innerHTML = '';
    rows[2].appendChild(headerDiv);
  }
}
