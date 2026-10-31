/* debug.html(診断ページ)の動き:all.mind の状態と、マーカー検出の番号(targetIndex)を画面に表示する */
const L=document.getElementById('log'); const log=t=>{L.textContent+=t+'\n'; L.scrollTop=L.scrollHeight;};
log('UA: '+navigator.userAgent.slice(0,90));
fetch('./ar/all.mind?v='+Date.now()).then(async r=>{const b=await r.arrayBuffer(); log('all.mind: HTTP '+r.status+' / '+b.byteLength+' bytes / 更新 '+r.headers.get('last-modified'));}).catch(e=>log('all.mind 取得失敗: '+e));
for(let i=0;i<9;i++){const e=document.getElementById('t'+i); e.addEventListener('targetFound',()=>log('★ 検出 targetIndex='+i)); e.addEventListener('targetLost',()=>log('  見失い '+i));}
const sc=document.getElementById('scene');
document.getElementById('goBtn').onclick=async()=>{try{log('カメラ起動中...'); await sc.systems['mindar-image-system'].start(); log('起動OK。マーカーを映してください'); window.dispatchEvent(new Event('resize'));}catch(e){log('起動失敗: '+e);}};
