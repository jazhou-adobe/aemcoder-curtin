const FEE_PLANS = [
  {
    name: 'Specialisation',
    price: 'A$12,500',
    period: 'per year',
    note: 'Full-year specialisation track',
    featured: false,
    cta: 'Enrol Now',
    features: ['2 semesters', '8 units', null, null],
  },
  {
    name: 'Certificate',
    price: 'A$8,900',
    period: 'per year',
    note: '6-month intensive program',
    featured: false,
    cta: 'Enrol Now',
    features: ['1 semester', '4 units', null, '✓'],
  },
  {
    name: 'Existing Students',
    originalPrice: 'A$12,500',
    price: 'A$9,375',
    period: 'per year',
    note: 'Save 25%. Exclusive returning student offer.',
    featured: true,
    cta: 'Enrol Now',
    features: ['2 semesters', '8 units', '✓', '✓'],
  },
];

const FEE_FEATURES = [
  'Duration',
  'Units included',
  'Industry placement',
  'Graduate certificate pathway',
];

const SUGGESTIONS = [
  'What are the entry requirements for Animation and Game Design?',
  'What career paths can I pursue after graduating?',
  'What is the fee structure for this course?',
];

const COURSE_RESPONSE_HTML = `
<p>Here are the <strong>Animation and Game Design</strong> courses available at Curtin University:</p>
<p><strong>Bachelor of Arts (Animation and Game Design)</strong><br>
Develop your creative and technical skills across animation and game design. This studio-based program covers 3D modelling, character animation, game engines, interactive storytelling, and visual effects — preparing you for careers in film, television, gaming, and digital media.</p>
<p><strong>What you'll study:</strong></p>
<ul>
  <li>3D modelling and character animation</li>
  <li>Game engine development with Unity and Unreal Engine</li>
  <li>Visual effects and compositing</li>
  <li>Interactive storytelling and narrative design</li>
  <li>Industry placements and collaborative studio projects</li>
</ul>
<p>Curtin's program is recognised for its strong industry connections and hands-on learning environment. Graduates are sought after by leading animation studios and game development companies across Australia and internationally.</p>
<p>Would you like to know more about entry requirements or career outcomes?</p>
`.trim();

const VIDEO_INTRO = "Here's a look at what it's like to study Animation and Game Design at Curtin University:";
const VIDEO_ID = 'E_HX6lhtXY4';

function simulateTyping(messagesEl, delay, callback) {
  const typing = document.createElement('div');
  typing.className = 'course-assistant-message course-assistant-typing';
  typing.setAttribute('aria-label', 'Assistant is typing');
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.append(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  setTimeout(() => {
    typing.remove();
    callback();
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, delay);
}

function addUserMessage(messagesEl, text) {
  const msg = document.createElement('div');
  msg.className = 'course-assistant-message course-assistant-message--user';
  msg.textContent = text;
  messagesEl.append(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addAssistantTextMessage(messagesEl, html) {
  const msg = document.createElement('div');
  msg.className = 'course-assistant-message course-assistant-message--assistant';
  msg.innerHTML = html;
  messagesEl.append(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addFeeTableMessage(messagesEl) {
  const msg = document.createElement('div');
  msg.className = 'course-assistant-message course-assistant-message--assistant course-assistant-message--wide';

  const intro = document.createElement('p');
  intro.textContent = 'Here are the enrolment options for Animation and Game Design at Curtin:';
  msg.append(intro);

  const tableWrap = document.createElement('div');
  tableWrap.className = 'ca-fee-table-wrap';

  // Header row
  const header = document.createElement('div');
  header.className = 'ca-fee-row ca-fee-header';
  header.innerHTML = '<div class="ca-fee-label"></div>';
  FEE_PLANS.forEach((plan) => {
    const col = document.createElement('div');
    col.className = `ca-fee-col${plan.featured ? ' ca-fee-col--featured' : ''}`;
    col.innerHTML = `
      <p class="ca-fee-plan-name">${plan.name}</p>
      ${plan.originalPrice ? `<p class="ca-fee-original">${plan.originalPrice}</p>` : ''}
      <p class="ca-fee-price">${plan.price}</p>
      <p class="ca-fee-period">${plan.period}${plan.note ? `<br><em>${plan.note}</em>` : ''}</p>
      <a class="ca-fee-enrol-btn" href="/enroll-form">${plan.cta}</a>
    `;
    header.append(col);
  });
  tableWrap.append(header);

  // Feature rows
  FEE_FEATURES.forEach((feature, i) => {
    const row = document.createElement('div');
    row.className = 'ca-fee-row';
    const label = document.createElement('div');
    label.className = 'ca-fee-label';
    label.textContent = feature;
    row.append(label);

    FEE_PLANS.forEach((plan) => {
      const cell = document.createElement('div');
      cell.className = `ca-fee-col${plan.featured ? ' ca-fee-col--featured' : ''}`;
      const val = plan.features[i];
      cell.innerHTML = val === '✓'
        ? '<span class="ca-fee-check" aria-label="Included">✓</span>'
        : val || '<span class="ca-fee-dash" aria-label="Not included">—</span>';
      row.append(cell);
    });

    tableWrap.append(row);
  });

  msg.append(tableWrap);
  messagesEl.append(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showSuggestions(messagesEl, onSelect) {
  const wrap = document.createElement('div');
  wrap.className = 'course-assistant-suggestions';

  SUGGESTIONS.forEach((text) => {
    const btn = document.createElement('button');
    btn.className = 'course-assistant-suggestion-btn';
    btn.type = 'button';
    btn.innerHTML = `<span aria-hidden="true">↳</span> ${text}`;
    btn.addEventListener('click', () => {
      wrap.remove();
      onSelect(text);
    });
    wrap.append(btn);
  });

  messagesEl.append(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addAssistantVideoMessage(messagesEl, intro, videoId, onSuggest) {
  const msg = document.createElement('div');
  msg.className = 'course-assistant-message course-assistant-message--assistant';

  const thumbWrap = document.createElement('div');
  thumbWrap.className = 'course-assistant-video-thumb';
  thumbWrap.setAttribute('role', 'button');
  thumbWrap.setAttribute('tabindex', '0');
  thumbWrap.setAttribute('aria-label', 'Play video');

  thumbWrap.innerHTML = `
    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Video thumbnail" loading="lazy" />
    <div class="course-assistant-play-icon" aria-hidden="true">
      <svg viewBox="0 0 68 48" width="68" height="48">
        <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
        <path d="M45 24 27 14v20" fill="#fff"/>
      </svg>
    </div>
  `;

  let played = false;
  const playVideo = () => {
    if (played) return;
    played = true;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = 'Course overview video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.className = 'course-assistant-iframe';
    thumbWrap.replaceWith(iframe);
    setTimeout(() => showSuggestions(messagesEl, onSuggest), 600);
  };

  thumbWrap.addEventListener('click', playVideo);
  thumbWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playVideo();
    }
  });

  msg.innerHTML = `<p>${intro}</p>`;
  const videoWrap = document.createElement('div');
  videoWrap.className = 'course-assistant-video-wrap';
  videoWrap.append(thumbWrap);
  msg.append(videoWrap);

  messagesEl.append(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function openChatModal(label, initialQuery) {
  let turn = 0;

  const overlay = document.createElement('div');
  overlay.className = 'course-assistant-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', label);

  overlay.innerHTML = `
    <div class="course-assistant-modal">
      <div class="course-assistant-modal-header">
        <span class="course-assistant-modal-title">${label}</span>
        <button class="course-assistant-close-btn" aria-label="Close chat">&times;</button>
      </div>
      <div class="course-assistant-messages" aria-live="polite" aria-relevant="additions"></div>
      <div class="course-assistant-modal-footer">
        <div class="course-assistant-chat-input-wrap">
          <span class="course-assistant-chat-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <input type="text" class="course-assistant-chat-input" placeholder="Ask a question" aria-label="Type your message" />
          <button class="course-assistant-send-btn" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p class="course-assistant-disclaimer">AI responses may be inaccurate. Check answers and sources.</p>
      </div>
    </div>
  `;

  document.body.append(overlay);
  document.body.style.overflow = 'hidden';

  const messagesEl = overlay.querySelector('.course-assistant-messages');
  const chatInput = overlay.querySelector('.course-assistant-chat-input');
  const sendBtn = overlay.querySelector('.course-assistant-send-btn');
  const closeBtn = overlay.querySelector('.course-assistant-close-btn');

  const closeModal = () => {
    overlay.remove();
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  });

  const sendMessage = (text) => {
    addUserMessage(messagesEl, text);

    if (turn === 1) {
      turn = 2;
      simulateTyping(messagesEl, 1000, () => {
        addAssistantVideoMessage(messagesEl, VIDEO_INTRO, VIDEO_ID, sendMessage);
      });
    } else if (/fee|cost|tuition|price/i.test(text)) {
      simulateTyping(messagesEl, 900, () => {
        addFeeTableMessage(messagesEl);
      });
    } else {
      simulateTyping(messagesEl, 800, () => {
        addAssistantTextMessage(messagesEl, '<p>I\'m here to help you explore more about Curtin University courses. Feel free to ask anything about Animation, Game Design, or other programs!</p>');
      });
    }
  };

  const handleSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    sendMessage(text);
  };

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Kick off the scripted first exchange
  addUserMessage(messagesEl, initialQuery);
  simulateTyping(messagesEl, 1200, () => {
    addAssistantTextMessage(messagesEl, COURSE_RESPONSE_HTML);
    turn = 1;
    chatInput.focus();
  });

}

const SPARKLE_ICON = `<svg class="ca-sparkle" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M8 1 L9 6.5 L14.5 8 L9 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" fill="url(#ca-sparkle-grad)"/>
  <defs>
    <linearGradient id="ca-sparkle-grad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
</svg>`;

const DEFAULT_PROMPTS = [
  'How do I enrol at Curtin University?',
  'What are the on-campus facilities and student life?',
  'How do I apply for student accommodation on campus?',
  'What scholarships are available for new students?',
];

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const title = rows[0]?.querySelector('div')?.textContent?.trim()
    || 'Find your perfect course at Curtin.';
  const authoredPrompts = rows.slice(1).map((r) => r.querySelector('div')?.textContent?.trim()).filter(Boolean);
  const prompts = authoredPrompts.length ? authoredPrompts : DEFAULT_PROMPTS;
  const modalLabel = 'Ask Assistant';

  block.innerHTML = '';

  const widget = document.createElement('div');
  widget.className = 'course-assistant-widget';

  const h2 = document.createElement('h2');
  h2.className = 'course-assistant-title';
  h2.textContent = title;
  widget.append(h2);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'course-assistant-search-wrap';
  searchWrap.innerHTML = `
    <span class="course-assistant-search-icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </span>
    <input type="text" class="course-assistant-input" placeholder="Ask a question" aria-label="Course search query" />
    <button class="course-assistant-send-btn" type="button" aria-label="Send">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    </button>
  `;
  widget.append(searchWrap);

  const promptsWrap = document.createElement('div');
  promptsWrap.className = 'course-assistant-init-prompts';
  prompts.forEach((text) => {
    const btn = document.createElement('button');
    btn.className = 'course-assistant-init-prompt-btn';
    btn.type = 'button';
    btn.innerHTML = `${SPARKLE_ICON}<span>${text}</span>`;
    btn.addEventListener('click', () => openChatModal(modalLabel, text));
    promptsWrap.append(btn);
  });
  widget.append(promptsWrap);

  block.append(widget);

  const input = searchWrap.querySelector('.course-assistant-input');
  const sendBtn = searchWrap.querySelector('.course-assistant-send-btn');

  const launch = () => {
    const query = input.value.trim() || DEFAULT_PROMPTS[0];
    openChatModal(modalLabel, query);
  };

  sendBtn.addEventListener('click', launch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') launch();
  });
}
