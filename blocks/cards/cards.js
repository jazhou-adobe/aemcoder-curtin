export default async function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');

  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');

    // First cell is image
    const imgCell = cells[0];
    if (imgCell) {
      const picture = imgCell.querySelector('picture');
      if (picture) {
        card.appendChild(picture);
      }
    }

    // Second cell is caption text
    const textCell = cells[1];
    if (textCell) {
      const caption = document.createElement('div');
      caption.className = 'cards-caption';
      caption.innerHTML = textCell.innerHTML;
      card.appendChild(caption);
    }

    container.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(container);
}
