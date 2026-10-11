// Writes gallery/manifest.json: the list of photos shown in the home page gallery.
// Runs automatically on every Vercel deploy (see "buildCommand" in vercel.json). No packages needed.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const IMG = /\.(webp|jpe?g|png|avif|gif)$/i;

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (IMG.test(e.name)) out.push(path.relative(root, p).split(path.sep).join('/'));
  }
}

try {
  const paths = [];
  walk(path.join(root, 'gallery'), paths);
  walk(path.join(root, 'images', 'clients'), paths);
  paths.sort();
  const data = { source: process.env.VERCEL ? 'vercel-build' : 'committed', count: paths.length, paths: paths };
  fs.writeFileSync(path.join(root, 'gallery', 'manifest.json'), JSON.stringify(data, null, 1));
  console.log('gallery manifest written:', paths.length, 'photos');
} catch (err) {
  console.log('gallery manifest skipped:', err.message);
}
process.exit(0);
