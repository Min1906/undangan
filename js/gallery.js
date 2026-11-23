/**
 * GALLERY LIGHTBOX & CATEGORY TABS (ENHANCED)
 */

function initGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCap = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterTabs = document.querySelectorAll('.gallery-tab-btn');

  if (!modal || !lightboxImg || galleryItems.length === 0) return;

  let currentIndex = 0;
  let activeList = [];

  function buildActiveList() {
    activeList = [];
    galleryItems.forEach(item => {
      if (!item.classList.contains('hide')) {
        const img = item.querySelector('img');
        activeList.push({
          src: item.getAttribute('data-src') || img.src,
          caption: item.getAttribute('data-caption') || img.alt,
          element: item
        });
      }
    });
  }

  buildActiveList();

  // Category Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCat === filterCategory) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });

      buildActiveList();
    });
  });

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const targetSrc = item.getAttribute('data-src') || img.src;
      const foundIdx = activeList.findIndex(x => x.src === targetSrc);
      openLightbox(foundIdx !== -1 ? foundIdx : 0);
    });
  });

  function openLightbox(index) {
    if (activeList.length === 0) return;
    currentIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    document.body.classList.add('locked');
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.classList.remove('locked');
  }

  function updateLightboxContent() {
    const current = activeList[currentIndex];
    if (!current) return;
    lightboxImg.src = current.src;
    lightboxCap.textContent = current.caption;
  }

  function showNext() {
    if (activeList.length === 0) return;
    currentIndex = (currentIndex + 1) % activeList.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (activeList.length === 0) return;
    currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    updateLightboxContent();
  }

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-img-wrap')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Touch Swipe
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) showNext(); // Swipe left
      else showPrev(); // Swipe right
    }
  }
}

document.addEventListener('DOMContentLoaded', initGalleryLightbox);
