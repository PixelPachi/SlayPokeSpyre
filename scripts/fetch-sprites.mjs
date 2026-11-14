// Télécharge dans public/sprites/ les sprites PokeAPI listés dans scripts/sprites.json.
// Seuls des PNG fixes sont utilisés (aucun sprite animé).
// Usage : npm run sprites            (ne retélécharge pas les fichiers déjà présents)
//         npm run sprites -- --force (retélécharge tout)
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites';
const force = process.argv.includes('--force');

const manifest = JSON.parse(await readFile(join(root, 'scripts/sprites.json'), 'utf8'));

/** dossier PokeAPI -> dossier local */
const kinds = {
  front: (id) => [`pokemon/${id}.png`, `pokemon/front/${id}.png`],
  back: (id) => [`pokemon/back/${id}.png`, `pokemon/back/${id}.png`],
  shiny: (id) => [`pokemon/shiny/${id}.png`, `pokemon/shiny/${id}.png`],
  artwork: (id) => [`pokemon/other/official-artwork/${id}.png`, `pokemon/artwork/${id}.png`],
  items: (name) => [`items/${name}.png`, `items/${name}.png`],
};

const exists = (p) => access(p).then(() => true, () => false);
let downloaded = 0, skipped = 0, failed = 0;

for (const [kind, toPaths] of Object.entries(kinds)) {
  for (const id of manifest[kind] ?? []) {
    const [remote, local] = toPaths(id);
    const dest = join(root, 'public/sprites', local);
    if (!force && (await exists(dest))) { skipped++; continue; }
    const res = await fetch(`${BASE}/${remote}`);
    if (!res.ok) { console.error(`Échec ${res.status} : ${remote}`); failed++; continue; }
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  }
}
console.log(`Sprites : ${downloaded} téléchargés, ${skipped} déjà présents, ${failed} échecs.`);
if (failed) process.exit(1);
