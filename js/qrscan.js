// AR画面のカメラ映像から、QRコード(…/q/1/〜/q/9/)も読み取る補助機能。
// QRを映すと、マーカーを読んだときと同じ問題ページが開きます。
(function(){
  if (typeof jsQR === 'undefined') return;
  const RE = /\/q\/([1-9])\/?(?:[?#].*)?$/;
  const cv = document.createElement('canvas');
  const cx = cv.getContext('2d', { willReadFrequently: true });
  setInterval(()=>{
    try {
      if (typeof open !== 'undefined' && open) return;
      const v = document.querySelector('video');
      if (!v || v.readyState < 2 || !v.videoWidth) return;
      const w = 640, h = Math.round(w * v.videoHeight / v.videoWidth);
      cv.width = w; cv.height = h;
      cx.drawImage(v, 0, 0, w, h);
      const r = jsQR(cx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (!r) return;
      const m = RE.exec(r.data); if (!m) return;
      const s = APP_CONFIG.SPOTS[Number(m[1]) - 1]; const page = s && s.page; if (!page) return;
      show('./' + page + '?embed=1', false);
    } catch (e) {}
  }, 300);
})();
