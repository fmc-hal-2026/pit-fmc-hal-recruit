// ===== スクロールに連動して背景の歯車を回転 =====
(() => {
  const gears = document.querySelectorAll('.bg_gear');
  if (!gears.length) return;

  // 「視差効果を減らす」設定のときは回さない
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const rotateGears = () => {
    const y = window.scrollY;
    gears.forEach(gear => {
      const speed = Number(gear.dataset.speed) || 0;
      gear.style.setProperty('--rot', `${y * speed}deg`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(rotateGears);
      ticking = true;
    }
  }, { passive: true });

  rotateGears(); // 初期状態を反映
})();