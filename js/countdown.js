/**
 * COUNTDOWN TIMER & CALENDAR LINK GENERATOR
 */

// Target Wedding Date: 13 Desember 2026 pukul 09:00 WIB
const WEDDING_DATE = new Date('2026-12-13T09:00:00+07:00');

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
      if (countdownWrap && !document.getElementById('countdown-finished-msg')) {
        const msg = document.createElement('p');
        msg.id = 'countdown-finished-msg';
        msg.className = 'text-gold';
        msg.style.cssText = 'font-weight:600;margin-top:1rem;';
        msg.textContent = 'Acara Bahagia Sedang/Telah Berlangsung';
        countdownWrap.insertAdjacentElement('afterend', msg);
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
    const title = encodeURIComponent('The Wedding of Rian & Herfita');
    const details = encodeURIComponent('Pernikahan Rian Galih Firnanda & Herfita Oktavyana Dwi Savitri. Doa restu Anda merupakan kehormatan dan kebahagiaan bagi kami sekeluarga.');
    const location = encodeURIComponent('Kediaman Bapak Sudarto (Hiburan: Campursari)');
    
    // Format YYYYMMDDTHHmmssZ (13 Desember 2026, 09:00 - 16:00 WIB = 02:00 - 09:00 UTC)
    const startDate = '20261213T020000Z';
    const endDate = '20261213T090000Z';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initGoogleCalendarBtn();
});
