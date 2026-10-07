// ===== 結果タイプの定義（data-valueの [a,b,c] の並びと対応） =====
// 遷移先は、オペレーター＝result1 / マネジメント＝result2 / クリエイター＝result3
const TYPES = [
  { name: 'ファクトリーマネジメント職', url: 'result2.html' },
  { name: 'ファクトリークリエイター職', url: 'result3.html' },
  { name: 'ファクトリーオペレーター職', url: 'result1.html' }
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
  } else {
    pagetopBtn.classList.remove('is-shown');
  }
};

pagetopBtn.addEventListener('click', toScrollTop);
window.addEventListener('scroll', scrollEvents);


// ===== 回答の管理 =====
const questions = document.querySelectorAll('.question');
const answers = new Array(questions.length).fill(null); // 選んだ得点 [a,b,c]。未回答はnull


// ===== タブに「1/15」を表示 =====
questions.forEach((q, i) => {
  const tab = q.querySelector('.card_tab');
  tab.setAttribute('aria-hidden', 'true'); // 質問文の「Q1.」で伝わるので、読み上げは不要
  tab.innerHTML = `<span class="card_num">${i + 1}</span><span class="card_total">/${questions.length}</span>`;
});


// ===== 選択肢の動作 =====
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
      // この質問の中だけ未選択に戻す
      buttons.forEach(b => {
        const img = b.querySelector('img');
        img.src = img.dataset.off;
        b.setAttribute('aria-pressed', 'false');
      });

      // クリックしたものを選択状態に
      const img = btn.querySelector('img');
      img.src = img.dataset.on;
      btn.setAttribute('aria-pressed', 'true');

      // data-value の "[3,0,0]" を配列に変換して保存
      try {
        answers[i] = JSON.parse(btn.dataset.value);
      } catch (e) {
        console.error(`Q${i + 1} の data-value が不正です:`, btn.dataset.value);
      }
    });
  });
});


// ===== 結果ボタン =====
const submitBtn = document.getElementById('submit-btn');
const loading = document.getElementById('loading');
const LOADING_MS = 2000; // 「診断中」を見せる時間（ミリ秒）

submitBtn.addEventListener('click', () => {
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

  // 二重クリックを防いで「診断中」を表示
  submitBtn.disabled = true;
  loading.hidden = false;

  // 少し待ってから結果ページへ移動
  setTimeout(() => {
    location.href = TYPES[winner].url;
  }, LOADING_MS);
});

// ブラウザの「戻る」で戻ってきたとき、診断中の表示が残らないようにする
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    loading.hidden = true;
    submitBtn.disabled = false;
  }
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
