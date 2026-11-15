// Images des cartes faites avec Gemini : un cadre par personnage (+ neutre) et une illustration par capacité.
// Il suffit de déposer les PNG dans src/assets/cartes/ : seules les images présentes sont utilisées,
// sinon la carte garde son cadre dessiné en CSS et l'icône de sa catégorie.

const FRAMES = import.meta.glob<string>('../assets/cartes/cadres/*.png', { eager: true, query: '?url', import: 'default' });
const ARTS = import.meta.glob<string>('../assets/cartes/illustrations/*.png', { eager: true, query: '?url', import: 'default' });

const byName = (files: Record<string, string>) =>
  new Map(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.png$/, ''), url]));
const FRAME_URLS = byName(FRAMES);
const ART_URLS = byName(ARTS);

/** Nom de fichier d'une capacité : « Écras'Face » → ecras-face. */
export function artSlug(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Fichier du cadre : un par personnage, « neutre » pour les cartes que tout le monde peut apprendre. */
export function frameFile(character: string): string {
  return character === 'normal' ? 'neutre' : character;
}

export function frameUrl(character: string): string | undefined {
  return FRAME_URLS.get(frameFile(character));
}

export function artUrl(name: string): string | undefined {
  return ART_URLS.get(artSlug(name.replace(/\+$/, '')));
}
