export default async function decorate(block) {
  // Each row is a card with: cell 0 = icon image, cell 1 = title + description
  const rows = [...block.children];

  // Create a single wrapper div for the grid
  const grid = document.createElement('div');

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const textCell = cells[1];

    // Create a card element as a link
    const card = document.createElement('a');
    card.className = 'card';

    // Get the link from the heading
    const link = textCell.querySelector('a');
    if (link) {
      card.href = link.href;
      if (link.target) card.target = link.target;
    }

    // Build icon container
    const iconDiv = document.createElement('div');
    iconDiv.className = 'card-icon';
    const img = iconCell.querySelector('img');
    if (img) {
      // Use the SVG as a CSS mask for coloring
      const imgSrc = img.getAttribute('src') || img.src;
      iconDiv.style.webkitMaskImage = `url(${imgSrc})`;
      iconDiv.style.maskImage = `url(${imgSrc})`;
    }

    // Build text container
    const textDiv = document.createElement('div');
    textDiv.className = 'card-text';

    const h3 = textCell.querySelector('h3');
    if (h3) {
      const newH3 = document.createElement('h3');
      newH3.textContent = h3.textContent;
      textDiv.appendChild(newH3);
    }

    const p = textCell.querySelector('p');
    if (p) {
      const newP = document.createElement('p');
      newP.textContent = p.textContent;
      textDiv.appendChild(newP);
    }

    card.appendChild(iconDiv);
    card.appendChild(textDiv);
    grid.appendChild(card);
  });

  // Replace block content with the grid
  block.textContent = '';
  block.appendChild(grid);
}
