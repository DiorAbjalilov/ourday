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

// ===== Particles =====
function createParticles() {
  const container = document.getElementById('particles');
  const count = window.innerWidth < 600 ? 15 : 25;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== Countdown =====
function initCountdown() {
  const weddingDate = new Date('2026-04-26T17:00:00+05:00');

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

    if (daysEl.textContent !== String(days).padStart(2, '0')) {
      daysEl.style.transform = 'scale(1.1)';
      setTimeout(() => daysEl.style.transform = 'scale(1)', 200);
    }

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
  btn.querySelector('.btn-loading').style.display = 'inline';
  msg.textContent = '';
  msg.className = 'form-message';

  try {
    const res = await supabaseRest('wishes', {
      method: 'POST',
      body: { full_name: fullName, message },
    });

    if (!res.ok) throw new Error('Failed to submit');

    msg.textContent = 'Tabrigingiz uchun rahmat! ✨';
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
  createParticles();
  initScrollAnimations();
  initCountdown();
  loadWishes();

  document.getElementById('wish-form').addEventListener('submit', submitWish);
});
