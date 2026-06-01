export default async function decorate(block) {
  // Flatten the row/cell structure into a simple flex row of links
  const links = [...block.querySelectorAll('a')];
  const row = block.querySelector(':scope > div');
  if (row) {
    row.innerHTML = '';
    links.forEach((link) => row.append(link));
  }
}
