export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1: Tags + Title
  if (rows[0]) {
    const cells = [...rows[0].children];
    // First cell contains the tags text (e.g. "Undergraduate | Major")
    if (cells[0]) {
      const tagText = cells[0].textContent.trim();
      const tagNames = tagText.split('|').map((t) => t.trim());
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'tags';
      tagNames.forEach((name, i) => {
        const span = document.createElement('span');
        span.className = i === 0 ? 'tag tag--primary' : 'tag tag--secondary';
        span.textContent = name;
        tagsContainer.appendChild(span);
      });
      cells[0].innerHTML = '';
      cells[0].appendChild(tagsContainer);
    }
    // Second cell contains the h1 - leave as is
  }
}
