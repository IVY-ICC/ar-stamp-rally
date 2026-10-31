/* ③ 迷路暗号(spot3)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot3-meiro.css、文言は ../../spots/spot3-meiro.html にあります。
 */
// 迷路: # = 壁, . = 通路
const MAP = [
  '...#...',
  '##.#.#.',
  '.....#.',
  '.#####.',
  '.......',
  '######.',
  '.......'
];
// 文字の位置 '行,列' : 文字
const LETTERS = { '2,1':'D', '0,6':'B', '6,0':'E', '4,0':'A', '4,3':'C', '2,0':'F' };
const ORDER = ['D','B','E'];
const ANSWER = 'CAD';
const CHOICES = ['CAD','CAB','BAD','DAB'];
const ROWS = MAP.length, COLS = MAP[0].length;
let pr = 0, pc = 0, nextIdx = 0, picked = [], badSteps = new Set();
let gameStarted = false, cleared = false, phase = 'maze';

const gameLayer = document.getElementById('gameLayer');
const mazeEl = document.getElementById('maze');
const gotEl = document.getElementById('got');
const dpad = document.getElementById('dpad');
const choicesEl = document.getElementById('choices');
const qText = document.getElementById('qText');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }

function cellSize(){
  const byW = Math.floor((Math.min(window.innerWidth*0.92, 440) - 12 - (COLS-1)*2) / COLS);
  const byH = Math.floor((window.innerHeight - 484) / ROWS);   // 下に4択ぶんの場所を残す
  return Math.max(24, Math.min(36, byW, byH));
}
function render(){
  const cs = cellSize();
  mazeEl.style.gridTemplateColumns = 'repeat(' + COLS + ',' + cs + 'px)';
  mazeEl.style.gridAutoRows = cs + 'px';
  mazeEl.innerHTML = '';
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++){
    const el = document.createElement('div');
    const wall = MAP[r][c]==='#';
    el.className = 'c ' + (wall ? 'w' : (r===0&&c===0 ? 's' : 'o'));
    el.style.fontSize = cs + 'px';
    const key = r+','+c;
    if (!wall && LETTERS[key]){
      const L = LETTERS[key];
      const l = document.createElement('div'); l.className = 'l' + (picked.includes(L) ? ' done' : '') + (badSteps.has(key) ? ' bad' : '');
      l.textContent = L; el.appendChild(l);
    }
    if (r===pr && c===pc){ const p = document.createElement('div'); p.textContent = '🧑‍💻'; p.style.fontSize = (cs*0.62)+'px'; p.style.position='absolute'; el.style.position='relative'; el.appendChild(p); }
    mazeEl.appendChild(el);
  }
  gotEl.textContent = '拾った文字: ' + [0,1,2].map(i=> picked[i] || '_').join(' ');
}
function move(dir){
  if (cleared || phase !== 'maze') return;
  let r = pr, c = pc;
  if (dir==='U') r--; if (dir==='D') r++; if (dir==='L') c--; if (dir==='R') c++;
  if (r<0||c<0||r>=ROWS||c>=COLS||MAP[r][c]==='#') return;
  pr = r; pc = c;
  const key = r+','+c, L = LETTERS[key];
  if (L && !picked.includes(L)){
    if (L === ORDER[nextIdx]){ picked.push(L); nextIdx++; resultBadge.style.display='none'; }
    else if (!badSteps.has(key)){ badSteps.add(key); addMistake(); setResult('その文字は、いま拾う順番ではないよ(まちがい ' + spotMistakes() + '回)'); }
  }
  render();
  if (picked.length === ORDER.length) toChoices();
}
function toChoices(){
  phase = 'answer';
  dpad.classList.add('off'); choicesEl.style.display = 'grid'; choicesEl.classList.add('wait');
  resultBadge.style.display = 'none';
  setTimeout(()=> choicesEl.classList.remove('wait'), 1200);   // 連打で誤タップしないよう、少しだけ待つ
  qText.innerHTML = '拾った <b>D・B・E</b> を、それぞれアルファベットで<b>1つ前の文字</b>に直して並べると、何になる?<br><span style="font-weight:600;font-size:12px">(ヒント: Dの1つ前は C)</span>';
}
dpad.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> move(b.dataset.d)));
document.addEventListener('keydown', e=>{ const m = {ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'}[e.key]; if (m) move(m); });
let sx=0, sy=0, sw=false;
mazeEl.addEventListener('pointerdown', e=>{ sx=e.clientX; sy=e.clientY; sw=true; });
mazeEl.addEventListener('pointerup', e=>{ if(!sw) return; sw=false; const dx=e.clientX-sx, dy=e.clientY-sy;
  if (Math.max(Math.abs(dx),Math.abs(dy)) < 20) return;
  move(Math.abs(dx)>Math.abs(dy) ? (dx>0?'R':'L') : (dy>0?'D':'U')); });

CHOICES.forEach(v=>{
  const b = document.createElement('button'); b.className='choice'; b.textContent = v;
  b.addEventListener('click', ()=>{
    if (cleared || b.classList.contains('ng')) return;
    if (v === ANSWER){ cleared = true; setResult('正解!'); setTimeout(showClear, 500); }
    else { b.classList.add('ng'); addMistake(); setResult('ちがいます(このスポットのまちがい ' + spotMistakes() + '回)'); }
  });
  choicesEl.appendChild(b);
});
function showClear(){
  markCleared();
  clearText.innerHTML = 'D→C、B→A、E→D と、1文字ずつずらして並べると「CAD」。<br>文字を一定のルールでずらす暗号を「シーザー暗号」といいます。<br>CADは、設計に使うソフトの名前(Computer Aided Design)です。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
window.addEventListener('resize', ()=>{ if(gameStarted) render(); });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; render(); }
});
