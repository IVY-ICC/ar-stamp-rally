/* ① サーバーラック(spot1)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot1-rack.css、文言は ../../spots/spot1-rack.html にあります。
 */
const TOTAL = 12, REMOVE = 3; // 12 × 1/4 = 3台撤去 → 残り9台
const gameLayer = document.getElementById('gameLayer');
const rack = document.getElementById('rack');
const counter = document.getElementById('counter');
const doBtn = document.getElementById('doBtn');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, cleared = false, lastTried = -1;
const off = new Array(TOTAL).fill(false);

function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }
function removedCount(){ return off.filter(Boolean).length; }
function refresh(){ const r = removedCount(); counter.textContent = '撤去:' + r + '台 / 残り:' + (TOTAL - r) + '台'; }
function build(){
  for (let i=0;i<TOTAL;i++){
    const el = document.createElement('div'); el.className='srv';
    el.innerHTML = 'No.' + (i+1) + '<span><i class="led"></i><i class="led b"></i></span>';
    el.querySelectorAll('i').forEach(x=>{ x.style.display='inline-block'; });
    el.addEventListener('click', ()=>{ if(cleared) return; off[i] = !off[i]; el.classList.toggle('off', off[i]); resultBadge.style.display='none'; refresh(); });
    rack.appendChild(el);
  }
}
doBtn.addEventListener('click', ()=>{
  if (cleared) return;
  const r = removedCount();
  if (r === REMOVE){ cleared = true; setResult('正解!'); setTimeout(showClear, 500); return; }
  if (r === lastTried){ setResult('さっきと同じ台数です。考え直してみよう'); return; }
  lastTried = r; addMistake();
  setResult('撤去する台数が違うようです(このスポットのまちがい ' + spotMistakes() + '回)');
});
function showClear(){
  markCleared();
  clearText.innerHTML = '12台の 1/4 = 12 × 1/4 = 3台 を撤去します。<br>残りは 12 − 3 = 9台 です。<br>「全体のうちの割合」は、実際の台数や人数に直して考えます。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; build(); refresh(); }
});
