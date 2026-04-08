// ===== Supabase Config =====
const SUPABASE_URL = 'https://pdpogzsezinorotwmtec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcG9nenNlemlub3JvdHdtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTE0MzksImV4cCI6MjA5MDE4NzQzOX0.TxIkuMFvENgRTxTyJAoEN3Xvyph4Pll2ZOVHjgXq7xY';

const supabaseRest = (table, options = {}) => {
  const params = new URLSearchParams();
  if (options.select) params.set('select', options.select);
  if (options.order) params.set('order', options.order);
  if (options.limit) params.set('limit', options.limit);

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;

  return fetch(url, {
    method: options.method || 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' : undefined,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

// ===== Envelope Opening =====
function initEnvelope() {
  const openBtn = document.getElementById('openBtn');
  const envelope = document.getElementById('envelope');
  const mainContent = document.getElementById('mainContent');

  openBtn.addEventListener('click', () => {
    envelope.style.transition = 'all 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)';
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.9) translateY(-30px)';

    setTimeout(() => {
      envelope.style.display = 'none';
      mainContent.style.display = 'block';
      mainContent.classList.add('page-enter');

      // Initialize everything after content is visible
      setTimeout(() => {
        createPetals();
        createFloatingHearts();
        initScrollAnimations();
        initCountdown();
        loadWishes();
      }, 100);
    }, 700);
  });
}

// ===== Floating Petals =====
function createPetals() {
  const container = document.getElementById('petals');
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 10 + 6;
    petal.style.left = Math.random() * 100 + '%';
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.animationDuration = (Math.random() * 12 + 8) + 's';
    petal.style.animationDelay = (Math.random() * 15) + 's';

    // Random rotation for variety
    const rotation = Math.random() * 360;
    petal.style.transform = `rotate(${rotation}deg)`;

    container.appendChild(petal);
  }
}

// ===== Floating Hearts =====
function createFloatingHearts() {
  const container = document.getElementById('hearts');
  const count = window.innerWidth < 600 ? 6 : 10;

  for (let i = 0; i < count; i++) {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.classList.add('float-heart');
    heart.setAttribute('width', '14');
    heart.setAttribute('height', '14');
    heart.setAttribute('viewBox', '0 0 24 24');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');

    const colors = ['#d4727e', '#e8a0aa', '#f5d5da', '#c9a96e'];
    path.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);

    heart.appendChild(path);

    const size = Math.random() * 12 + 8;
    heart.setAttribute('width', size);
    heart.setAttribute('height', size);
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 15 + 10) + 's';
    heart.style.animationDelay = (Math.random() * 20) + 's';

    container.appendChild(heart);
  }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  // Make hero elements visible immediately with stagger
  const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });

  // Observe remaining elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}

// ===== Countdown =====
function initCountdown() {
  const weddingDate = new Date('2026-04-26T17:00:00+05:00');
  const totalDays = 365; // for progress ring

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Animate number change
    if (secondsEl.textContent !== String(seconds).padStart(2, '0')) {
      secondsEl.style.transform = 'translate(-50%, -50%) scale(1.15)';
      setTimeout(() => {
        secondsEl.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 200);
    }

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Update progress rings
    const circumference = 283;
    const rings = document.querySelectorAll('.cd-progress');
    if (rings.length >= 4) {
      rings[0].style.strokeDashoffset = circumference - (circumference * (1 - days / totalDays));
      rings[1].style.strokeDashoffset = circumference - (circumference * hours / 24);
      rings[2].style.strokeDashoffset = circumference - (circumference * minutes / 60);
      rings[3].style.strokeDashoffset = circumference - (circumference * seconds / 60);
    }
  }

  update();
  setInterval(update, 1000);
}

// ===== Wishes =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  return `${day} ${months[date.getMonth()]}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createWishCard(wish) {
  const fullName = wish.full_name || '';
  const initials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return `
    <div class="wish-card" style="animation-delay: ${Math.random() * 0.3}s">
      <div class="wish-card-header">
        <div class="wish-avatar">${initials}</div>
        <span class="wish-name">${escapeHtml(fullName)}</span>
        <span class="wish-date">${formatDate(wish.created_at)}</span>
      </div>
      <p class="wish-message">${escapeHtml(wish.message)}</p>
    </div>
  `;
}

async function loadWishes() {
  const list = document.getElementById('wishes-list');

  try {
    const res = await supabaseRest('wishes', {
      select: '*',
      order: 'created_at.desc',
      limit: '50',
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const wishes = await res.json();

    if (wishes.length === 0) {
      list.innerHTML = '<p class="no-wishes">Hozircha tabriklar yo\'q. Birinchi bo\'ling!</p>';
      return;
    }

    list.innerHTML = `
      <h3 class="wishes-list-title">Tabriklar</h3>
      ${wishes.map(createWishCard).join('')}
    `;
  } catch (err) {
    console.error('Error loading wishes:', err);
    list.innerHTML = '<p class="no-wishes">Tabriklarni yuklashda xatolik yuz berdi.</p>';
  }
}

async function submitWish(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMessage');
  const fullName = document.getElementById('fullName').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!fullName || !message) return;

  btn.disabled = true;
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loading').style.display = 'inline-flex';
  msg.textContent = '';
  msg.className = 'form-message';

  try {
    const res = await supabaseRest('wishes', {
      method: 'POST',
      body: { full_name: fullName, message },
    });

    if (!res.ok) throw new Error('Failed to submit');

    msg.textContent = 'Tabrigingiz uchun rahmat!';
    msg.className = 'form-message success';

    document.getElementById('wish-form').reset();

    await loadWishes();
  } catch (err) {
    console.error('Error submitting wish:', err);
    msg.textContent = 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
    msg.className = 'form-message error';
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loading').style.display = 'none';
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  document.getElementById('wish-form').addEventListener('submit', submitWish);
});
