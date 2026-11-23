/**
 * MAIN APP CONTROLLER (ENHANCED)
 * URL parsing, Wax seal cover curtain, Scroll Reveal, Floating Nav,
 * WhatsApp Share Generator, QRIS Viewer, and Clipboard Toasts
 */

window.currentGuestName = '';

// Toast Notification
function showToast(message, duration = 3200) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// 1. URL Query Parameter Parser
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  let guest = params.get('to') || params.get('u') || params.get('guest') || params.get('p');

  if (guest) {
    guest = guest.trim();
    window.currentGuestName = guest;

    const coverGuestEl = document.getElementById('cover-guest-name');
    if (coverGuestEl) {
      coverGuestEl.textContent = guest;
    }

    const rsvpNameInput = document.getElementById('rsvp-name');
    if (rsvpNameInput) rsvpNameInput.value = guest;

    const wishNameInput = document.getElementById('wish-name');
    if (wishNameInput) wishNameInput.value = guest;
  }
}

// 2. Open Invitation Curtain Transition
function initCoverOpener() {
  const btnOpen = document.getElementById('btn-open-invitation');
  const cover = document.getElementById('invitation-cover');

  if (!btnOpen || !cover) return;

  btnOpen.addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('locked');

    if (typeof startMusicOnOpen === 'function') {
      startMusicOnOpen();
    }
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }

    setTimeout(() => {
      const hero = document.getElementById('hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  });
}

// 3. Scroll Reveal via IntersectionObserver
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 4. Floating Navigation Active State
function initFloatingNav() {
  const navLinks = document.querySelectorAll('.floating-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 220;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// 5. Copy to Clipboard Utility
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (!targetText) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(targetText).then(() => {
          showToast(`Tersalin ke clipboard: ${targetText}`);
        }).catch(() => fallbackCopy(targetText));
      } else {
        fallbackCopy(targetText);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Tersalin ke clipboard: ${text}`);
    } catch (e) {
      showToast('Gagal menyalin secara otomatis');
    }
    document.body.removeChild(tempInput);
  }
}

// 6. Interactive QRIS Modal Viewer
function initQRISModal() {
  const modal = document.getElementById('qris-modal');
  const btnOpenList = document.querySelectorAll('.btn-open-qris');
  const btnClose = document.getElementById('qris-modal-close');

  if (!modal) return;

  btnOpenList.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.classList.add('locked');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('locked');
  }

  if (btnClose) btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// 7. Interactive WhatsApp Invitation Generator
function initWhatsAppShareModal() {
  const modal = document.getElementById('share-modal');
  const btnOpen = document.getElementById('btn-open-share');
  const btnClose = document.getElementById('share-modal-close');
  const btnGenerate = document.getElementById('btn-generate-share');
  const inputGuest = document.getElementById('share-guest-name');
  const outputText = document.getElementById('share-result-text');
  const btnSendWA = document.getElementById('btn-send-whatsapp');
  const btnCopyShare = document.getElementById('btn-copy-share');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.classList.add('locked');
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('locked');
  }

  if (btnClose) btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (btnGenerate && inputGuest && outputText) {
    function generateMessage() {
      const name = inputGuest.value.trim() || 'Bapak/Ibu/Saudara/i';
      const baseUrl = window.location.origin + window.location.pathname;
      const targetUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
      
      const message = `Kepada Yth. ${name},%0A%0ATanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri hari bahagia kami:%0A%0A*The Wedding of Arya & Anindya*%0A🗓️ Minggu, 18 April 2027%0A📍 Grand Ballroom Plataran Dharmawangsa, Jakarta%0A%0ABerikut tautan undangan resmi Anda:%0A${encodeURIComponent(targetUrl)}%0A%0AMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.%0A%0ATerima kasih,%0AArya & Anindya`;
      
      outputText.value = decodeURIComponent(message);
      
      if (btnSendWA) {
        btnSendWA.href = `https://api.whatsapp.com/send?text=${message}`;
        btnSendWA.style.display = 'inline-flex';
      }
      if (btnCopyShare) {
        btnCopyShare.setAttribute('data-copy', decodeURIComponent(message));
      }
    }

    btnGenerate.addEventListener('click', generateMessage);
    inputGuest.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') generateMessage();
    });
  }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('locked');

  initGuestName();
  initCoverOpener();
  initScrollReveal();
  initFloatingNav();
  initCopyButtons();
  initQRISModal();
  initWhatsAppShareModal();
});
