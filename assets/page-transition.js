/**
 * Smooth Page Transition & Accurate Hash Scroll after ScrollCraft Layout
 */
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'warp-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="warp-transition-core">
      <div class="warp-star"></div>
      <span class="warp-label tm-mono">ĐANG CHUYỂN TRANG...</span>
    </div>
  `;
  document.body.appendChild(overlay);

  function scrollToHashIfPresent() {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-active');
    setTimeout(scrollToHashIfPresent, 120);
    setTimeout(scrollToHashIfPresent, 340);
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') {
      return;
    }

    const label = link.getAttribute('data-warp-label') || 'ĐANG CHUYỂN TRANG...';
    const labelEl = overlay.querySelector('.warp-label');
    if (labelEl) labelEl.textContent = label;

    e.preventDefault();
    overlay.classList.add('is-active');

    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });
})();
