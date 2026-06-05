export default function decorate(block) {
  const rows = [...block.children];

  // Parse authored content from block rows
  // Row 0: breadcrumb text (pipe-separated: APPAREL | curtin_style | HOODIES)
  // Row 1: title
  // Row 2: price
  // Row 3: sizes (pipe-separated: S | M | L | XL | XXL)
  // Row 4: default selected size
  // Row 5: add to bag button label
  // Row 6: shipping text (label | description)
  // Row 7: product details title | product details body
  // Row 8: shipping & returns title | body
  // Row 9+: images (main + thumbnails)

  const get = (i) => rows[i]?.querySelector('div')?.innerHTML?.trim() || '';
  const getText = (i) => rows[i]?.querySelector('div')?.textContent?.trim() || '';

  // Breadcrumb
  const breadcrumbParts = getText(0).split('|').map((s) => s.trim()).filter(Boolean);

  // Basic info
  const title = getText(1) || 'Curtin University Heritage Hoodie - Blue';
  const price = getText(2) || '$59.95';
  const sizesRaw = getText(3) || 'S|M|L|XL|XXL';
  const sizes = sizesRaw.split('|').map((s) => s.trim()).filter(Boolean);
  const defaultSize = getText(4) || 'M';

  // Shipping
  const shippingParts = getText(6).split('|').map((s) => s.trim());
  const shippingTitle = shippingParts[0] || 'Shipping';
  const shippingBody = shippingParts[1] || 'Free standard shipping on orders over $100.';

  // Accordions
  const acc1Title = getText(7).split('|')[0]?.trim() || 'Product Details';
  const acc1Body = get(7).split('</div>')[1] || '';
  const row7cells = rows[7] ? [...rows[7].children] : [];
  const acc1BodyHtml = row7cells[1]?.innerHTML || '';
  const row8cells = rows[8] ? [...rows[8].children] : [];
  const acc2Title = row8cells[0]?.textContent?.trim() || 'Shipping & Returns';
  const acc2BodyHtml = row8cells[1]?.innerHTML || '';

  // Images — rows 9+ are image rows (main image first, then thumbnails)
  const imageRows = [...rows].slice(9);
  const images = imageRows.map((row) => {
    const img = row.querySelector('img');
    const caption = row.querySelector('div:last-child')?.textContent?.trim() || '';
    return { src: img?.src || img?.getAttribute('src') || '', alt: img?.alt || title, caption };
  });

  // Build HTML
  block.innerHTML = '';

  // Breadcrumb
  if (breadcrumbParts.length) {
    const bc = document.createElement('nav');
    bc.className = 'curtin-pdp__breadcrumb';
    bc.innerHTML = breadcrumbParts.map((part, i) => {
      const isLast = i === breadcrumbParts.length - 1;
      return isLast
        ? `<strong>${part}</strong>`
        : `<a href="#">${part}</a><span>›</span>`;
    }).join('');
    block.appendChild(bc);
  }

  // Layout wrapper
  const layout = document.createElement('div');
  layout.className = 'curtin-pdp__layout';

  // --- Gallery ---
  const gallery = document.createElement('div');
  gallery.className = 'curtin-pdp__gallery';

  const mainImgWrap = document.createElement('div');
  mainImgWrap.className = 'curtin-pdp__main-image';
  const mainImg = document.createElement('img');
  mainImg.src = images[0]?.src || '/images/curtin-hoodie-blue.jpg';
  mainImg.alt = images[0]?.alt || title;
  mainImg.loading = 'lazy';
  mainImgWrap.appendChild(mainImg);
  gallery.appendChild(mainImgWrap);

  if (images.length > 1) {
    const thumbsGrid = document.createElement('div');
    thumbsGrid.className = 'curtin-pdp__thumbnails';
    images.forEach((imgData, i) => {
      const thumb = document.createElement('div');
      thumb.className = `curtin-pdp__thumb${i === 0 ? ' active' : ''}`;
      const tImg = document.createElement('img');
      tImg.src = imgData.src;
      tImg.alt = imgData.alt;
      tImg.loading = 'lazy';
      thumb.appendChild(tImg);
      if (imgData.caption) {
        const label = document.createElement('span');
        label.className = 'curtin-pdp__thumb-label';
        label.textContent = imgData.caption;
        thumb.appendChild(label);
      }
      thumb.addEventListener('click', () => {
        mainImg.src = imgData.src;
        mainImg.alt = imgData.alt;
        thumbsGrid.querySelectorAll('.curtin-pdp__thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbsGrid.appendChild(thumb);
    });
    gallery.appendChild(thumbsGrid);
  }

  layout.appendChild(gallery);

  // --- Info ---
  const info = document.createElement('div');
  info.className = 'curtin-pdp__info';

  // Title
  const titleEl = document.createElement('h1');
  titleEl.className = 'curtin-pdp__title';
  titleEl.textContent = title;
  info.appendChild(titleEl);

  // Price
  const priceEl = document.createElement('p');
  priceEl.className = 'curtin-pdp__price';
  priceEl.textContent = price;
  info.appendChild(priceEl);

  // Size label
  const sizeLabelEl = document.createElement('div');
  sizeLabelEl.className = 'curtin-pdp__label';
  sizeLabelEl.innerHTML = `<span>Select Size</span><span class="curtin-pdp__size-guide">Size Guide</span>`;
  info.appendChild(sizeLabelEl);

  // Sizes
  const sizesEl = document.createElement('div');
  sizesEl.className = 'curtin-pdp__sizes';
  let selectedSize = defaultSize;
  sizes.forEach((size) => {
    const btn = document.createElement('button');
    btn.className = `curtin-pdp__size-btn${size === selectedSize ? ' selected' : ''}`;
    btn.textContent = size;
    btn.addEventListener('click', () => {
      selectedSize = size;
      sizesEl.querySelectorAll('.curtin-pdp__size-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    sizesEl.appendChild(btn);
  });
  info.appendChild(sizesEl);

  // Quantity
  let qty = 1;
  const qtyRow = document.createElement('div');
  qtyRow.className = 'curtin-pdp__quantity-row';
  qtyRow.innerHTML = `<span class="curtin-pdp__qty-label">Quantity</span>`;
  const qtyControls = document.createElement('div');
  qtyControls.className = 'curtin-pdp__qty-controls';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'curtin-pdp__qty-btn';
  removeBtn.textContent = 'remove';
  const qtyVal = document.createElement('span');
  qtyVal.className = 'curtin-pdp__qty-value';
  qtyVal.textContent = String(qty);
  const addBtn = document.createElement('button');
  addBtn.className = 'curtin-pdp__qty-btn';
  addBtn.textContent = 'add';
  removeBtn.addEventListener('click', () => {
    if (qty > 1) { qty -= 1; qtyVal.textContent = String(qty); }
  });
  addBtn.addEventListener('click', () => {
    qty += 1;
    qtyVal.textContent = String(qty);
  });
  qtyControls.append(removeBtn, qtyVal, addBtn);
  qtyRow.appendChild(qtyControls);
  info.appendChild(qtyRow);

  // Express checkout
  const addBtn2 = document.createElement('button');
  addBtn2.className = 'curtin-pdp__add-to-bag';
  addBtn2.textContent = 'Express Checkout';
  addBtn2.addEventListener('click', () => { window.location.href = '/curtin-checkout'; });
  info.appendChild(addBtn2);

  // Wishlist
  const wishBtn = document.createElement('button');
  wishBtn.className = 'curtin-pdp__wishlist-btn';
  wishBtn.innerHTML = `<span class="material-icons">favorite_border</span> Add to Wishlist`;
  info.appendChild(wishBtn);

  // Shipping banner
  const shippingEl = document.createElement('div');
  shippingEl.className = 'curtin-pdp__shipping';
  shippingEl.innerHTML = `
    <span class="material-icons">local_shipping</span>
    <div class="curtin-pdp__shipping-text">
      <strong>${shippingTitle}</strong>
      <span>${shippingBody}</span>
    </div>`;
  info.appendChild(shippingEl);

  // Accordions
  [[acc1Title, acc1BodyHtml, true], [acc2Title, acc2BodyHtml, false]].forEach(([accTitle, accBody, open]) => {
    if (!accTitle) return;
    const acc = document.createElement('div');
    acc.className = `curtin-pdp__accordion${open ? ' open' : ''}`;
    const header = document.createElement('button');
    header.className = 'curtin-pdp__accordion-header';
    header.innerHTML = `
      <span class="curtin-pdp__accordion-title">${accTitle}</span>
      <span class="material-icons curtin-pdp__accordion-icon">expand_more</span>`;
    const body = document.createElement('div');
    body.className = 'curtin-pdp__accordion-body';
    body.innerHTML = accBody || '';
    header.addEventListener('click', () => acc.classList.toggle('open'));
    acc.append(header, body);
    info.appendChild(acc);
  });

  layout.appendChild(info);
  block.appendChild(layout);

  // Ensure Material Icons font is loaded
  if (!document.querySelector('link[href*="material-icons"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }
}
