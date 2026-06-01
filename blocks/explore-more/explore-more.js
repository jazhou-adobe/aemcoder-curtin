export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // cells[0] = icon, cells[1] = title+desc, cells[2] = link
    const linkCell = cells[2];
    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        // Make the entire card clickable
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          const href = anchor.getAttribute('href');
          const target = anchor.getAttribute('target');
          if (target === '_blank') {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        });
        row.setAttribute('role', 'link');
        row.setAttribute('aria-label', anchor.textContent.trim());
      }
    }
  });
}
