export default async function decorate(block) {
  // Structure: first row is title, remaining rows are stat cards
  // Each stat card row has: [icon cell (plain text icon name), text cell]
  // Convert plain text icon names to proper icon span elements
  const rows = [...block.children].slice(1); // skip title row
  rows.forEach((row) => {
    const iconCell = row.querySelector('div:first-child');
    if (!iconCell) return;
    const iconName = iconCell.textContent.trim();
    if (!iconName) return;

    const span = document.createElement('span');
    span.className = `icon icon-${iconName}`;
    const img = document.createElement('img');
    img.dataset.iconName = iconName;
    img.src = `/icons/${iconName}.svg`;
    img.alt = '';
    img.loading = 'lazy';
    span.append(img);

    iconCell.textContent = '';
    iconCell.append(span);
  });
}
