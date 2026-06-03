/**
 * Enrollment Form block
 * Standard university course enrollment capture form.
 * Authored content (optional): heading and/or description in the first row(s).
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Extract optional heading / description authored into the block table
  const authoredRows = [...block.children];
  let heading = '';
  let description = '';

  authoredRows.forEach((row) => {
    const cell = row.querySelector('div');
    if (!cell) return;
    const h = cell.querySelector('h1,h2,h3,h4,h5,h6');
    if (h && !heading) {
      heading = h.outerHTML;
    } else if (!description) {
      description = cell.innerHTML;
    }
  });

  const defaultHeading = '<h2>Course Enrolment Form</h2>';

  // Build form HTML
  block.innerHTML = `
    <div class="enrollment-form-inner">
      <div class="enrollment-form-header">${heading || defaultHeading}</div>
      ${description ? `<div class="enrollment-form-description">${description}</div>` : ''}
      <form class="enrollment-form-fields" novalidate>

        <fieldset class="enrollment-form-section">
          <legend>Personal information</legend>

          <div class="enrollment-form-row enrollment-form-row--two-col">
            <div class="enrollment-form-field">
              <label for="ef-first-name">First name <span aria-hidden="true">*</span></label>
              <input type="text" id="ef-first-name" name="firstName"
                autocomplete="given-name" required aria-required="true"
                placeholder="Enter your first name" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
            <div class="enrollment-form-field">
              <label for="ef-last-name">Last name <span aria-hidden="true">*</span></label>
              <input type="text" id="ef-last-name" name="lastName"
                autocomplete="family-name" required aria-required="true"
                placeholder="Enter your last name" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row enrollment-form-row--two-col">
            <div class="enrollment-form-field">
              <label for="ef-dob">Date of birth <span aria-hidden="true">*</span></label>
              <input type="date" id="ef-dob" name="dateOfBirth"
                autocomplete="bday" required aria-required="true" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
            <div class="enrollment-form-field">
              <label for="ef-phone">Phone number <span aria-hidden="true">*</span></label>
              <input type="tel" id="ef-phone" name="phone"
                autocomplete="tel" required aria-required="true"
                placeholder="e.g. 0400 000 000" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <label for="ef-email">Email address <span aria-hidden="true">*</span></label>
              <input type="email" id="ef-email" name="email"
                autocomplete="email" required aria-required="true"
                placeholder="Enter your email address" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <label for="ef-citizenship">Citizenship / residency status <span aria-hidden="true">*</span></label>
              <select id="ef-citizenship" name="citizenshipStatus" required aria-required="true">
                <option value="" disabled selected>Select your status</option>
                <option value="australian-citizen">Australian Citizen</option>
                <option value="permanent-resident">Australian Permanent Resident</option>
                <option value="new-zealand-citizen">New Zealand Citizen</option>
                <option value="international">International Student</option>
              </select>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>
        </fieldset>

        <fieldset class="enrollment-form-section">
          <legend>Course preferences</legend>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <label for="ef-course">Course of interest <span aria-hidden="true">*</span></label>
              <input type="text" id="ef-course" name="courseOfInterest"
                required aria-required="true"
                placeholder="e.g. Bachelor of Engineering (Honours)" />
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row enrollment-form-row--two-col">
            <div class="enrollment-form-field">
              <label for="ef-start">Intended start date <span aria-hidden="true">*</span></label>
              <select id="ef-start" name="intendedStart" required aria-required="true">
                <option value="" disabled selected>Select intake</option>
                <option value="semester-1-2026">Semester 1, 2026</option>
                <option value="semester-2-2026">Semester 2, 2026</option>
                <option value="semester-1-2027">Semester 1, 2027</option>
                <option value="semester-2-2027">Semester 2, 2027</option>
              </select>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
            <div class="enrollment-form-field">
              <label for="ef-highest-qual">Highest qualification <span aria-hidden="true">*</span></label>
              <select id="ef-highest-qual" name="highestQualification" required aria-required="true">
                <option value="" disabled selected>Select qualification</option>
                <option value="year-12">Year 12 / ATAR</option>
                <option value="tafe-cert">TAFE / Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor degree</option>
                <option value="postgraduate">Postgraduate degree</option>
                <option value="other">Other</option>
              </select>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <span class="enrollment-form-field-label">Study mode <span aria-hidden="true">*</span></span>
              <div class="enrollment-form-radio-group" role="group" aria-labelledby="ef-study-mode-label">
                <label class="enrollment-form-radio">
                  <input type="radio" name="studyMode" value="full-time" required />
                  <span>Full-time</span>
                </label>
                <label class="enrollment-form-radio">
                  <input type="radio" name="studyMode" value="part-time" />
                  <span>Part-time</span>
                </label>
                <label class="enrollment-form-radio">
                  <input type="radio" name="studyMode" value="online" />
                  <span>Online</span>
                </label>
              </div>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>
        </fieldset>

        <fieldset class="enrollment-form-section">
          <legend>Additional information</legend>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <label for="ef-referral">How did you hear about us?</label>
              <select id="ef-referral" name="referralSource">
                <option value="" selected>Select an option</option>
                <option value="search-engine">Search engine (Google, Bing, etc.)</option>
                <option value="social-media">Social media</option>
                <option value="school-counsellor">School / career counsellor</option>
                <option value="word-of-mouth">Word of mouth</option>
                <option value="open-day">Open Day / campus visit</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>

          <div class="enrollment-form-row">
            <div class="enrollment-form-field">
              <label for="ef-message">Additional comments or questions</label>
              <textarea id="ef-message" name="message" rows="4"
                placeholder="Any further information you'd like to share..."></textarea>
              <span class="enrollment-form-error" aria-live="polite"></span>
            </div>
          </div>
        </fieldset>

        <div class="enrollment-form-row enrollment-form-actions">
          <p class="enrollment-form-required-note"><span aria-hidden="true">*</span> Required fields</p>
          <button type="submit" class="enrollment-form-submit">Submit</button>
        </div>

        <div class="enrollment-form-success" role="alert" hidden>
          <p>Thank you! Your enrollment request has been submitted. A member of our team will contact you shortly.</p>
        </div>
      </form>
    </div>
  `;

  const form = block.querySelector('.enrollment-form-fields');

  function getFieldEl(control) {
    return control.closest('.enrollment-form-field');
  }

  function showError(control, message) {
    const field = getFieldEl(control);
    const error = field.querySelector('.enrollment-form-error');
    if (control.type !== 'radio') control.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    field.classList.add('has-error');
  }

  function clearError(control) {
    const field = getFieldEl(control);
    const error = field.querySelector('.enrollment-form-error');
    control.removeAttribute('aria-invalid');
    error.textContent = '';
    field.classList.remove('has-error');
  }

  function getLabelText(control) {
    // label element or span.enrollment-form-field-label
    const field = getFieldEl(control);
    const labelEl = field.querySelector('label, .enrollment-form-field-label');
    return labelEl?.textContent.replace('*', '').trim() || 'This field';
  }

  function validateControl(control) {
    if (control.type === 'radio') {
      // Validate the group: check if any radio with this name is checked
      const group = form.querySelectorAll(`input[name="${control.name}"]`);
      const checked = [...group].some((r) => r.checked);
      const field = getFieldEl(control);
      const error = field.querySelector('.enrollment-form-error');
      if (!checked) {
        error.textContent = `${getLabelText(control)} is required.`;
        field.classList.add('has-error');
        return false;
      }
      error.textContent = '';
      field.classList.remove('has-error');
      return true;
    }

    if (control.validity.valueMissing) {
      showError(control, `${getLabelText(control)} is required.`);
      return false;
    }
    if (control.type === 'email' && control.validity.typeMismatch) {
      showError(control, 'Please enter a valid email address.');
      return false;
    }
    if (control.type === 'tel' && control.value && !/^[\d\s()+-]{7,20}$/.test(control.value)) {
      showError(control, 'Please enter a valid phone number.');
      return false;
    }
    clearError(control);
    return true;
  }

  // Attach blur/change listeners to all form controls
  form.querySelectorAll('input, select, textarea').forEach((control) => {
    const eventType = (control.tagName === 'SELECT' || control.type === 'radio' || control.type === 'checkbox')
      ? 'change' : 'blur';
    control.addEventListener(eventType, () => validateControl(control));
    if (eventType === 'blur') {
      control.addEventListener('input', () => {
        if (getFieldEl(control).classList.contains('has-error')) validateControl(control);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect controls; de-duplicate radio groups (validate once per name)
    const seenRadios = new Set();
    const controls = [...form.querySelectorAll('input, select, textarea')].filter((c) => {
      if (c.type === 'radio') {
        if (seenRadios.has(c.name)) return false;
        seenRadios.add(c.name);
      }
      return true;
    });

    const allValid = controls.map((c) => validateControl(c)).every(Boolean);

    if (!allValid) {
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      firstError?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    // TODO: replace with real submission endpoint
    // eslint-disable-next-line no-console
    console.info('Enrollment form submitted:', data);

    form.querySelectorAll('input, select, textarea, button').forEach((el) => {
      el.setAttribute('disabled', '');
    });
    form.querySelector('.enrollment-form-success').hidden = false;
    form.querySelector('.enrollment-form-submit').textContent = 'Submitted';
    form.querySelector('.enrollment-form-success').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
