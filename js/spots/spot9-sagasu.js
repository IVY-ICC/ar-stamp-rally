/* ⑨ 間違い探し(spot9)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot9-sagasu.css、文言は ../../spots/spot9-sagasu.html にあります。
 */
const COLS = 10, ROWS = 10;
const gameLayer = document.getElementById('gameLayer');
const grid = document.getElementById('grid');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, cleared = false;
const wrong = new Set(), found = new Set();
let foundO = 0, foundI = 0;
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }
function updateProg(){ document.getElementById('prog').textContent = '見つけた数  O: ' + foundO + '/3  ・  I: ' + foundI + '/3'; }

function build(){
  const avail = Math.min(window.innerWidth*0.92, 440) - 12;
  const cw = Math.floor((avail - (COLS-1)*1) / COLS);
  const top = document.getElementById('qBox').getBoundingClientRect().bottom + 10;
  const ch = Math.max(24, Math.min(cw, Math.floor((window.innerHeight - top - 30) / ROWS) - 1));
  grid.style.gridTemplateColumns = 'repeat(' + COLS + ',' + cw + 'px)';
  grid.style.gridAutoRows = ch + 'px'; grid.style.gap = '1px'; grid.style.padding = '6px';
  grid.style.width = 'fit-content'; grid.style.margin = '10px auto 0';
  const idx = [];
  while (idx.length < 6){ const r = Math.floor(Math.random() * COLS * ROWS); if (!idx.includes(r)) idx.push(r); }
  const oddMap = {}; idx.forEach((v,k)=>{ oddMap[v] = (k < 3 ? 'O' : 'I'); });
  for (let i=0;i<COLS*ROWS;i++){
    const el = document.createElement('div'); el.className = 'ch';
    el.textContent = oddMap[i] || (Math.random() < 0.5 ? '0' : '1');
    el.style.fontSize = Math.min(Math.min(cw,ch)*0.74, 24) + 'px';
    el.addEventListener('click', ()=>{
      if (cleared) return;
      if (oddMap[i]){
        if (found.has(i)) return;
        found.add(i); el.style.background = '#59c98a';
        if (oddMap[i] === 'O') foundO++; else foundI++;
        updateProg(); resultBadge.style.display = 'none';
        if (foundO === 3 && foundI === 3){ cleared = true; setResult('全部見つけた!'); setTimeout(showClear, 600); }
      } else if (!wrong.has(i)){
        wrong.add(i); el.classList.add('ng'); addMistake();
        setResult('それは「' + el.textContent + '」です(このスポットのまちがい ' + spotMistakes() + '回)');
      }
    });
    grid.appendChild(el);
  }
}
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
function showClear(){
  markCleared();
  clearText.innerHTML = '数字の「0」「1」と、アルファベットの「O」「I」は、とてもよく似ています。<br>プログラムでは、この見まちがいが原因で動かなくなる(バグ)ことがあります。<br>最後まで、おつかれさまでした!';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; document.getElementById('exBtn').style.display='block'; build(); }
});
