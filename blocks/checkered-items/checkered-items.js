export default async function decorate(block) {
  // Each row has two cells: image cell and text cell
  // The alternating layout is handled purely via CSS grid positioning
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // First cell is the image cell
    if (cells[0]) {
      cells[0].classList.add('checkered-items-image');
    }
    // Second cell is the content cell
    if (cells[1]) {
      cells[1].classList.add('checkered-items-content');
    }
  });
}
