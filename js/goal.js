/* goal.html(スタンプ帳)の動き:スタンプ表示、景品の判定、確認コード、係の人用の受け取り済み操作 */
// ===== 設定は js/config.js にあります(暗証番号・景品の個数・スポット一覧) =====
const STAFF_PIN = APP_CONFIG.STAFF_PIN;
const PRIZE = APP_CONFIG.PRIZE;
const SPOTS = APP_CONFIG.SPOTS.map(s => [s.key, s.no, s.name, s.icon]);
// ============================================
function load(key){ try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : {}; } catch(e){ return {}; } }
function raw(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
const cleared = load('ivyArStampCleared');
const mist = load('ivyArStampMistakes');
const start = Number(raw('ivyArStampStart')) || 0;
let done = 0, total = 0, last = 0;
const grid = document.getElementById('grid');
SPOTS.forEach(([k,no,nm,ic])=>{
  const ok = !!cleared[k]; if (ok){ done++; last = Math.max(last, Number(cleared[k])||0); }
  const d = document.createElement('div'); d.className = 'stamp' + (ok ? ' done' : '');
  d.innerHTML = '<div class="no">'+no+'</div><div class="mk">'+(ok ? ic : '？')+'</div><div class="nm">'+nm+'</div>';
  grid.appendChild(d);
});
Object.values(mist).forEach(v=> total += Number(v)||0);
document.getElementById('cnt').textContent = done + ' / 9';
document.getElementById('mis').textContent = total + '回';
if (start && last && done > 0){
  const m = Math.max(1, Math.round((last - start) / 60000));
  document.getElementById('dur').textContent = (m >= 60 ? Math.floor(m/60) + '時間' : '') + (m % 60) + '分';
}
// 景品
let tag = '', big = '', txt = '';
if (done === 0){ tag = 'まだスタンプがありません'; big = '🎯'; txt = 'スポットのマーカーを見つけて、問題に挑戦しよう!'; }
else if (done < 9){ tag = '参加賞'; big = '景品 ' + PRIZE.partial + '個'; txt = 'あと ' + (9 - done) + ' スポットで完走! 完走すると もっともらえるよ。'; }
else if (total === 0){ tag = '🎉 完走・まちがい0回!'; big = '景品 ' + PRIZE.perfect + '個'; txt = 'すばらしい! 全問ノーミスでした。'; }
else { tag = '🏅 完走!'; big = '景品 ' + PRIZE.complete + '個'; txt = '9スポットすべてクリア! おつかれさまでした。'; }
document.getElementById('prize').innerHTML = '<span class="tag">'+tag+'</span><div class="big">'+big+'</div><div class="txt">'+txt+'</div>';
// 確認コード(スタンプ数・まちがい数・最終クリア時刻から計算)
function hash(s){ let h = 5381; for (let i=0;i<s.length;i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36).toUpperCase().padStart(6,'0').slice(-6); }
document.getElementById('code').textContent = hash(done + '|' + total + '|' + last + '|' + start);
// 時計
function tick(){ const d = new Date(); const p = n=> String(n).padStart(2,'0'); document.getElementById('clock').textContent = p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds()); }
tick(); setInterval(tick, 1000);
// 受け取り済み
function showReceived(){ const t = raw('ivyArStampReceived'); if (t){ const r = document.getElementById('received'); r.style.display = 'block'; const d = new Date(Number(t)); r.textContent = '✅ 景品は受け取り済みです(' + d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0') + ')'; } }
showReceived();
document.getElementById('recvBtn').addEventListener('click', ()=>{
  const m = document.getElementById('msg');
  if (document.getElementById('pin').value !== STAFF_PIN){ m.textContent = '暗証番号がちがいます'; return; }
  if (raw('ivyArStampReceived')){ m.textContent = 'すでに受け取り済みです'; return; }
  try { localStorage.setItem('ivyArStampReceived', String(Date.now())); } catch(e){}
  m.textContent = '受け取り済みにしました'; showReceived();
});
if (/[?&]embed=1/.test(location.search) || window.parent !== window){
  document.getElementById('camBtn').addEventListener('click', e=>{ e.preventDefault(); parent.postMessage({type:'close'}, '*'); });
}
if (done < 9){
  const rest = SPOTS.filter(s=>!cleared[s[0]]).map(s=>s[1]+s[2]).join(' ・ ');
  const n = document.createElement('div'); n.className='nextHint'; n.textContent = '未クリア: ' + rest;
  document.querySelector('.card').appendChild(n);
}
