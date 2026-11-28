// Images des cartes faites avec Gemini : un cadre par personnage (+ neutre) et une illustration par capacité.
// Il suffit de déposer les PNG dans src/assets/cartes/ : seules les images présentes sont utilisées,
// sinon la carte garde son cadre dessiné en CSS et l'icône de sa catégorie.

const FRAMES = import.meta.glob<string>('../assets/cartes/cadres/*.png', { eager: true, query: '?url', import: 'default' });
// illustrations/<slug>.png : capacité partagée (sans Pokémon) ; illustrations/<perso>/<slug>.webp : version dessinée avec ce Pokémon
const ARTS = import.meta.glob<string>('../assets/cartes/illustrations/**/*.{png,webp,jpg}', { eager: true, query: '?url', import: 'default' });

const byName = (files: Record<string, string>) =>
  new Map(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.png$/, ''), url]));
const FRAME_URLS = byName(FRAMES);
const FULL = import.meta.glob<string>('../assets/cartes/full/*.{png,webp,jpg}', { eager: true, query: '?url', import: 'default' });
const FULL_URLS = new Map(Object.entries(FULL).map(([p, u]) => [p.split('/').pop()!.replace(/\.(png|webp|jpg)$/, ''), u]));
/** Illustration plein cadre d'une carte full art (par identifiant de base). */
export function fullArtUrl(id: string): string | undefined {
  return FULL_URLS.get(id.replace(/^.*:/, ''));
}
const ORBS = import.meta.glob<string>('../assets/orbes/*.png', { eager: true, query: '?url', import: 'default' });
const ORB_URLS = byName(ORBS);
const BACKS = import.meta.glob<string>('../assets/ui/dos-*.png', { eager: true, query: '?url', import: 'default' });
const BACK_URLS = byName(BACKS);

/** Dos de carte Gemini d'un personnage (pour la pioche). */
export function backUrl(character: string): string | undefined {
  return BACK_URLS.get(`dos-${character}`);
}

/** Orbe d'énergie Gemini d'un personnage (« neutre » pour les cartes communes). */
export function orbUrl(character: string): string | undefined {
  return ORB_URLS.get(frameFile(character));
}
const ART_URLS = new Map(Object.entries(ARTS).map(([path, url]) => [path.split('/illustrations/')[1].replace(/\.(png|webp|jpg)$/, ''), url]));

/** Nom de fichier d'une capacité : « Écras'Face » → ecras-face. */
export function artSlug(name: string): string {
  return name.replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Fichier du cadre : un par personnage, « neutre » pour les cartes que tout le monde peut apprendre. */
export function frameFile(character: string): string {
  if (character === 'duo') return 'duo-both';
  if (character === 'chroma') return 'chroma';
  return character === 'normal' || character === 'quelorior' ? 'neutre' : character;
}

export function frameUrl(character: string): string | undefined {
  return FRAME_URLS.get(frameFile(character));
}

export function artUrl(name: string, character?: string): string | undefined {
  const slug = artSlug(name.replace(/\+$/, ''));
  return (character && ART_URLS.get(`${character}/${slug}`)) || ART_URLS.get(slug);
}

/** Illustration sans Pokémon pour une attaque ennemie : neutre, sinon celle de Caninos ou de Kangourex
 *  (sauf leurs cartes de départ, où leur Pokémon est dessiné). */
const WITH_POKEMON = new Set(['caninos/griffe', 'caninos/flammeche', 'caninos/morsure', 'kangourex/ecras-face', 'kangourex/coup-d-main', 'kangourex/coup-double']);
export function artNoPokemon(name: string): string | undefined {
  const slug = artSlug(name);
  for (const key of [slug, `caninos/${slug}`, `kangourex/${slug}`]) {
    if (!WITH_POKEMON.has(key) && ART_URLS.get(key)) return ART_URLS.get(key);
  }
  return undefined;
}

// Icônes Gemini des statuts, de l'Aura, des talents, de la Protection et des intentions ennemies.
const ICONS = import.meta.glob<string>('../assets/ui/statuts/*.png', { eager: true, query: '?url', import: 'default' });
const ICON_URLS = byName(ICONS);
/** Icône d'un statut / élément d'interface (undefined si l'image n'existe pas encore). */
export function iconUrl(name: string): string | undefined {
  return ICON_URLS.get(name);
}
/** Balise <img> de l'icône, ou chaîne vide. */
export function iconImg(name: string, cls = 'ico'): string {
  const u = ICON_URLS.get(name);
  return u ? `<img class="${cls}" src="${u}" alt="">` : '';
}
