/* ⑥ 2進数(spot6)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot6-binary.css、文言は ../../spots/spot6-binary.html にあります。
 */
// カード(2進数) と 正しい枠(10進数)
const CARDS = [ {id:'c2', bin:'10', slot:0}, {id:'c3', bin:'11', slot:1}, {id:'c4', bin:'100', slot:2}, {id:'c5', bin:'101', slot:3} ];
const SLOT_NUMS = [2,3,4,5];
const gameLayer = document.getElementById('gameLayer');
const qBox = document.getElementById('qBox');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const checkBtn = document.getElementById('checkBtn');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');
let W, H, sw = 140, sh = 58, cw = 76, ch = 48;
let slotPos = [], homePos = [];
let slotEls = [], cardEls = {};
let slotOfCard = {}, cardInSlot = [null,null,null,null], homeIndex = {};
let lastSig = '', cleared = false, gameStarted = false;
function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }

function layout(){
  W = window.innerWidth; H = window.innerHeight;
  const topY = qBox.getBoundingClientRect().bottom + 16;
  const gap = 12, usable = Math.min(W*0.92, 440);
  sw = (usable - gap) / 2; sh = Math.max(50, Math.min(64, (H - topY - 230) / 3.2));
  const x0 = W/2 - usable/2;
  slotPos = [0,1,2,3].map(i=>({ x: x0 + (i%2)*(sw+gap) + sw/2, y: topY + Math.floor(i/2)*(sh+gap) + sh/2 }));
  cw = (usable - 3*8) / 4; ch = Math.max(44, sh*0.85);
  const ty = topY + 2*(sh+gap) + 24 + ch/2;
  homePos = [0,1,2,3].map(i=>({ x: x0 + i*(cw+8) + cw/2, y: ty }));
  slotEls.forEach((el,i)=>{ el.style.width=sw+'px'; el.style.height=sh+'px'; el.style.left=(slotPos[i].x-sw/2)+'px'; el.style.top=(slotPos[i].y-sh/2)+'px'; });
  CARDS.forEach(c=>{ const el=cardEls[c.id]; el.style.width=cw+'px'; el.style.height=ch+'px'; el.style.fontSize=Math.min(22, cw*0.3)+'px'; });
  renderCards();
}
function renderCards(){
  CARDS.forEach(c=>{ const k = slotOfCard[c.id]; const p = (k===null||k===undefined) ? homePos[homeIndex[c.id]] : slotPos[k];
    const el = cardEls[c.id]; const w = (k===null||k===undefined) ? cw : Math.min(cw, sw*0.5);
    el.style.width = w+'px'; el.style.left=(p.x - w/2 - ((k===null||k===undefined)?0:sw*0.18))+'px'; el.style.top=(p.y-ch/2)+'px'; });
}
function build(){
  SLOT_NUMS.forEach((n,i)=>{ const el=document.createElement('div'); el.className='slot'; el.innerHTML='<span class="lb">10進数</span><span class="nm">'+n+'</span>'; gameLayer.appendChild(el); slotEls.push(el); });
  const order=[0,1,2,3].sort(()=>Math.random()-0.5);
  CARDS.forEach((c,i)=>{ homeIndex[c.id]=order[i]; slotOfCard[c.id]=null;
    const el=document.createElement('div'); el.className='card'; el.textContent=c.bin; gameLayer.appendChild(el); cardEls[c.id]=el; makeDraggable(c.id, el); });
}
function makeDraggable(id, el){
  let dragging=false, offX=0, offY=0;
  el.addEventListener('pointerdown', e=>{ if(cleared) return; dragging=true; try{el.setPointerCapture(e.pointerId);}catch(err){}
    const r=el.getBoundingClientRect(); offX=e.clientX-r.left; offY=e.clientY-r.top; el.style.zIndex=999; });
  el.addEventListener('pointermove', e=>{ if(!dragging) return; el.style.left=(e.clientX-offX)+'px'; el.style.top=(e.clientY-offY)+'px'; });
  const end=()=>{ if(!dragging) return; dragging=false; el.style.zIndex=35; drop(id); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
function drop(id){
  const r=cardEls[id].getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
  let best=-1, bd=Infinity;
  slotPos.forEach((p,k)=>{ const d=Math.hypot(cx-p.x, cy-p.y); if(d<bd){bd=d;best=k;} });
  const prev = slotOfCard[id];
  if (bd < sw*0.7){
    const occ = cardInSlot[best];
    if (occ && occ!==id){ if(prev!==null){ cardInSlot[prev]=occ; slotOfCard[occ]=prev; } else { slotOfCard[occ]=null; } }
    else if (prev!==null && prev!==best){ cardInSlot[prev]=null; }
    cardInSlot[best]=id; slotOfCard[id]=best;
  } else { if(prev!==null) cardInSlot[prev]=null; slotOfCard[id]=null; }
  renderCards();
}
checkBtn.addEventListener('click', ()=>{
  if (cleared) return;
  if (CARDS.some(c=>slotOfCard[c.id]===null)){ setResult('4枚すべてを、枠の中に置いてください'); return; }
  const correct = CARDS.filter(c=>slotOfCard[c.id]===c.slot).length;
  if (correct===CARDS.length){ cleared=true; setResult('正解!'); setTimeout(showClear,600); return; }
  const sig = CARDS.map(c=>c.id+':'+slotOfCard[c.id]).join('|');
  if (sig===lastSig){ setResult('さっきと同じ並びです。別の並びを試してみよう'); return; }
  lastSig=sig; addMistake();
  setResult('いま '+correct+'枚 合っています(このスポットのまちがい '+spotMistakes()+'回)');
});
function showClear(){
  markCleared();
  clearText.innerHTML='10 = 2、11 = 2+1 = 3、100 = 4、101 = 4+1 = 5。<br>2進数は、右から 1・2・4・8… と、2倍ずつ大きくなる位で数えます。<br>桁が1つ増えるたびに、2倍になります。';
  scoreText.textContent='このスポットのまちがい '+spotMistakes()+'回 / 合計 '+totalMistakes()+'回';
  clearScreen.classList.add('show');
}
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
window.addEventListener('resize', ()=>{ if(gameStarted) layout(); });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; qBox.style.display='block'; checkBtn.style.display='block'; document.getElementById('exBtn').style.display='block'; build(); layout(); }
});
