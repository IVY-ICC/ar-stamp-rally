/* ⑦ 五大装置(spot7)の問題とゲームの動き
 * - 共通の関数(addMistake / spotMistakes / totalMistakes / markCleared)は ../common.js にあります。
 * - 問題の数字・選択肢・正解は、このファイルの上のほうにある定数(ANSWER, CHOICES など)を書き換えます。
 * - 見た目は ../../css/spots/spot7-godai.css、文言は ../../spots/spot7-godai.html にあります。
 */
const DEVICES = [
  { id:'control', name:'制御装置', icon:'🎛️', slot:'A' },
  { id:'input',   name:'入力装置', icon:'⌨️', slot:'B' },
  { id:'memory',  name:'記憶装置', icon:'💾', slot:'C' },
  { id:'alu',     name:'演算装置', icon:'🧮', slot:'D' },
  { id:'output',  name:'出力装置', icon:'🖥️', slot:'E' },
];
const SLOT_KEYS = ['A','B','C','D','E'];
const gameLayer = document.getElementById('gameLayer');
const arrowCanvas = document.getElementById('arrowCanvas');
const actx = arrowCanvas.getContext('2d');
const clueBox = document.getElementById('clueBox');
const resultBadge = document.getElementById('resultBadge');
const resultText = document.getElementById('resultText');
const checkBtn = document.getElementById('checkBtn');
const clearScreen = document.getElementById('clearScreen');
const clearText = document.getElementById('clearText');
const scoreText = document.getElementById('scoreText');

let W, H, s = 80;
let slotPos = {}, homePos = [];
let slotEls = {}, cardEls = {};
let slotOfCard = {};
let cardInSlot = {};
let homeIndex = {};
let lastSig = '';
let cleared = false, gameStarted = false;

function setResult(msg){ resultText.textContent = msg; resultBadge.style.display = 'block'; }

function layout(){
  W = window.innerWidth; H = window.innerHeight;
  arrowCanvas.width = W; arrowCanvas.height = H;
  const clueBottom = clueBox.getBoundingClientRect().bottom || 150;
  const topY = clueBottom + 14;
  s = Math.max(48, Math.min(W * 0.2, 104, (H - topY - 130) / 6.05));
  const spread = Math.min(W * 0.3, 260);
  const cx = W / 2, row0 = topY + s / 2, step = s * 1.3;
  slotPos = { A:{x:cx,y:row0}, D:{x:cx-s*0.6,y:row0+step}, C:{x:cx,y:row0+step*2}, B:{x:cx-spread,y:row0+step*2}, E:{x:cx+spread,y:row0+step*2} };
  const cardsY1 = row0 + step * 2 + s * 1.25, cardsY2 = cardsY1 + s * 1.12;
  homePos = [ {x:cx-spread,y:cardsY1},{x:cx,y:cardsY1},{x:cx+spread,y:cardsY1},{x:cx-spread/2,y:cardsY2},{x:cx+spread/2,y:cardsY2} ];
  SLOT_KEYS.forEach(k=>{ const el = slotEls[k]; el.style.width = s+'px'; el.style.height = s+'px'; el.style.left = (slotPos[k].x - s/2)+'px'; el.style.top = (slotPos[k].y - s/2)+'px'; });
  const cs = s * 0.94;
  DEVICES.forEach(d=>{ const el = cardEls[d.id]; el.style.width = cs+'px'; el.style.height = cs+'px';
    el.querySelector('.icon').style.fontSize = (cs*0.34)+'px'; el.querySelector('.name').style.fontSize = Math.max(10, cs*0.14)+'px'; });
  renderCards(); drawDiagram();
}
function renderCards(){
  const cs = s * 0.94;
  DEVICES.forEach(d=>{ const k = slotOfCard[d.id]; const p = k ? slotPos[k] : homePos[homeIndex[d.id]];
    const el = cardEls[d.id]; el.style.left = (p.x - cs/2)+'px'; el.style.top = (p.y - cs/2)+'px'; });
}
function arrowHead(x,y,ang){ actx.beginPath(); actx.moveTo(x,y); actx.lineTo(x-11*Math.cos(ang-0.45), y-11*Math.sin(ang-0.45)); actx.lineTo(x-11*Math.cos(ang+0.45), y-11*Math.sin(ang+0.45)); actx.closePath(); actx.fill(); }
function solidArrow(x1,y1,x2,y2,both){ actx.beginPath(); actx.moveTo(x1,y1); actx.lineTo(x2,y2); actx.stroke(); const ang = Math.atan2(y2-y1,x2-x1); arrowHead(x2,y2,ang); if (both) arrowHead(x1,y1,ang+Math.PI); }
function drawDiagram(){
  actx.clearRect(0,0,W,H);
  const h = s/2, gap = 4;
  const A=slotPos.A,B=slotPos.B,C=slotPos.C,D=slotPos.D,E=slotPos.E;
  // 青: 制御の流れ (制御装置 → 他の4つ)
  actx.save(); actx.strokeStyle='#5aa8ff'; actx.fillStyle='#5aa8ff'; actx.lineWidth=3;
  solidArrow(A.x-s*0.3,A.y+h+gap,A.x-s*0.3,D.y-h-gap,false);               // 制御→演算
  solidArrow(A.x+s*0.35,A.y+h+gap,A.x+s*0.35,C.y-h-gap,false);             // 制御→記憶
  actx.beginPath(); actx.moveTo(A.x-h,A.y); actx.lineTo(B.x,A.y); actx.lineTo(B.x,B.y-h-gap-8); actx.stroke();
  arrowHead(B.x,B.y-h-gap,Math.PI/2);                                       // 制御→入力
  actx.beginPath(); actx.moveTo(A.x+h,A.y); actx.lineTo(E.x,A.y); actx.lineTo(E.x,E.y-h-gap-8); actx.stroke();
  arrowHead(E.x,E.y-h-gap,Math.PI/2);                                       // 制御→出力
  actx.restore();
  // 赤: データの流れ
  actx.save(); actx.strokeStyle='#ff5a5a'; actx.fillStyle='#ff5a5a'; actx.lineWidth=3.5;
  solidArrow(B.x+h+gap,B.y,C.x-h-gap,C.y,false);                            // 入力→記憶
  solidArrow(C.x+h+gap,C.y,E.x-h-gap,E.y,false);                            // 記憶→出力
  solidArrow(D.x-s*0.2,D.y+h+gap,D.x-s*0.2,C.y-h-gap,false);                // 演算→記憶
  solidArrow(D.x+s*0.35,C.y-h-gap,D.x+s*0.35,D.y+h+gap,false);              // 記憶→演算
  solidArrow(A.x+s*0.12,C.y-h-gap,A.x+s*0.12,A.y+h+gap,false);              // 記憶→制御
  actx.restore();
}
function buildGame(){
  SLOT_KEYS.forEach(k=>{ const el=document.createElement('div'); el.className='slot'; gameLayer.appendChild(el); slotEls[k]=el; cardInSlot[k]=null; });
  const order=[0,1,2,3,4].sort(()=>Math.random()-0.5);
  DEVICES.forEach((d,i)=>{ homeIndex[d.id]=order[i]; slotOfCard[d.id]=null;
    const el=document.createElement('div'); el.className='card';
    el.innerHTML='<div class="icon">'+d.icon+'</div><div class="name">'+d.name+'</div>';
    gameLayer.appendChild(el); cardEls[d.id]=el; makeDraggable(d.id, el); });
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
  let best=null, bd=Infinity;
  SLOT_KEYS.forEach(k=>{ const d=Math.hypot(cx-slotPos[k].x, cy-slotPos[k].y); if(d<bd){bd=d;best=k;} });
  const prev=slotOfCard[id]||null;
  if (bd < s*0.85){
    const occ=cardInSlot[best];
    if (occ && occ!==id){ if(prev){ cardInSlot[prev]=occ; slotOfCard[occ]=prev; } else { slotOfCard[occ]=null; } }
    else if (prev && prev!==best){ cardInSlot[prev]=null; }
    cardInSlot[best]=id; slotOfCard[id]=best;
  } else { if(prev) cardInSlot[prev]=null; slotOfCard[id]=null; }
  renderCards();
}
checkBtn.addEventListener('click', ()=>{
  if (cleared) return;
  if (DEVICES.some(d=>!slotOfCard[d.id])){ setResult('5枚すべてを、枠の中に置いてください'); return; }
  const correctCount = DEVICES.filter(d=>slotOfCard[d.id]===d.slot).length;
  if (correctCount===5){ cleared=true; setResult('正解!'); setTimeout(showClear,600); return; }
  const sig = DEVICES.map(d=>d.id+':'+slotOfCard[d.id]).join('|');
  if (sig===lastSig){ setResult('さっきと同じ並びです。別の並びを試してみよう'); return; }
  lastSig=sig; addMistake();
  setResult('いま '+correctCount+'枚 合っています(このスポットのまちがい '+spotMistakes()+'回)');
});
function showClear(){
  markCleared();
  clearText.innerHTML='五大装置は、コンピュータを構成する5つの装置です。<br>入力装置から入ったデータは、記憶装置に保存され、<br>演算装置とやり取りしながら処理されて、出力装置から出ます。<br>それらすべてに、制御装置が指示を出しています。';
  scoreText.textContent='このスポットのまちがい '+spotMistakes()+'回 / 合計 '+totalMistakes()+'回';
  clearScreen.classList.add('show');
}
document.getElementById('exBtn').addEventListener('click', ()=> document.getElementById('exModal').classList.add('show'));
document.getElementById('exClose').addEventListener('click', ()=> document.getElementById('exModal').classList.remove('show'));
window.addEventListener('resize', ()=>{ if(gameStarted) layout(); });
// 問題を表示する(マーカーを読み取ると、この関数が呼ばれます)
Spot.onStart(()=>{
  if(!gameStarted){ gameStarted=true; gameLayer.style.display='block'; clueBox.style.display='block'; checkBtn.style.display='block'; document.getElementById('exBtn').style.display='block'; buildGame(); layout(); }
});
