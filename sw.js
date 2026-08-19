const CACHE='fitness-coach-v8';
const CORE=['/','/index.html','/manifest.webmanifest','/exercise-images-patch.js','/ui-enhancements.js','/food-enhancements.js'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;

  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const r=await fetch(e.request);
        const text=await r.text();
        let patched=text;
        if(!patched.includes('/exercise-images-patch.js')){
          patched=patched.replace('</body>','<script src="/exercise-images-patch.js"></script></body>');
        }
        if(!patched.includes('/ui-enhancements.js')){
          patched=patched.replace('</body>','<script src="/ui-enhancements.js"></script></body>');
        }
        if(!patched.includes('/food-enhancements.js')){
          patched=patched.replace('</body>','<script src="/food-enhancements.js"></script></body>');
        }
        const headers=new Headers(r.headers);
        headers.set('content-type','text/html; charset=utf-8');
        const out=new Response(patched,{status:r.status,statusText:r.statusText,headers});
        const copy=out.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return out;
      }catch{
        return caches.match(e.request)||caches.match('/index.html');
      }
    })());
    return;
  }

  e.respondWith(
    fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
