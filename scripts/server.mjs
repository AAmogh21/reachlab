import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.md':'text/plain','.csv':'text/csv','.webmanifest':'application/manifest+json'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname.split('/').some(part=>part.startsWith('.')))throw Error('Forbidden');
    if(pathname==='/')pathname='/index.html';
    const file=resolve(root,'.'+pathname);
    if(!file.startsWith(root+sep))throw Error('Forbidden');
    if(!(await stat(file)).isFile())throw Error('Not found');
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(await readFile(file));
  }catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`ReachLab running at http://127.0.0.1:${port}`));
