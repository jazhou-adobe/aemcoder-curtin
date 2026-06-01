export default async function decorate(block) {
  // The site-footer block contains structured rows:
  // Row 1: Campuses + Teaching areas (two cells)
  // Row 2: Social links
  // Row 3: Acknowledgment message
  // Row 4: Legal links + codes

  const rows = [...block.children];

  // Row 1: two columns with headings + lists
  if (rows[0]) {
    rows[0].classList.add('footer-columns');
  }

  // Row 2: social links
  if (rows[1]) {
    rows[1].classList.add('footer-socials');
  }

  // Row 3: acknowledgment
  if (rows[2]) {
    rows[2].classList.add('footer-acknowledgment');
  }

  // Row 4: legal
  if (rows[3]) {
    rows[3].classList.add('footer-legal');
  }
}
