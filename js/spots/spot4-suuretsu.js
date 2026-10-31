/* ④ 数列(spot4)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot4-suuretsu.css、文言は ../../spots/spot4-suuretsu.html にあります。
 */
const SEQ = [2, 5, 11, 23, 47];      // 次の差: 3, 6, 12, 24 (2倍ずつ) → 次の差は48
const ANSWER = 95;
const CHOICES = [71, 94, 95, 96];
const gameLayer = document.getElementById('gameLayer');
const seqEl = document.getElementById('seq');
const choicesEl = document.getElementById('choices');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, cleared = false;
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }

function build(){
  SEQ.forEach((v,i)=>{
    const w = document.createElement('div'); w.className = 'cellw';
    const s = document.createElement('div'); s.className = 'shape s' + i; s.textContent = v;
    const g = document.createElement('div'); g.className = 'gap';
    s.addEventListener('click', ()=>{
      const next = (i < SEQ.length-1) ? SEQ[i+1] : ANSWER;
      if (i < SEQ.length-1) g.textContent = '→ +' + (next - v);
      else g.textContent = '→ ?';
    });
    w.appendChild(s); w.appendChild(g); seqEl.appendChild(w);
  });
  const w = document.createElement('div'); w.className = 'cellw';
  const q = document.createElement('div'); q.className = 'shape q'; q.textContent = '?';
  w.appendChild(q); w.appendChild(Object.assign(document.createElement('div'), {className:'gap'})); seqEl.appendChild(w);
  CHOICES.forEach(v=>{
    const b = document.createElement('button'); b.className = 'choice'; b.textContent = v;
    b.addEventListener('click', ()=>{
      if (cleared || b.classList.contains('ng')) return;
      if (v === ANSWER){ cleared = true; setResult('正解!'); setTimeout(showClear, 500); }
      else { b.classList.add('ng'); addMistake(); setResult('ちがいます(このスポットのまちがい ' + spotMistakes() + '回)'); }
    });
    choicesEl.appendChild(b);
  });
}
function showClear(){
  markCleared();
  clearText.innerHTML = '数の差は 3, 6, 12, 24 と、2倍ずつ増えています。<br>次の差は 48 なので、47 + 48 = 95。<br>(「2倍して1を足す」規則でも、47×2+1 = 95 です)<br>規則を見つけるときは、まず「差」を調べてみよう。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
document.getElementById('moreBtn').addEventListener('click', ()=>{ document.getElementById('h2').classList.remove('hidden'); document.getElementById('moreBtn').style.display='none'; });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; document.getElementById('exBtn').style.display='block'; build(); }
});
