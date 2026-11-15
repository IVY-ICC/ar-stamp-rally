// 「QRを読む」ボタン:押している間だけARの追跡を止めて、QRコードを読み取ります。
// QRは …/q/1/ 〜 …/q/9/ の形。読めたら、マーカーを読んだときと同じ問題ページを開きます。
(function(){
  const RE = /\/q\/([1-9])\/?(?:[?#].*)?$/;
  const sys = ()=> scene.systems['mindar-image-system'];
  const ov = document.createElement('div');
  ov.id = 'qrov';
  ov.style.cssText = 'display:none;position:fixed;left:0;right:0;top:0;z-index:30;padding:14px 12px;text-align:center;color:#fff;font:700 16px/1.5 sans-serif;background:rgba(11,32,55,.88)';
  ov.innerHTML = '<div>QRコードを、カメラに映してください</div><button id="qrStop" style="margin-top:8px;padding:8px 22px;border:0;border-radius:20px;background:#ffd66b;color:#0b2037;font:900 15px sans-serif">やめる</button>';
  document.body.appendChild(ov);
  const btn = document.createElement('button');
  btn.textContent = '📷 QRを読む';
  btn.style.cssText = 'border:0;border-radius:18px;padding:8px 14px;background:#fff;color:#0b2037;font:900 14px sans-serif';
  btn.style.display = 'none';   // マーカーが読めないまま一定時間たつと表示
  const bar = document.getElementById('bar');
  bar.insertBefore(btn, document.getElementById('goalBtn'));
  const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
  const det = ('BarcodeDetector' in window) ? (()=>{ try { return new BarcodeDetector({ formats: ['qr_code'] }); } catch(e){ return null; } })() : null;
  let timer = null, busy = false;

  function stop(resume){
    clearInterval(timer); timer = null; ov.style.display = 'none';
    if (resume) { try { sys().unpause(); } catch(e){} }
  }
  async function readOnce(){
    if (busy) return; busy = true;
    try {
      const v = document.querySelector('video');
      if (!v || v.readyState < 2 || !v.videoWidth) return;
      let text = null;
      if (det) { const r = await det.detect(v); if (r.length) text = r[0].rawValue; }
      else if (typeof jsQR !== 'undefined') {
        const w = 640, h = Math.round(w * v.videoHeight / v.videoWidth);
        cv.width = w; cv.height = h; cx.drawImage(v, 0, 0, w, h);
        const r = jsQR(cx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
        if (r) text = r.data;
      }
      const m = text && RE.exec(text); if (!m) return;
      const s = APP_CONFIG.SPOTS[Number(m[1]) - 1]; if (!s) return;
      stop(true);
      if (navigator.vibrate) { try { navigator.vibrate(60); } catch(e){} }
      show('./' + s.page + '?embed=1', false);
    } catch(e){} finally { busy = false; }
  }
  btn.addEventListener('click', ()=>{
    if (open || timer) return;
    try { sys().pause(true); } catch(e){}      // ARの追跡だけ止める(カメラ映像は残す)
    ov.style.display = 'block';
    timer = setInterval(readOnce, 250);
  });
  // AR画面で12秒たってもマーカーが読めなければ、ボタンを表示。問題ページを開いたら、数え直し
  let idle = 0;
  setInterval(()=>{
    if (open || timer || bar.style.display !== 'flex') { idle = 0; if (open) btn.style.display = 'none'; return; }
    if (++idle >= 12) btn.style.display = '';
  }, 1000);
  document.getElementById('qrStop').addEventListener('click', ()=> stop(true));
})();
