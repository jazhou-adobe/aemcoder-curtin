export default async function decorate(block) {
  const rows = [...block.children];
  const slides = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const textCell = cells[1];

    const img = imgCell ? imgCell.querySelector('img') : null;
    const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];
    const locationName = paragraphs[0] ? paragraphs[0].textContent.trim() : '';
    const linkEl = textCell ? textCell.querySelector('a') : null;
    const linkText = linkEl ? linkEl.textContent.trim() : '';
    const linkHref = linkEl ? linkEl.href : '#';

    slides.push({ img, locationName, linkText, linkHref });
  });

  // Clear block and build carousel structure
  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'carousel-slide';

    if (slide.img) {
      const picture = slide.img.closest('picture') || document.createElement('picture');
      if (!picture.contains(slide.img)) picture.appendChild(slide.img);
      slideEl.appendChild(picture);
    }

    const content = document.createElement('div');
    content.className = 'slide-content';

    const name = document.createElement('p');
    name.className = 'location-name';
    name.textContent = slide.locationName;
    content.appendChild(name);

    const link = document.createElement('a');
    link.className = 'location-link';
    link.href = slide.linkHref;
    link.textContent = slide.linkText;
    content.appendChild(link);

    slideEl.appendChild(content);
    track.appendChild(slideEl);
  });

  block.appendChild(track);

  // Build navigation
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  const progressFill = document.createElement('div');
  progressFill.className = 'progress-fill';
  progressBar.appendChild(progressFill);
  nav.appendChild(progressBar);

  const navButtons = document.createElement('div');
  navButtons.className = 'nav-buttons';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#8249;';
  navButtons.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#8250;';
  navButtons.appendChild(nextBtn);

  nav.appendChild(navButtons);
  block.appendChild(nav);

  // Carousel logic
  let currentIndex = 0;
  const slidesPerView = () => {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 4;
  };

  function updateCarousel() {
    const perView = slidesPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const slideWidth = track.querySelector('.carousel-slide')?.offsetWidth || 0;
    const gap = 16;
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update progress bar
    const progress = maxIndex > 0 ? ((currentIndex + perView) / slides.length) * 100 : 100;
    progressFill.style.width = `${Math.min(progress, 100)}%`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex -= 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex += 1;
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
