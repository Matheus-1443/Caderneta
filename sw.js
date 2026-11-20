const V='caderneta-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const FBU=['https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(SHELL);for(const u of FBU){try{await c.add(u)}catch(x){}}self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys()){if(k!==V) await caches.delete(k)}await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(!(u.origin===location.origin||u.hostname==='www.gstatic.com')) return;
  e.respondWith((async()=>{
    const c=await caches.open(V);
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')) c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;if(res) return res;
    if(r.mode==='navigate'){const i=await c.match('index.html');if(i) return i}
    return new Response('Sem conexão',{status:503});
  })());
});
