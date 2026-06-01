export default async function decorate(block) {
  // The block structure:
  // Row 1: Tags (Undergraduate, Major)
  // Row 2: Title (h1)
  // Row 3: Key info header (h3 + Favourite)
  // Row 4: Key info items (3 columns)

  const rows = [...block.children];

  // Row 3: Add favourite icon styling
  if (rows[2]) {
    const favCell = rows[2].querySelector('div:last-child');
    if (favCell) {
      favCell.classList.add('course-hero-favourite');
    }
  }

  // Row 4: Add class for grid layout
  if (rows[3]) {
    rows[3].classList.add('course-hero-info-grid');
  }
}
