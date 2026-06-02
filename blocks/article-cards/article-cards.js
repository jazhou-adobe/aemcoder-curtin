export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const textCell = cells[1];

    const card = document.createElement('div');
    card.className = 'article-card';

    // Image
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'article-card-image';
    const img = imgCell?.querySelector('img');
    if (img) imgWrapper.appendChild(img);
    card.appendChild(imgWrapper);

    // Body
    const body = document.createElement('div');
    body.className = 'article-card-body';

    const heading = textCell?.querySelector('h3, h2');
    const link = heading?.querySelector('a') || textCell?.querySelector('a');
    const para = textCell?.querySelector('p:not(:has(a))') || [...(textCell?.querySelectorAll('p') || [])].find((p) => !p.querySelector('a'));

    if (heading) body.appendChild(heading);
    if (para) body.appendChild(para);

    // Read more link
    if (link) {
      const readMore = document.createElement('a');
      readMore.className = 'article-card-read-more';
      readMore.href = link.href;
      readMore.innerHTML = 'Read more <span class="read-more-icon">→</span>';
      body.appendChild(readMore);
    }

    card.appendChild(body);
    block.appendChild(card);
  });
}
