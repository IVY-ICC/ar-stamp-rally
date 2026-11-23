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
const STARTED_KEY = 'ivyArStampStarted';                      // 受付済みの印(受付QR=index.html を開くと付く)
const SPOT_KEY = document.body.dataset.spot;                  // 例: 'spot1'

// ---- 保存(localStorageが使えない端末でも動くように、メモリにも持つ) ----
let memStore = {};
function loadStore(){ try { const s = localStorage.getItem(STORE_KEY); return s ? JSON.parse(s) : {}; } catch(e){ return memStore; } }
function saveStore(o){ memStore = o; try { localStorage.setItem(STORE_KEY, JSON.stringify(o)); } catch(e){} }

// ?reset=1 を付けて開くと、この端末の記録をすべて消す(テスト用)
if (/[?&]reset=1/.test(location.search)){
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(CLEAR_KEY); localStorage.removeItem(START_KEY); localStorage.removeItem('ivyArStampReceived'); localStorage.removeItem(STARTED_KEY); } catch(e){}
  memStore = {};
}

// ---- 受付チェック: 受付のQR(index.html)を読んでいない端末は、スポットのQRから直接入れない ----
// ・印(ivyArStampStarted)は index.html を開いたときに付き、reset.html で消えます。
// ・index.html の中(?embed=1)で開かれたときは、チェックしません(すでに受付済みのため)。
// ・★ localStorage が使えない端末(プライベートブラウズ等)は「入れる側」に倒し、チェックしません。
//    入れない人を出さないための方針です(README の「注意事項」を参照)。
function storageWorks(){
  try { localStorage.setItem('__ivyTest', '1'); localStorage.removeItem('__ivyTest'); return true; } catch(e){ return false; }
}
function isReceived(){
  if (!storageWorks()) return true;                           // 保存できない端末は通す
  try { return localStorage.getItem(STARTED_KEY) === '1'; } catch(e){ return true; }
}
window.__GATE_BLOCKED = !window.__EMBED && !isReceived();
function showGate(){
  const d = document.createElement('div');
  d.id = 'gateScreen';
  d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0b2037;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:sans-serif;overflow:auto';
  d.innerHTML = '<div style="max-width:420px">'
    + '<div style="font-size:48px">📋</div>'
    + '<h1 style="font-size:22px;line-height:1.5;margin:10px 0 12px">受付のQRコードを、<br>先に読み取ってください</h1>'
    + '<p style="font-size:15px;line-height:1.7;margin:0 0 18px">受付に貼ってある<b>スタート用のQRコード</b>を読み取ると、問題に挑戦できるようになります。</p>'
    + '<div style="background:#fff;color:#0b2037;border-radius:14px;padding:14px 16px;text-align:left;font-size:14px;line-height:1.7">'
    + '<b style="font-size:15px">すでに受付を済ませた方へ</b><br>'
    + '最初に使ったアプリ(iPhone=Safari、Android=Chrome)で、受付のQRコードをもう一度読み取ってください。<br>'
    + '<b>スタンプの記録は消えません。</b></div></div>';
  document.body.appendChild(d);
}
if (window.__GATE_BLOCKED) showGate();

// ---- まちがい回数 ----
function spotMistakes(){ return Number(loadStore()[SPOT_KEY]) || 0; }                       // このスポットの回数
function totalMistakes(){ return Object.values(loadStore()).reduce((a,b)=> a + (Number(b)||0), 0); }   // 合計
function addMistake(){ const s = loadStore(); s[SPOT_KEY] = (Number(s[SPOT_KEY]) || 0) + 1; saveStore(s); updateBadge(); }
function updateBadge(){ document.getElementById('mistakeBadge').textContent = 'まちがい 合計 ' + totalMistakes() + '回'; }
updateBadge();

// ---- スタンプ記録(スタンプ帳 goal.html で使う) ----
try { if (!window.__GATE_BLOCKED && !localStorage.getItem(START_KEY)) localStorage.setItem(START_KEY, String(Date.now())); } catch(e){}   // 受付前に開いただけでは、開始時刻を付けない
function markCleared(){
  try { const o = JSON.parse(localStorage.getItem(CLEAR_KEY) || '{}'); if (!o[SPOT_KEY]) o[SPOT_KEY] = Date.now(); localStorage.setItem(CLEAR_KEY, JSON.stringify(o)); } catch(e){}
  // index.html に「クリアした」と知らせる(上のバーのスタンプ数が更新される)
  try { if (window.__EMBED) parent.postMessage({ type: 'cleared', spot: SPOT_KEY }, '*'); } catch(e){}
}

// ---- 問題の表示を始める ----
// 各スポットの js が Spot.onStart(関数) を呼ぶと、ページが開いてすぐ、その関数が実行されます。
// (マーカーを読み取ってから index.html がこのページを開くので、ここで始めてよい)
const Spot = { onStart(fn){ if (window.__GATE_BLOCKED) return; setTimeout(fn, 60); } };   // 受付前は問題を始めない

// ---- 画面の中のボタン ----
if (window.__EMBED){
  const next = document.getElementById('nextBtn');
  const goal = document.getElementById('goalLink');
  if (next){ next.style.display = 'inline-block'; next.addEventListener('click', ()=> parent.postMessage({ type: 'close' }, '*')); }   // 「次のスポットを探す」→ カメラに戻る
  if (goal){ goal.addEventListener('click', e=>{ e.preventDefault(); parent.postMessage({ type: 'goal' }, '*'); }); }                // 「スタンプ帳を見る」
} else {
  // QRコードから直接開いたとき:「次のスポットを探す」で、ARのカメラ画面(自動起動)へ
  const next = document.getElementById('nextBtn');
  if (next){ next.style.display = 'inline-block'; next.addEventListener('click', ()=> { location.href = '../index.html?auto=1'; }); }
}
