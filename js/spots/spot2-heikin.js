/* ② 平均(spot2)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot2-heikin.css、文言は ../../spots/spot2-heikin.html にあります。
 */
const ANSWER = 18; // 30×5 − (24+30+36+42)
const CHOICES = [12, 15, 18, 21];
const gameLayer = document.getElementById('gameLayer');
const fog = document.getElementById('fog'), fctx = fog.getContext('2d');
const fogMsg = document.getElementById('fogMsg');
const tableCard = document.getElementById('tableCard');
const qCard = document.getElementById('qCard');
const choicesEl = document.getElementById('choices');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let gameStarted = false, revealed = false, cleared = false;
let cw = 0, ch = 0, cell = 14, cols = 0, rows = 0, touched = null, touchedCount = 0;

function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }

function drawFog(){
  const r = tableCard.getBoundingClientRect();
  cw = Math.round(r.width); ch = Math.round(r.height);
  fog.width = cw; fog.height = ch;
  const g = fctx.createLinearGradient(0,0,0,ch);
  g.addColorStop(0,'#8a8173'); g.addColorStop(1,'#6f675b');
  fctx.globalCompositeOperation = 'source-over';
  fctx.fillStyle = g; fctx.fillRect(0,0,cw,ch);
  fctx.fillStyle = 'rgba(210,200,185,0.45)';
  for (let i=0;i<16;i++){ fctx.beginPath(); fctx.arc(Math.random()*cw, Math.random()*ch, 14+Math.random()*30, 0, Math.PI*2); fctx.fill(); }
  fctx.fillStyle = 'rgba(40,34,28,0.5)';
  for (let i=0;i<90;i++){ fctx.fillRect(Math.random()*cw, Math.random()*ch, 2+Math.random()*3, 2+Math.random()*3); }
  cols = Math.ceil(cw/cell); rows = Math.ceil(ch/cell);
  touched = new Uint8Array(cols*rows); touchedCount = 0;
}
function erase(x,y){
  fctx.globalCompositeOperation = 'destination-out';
  fctx.beginPath(); fctx.arc(x,y,26,0,Math.PI*2); fctx.fill();
  const x0=Math.max(0,Math.floor((x-24)/cell)), x1=Math.min(cols-1,Math.floor((x+24)/cell));
  const y0=Math.max(0,Math.floor((y-24)/cell)), y1=Math.min(rows-1,Math.floor((y+24)/cell));
  for (let j=y0;j<=y1;j++) for (let i=x0;i<=x1;i++){ const k=j*cols+i; if(!touched[k]){ touched[k]=1; touchedCount++; } }
  if (!revealed && touchedCount/(cols*rows) > 0.6) reveal();
}
function reveal(){
  revealed = true;
  fog.style.opacity = 0; fog.style.pointerEvents = 'none'; fogMsg.style.opacity = 0;
  qCard.style.display = 'block';
}
let down = false;
function pos(e){ const r = fog.getBoundingClientRect(); return { x:e.clientX-r.left, y:e.clientY-r.top }; }
fog.addEventListener('pointerdown', e=>{ down = true; try{ fog.setPointerCapture(e.pointerId); }catch(err){} const p=pos(e); erase(p.x,p.y); });
fog.addEventListener('pointermove', e=>{ if(!down) return; const p=pos(e); erase(p.x,p.y); });
['pointerup','pointercancel'].forEach(ev=> fog.addEventListener(ev, ()=>{ down=false; }));

function buildChoices(){
  CHOICES.forEach(v=>{
    const b = document.createElement('button'); b.className='choice'; b.textContent = v + '人';
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
  clearText.innerHTML = '平均 = 合計 ÷ 個数 なので、合計 = 平均 × 個数 です。<br>5日間の合計は 30 × 5 = 150人。<br>わかっている4日の合計は 24+30+36+42 = 132人。<br>水曜日は 150 − 132 = 18人 です。';
  scoreText.textContent = 'このスポットのまちがい ' + spotMistakes() + '回 / 合計 ' + totalMistakes() + '回';
  clearScreen.classList.add('show');
}
window.addEventListener('resize', ()=>{ if(gameStarted && !revealed) drawFog(); });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; buildChoices(); setTimeout(drawFog, 50); }
});
