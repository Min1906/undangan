/**
 * MUSIC CONTROLLER, EQUALIZER, CANVAS CONFETTI & FALLING PETALS
 */

let bgMusic = null;
let isMusicPlaying = false;
let petalsEnabled = true;

/* ========================================================
   MUSIC PLAYBACK & VISUALIZER
   ======================================================== */
function initMusicController() {
  const musicBtn = document.getElementById('btn-music');
  const audioElement = document.getElementById('wedding-audio');

  if (!musicBtn || !audioElement) return;
  bgMusic = audioElement;

  musicBtn.addEventListener('click', () => {
    toggleMusic();
  });
}

function startMusicOnOpen() {
  if (!bgMusic) {
    bgMusic = document.getElementById('wedding-audio');
  }
  if (!bgMusic) return;

  bgMusic.play().then(() => {
    isMusicPlaying = true;
    updateMusicUI(true);
  }).catch((err) => {
    console.log('Autoplay blocked:', err);
    isMusicPlaying = false;
    updateMusicUI(false);
  });
}

function toggleMusic() {
  if (!bgMusic) return;

  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicUI(false);
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusicUI(true);
    }).catch(e => console.log(e));
  }
}

function updateMusicUI(playing) {
  const musicBtn = document.getElementById('btn-music');
  if (!musicBtn) return;

  if (playing) {
    musicBtn.classList.remove('paused');
    musicBtn.setAttribute('title', 'Matikan Musik');
    musicBtn.innerHTML = `
      <div class="music-equalizer">
        <div class="eq-bar"></div>
        <div class="eq-bar"></div>
        <div class="eq-bar"></div>
      </div>
    `;
  } else {
    musicBtn.classList.add('paused');
    musicBtn.setAttribute('title', 'Putar Musik');
    musicBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
  }
}

/* ========================================================
   CANVAS CONFETTI EXPLOSION
   ======================================================== */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const numberOfPieces = 110;
  const colors = ['#d8b248', '#94744f', '#f4ede4', '#e63946', '#ffffff', '#e2c694', '#cbb499'];

  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height / 2 + (Math.random() - 0.5) * 80,
      w: Math.random() * 9 + 5,
      h: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1.25) * 16,
      gravity: 0.28,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  let startTime = Date.now();
  const duration = 4200; // 4.2 seconds

  function animate() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      if (elapsed > 2000) {
        p.opacity -= 0.015;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  animate();
}

/* ========================================================
   GENTLE FALLING FLOWER PETALS & SPARKLES
   ======================================================== */
function initFallingPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const petals = [];
  const maxPetals = 22; // Elegant, not overly crowded

  for (let i = 0; i < maxPetals; i++) {
    petals.push(createPetal(canvas.width, canvas.height, true));
  }

  function createPetal(w, h, initial = false) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      size: Math.random() * 7 + 6,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.1 + 0.7,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.35,
      color: Math.random() > 0.4 ? 'rgba(235, 218, 200, ' : 'rgba(216, 178, 72, '
    };
  }

  function renderPetals() {
    if (!petalsEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(renderPetals);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    petals.forEach((p, idx) => {
      p.x += p.speedX + Math.sin(p.angle) * 0.6;
      p.y += p.speedY;
      p.angle += p.angularSpeed;

      // Reset when falling below screen
      if (p.y > canvas.height + 20) {
        petals[idx] = createPetal(canvas.width, canvas.height, false);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      // Draw almond-shaped delicate floral petal
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderPetals);
  }

  renderPetals();

  // Toggle button listener
  const toggleBtn = document.getElementById('btn-toggle-petals');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsEnabled = !petalsEnabled;
      toggleBtn.classList.toggle('active', petalsEnabled);
      if (typeof showToast === 'function') {
        showToast(petalsEnabled ? 'Efek kelopak bunga diaktifkan 🌸' : 'Efek kelopak bunga dimatikan');
      }
    });
  }
}

window.addEventListener('resize', () => {
  const c1 = document.getElementById('confetti-canvas');
  if (c1) { c1.width = window.innerWidth; c1.height = window.innerHeight; }
  const c2 = document.getElementById('petals-canvas');
  if (c2) { c2.width = window.innerWidth; c2.height = window.innerHeight; }
});

document.addEventListener('DOMContentLoaded', () => {
  initMusicController();
  initFallingPetals();
});
