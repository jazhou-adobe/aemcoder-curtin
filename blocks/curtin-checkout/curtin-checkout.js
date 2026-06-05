export default function decorate(block) {
  const rows = [...block.children];
  const getText = (i) => rows[i]?.querySelector('div')?.textContent?.trim() || '';
  const getHTML = (i) => rows[i]?.querySelector('div')?.innerHTML?.trim() || '';

  // Row 0: product image URL
  // Row 1: product name
  // Row 2: product variant (Size | Color)
  // Row 3: product price
  // Row 4: email address
  // Row 5: shipping name (First | Last)
  // Row 6: shipping address
  // Row 7: shipping city | postcode
  // Row 8: subtotal
  // Row 9: shipping label | shipping cost
  // Row 10: GST label | GST amount
  // Row 11: total amount
  // Row 12: complete purchase button label

  const productImage = 'https://main--aemcoder-curtin--jazhou-adobe.aem.page/products/curtin-hoodie-blue/media_123d05508ecf048f00143b510b7c05d0cc12eae9b.png?width=750&format=png&optimize=medium';
  const productName = getText(1) || 'Curtin University Heritage Hoodie';
  const variantParts = getText(2).split('|').map((s) => s.trim());
  const productSize = variantParts[0] || 'M';
  const productColor = variantParts[1] || 'Heritage Grey';
  const productPrice = getText(3) || '$59.95';

  const email = getText(4) || 'j.smith@student.curtin.edu.au';

  const nameParts = getText(5).split('|').map((s) => s.trim());
  const firstName = nameParts[0] || 'Kent';
  const lastName = nameParts[1] || '';

  const address = getText(6) || 'Kent St, Bentley';
  const locationParts = getText(7).split('|').map((s) => s.trim());
  const city = locationParts[0] || 'Perth';
  const postcode = locationParts[1] || '6102';

  const subtotal = getText(8) || '$59.95';
  const shippingParts = getText(9).split('|').map((s) => s.trim());
  const shippingLabel = shippingParts[0] || 'Shipping (Express)';
  const shippingCost = shippingParts[1] || '$12.50';
  const gstParts = getText(10).split('|').map((s) => s.trim());
  const gstLabel = gstParts[0] || 'GST (10%)';
  const gstAmount = gstParts[1] || '$6.00';
  const total = getText(11) || 'AUD $78.45';
  const btnLabel = getText(12) || 'COMPLETE PURCHASE';

  block.innerHTML = `
    <div class="curtin-checkout__inner">

      <!-- Left column: form -->
      <div class="curtin-checkout__form-col">

        <!-- Breadcrumb steps -->
        <nav class="curtin-checkout__steps" aria-label="Checkout steps">
          <span class="curtin-checkout__step">Information</span>
          <span class="curtin-checkout__step-sep" aria-hidden="true">›</span>
          <span class="curtin-checkout__step">Shipping</span>
          <span class="curtin-checkout__step-sep" aria-hidden="true">›</span>
          <span class="curtin-checkout__step curtin-checkout__step--active">Payment</span>
        </nav>

        <!-- Contact Information -->
        <section class="curtin-checkout__section">
          <h2 class="curtin-checkout__section-title">Contact Information</h2>
          <div class="curtin-checkout__field-group">
            <label class="curtin-checkout__label" for="cc-email">Email Address</label>
            <input class="curtin-checkout__input" id="cc-email" type="email" autocomplete="email" />
          </div>
        </section>

        <!-- Shipping Address -->
        <section class="curtin-checkout__section">
          <h2 class="curtin-checkout__section-title">Shipping Address</h2>
          <div class="curtin-checkout__row">
            <div class="curtin-checkout__field-group">
              <label class="curtin-checkout__label" for="cc-first-name">First Name</label>
              <input class="curtin-checkout__input" id="cc-first-name" type="text" autocomplete="given-name" />
            </div>
            <div class="curtin-checkout__field-group">
              <label class="curtin-checkout__label" for="cc-last-name">Last Name</label>
              <input class="curtin-checkout__input" id="cc-last-name" type="text" autocomplete="family-name" />
            </div>
          </div>
          <div class="curtin-checkout__field-group">
            <label class="curtin-checkout__label" for="cc-address">Address</label>
            <input class="curtin-checkout__input" id="cc-address" type="text" autocomplete="street-address" />
          </div>
          <div class="curtin-checkout__row">
            <div class="curtin-checkout__field-group">
              <label class="curtin-checkout__label" for="cc-city">City</label>
              <input class="curtin-checkout__input" id="cc-city" type="text" autocomplete="address-level2" />
            </div>
            <div class="curtin-checkout__field-group">
              <label class="curtin-checkout__label" for="cc-postcode">Postcode</label>
              <input class="curtin-checkout__input" id="cc-postcode" type="text" autocomplete="postal-code" />
            </div>
          </div>
          <button class="curtin-checkout__campus-btn" type="button">Campus Collection</button>
        </section>

        <!-- Payment Method -->
        <section class="curtin-checkout__section">
          <h2 class="curtin-checkout__section-title">Payment Method</h2>
          <div class="curtin-checkout__payment-options">
            <button class="curtin-checkout__pay-btn" type="button" aria-label="Google Pay">
              <span class="curtin-checkout__pay-icon">
                <img src="https://www.svgrepo.com/show/452222/google-pay.svg" alt="Google Pay" width="48" height="32" />
              </span>
            </button>
            <button class="curtin-checkout__pay-btn" type="button" aria-label="Alipay">
              <span class="curtin-checkout__pay-icon">
                <img src="https://cdn.worldvectorlogo.com/logos/alipay-square-.svg" alt="Alipay" width="40" height="40" style="max-width:40px;max-height:40px;object-fit:contain;" />
              </span>
            </button>
            <button class="curtin-checkout__pay-btn" type="button" aria-label="WePay">
              <span class="curtin-checkout__pay-icon">
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="24" rx="2" fill="#07C160"/><path d="M8 10h3l1.5 5 2-5h2l2 5 1.5-5H22l-3 8h-2l-2-5-2 5h-2L8 10z" fill="#fff"/></svg>
              </span>
              <span class="curtin-checkout__pay-label">WEPAY</span>
            </button>
            <button class="curtin-checkout__pay-btn" type="button" aria-label="Apple Pay">
              <span class="curtin-checkout__pay-icon">
                <img src="https://www.logo.wine/a/logo/Apple_Pay/Apple_Pay-Logo.wine.svg" alt="Apple Pay" width="48" height="32" />
              </span>
            </button>
          </div>

          <!-- Credit Card -->
          <div class="curtin-checkout__card-panel">
            <div class="curtin-checkout__card-header">
              <span class="curtin-checkout__card-title">Credit Card</span>
              <svg class="curtin-checkout__card-icon" width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x=".5" y=".5" width="31" height="21" rx="3.5" fill="#fff" stroke="#d0d0d0"/><rect y="4" width="32" height="5" fill="#222"/><rect x="4" y="14" width="7" height="4" rx="1" fill="#e6b800"/></svg>
            </div>
            <div class="curtin-checkout__field-group">
              <label class="curtin-checkout__label" for="cc-number">Card number</label>
              <input class="curtin-checkout__input" id="cc-number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="" />
            </div>
            <div class="curtin-checkout__row">
              <div class="curtin-checkout__field-group">
                <label class="curtin-checkout__label" for="cc-expiry">Expiration date (MM/YY)</label>
                <input class="curtin-checkout__input" id="cc-expiry" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="" />
              </div>
              <div class="curtin-checkout__field-group">
                <label class="curtin-checkout__label" for="cc-cvv">Security code (CVV)</label>
                <input class="curtin-checkout__input" id="cc-cvv" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="" />
              </div>
            </div>
          </div>
        </section>

        <!-- Security notice -->
        <p class="curtin-checkout__security-note">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 3.5v4C1 11.1 3.5 14.4 7 15c3.5-.6 6-3.9 6-7.5v-4L7 1z" stroke="#888" stroke-width="1.2" fill="none"/><path d="M4.5 8l1.8 1.8 3-3" stroke="#888" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          All transactions are secure and encrypted.
        </p>
      </div>

      <!-- Right column: order summary -->
      <aside class="curtin-checkout__summary">
        <h2 class="curtin-checkout__summary-title">Order Summary</h2>

        <div class="curtin-checkout__product">
          <img class="curtin-checkout__product-img" src="${productImage}" alt="${productName}" loading="lazy" />
          <div class="curtin-checkout__product-info">
            <strong class="curtin-checkout__product-name">${productName}</strong>
            <span class="curtin-checkout__product-variant">Size: ${productSize} | Color: ${productColor}</span>
            <span class="curtin-checkout__product-price">${productPrice}</span>
          </div>
        </div>

        <div class="curtin-checkout__divider"></div>

        <div class="curtin-checkout__line-items">
          <div class="curtin-checkout__line">
            <span>Subtotal</span><span>${subtotal}</span>
          </div>
          <div class="curtin-checkout__line">
            <span>${shippingLabel}</span><span>${shippingCost}</span>
          </div>
          <div class="curtin-checkout__line">
            <span>${gstLabel}</span><span>${gstAmount}</span>
          </div>
        </div>

        <div class="curtin-checkout__divider"></div>

        <div class="curtin-checkout__total-line">
          <strong>Total</strong>
          <strong class="curtin-checkout__total-amount">${total}</strong>
        </div>

        <button class="curtin-checkout__submit-btn" type="button">${btnLabel}</button>

        <div class="curtin-checkout__trust-icons" aria-label="Trust badges">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="14" cy="14" r="13" stroke="#bbb" stroke-width="1.5"/><path d="M14 5l-7 3v5c0 4.4 3 8.1 7 9 4-1 7-4.6 7-9V8l-7-3z" stroke="#bbb" stroke-width="1.4" fill="none"/><path d="M10 14l2.5 2.5 5.5-5.5" stroke="#bbb" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="14" cy="14" r="13" stroke="#bbb" stroke-width="1.5"/><rect x="9" y="10" width="10" height="8" rx="1.5" stroke="#bbb" stroke-width="1.4" fill="none"/><path d="M11 10V8.5a3 3 0 016 0V10" stroke="#bbb" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="14" cy="14" r="13" stroke="#bbb" stroke-width="1.5"/><path d="M9 13h10M9 13l2-3M9 13l2 3M19 13l-2-3M19 13l-2 3" stroke="#bbb" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>
      </aside>

    </div>
  `;

  // Button interaction
  block.querySelector('.curtin-checkout__submit-btn')?.addEventListener('click', () => {
    const btn = block.querySelector('.curtin-checkout__submit-btn');
    btn.textContent = 'Processing…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Order Placed';
    }, 1800);
  });

  // Payment option toggle
  block.querySelectorAll('.curtin-checkout__pay-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelectorAll('.curtin-checkout__pay-btn').forEach((b) => b.classList.remove('curtin-checkout__pay-btn--active'));
      btn.classList.add('curtin-checkout__pay-btn--active');
    });
  });
}
