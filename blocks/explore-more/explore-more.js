export default async function decorate(block) {
  // CSS uses .explore-more as the grid — each child div is a card.
  // Just make each row clickable using the first link found in any cell.
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;
    row.style.cursor = 'pointer';
    row.setAttribute('role', 'link');
    row.setAttribute('aria-label', link.textContent.trim() || link.getAttribute('aria-label') || '');
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let native link handle it
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');
      if (target === '_blank') window.open(href, '_blank');
      else window.location.href = href;
    });
  });
}
