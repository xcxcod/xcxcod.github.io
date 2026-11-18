import { cp, readFile, writeFile, mkdtemp, copyFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

// Produces a disposable copy. It never changes the real export or injects QA into production.
const source=resolve(process.argv[2] || 'out');
await readFile(join(source,'index.html'));
const target=await mkdtemp(join(tmpdir(),'portfolio-hero-profile-'));
await cp(source,target,{recursive:true});
await copyFile(join(dirname(fileURLToPath(import.meta.url)),'hero-benchmark.js'),join(target,'hero-benchmark.js'));
const entry=join(target,'index.html');
await writeFile(entry,(await readFile(entry,'utf8')).replace('</body>','<script src="/hero-benchmark.js" defer></script></body>'));
console.log(`Local QA copy: ${target}\nServe it with: python3 -m http.server 3103 --bind 127.0.0.1 --directory '${target}'`);
