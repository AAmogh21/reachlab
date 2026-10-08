const CACHE='reachlab-v1';
const FILES=['./','./index.html','./src/style.css','./src/app.js','./src/robotics.js','./src/learning-worker.js','./manifest.webmanifest','./icon.svg','./research/technical-report.md'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('reachlab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method==='GET'&&new URL(event.request.url).origin===self.location.origin)event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});
