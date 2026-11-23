/**
 * COUNTDOWN TIMER & CALENDAR LINK GENERATOR
 */

// Target Wedding Date (Tahun-Bulan-Hari Jam:Menit:Detik)
// Silakan sesuaikan tanggal target pernikahan di sini
const WEDDING_DATE = new Date('2027-04-18T08:00:00+07:00');

function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const countdownWrap = document.getElementById('countdown-wrapper');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE.getTime() - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (countdownWrap) {
        countdownWrap.insertAdjacentHTML('afterend', '<p class="text-gold" style="font-weight:600;margin-top:1rem;">Acara Bahagia Telah Berlangsung</p>');
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Google Calendar link
function initGoogleCalendarBtn() {
  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const title = encodeURIComponent('The Wedding of Arya & Anindya');
    const details = encodeURIComponent('Pernikahan Arya Danendra & Anindya Kirana. Doa restu Anda merupakan kehormatan dan kebahagiaan bagi kami.');
    const location = encodeURIComponent('Grand Ballroom Plataran Dharmawangsa, Jakarta Selatan');
    
    // Format YYYYMMDDTHHmmssZ
    const startDate = '20270418T010000Z'; // 08:00 WIB = 01:00 UTC
    const endDate = '20270418T070000Z';   // 14:00 WIB = 07:00 UTC
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initGoogleCalendarBtn();
});
