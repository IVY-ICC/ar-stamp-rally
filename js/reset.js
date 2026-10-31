/* reset.html : このスマホ(ブラウザ)に保存された記録を消す
 * 消すもの: まちがい回数 / クリア記録 / 開始時刻 / 景品の受取記録
 * キー名は js/common.js と同じ。キーを変えたときは、ここも合わせてください。
 */
(function(){
  var KEYS = ['ivyArStampMistakes','ivyArStampCleared','ivyArStampStart','ivyArStampReceived'];
  var failed = false;
  try { KEYS.forEach(function(k){ localStorage.removeItem(k); }); } catch(e){ failed = true; }
  try { sessionStorage.removeItem('ivyArCam'); } catch(e){}
  // 本当に消えたか確認
  try { if (KEYS.some(function(k){ return localStorage.getItem(k) !== null; })) failed = true; } catch(e){ failed = true; }
  if (failed){
    document.getElementById('warn').hidden = false;
    document.querySelector('h1').textContent = 'リセットできませんでした';
    document.querySelector('.icon').textContent = '⚠️';
  }
})();
