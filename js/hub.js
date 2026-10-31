/* index.html(入口・カメラ)の動き:カメラ起動、マーカー読み取り→問題ページ表示、スタンプ帳 */
// マーカーの順番(targetIndex 0〜8)→ 問題ページ。順番は js/config.js の MARKER_ORDER で決めます。
const FILES = APP_CONFIG.MARKER_ORDER.map(key => APP_CONFIG.SPOTS.find(s => s.key === key).page);
const frame = document.getElementById('frame');
const scene = document.getElementById('scene');
let open = false;

function clearedCount(){
  try { return Object.keys(JSON.parse(localStorage.getItem('ivyArStampCleared') || '{}')).length; } catch(e){ return 0; }
}
function refreshBar(){ document.getElementById('stamps').textContent = 'スタンプ ' + clearedCount() + ' / 9'; }
function show(url, isGoal){
  open = true; frame.className = isGoal ? 'goal' : ''; frame.src = url; frame.style.display = 'block';
  document.getElementById('bar').style.display = 'none'; document.getElementById('hint').style.display = 'none';
}
function closeFrame(){
  frame.style.display = 'none'; frame.src = 'about:blank'; open = false;
  document.getElementById('bar').style.display = 'flex'; document.getElementById('hint').style.display = 'block';
  refreshBar();
}
FILES.forEach((f, i)=>{
  document.getElementById('t' + i).addEventListener('targetFound', ()=>{
    if (open) return;
    if (navigator.vibrate) { try { navigator.vibrate(60); } catch(e){} }
    show('./' + f + '?embed=1', false);   // 問題ページを、カメラの上に重ねて表示
  });
});
window.addEventListener('message', e=>{
  const d = e.data || {};
  if (d.type === 'close') closeFrame();
  else if (d.type === 'goal') show('./goal.html?embed=1', true);
  else if (d.type === 'cleared') refreshBar();
});
document.getElementById('goalBtn').addEventListener('click', ()=> show('./goal.html?embed=1', true));

// all.mind が見つからないときは、原因が分かるメッセージを出す
fetch('./ar/all.mind', { method: 'HEAD' }).then(r=>{ if(!r.ok) throw 0; }).catch(()=>{
  const e = document.getElementById('err'); e.innerHTML = '読み取りデータ(ar/all.mind)が見つかりません。<br>管理者に連絡してください。'; e.style.display = 'flex';
});
async function startCamera(){
  document.getElementById('goBtn').disabled = true;
  try {
    const sys = scene.systems['mindar-image-system'];
    await sys.start();
    const ensurePlay = ()=>{
      const v = document.querySelector('video'); if (!v) return;
      v.setAttribute('playsinline',''); v.muted = true;
      if (v.paused){ v.play().then(()=>{ document.getElementById('playBtn').style.display='none'; }).catch(()=>{ document.getElementById('playBtn').style.display='block'; }); }
    };
    ensurePlay(); setTimeout(ensurePlay, 500); setTimeout(ensurePlay, 1500);
    document.getElementById('playBtn').onclick = ()=>{ const v=document.querySelector('video'); if(v) v.play(); document.getElementById('playBtn').style.display='none'; };
    const fit = ()=> window.dispatchEvent(new Event('resize'));
    fit(); setTimeout(fit, 300); setTimeout(fit, 1000); window.addEventListener('orientationchange', ()=> setTimeout(fit, 300));
    try { sessionStorage.setItem('ivyArCam', '1'); } catch(e){}
    document.getElementById('start').style.display = 'none';
    document.getElementById('bar').style.display = 'flex'; document.getElementById('hint').style.display = 'block';
    refreshBar();
  } catch(err){
    document.getElementById('goBtn').disabled = false;
    if (!window.__auto) document.getElementById('err').style.display = 'flex';
  }
}
document.getElementById('goBtn').addEventListener('click', startCamera);
// 2回目以降(スタンプ帳から戻ったときなど)は、スタート画面を挟まず自動でカメラを起動
let wantAuto = /[?&]auto=1/.test(location.search);
try { if (sessionStorage.getItem('ivyArCam') === '1') wantAuto = true; } catch(e){}
if (wantAuto){
  window.__auto = true;
  document.getElementById('start').style.display = 'none';
  const go = ()=> startCamera().then(()=>{ if (document.getElementById('start').style.display === 'none' && document.getElementById('bar').style.display !== 'flex') document.getElementById('start').style.display = 'flex'; });
  if (scene.hasLoaded) go(); else scene.addEventListener('loaded', go);
}
