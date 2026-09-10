import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('1. Preparing source index.html...');
const devHtml = fs.readFileSync(path.join(__dirname, 'index.dev.html'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'index.html'), devHtml, 'utf-8');

console.log('2. Running vite build...');
execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });

console.log('3. Deploying build to root for GitHub Pages...');
const distHtml = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'index.html'), distHtml, 'utf-8');

const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(__dirname, 'dist', 'assets');

if (fs.existsSync(assetsDir)) {
  fs.rmSync(assetsDir, { recursive: true, force: true });
}
fs.mkdirSync(assetsDir, { recursive: true });

const files = fs.readdirSync(distAssetsDir);
for (const file of files) {
  fs.copyFileSync(path.join(distAssetsDir, file), path.join(assetsDir, file));
  console.log(`   Copied asset: ${file}`);
}

console.log('✅ Build & Sync completed successfully!');
