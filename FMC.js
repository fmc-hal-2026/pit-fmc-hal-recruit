// ===== 結果タイプの定義（data-valueの [a,b,c] の並びと対応） =====
const TYPES = [
  { name: 'ファクトリーマネジメント職', detail: '' },
  { name: 'ファクトリークリエイター職', detail: '' },
  { name: 'ファクトリーオペレーター職', detail: '' }
];

// ===== 選択時の画像を先読み =====
document.querySelectorAll('.choice img').forEach(img => {
  new Image().src = img.dataset.on;
});


// ===== ページトップボタンの設定 =====
const pagetopBtn = document.querySelector('.to-pagetop');

const toScrollTop = () => {
  window.scroll({
    top: 0,
    behavior: "smooth"
  });
};

const scrollEvents = () => {
  if (window.scrollY > 100) {
    pagetopBtn.classList.add('is-shown');
  } else if (window.scrollY < 100) {
    pagetopBtn.classList.remove('is-shown');
  }
}

pagetopBtn.addEventListener('click', toScrollTop);
window.addEventListener('scroll', scrollEvents);


// ===== 回答の管理 =====
const questions = document.querySelectorAll('.question');
const answers = new Array(questions.length).fill(null); // 選んだ得点 [a,b,c]。未回答はnull

questions.forEach((question, i) => {
  const buttons = question.querySelectorAll('.choice');

  buttons.forEach(btn => {
    // ホバー時：onの画像にする
    btn.addEventListener('mouseenter', () => {
      const img = btn.querySelector('img');
      img.src = img.dataset.on;
    });

    // ホバー終了時：選択済みでなければoffに戻す
    btn.addEventListener('mouseleave', () => {
      if (btn.getAttribute('aria-pressed') !== 'true') {
        const img = btn.querySelector('img');
        img.src = img.dataset.off;
      }
    });

    // クリック時
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        const img = b.querySelector('img');
        img.src = img.dataset.off;
        b.setAttribute('aria-pressed', 'false');
      });

      const img = btn.querySelector('img');
      img.src = img.dataset.on;
      btn.setAttribute('aria-pressed', 'true');

      try {
        answers[i] = JSON.parse(btn.dataset.value);
      } catch (e) {
        console.error(`Q${i + 1} の data-value が不正です:`, btn.dataset.value);
      }
    });
  });
});

// ===== 結果ボタン =====
document.getElementById('submit-btn').addEventListener('click', () => {
  // 未回答チェック
  const unanswered = answers.indexOf(null);
  if (unanswered !== -1) {
    alert(`Q${unanswered + 1} が未回答です`);
    questions[unanswered].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // 3種類の合計を計算
  const totals = [0, 0, 0];
  answers.forEach(points => {
    points.forEach((p, t) => { totals[t] += p; });
  });
  console.log('合計点:', totals); // 確認用

  // 一番高いタイプを決定（同点の場合は先に書いたタイプを優先）
  const winner = totals.indexOf(Math.max(...totals));

  // 画面に表示
  document.getElementById('result-name').textContent = TYPES[winner].name;
  document.getElementById('result-detail').textContent = TYPES[winner].detail;

  const area = document.getElementById('result-area');
  area.hidden = false;
  area.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ===== スクロールで下からふわっと登場 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fadeUp');
      observer.unobserve(entry.target); // 一度だけ実行するため、監視を解除
    }
  });
}, {
  threshold: 0.2 // 要素の20%が見えたら発動
});

questions.forEach(q => observer.observe(q));