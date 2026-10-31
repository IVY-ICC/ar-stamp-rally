/* ============================================================
 * common.js : 全スポット(問題ページ)共通の処理
 *  - まちがい回数・クリア記録の保存(スマホのlocalStorage)
 *  - index.html の画面に埋め込まれたとき(?embed=1)の親ページとのやり取り
 * 各問題ページは、<body data-spot="spot1"> のように自分の番号を持っています。
 * ============================================================ */

// 親ページ(index.html)の中のiframeとして開かれているか
window.__EMBED = /[?&]embed=1/.test(location.search);
if (window.__EMBED) document.documentElement.classList.add('embed');

const STORE_KEY = 'ivyArStampMistakes';                       // まちがい回数
const CLEAR_KEY = 'ivyArStampCleared', START_KEY = 'ivyArStampStart';   // クリア記録・開始時刻
const SPOT_KEY = document.body.dataset.spot;                  // 例: 'spot1'

// ---- 保存(localStorageが使えない端末でも動くように、メモリにも持つ) ----
let memStore = {};
function loadStore(){ try { const s = localStorage.getItem(STORE_KEY); return s ? JSON.parse(s) : {}; } catch(e){ return memStore; } }
function saveStore(o){ memStore = o; try { localStorage.setItem(STORE_KEY, JSON.stringify(o)); } catch(e){} }

// ?reset=1 を付けて開くと、この端末の記録をすべて消す(テスト用)
if (/[?&]reset=1/.test(location.search)){
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(CLEAR_KEY); localStorage.removeItem(START_KEY); localStorage.removeItem('ivyArStampReceived'); } catch(e){}
  memStore = {};
}

// ---- まちがい回数 ----
function spotMistakes(){ return Number(loadStore()[SPOT_KEY]) || 0; }                       // このスポットの回数
function totalMistakes(){ return Object.values(loadStore()).reduce((a,b)=> a + (Number(b)||0), 0); }   // 合計
function addMistake(){ const s = loadStore(); s[SPOT_KEY] = (Number(s[SPOT_KEY]) || 0) + 1; saveStore(s); updateBadge(); }
function updateBadge(){ document.getElementById('mistakeBadge').textContent = 'まちがい 合計 ' + totalMistakes() + '回'; }
updateBadge();

// ---- スタンプ記録(スタンプ帳 goal.html で使う) ----
try { if (!localStorage.getItem(START_KEY)) localStorage.setItem(START_KEY, String(Date.now())); } catch(e){}
function markCleared(){
  try { const o = JSON.parse(localStorage.getItem(CLEAR_KEY) || '{}'); if (!o[SPOT_KEY]) o[SPOT_KEY] = Date.now(); localStorage.setItem(CLEAR_KEY, JSON.stringify(o)); } catch(e){}
  // index.html に「クリアした」と知らせる(上のバーのスタンプ数が更新される)
  try { if (window.__EMBED) parent.postMessage({ type: 'cleared', spot: SPOT_KEY }, '*'); } catch(e){}
}

// ---- 問題の表示を始める ----
// 各スポットの js が Spot.onStart(関数) を呼ぶと、ページが開いてすぐ、その関数が実行されます。
// (マーカーを読み取ってから index.html がこのページを開くので、ここで始めてよい)
const Spot = { onStart(fn){ setTimeout(fn, 60); } };

// ---- 画面の中のボタン ----
if (window.__EMBED){
  const next = document.getElementById('nextBtn');
  const goal = document.getElementById('goalLink');
  if (next){ next.style.display = 'inline-block'; next.addEventListener('click', ()=> parent.postMessage({ type: 'close' }, '*')); }   // 「次のスポットを探す」→ カメラに戻る
  if (goal){ goal.addEventListener('click', e=>{ e.preventDefault(); parent.postMessage({ type: 'goal' }, '*'); }); }                // 「スタンプ帳を見る」
}
