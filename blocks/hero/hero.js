export default async function decorate(block) {
  const rows = [...block.children];

  // Make first slide active
  if (rows.length > 0) {
    rows[0].classList.add('active');
  }

  // Create navigation dots if multiple slides
  if (rows.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'hero-nav';

    rows.forEach((row, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Slide ${i + 1} of ${rows.length}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        rows.forEach((r) => r.classList.remove('active'));
        nav.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        row.classList.add('active');
        dot.classList.add('active');
      });
      nav.append(dot);
    });

    block.append(nav);

    // Auto-rotate every 6 seconds
    let current = 0;
    setInterval(() => {
      current = (current + 1) % rows.length;
      rows.forEach((r) => r.classList.remove('active'));
      nav.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      rows[current].classList.add('active');
      nav.querySelectorAll('button')[current].classList.add('active');
    }, 6000);
  }
}
