/* ⑧ 増加率(spot8)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot8-zouka.css、文言は ../../spots/spot8-zouka.html にあります。
 */
const BASE = 250, NEXT = 300;
const ANSWER = Math.round((NEXT - BASE) / BASE * 100);   // 20
const gameLayer = document.getElementById('gameLayer');
const sl = document.getElementById('sl'), pct = document.getElementById('pct'), calc = document.getElementById('calc');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, cleared = false, lastTried = -1;
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }
sl.addEventListener('input', ()=>{ const v = Number(sl.value); pct.textContent = v + '%'; calc.textContent = BASE + '人の ' + v + '% 増し → ' + (Math.round(BASE * (1 + v/100) * 10) / 10) + '人'; });
document.getElementById('decide').addEventListener('click', ()=>{
  if (cleared) return;
  const v = Number(sl.value);
  if (v === ANSWER){ cleared = true; setResult('正解!'); setTimeout(showClear, 500); return; }
  if (v === lastTried){ setResult('さっきと同じ値です。考え直してみよう'); return; }
  lastTried = v; addMistake();
  setResult(v === 25 ? '基準は「今年の250人」だよ(まちがい ' + spotMistakes() + '回)' : 'ちがうようです(このスポットのまちがい ' + spotMistakes() + '回)');
});
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
function showClear(){
  markCleared();
  clearText.innerHTML = '来年に増える人数 = 300 − 250 = 50人<br>基準は「今年の250人」なので、50 ÷ 250 × 100 = 20%<br>(200人を基準にした 25% ではありません)<br>基準が変わると、同じ50人でも割合は変わります。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; document.getElementById('exBtn').style.display='block'; }
});
