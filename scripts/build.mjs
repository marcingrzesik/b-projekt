import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
const assets={};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
function walk(dir){for(const f of readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else assets['/'+path.relative('public',p)]={type:types[path.extname(p)]||'application/octet-stream',body:readFileSync(p).toString('base64')};}}
walk('public');rmSync('dist',{recursive:true,force:true});mkdirSync('dist/server',{recursive:true});writeFileSync('dist/server/index.js',`const assets=${JSON.stringify(assets)};\n`+readFileSync('worker/index.js','utf8'));
