'use strict';

// ── CONFIG ────────────────────────────────
const CONFIG = {
  TARGET:      10_000_000,
  BASE_COUNT:  18_427,        // Seed value (pre-existing registrations)
  TICK_MS:     4200,          // New registration every ~4s (demo mode)
  TOAST_LIMIT: 5,
};

// ── STATE ─────────────────────────────────
const STATE = {
  count: CONFIG.BASE_COUNT,
  provinceData: {}, // { provinceName: count }
  toasts: [],
  quizStep: 0,
  quizAnswers: [],
  formSubmitted: false,
};

const SAMPLE_NAMES = [
  'Minh Tuấn','Hương Giang','Quốc Huy','Thu Hà','Bảo Anh',
  'Thanh Bình','Khánh Linh','Đức Nam','Mai Phương','Trung Kiên',
  'Thùy Dương','Hoàng Long','Ngọc Anh','Văn Khoa','Mỹ Linh',
  'Trung Hiếu','Thảo Nhi','Đại Nghĩa','Kim Oanh','Phúc Thịnh',
];

// ── COUNTER ANIMATION ─────────────────────
function animateCounter(el, from, to, duration = 1200) {
  const start = performance.now();
  const delta = to - from;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + delta * ease);
    el.textContent = current.toLocaleString('vi-VN');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function updateAllCounters(newCount) {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const old = parseInt(el.dataset.current || '0');
    el.dataset.current = newCount;
    animateCounter(el, old, newCount, 800);
  });
}


// ── TOAST NOTIFICATIONS ───────────────────
function showToast(name, province) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  if (STATE.toasts.length >= CONFIG.TOAST_LIMIT) {
    const oldest = STATE.toasts.shift();
    oldest?.classList.add('out');
    setTimeout(() => oldest?.remove(), 300);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const flag = ['🎉','✨','💚','🌿','🎊'][Math.floor(Math.random()*5)];
  toast.innerHTML = `
    <span class="toast-flag">${flag}</span>
    <div>
      <div class="toast-name">${name}</div>
      <div style="color:var(--text-muted);font-size:0.75rem;">tại ${province}&nbsp;vừa đăng ký</div>
    </div>
  `;
  container.appendChild(toast);
  STATE.toasts.push(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
    STATE.toasts = STATE.toasts.filter(t => t !== toast);
  }, 4500);
}

// ── AUTO-REGISTRATION SIMULATION ─────────
function startSimulation() {
  setInterval(() => {
    const newReg = Math.floor(Math.random() * 3) + 1;
    STATE.count += newReg;

    // Pick random province
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    STATE.provinceData[province] = (STATE.provinceData[province] || 0) + newReg;

    // Update UI
    updateAllCounters(STATE.count);
    refreshMapColors();

    // Toast
    const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    showToast(name, province);
  }, CONFIG.TICK_MS);
}

// ── FORM VALIDATION ───────────────────────
const RULES = {
  fullname: {
    test: v => v.trim().length >= 3,
    msg: 'Vui lòng nhập họ và tên (ít nhất 3 ký tự).',
  },
  email: {
    test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    msg: 'Email không hợp lệ.',
  },
  phone: {
    test: v => /^(0|\+84)\d{9,10}$/.test(v.replace(/\s/g,'')),
    msg: 'Số điện thoại không hợp lệ (VD: 0901234567).',
  },
  province: {
    test: v => v !== '',
    msg: 'Vui lòng chọn tỉnh/thành phố.',
  },
};

function validateField(id) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(`${id}-error`);
  if (!input || !RULES[id]) return true;

  const val = input.value;
  const ok  = RULES[id].test(val);

  input.classList.toggle('error',   !ok);
  input.classList.toggle('success',  ok);
  if (errEl) {
    errEl.textContent = ok ? '' : RULES[id].msg;
    errEl.classList.toggle('show', !ok);
  }
  return ok;
}

function validateForm() {
  const fields = ['fullname','email','phone','province'];
  const results = fields.map(validateField);

  // Checkboxes
  const cb1 = document.getElementById('cb-1');
  const cb3 = document.getElementById('cb-3');
  let cbOk = true;
  if (!cb1?.checked || !cb3?.checked) {
    const cbErr = document.getElementById('cb-error');
    if (cbErr) { cbErr.classList.add('show'); }
    cbOk = false;
  } else {
    const cbErr = document.getElementById('cb-error');
    if (cbErr) { cbErr.classList.remove('show'); }
  }

  return results.every(Boolean) && cbOk;
}

// ── CERTIFICATE GENERATOR ─────────────────
function generateCertificate(name) {
  const num = 'KLV-' + String(STATE.count).padStart(7, '0');
  const date = new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });

  document.getElementById('cert-name').textContent = name;
  document.getElementById('cert-num').textContent  = num;
  document.getElementById('cert-date').textContent = `Ngày ${date}`;
}

// ── FORM SUBMIT ───────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  if (STATE.formSubmitted) return;

  if (!validateForm()) {
    // Shake form
    const card = document.querySelector('.form-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'shake 0.4s ease';
    return;
  }

  const btn  = document.getElementById('submit-btn');
  btn.classList.add('loading');

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('loading');

    const name     = document.getElementById('fullname').value.trim();
    const province = document.getElementById('province').value;

    // Update state
    STATE.count++;
    STATE.provinceData[province] = (STATE.provinceData[province] || 0) + 1;
    STATE.formSubmitted = true;

    // Update UI
    updateAllCounters(STATE.count);
    refreshMapColors();

    // Generate certificate
    generateCertificate(name);

    // Show success screen
    const form    = document.getElementById('reg-form');
    const success = document.getElementById('success-screen');
    form.style.display    = 'none';
    success.classList.add('show');

    // Scroll to success
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Toast
    showToast(name, province);

    // Hide floating CTA
    document.querySelector('.floating-cta')?.classList.remove('show');
  }, 1600);
}

// ── REAL-TIME FIELD VALIDATION ─────────────
function attachFieldListeners() {
  ['fullname','email','phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(id));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(id);
      });
    }
  });

  const provinceEl = document.getElementById('province');
  if (provinceEl) {
    provinceEl.addEventListener('change', () => validateField('province'));
  }

  const cbEls = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
  cbEls.forEach(cb => {
    cb.addEventListener('change', () => {
      const cbErr = document.getElementById('cb-error');
      const cb1 = document.getElementById('cb-1');
      const cb3 = document.getElementById('cb-3');
      if (cb1?.checked && cb3?.checked && cbErr) {
        cbErr.classList.remove('show');
      }
    });
  });
}

// ── SHARE FUNCTIONS ───────────────────────
function shareOnFacebook() {
  const url  = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    '🌿 Tôi vừa đặt dấu ấn trên 10 triệu bản đồ gen Hạnh Phúc! ' +
    'Cùng mình xác lập kỷ lục và an tâm sinh con trong kỷ nguyên y học chính xác 💚 ' +
    '#BanDo10TrieuGenHanhPhuc #ClientSolutions #CarrierCheck'
  );
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnZalo() {
  window.open(`https://zalo.me/share/url?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnTikTok() {
  // Copy caption to clipboard
  const caption = '#BanDo10TrieuGenHanhPhuc #ClientSolutions #CarrierCheck #ChatLuongDanSoViet #YHocChinhXac';
  navigator.clipboard?.writeText(caption).then(() => {
    alert('Đã copy hashtag! Bạn mở TikTok và paste nhé 🎵\n\n' + caption);
  }).catch(() => {
    prompt('Copy hashtag này:', caption);
  });
}

function downloadCert() {
  // In production this would generate/download a real image
  const name = document.getElementById('fullname').value.trim();
  alert(`🎉 Chứng nhận của ${name} đang được tạo...\n\nTính năng tải ảnh sẽ được kết nối với Backend.`);
}

// ── QUIZ ──────────────────────────────────
const QUIZ_DATA = [
  {
    q: 'Bạn biết gì về xét nghiệm gen trước hôn nhân?',
    opts: [
      'Chưa từng nghe đến',
      'Có nghe nhưng chưa hiểu rõ',
      'Đã tìm hiểu và quan tâm',
      'Đã thực hiện hoặc có kế hoạch thực hiện',
    ],
    scores: [1,2,3,4],
  },
  {
    q: 'Bạn biết rằng 2 người hoàn toàn khỏe mạnh vẫn có thể sinh con mắc bệnh di truyền lặn không?',
    opts: ['Chưa biết điều này','Có nghe nhưng không chắc','Biết rõ điều này','Đã tư vấn với bác sĩ về vấn đề này'],
    scores: [1,2,3,4],
  },
  {
    q: 'Bạn sẽ làm gì nếu biết mình mang gen bệnh lặn?',
    opts: [
      'Không biết phải làm gì',
      'Lo lắng nhưng chưa có kế hoạch',
      'Sẽ tư vấn với bác sĩ di truyền',
      'Đã hiểu và có kế hoạch cụ thể',
    ],
    scores: [1,2,3,4],
  },
  {
    q: 'Bạn đã sẵn sàng cho hành trình xây dựng gia đình một cách có trách nhiệm?',
    opts: [
      'Chưa nghĩ đến vấn đề này',
      'Đang tìm hiểu và chuẩn bị',
      'Đã có kế hoạch rõ ràng',
      'Tôi và bạn đời đã thống nhất và chuẩn bị kỹ',
    ],
    scores: [1,2,3,4],
  },
];

function renderQuiz() {
  const wrap = document.getElementById('quiz-content');
  if (!wrap) return;

  const q = QUIZ_DATA[STATE.quizStep];
  const pct = Math.round((STATE.quizStep / QUIZ_DATA.length) * 100);

  wrap.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="quiz-progress-text">Câu ${STATE.quizStep + 1}/${QUIZ_DATA.length}</span>
    </div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((opt, i) => `
        <button class="quiz-option" data-idx="${i}" onclick="selectQuizOption(this, ${i})">
          <span style="color:var(--teal);font-weight:700;margin-right:8px;">${String.fromCharCode(65+i)}.</span>
          ${opt}
        </button>
      `).join('')}
    </div>
    <div class="quiz-nav">
      ${STATE.quizStep > 0 ? `<button class="btn btn-outline" onclick="quizBack()">← Quay lại</button>` : ''}
      <button class="btn btn-primary" id="quiz-next" disabled onclick="quizNext()">
        ${STATE.quizStep === QUIZ_DATA.length - 1 ? 'Xem kết quả 🎯' : 'Tiếp theo →'}
      </button>
    </div>
  `;
}

function selectQuizOption(el, idx) {
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  STATE.quizAnswers[STATE.quizStep] = QUIZ_DATA[STATE.quizStep].scores[idx];
  document.getElementById('quiz-next').disabled = false;
}

function quizNext() {
  if (STATE.quizAnswers[STATE.quizStep] === undefined) return;
  if (STATE.quizStep < QUIZ_DATA.length - 1) {
    STATE.quizStep++;
    renderQuiz();
  } else {
    showQuizResult();
  }
}

function quizBack() {
  if (STATE.quizStep > 0) {
    STATE.quizStep--;
    renderQuiz();
  }
}

function showQuizResult() {
  const total = STATE.quizAnswers.reduce((a,b) => a+b, 0);
  const max   = QUIZ_DATA.length * 4;
  const pct   = Math.round((total / max) * 100);

  let level, emoji, advice;
  if (pct <= 30) {
    level = 'Người Khám Phá 🌱'; emoji = '🌱';
    advice = 'Bạn đang ở bước đầu hành trình! Việc tìm hiểu về xét nghiệm gen trước hôn nhân sẽ giúp bạn chủ động hơn trong việc bảo vệ sức khỏe thế hệ sau.';
  } else if (pct <= 60) {
    level = 'Người Tiên Phong 🌿'; emoji = '🌿';
    advice = 'Bạn đã có nhận thức tốt! Chỉ cần thêm một bước nhỏ — tư vấn với chuyên gia di truyền học — để hoàn thiện hành trình chuẩn bị của mình.';
  } else {
    level = 'Chiến Binh Gen Hạnh Phúc 💚'; emoji = '💚';
    advice = 'Tuyệt vời! Bạn là hình mẫu của thế hệ sống trách nhiệm. Hãy chia sẻ kiến thức này đến cộng đồng và cùng xây dựng 10 triệu bản đồ gen Hạnh Phúc!';
  }

  const wrap = document.getElementById('quiz-content');
  wrap.innerHTML = `
    <div style="text-align:center;padding:20px 0;">
      <div style="font-size:3.5rem;margin-bottom:16px;">${emoji}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Kết quả của bạn</div>
      <div style="font-size:1.5rem;font-weight:700;color:var(--teal);margin-bottom:20px;">${level}</div>
      <div style="
        width:100px;height:100px;margin:0 auto 20px;
        border-radius:50%;
        background: conic-gradient(var(--teal) ${pct}%, rgba(255,255,255,0.08) 0%);
        display:flex;align-items:center;justify-content:center;
        font-size:1.5rem;font-weight:700;color:var(--text-white);
      ">${pct}%</div>
      <p style="font-size:0.88rem;color:var(--text-light);line-height:1.7;max-width:480px;margin:0 auto 28px;">${advice}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="#form-section" class="btn btn-primary">🧬 Đăng ký ngay</a>
        <button class="btn btn-outline" onclick="STATE.quizStep=0;STATE.quizAnswers=[];renderQuiz()">🔄 Làm lại</button>
      </div>
    </div>
  `;
}

// ── SCROLL ANIMATIONS ─────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FLOATING CTA ──────────────────────────
function initFloatingCTA() {
  const cta    = document.querySelector('.floating-cta');
  const formEl = document.getElementById('form-section');
  if (!cta || !formEl) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      cta.classList.toggle('show', !entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  observer.observe(formEl);
}

// ── PARTICLES ────────────────────────────
function createParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;

  const colors = ['rgba(0,201,167,', 'rgba(18,168,132,', 'rgba(255,215,0,'];

  for (let i = 0; i < 30; i++) {
    const p   = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const col  = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      background:${col}${Math.random()*0.5+0.2});
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*-20}s;
    `;
    container.appendChild(p);
  }
}

// ── SHAKE ANIMATION (CSS) ─────────────────
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }
`;
document.head.appendChild(shakeStyle);

// ── SMOOTH SCROLL FOR ANCHORS ─────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Form
  attachFieldListeners();
  document.getElementById('reg-form')?.addEventListener('submit', handleFormSubmit);

  // Quiz
  renderQuiz();

  // Simulation
  startSimulation();

  // UI helpers
  initScrollAnimations();
  initFloatingCTA();
  createParticles();
  initSmoothScroll();
});

// Expose to HTML onclick
window.selectQuizOption = selectQuizOption;
window.quizNext         = quizNext;
window.quizBack         = quizBack;
window.shareOnFacebook  = shareOnFacebook;
window.shareOnZalo      = shareOnZalo;
window.shareOnTikTok    = shareOnTikTok;
window.downloadCert     = downloadCert;
window.STATE            = STATE;
