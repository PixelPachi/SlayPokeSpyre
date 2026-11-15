/** Chemin d'un fichier de public/, qui marche en local comme sur GitHub Pages. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Infobulles : tout élément avec data-tip affiche son texte au survol. */
export function installTooltips(stage: HTMLElement): void {
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  stage.appendChild(tip);
  stage.addEventListener('mousemove', (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-tip]');
    if (!el) {
      tip.classList.remove('show');
      return;
    }
    const r = stage.getBoundingClientRect();
    const scale = r.width / stage.offsetWidth;
    tip.innerHTML = el.dataset.tip!;
    tip.classList.add('show');
    let x = (ev.clientX - r.left) / scale + 16;
    let y = (ev.clientY - r.top) / scale + 18;
    if (x + 300 > stage.offsetWidth) x -= 320;
    if (y + tip.offsetHeight > stage.offsetHeight) y -= tip.offsetHeight + 30;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  });
  stage.addEventListener('mouseleave', () => tip.classList.remove('show'));
  // Un clic change souvent d'écran : on cache l'infobulle pour qu'elle ne reste pas affichée
  stage.addEventListener('click', () => tip.classList.remove('show'), true);
}

/** Garde la scène 1280×720 à la taille de la fenêtre, sans déformer. */
export function fitStage(stage: HTMLElement): void {
  const fit = () => {
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  };
  window.addEventListener('resize', fit);
  fit();
}

/** Petit message qui s'affiche quelques secondes en haut de l'écran. */
export function toast(text: string): void {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  (document.querySelector('#stage') ?? document.body).appendChild(el);
  setTimeout(() => el.remove(), 4500);
}
