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

// ===== Xで共有 =====
document.querySelectorAll('.share_x').forEach(link => {
  // 共有するURL：この結果ページ自身（?や#以降は外す）
  const pageUrl = location.href.split(/[?#]/)[0];

  const params = new URLSearchParams();
  params.set('text', link.dataset.text || '');
  params.set('url', pageUrl);
  if (link.dataset.hashtags) params.set('hashtags', link.dataset.hashtags);
  if (link.dataset.via)      params.set('via', link.dataset.via);

  link.href = 'https://x.com/intent/tweet?' + params.toString();
});

// ===== 「こちらも当てはまるかも？」の表示 =====
(() => {
  const TYPE_INFO = {
    1: { name: 'ファクトリーマネジメント職', url: 'result1.html' },
    2: { name: 'ファクトリークリエイター職', url: 'result2.html' },
    3: { name: 'ファクトリーオペレーター職', url: 'result3.html' }
  };

  const box  = document.getElementById('result-sub');
  const link = document.getElementById('result-sub-link');
  if (!box || !link) return;

  // URLの ?sub=3 の部分を読む
  const sub  = new URLSearchParams(location.search).get('sub');
  const info = TYPE_INFO[sub];
  if (!info) return;                                   // 渡されていない・不正な値なら表示しない
  if (location.pathname.endsWith(info.url)) return;    // 今のページと同じタイプなら表示しない

  link.textContent = info.name;
  link.href = info.url;
  box.hidden = false;
})();
