// ===== ページトップボタン =====
const pagetopBtn = document.querySelector('.to-pagetop');

if (pagetopBtn) {
  pagetopBtn.addEventListener('click', () => {
    window.scroll({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      pagetopBtn.classList.add('is-shown');
    } else {
      pagetopBtn.classList.remove('is-shown');
    }
  });
}

// ===== アコーディオン =====
document.querySelectorAll('.accordion-area .title').forEach(btn => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (!panel) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('is-open', !isOpen);
  });
});