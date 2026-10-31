/* ⑤ ベン図(spot5)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot5-venn.css、文言は ../../spots/spot5-venn.html にあります。
 */
const ALL = 100, PY = 60, JV = 45, BOTH = 25;
const ONLY_PY = PY - BOTH;           // 35
const ONLY_JV = JV - BOTH;           // 20
const ANSWER = ALL - (ONLY_PY + BOTH + ONLY_JV);  // 20
const gameLayer = document.getElementById('gameLayer');
const valEl = document.getElementById('val');
const tN = document.getElementById('tN');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, cleared = false, value = 0, lastTried = -1;
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }
function showVal(){ valEl.textContent = value + '人'; tN.textContent = value; }
document.getElementById('hP').addEventListener('click', ()=>{ document.getElementById('tP').textContent = ONLY_PY; });
document.getElementById('hJ').addEventListener('click', ()=>{ document.getElementById('tJ').textContent = ONLY_JV; });
document.getElementById('minus').addEventListener('click', ()=>{ if(!cleared){ value = Math.max(0, value-1); showVal(); } });
document.getElementById('plus').addEventListener('click', ()=>{ if(!cleared){ value = Math.min(100, value+1); showVal(); } });
document.getElementById('decide').addEventListener('click', ()=>{
  if (cleared) return;
  if (value === ANSWER){ cleared = true; setResult('正解!'); setTimeout(showClear, 500); return; }
  if (value === lastTried){ setResult('さっきと同じ数です。考え直してみよう'); return; }
  lastTried = value; addMistake();
  setResult('ちがうようです(このスポットのまちがい ' + spotMistakes() + '回)');
});
function showClear(){
  markCleared();
  clearText.innerHTML = 'Pythonだけ 35人 + 両方 25人 + Javaだけ 20人 = 80人。<br>100 − 80 = 20人 が、どちらも学んでいない人です。<br>(式: 100 − (60 + 45 − 25) = 20)<br>「両方」を2回数えないのがポイントです。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
document.getElementById('moreBtn').addEventListener('click', ()=>{ document.getElementById('h2').classList.remove('hidden'); document.getElementById('moreBtn').style.display='none'; });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; document.getElementById('exBtn').style.display='block'; showVal(); }
});
