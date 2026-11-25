/**
 * RSVP & WISHES MANAGEMENT (LOCALSTORAGE + EMOJI REACTIONS + MODERATION)
 */

const STORAGE_KEY_RSVP = 'wedding_invitation_rsvps_rian_herfita';
const STORAGE_KEY_WISHES = 'wedding_invitation_wishes_rian_herfita';
const ADMIN_PIN = '1234'; // Default PIN moderasi untuk menghapus ucapan tidak pantas

// Data awal jika LocalStorage masih kosong
const DEFAULT_WISHES = [
  {
    id: 'wish-1',
    name: 'Dimas Prasetyo & Keluarga',
    relationship: 'Sahabat',
    text: 'Selamat untuk Mas Rian dan Mbak Herfita! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah, dan lekas dikaruniai keturunan yang sholeh/sholehah. Lancar sampai hari H dan acara unduh mantunya!',
    time: Date.now() - 3600000 * 24 * 2,
    reactions: { love: 18, pray: 14, clap: 8 }
  },
  {
    id: 'wish-2',
    name: 'Keluarga Bpk. H. Sukardi',
    relationship: 'Keluarga Besar',
    text: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga besar Bapak Parji dan Bapak Jatmiko!',
    time: Date.now() - 3600000 * 12,
    reactions: { love: 12, pray: 25, clap: 6 }
  },
  {
    id: 'wish-3',
    name: 'Rekan Kerja & Sahabat',
    relationship: 'Teman Kerja',
    text: 'Selamat menempuh hidup baru Rian & Fita! Semoga senantiasa diberikan kelancaran rezeki, kerukunan, dan kebahagiaan seumur hidup. Sampai ketemu di resepsi campursari!',
    time: Date.now() - 3600000 * 2,
    reactions: { love: 21, pray: 19, clap: 15 }
  }
];

function formatRelativeTime(timestamp) {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 30) return `${diffDays} hari lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID');
}

/* ========================================================
   RSVP LOGIC
   ======================================================== */
function getRSVPData() {
  const raw = localStorage.getItem(STORAGE_KEY_RSVP);
  return raw ? JSON.parse(raw) : [];
}

function saveRSVPData(data) {
  localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(data));
  updateRSVPStats();
}

function updateRSVPStats() {
  const rsvps = getRSVPData();
  let hadir = 0;
  let tidakHadir = 0;
  let ragu = 0;

  rsvps.forEach(r => {
    if (r.attendance === 'hadir') hadir += Number(r.guests || 1);
    else if (r.attendance === 'tidak') tidakHadir += 1;
    else ragu += 1;
  });

  const elHadir = document.getElementById('stat-hadir');
  const elTidak = document.getElementById('stat-tidak');
  const elRagu = document.getElementById('stat-ragu');

  if (elHadir) elHadir.textContent = hadir;
  if (elTidak) elTidak.textContent = tidakHadir;
  if (elRagu) elRagu.textContent = ragu;
}

function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  updateRSVPStats();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const attendance = document.getElementById('rsvp-attendance').value;
    const guests = document.getElementById('rsvp-guests').value;
    const notes = document.getElementById('rsvp-notes').value.trim();

    if (!name || !attendance) {
      if (typeof showToast === 'function') showToast('Mohon lengkapi nama dan status kehadiran.');
      return;
    }

    const rsvps = getRSVPData();
    const newEntry = {
      id: 'rsvp-' + Date.now(),
      name,
      attendance,
      guests: Number(guests) || 1,
      notes,
      timestamp: Date.now()
    };

    rsvps.push(newEntry);
    saveRSVPData(rsvps);

    // Auto-forward into wishes list if notes provided
    if (notes) {
      addWishDirectly(name, 'Tamu Undangan', notes);
    }

    if (typeof showToast === 'function') {
      showToast('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.');
    }
    form.reset();

    const urlGuest = window.currentGuestName || '';
    if (urlGuest) {
      document.getElementById('rsvp-name').value = urlGuest;
    }
  });
}

/* ========================================================
   WISHES & PRAYERS WITH EMOJI REACTIONS
   ======================================================== */
function getWishesData() {
  const raw = localStorage.getItem(STORAGE_KEY_WISHES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(DEFAULT_WISHES));
    return DEFAULT_WISHES;
  }
  return JSON.parse(raw);
}

function saveWishesData(data) {
  localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(data));
  renderWishes();
}

function addWishDirectly(name, relationship, text) {
  const wishes = getWishesData();
  wishes.unshift({
    id: 'wish-' + Date.now(),
    name,
    relationship: relationship || 'Tamu Undangan',
    text,
    time: Date.now(),
    reactions: { love: 1, pray: 1, clap: 0 }
  });
  saveWishesData(wishes);
}

function renderWishes() {
  const container = document.getElementById('wishes-list');
  const countBadge = document.getElementById('wishes-count');
  if (!container) return;

  const wishes = getWishesData();
  if (countBadge) countBadge.textContent = wishes.length;

  if (wishes.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
        Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
      </div>
    `;
    return;
  }

  container.innerHTML = wishes.map(wish => {
    const rx = wish.reactions || { love: 0, pray: 0, clap: 0 };
    return `
      <div class="wish-item" data-id="${wish.id}">
        <div class="wish-header">
          <span class="wish-name">
            ${escapeHtml(wish.name)}
            <span class="wish-relationship">${escapeHtml(wish.relationship || 'Tamu')}</span>
          </span>
          <span class="wish-time">${formatRelativeTime(wish.time)}</span>
        </div>
        <p class="wish-text">${escapeHtml(wish.text)}</p>
        <div class="wish-footer">
          <div class="wish-reactions">
            <button class="reaction-btn ${wish.reactedLove ? 'reacted' : ''}" onclick="toggleReaction('${wish.id}', 'love')">
              <span>❤️</span> <span>${rx.love || 0}</span>
            </button>
            <button class="reaction-btn ${wish.reactedPray ? 'reacted' : ''}" onclick="toggleReaction('${wish.id}', 'pray')">
              <span>🙏</span> <span>${rx.pray || 0}</span>
            </button>
            <button class="reaction-btn ${wish.reactedClap ? 'reacted' : ''}" onclick="toggleReaction('${wish.id}', 'clap')">
              <span>👏</span> <span>${rx.clap || 0}</span>
            </button>
          </div>
          <button class="wish-delete-btn" onclick="deleteWish('${wish.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Hapus
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initWishesForm() {
  const form = document.getElementById('wishes-form');
  if (!form) return;

  renderWishes();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('wish-name').value.trim();
    const rel = document.getElementById('wish-relation').value;
    const text = document.getElementById('wish-message').value.trim();

    if (!name || !text) {
      if (typeof showToast === 'function') showToast('Mohon isi nama dan pesan doa Anda.');
      return;
    }

    addWishDirectly(name, rel, text);
    if (typeof showToast === 'function') showToast('Terima kasih atas ucapan dan doa tulus Anda! ✨');
    form.reset();

    const urlGuest = window.currentGuestName || '';
    if (urlGuest) {
      document.getElementById('wish-name').value = urlGuest;
    }
  });

  // Admin Mode Moderasi Toggle
  const adminBtn = document.getElementById('btn-admin-toggle');
  const wishesBox = document.querySelector('.wishes-box');

  if (adminBtn && wishesBox) {
    adminBtn.addEventListener('click', () => {
      if (wishesBox.classList.contains('admin-mode')) {
        wishesBox.classList.remove('admin-mode');
        adminBtn.classList.remove('active');
        adminBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Mode Moderasi
        `;
        if (typeof showToast === 'function') showToast('Mode moderasi dinonaktifkan.');
      } else {
        const pin = prompt('Masukkan PIN Moderasi (Default: 1234):');
        if (pin === ADMIN_PIN) {
          wishesBox.classList.add('admin-mode');
          adminBtn.classList.add('active');
          adminBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Keluar Moderasi
          `;
          if (typeof showToast === 'function') showToast('Mode moderasi aktif! Anda dapat menghapus ucapan.');
        } else if (pin !== null) {
          if (typeof showToast === 'function') showToast('PIN salah! Akses ditolak.');
        }
      }
    });
  }
}

// Reaction Toggle
window.toggleReaction = function(wishId, type) {
  const wishes = getWishesData();
  const wish = wishes.find(w => w.id === wishId);
  if (!wish) return;

  if (!wish.reactions) wish.reactions = { love: 0, pray: 0, clap: 0 };

  const keyMap = { love: 'reactedLove', pray: 'reactedPray', clap: 'reactedClap' };
  const stateKey = keyMap[type];

  if (!wish[stateKey]) {
    wish.reactions[type] = (wish.reactions[type] || 0) + 1;
    wish[stateKey] = true;
  } else {
    wish.reactions[type] = Math.max(0, (wish.reactions[type] || 1) - 1);
    wish[stateKey] = false;
  }

  saveWishesData(wishes);
};

window.deleteWish = function(wishId) {
  if (confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) {
    const wishes = getWishesData();
    const filtered = wishes.filter(w => w.id !== wishId);
    saveWishesData(filtered);
    if (typeof showToast === 'function') showToast('Ucapan berhasil dihapus.');
  }
};

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  initRSVPForm();
  initWishesForm();
});
