// Pokémon sauvages ajoutés à chaque zone pour croiser des adversaires de tous les types.
import type { EnemyDef } from '../core/model';

export const WILD_ENEMIES: EnemyDef[] = [
  // ——— foret-de-jade ———
  {
    id: 'kabuto', name: 'Kabuto', dex: 140, types: ['roche', 'eau'], hp: [13, 17],
    moves: [
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'jet-pierres', name: 'Jet-Pierres', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 5 },
      { id: 'armure', name: 'Armure', weight: 25, intent: 'defense', block: 8 },
    ],
  },
  {
    id: 'minidraco', name: 'Minidraco', dex: 147, types: ['dragon'], hp: [13, 17],
    moves: [
      { id: 'draco-queue', name: 'Draco-Queue', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 5 },
      { id: 'ligotage', name: 'Ligotage', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 4, playerStatus: { status: 'ligote', stacks: 1 } },
      { id: 'danse-draco', name: 'Danse Draco', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 4 },
    ],
  },
  {
    id: 'pikachu', name: 'Pikachu', dex: 25, types: ['electrik'], hp: [13, 17],
    moves: [
      { id: 'eclair', name: 'Éclair', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 5, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'vive-attaque', name: 'Vive-Attaque', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'groz-yeux', name: 'Groz\'Yeux', weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'mystherbe', name: 'Mystherbe', dex: 43, types: ['plante', 'poison'], hp: [13, 17],
    moves: [
      { id: 'mega-sangsue', name: 'Méga-Sangsue', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 5, drain: true },
      { id: 'poudre-toxik', name: 'Poudre Toxik', weight: 25, intent: 'handicap', playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'acide', name: 'Acide', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 4, playerStatus: { status: 'poison', stacks: 1 } },
    ],
  },
  {
    id: 'taupiqueur', name: 'Taupiqueur', dex: 50, types: ['sol'], hp: [13, 17],
    moves: [
      { id: 'coud-boue', name: 'Coud\'Boue', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 5, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'tunnel', name: 'Tunnel', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 7 },
      { id: 'griffe', name: 'Griffe', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 } },
    ],
  },
  {
    id: 'rondoudou', name: 'Rondoudou', dex: 39, types: ['normal', 'fee'], hp: [13, 17],
    moves: [
      { id: 'torgnoles', name: 'Torgnoles', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 2, hits: 3 },
      { id: 'berceuse', name: 'Berceuse', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
      { id: 'eclat-magique', name: 'Éclat Magique', weight: 35, intent: 'attaque', pokeType: 'fee', damage: 5 },
    ],
  },
  // ——— bois-aux-chenes ———
  {
    id: 'marcacrin', name: 'Marcacrin', dex: 220, types: ['glace', 'sol'], hp: [13, 17],
    moves: [
      { id: 'poudreuse', name: 'Poudreuse', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 5, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'coud-boue', name: 'Coud\'Boue', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 4, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'armure', name: 'Armure', weight: 25, intent: 'defense', block: 7 },
    ],
  },
  {
    id: 'hericendre', name: 'Héricendre', dex: 155, types: ['feu'], hp: [13, 17],
    moves: [
      { id: 'flammeche', name: 'Flammèche', weight: 35, intent: 'attaque', pokeType: 'feu', damage: 5, playerStatus: { status: 'brulure', stacks: 1 } },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'brouillard', name: 'Brouillard', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'marill', name: 'Marill', dex: 183, types: ['eau', 'fee'], hp: [13, 17],
    moves: [
      { id: 'bulles-d-o', name: 'Bulles d\'O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 5 },
      { id: 'roulade', name: 'Roulade', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 3, hits: 2 },
      { id: 'repli', name: 'Repli', weight: 25, intent: 'defense', block: 7 },
    ],
  },
  {
    id: 'malosse', name: 'Malosse', dex: 228, types: ['tenebres', 'feu'], hp: [13, 17],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'flammeche', name: 'Flammèche', weight: 35, intent: 'attaque', pokeType: 'feu', damage: 4, playerStatus: { status: 'brulure', stacks: 1 } },
      { id: 'grondement', name: 'Grondement', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'natu', name: 'Natu', dex: 177, types: ['psy', 'vol'], hp: [13, 17],
    moves: [
      { id: 'picpic', name: 'Picpic', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 5 },
      { id: 'rafale-psy', name: 'Rafale Psy', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 6 },
      { id: 'plenitude', name: 'Plénitude', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 4 },
    ],
  },
  // ——— bois-clematis ———
  {
    id: 'tarinor', name: 'Tarinor', dex: 299, types: ['roche'], hp: [13, 17],
    moves: [
      { id: 'jet-pierres', name: 'Jet-Pierres', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 5 },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 9 },
    ],
  },
  {
    id: 'medhyena', name: 'Medhyèna', dex: 261, types: ['tenebres'], hp: [13, 17],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6 },
      { id: 'coup-bas', name: 'Coup Bas', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 7 },
      { id: 'hurlement', name: 'Hurlement', weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'tarsal', name: 'Tarsal', dex: 280, types: ['psy', 'fee'], hp: [13, 17],
    moves: [
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 6 },
      { id: 'voix-enjoleuse', name: 'Voix Enjôleuse', weight: 35, intent: 'attaque', pokeType: 'fee', damage: 4 },
      { id: 'doux-parfum', name: 'Doux Parfum', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'makuhita', name: 'Makuhita', dex: 296, types: ['combat'], hp: [13, 17],
    moves: [
      { id: 'poing-karate', name: 'Poing-Karaté', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 6 },
      { id: 'mach-punch', name: 'Mach Punch', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 4 },
      { id: 'gonflette', name: 'Gonflette', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'gobou', name: 'Gobou', dex: 258, types: ['eau'], hp: [13, 17],
    moves: [
      { id: 'pistolet-a-o', name: 'Pistolet à O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 5 },
      { id: 'coud-boue', name: 'Coud\'Boue', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 4, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'repli', name: 'Repli', weight: 25, intent: 'defense', block: 7 },
    ],
  },
  // ——— foret-de-vestigion ———
  {
    id: 'archeomire', name: 'Archéomire', dex: 436, types: ['acier', 'psy'], hp: [13, 17],
    moves: [
      { id: 'gyroballe', name: 'Gyroballe', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 5 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 5 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
    ],
  },
  {
    id: 'lixy', name: 'Lixy', dex: 403, types: ['electrik'], hp: [13, 17],
    moves: [
      { id: 'etincelle', name: 'Étincelle', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 6, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'groz-yeux', name: 'Groz\'Yeux', weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'keunotor', name: 'Keunotor', dex: 399, types: ['normal'], hp: [13, 17],
    moves: [
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'roulade', name: 'Roulade', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 3, hits: 2 },
      { id: 'boul-armure', name: 'Boul\'Armure', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 6 },
    ],
  },
  {
    id: 'baudrive', name: 'Baudrive', dex: 425, types: ['spectre', 'vol'], hp: [13, 17],
    moves: [
      { id: 'ombre-portee', name: 'Ombre Portée', weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 5 },
      { id: 'onde-folie', name: 'Onde Folie', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'tornade', name: 'Tornade', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 5 },
    ],
  },
  {
    id: 'tiplouf', name: 'Tiplouf', dex: 393, types: ['eau'], hp: [13, 17],
    moves: [
      { id: 'bulles-d-o', name: 'Bulles d\'O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 5 },
      { id: 'picpic', name: 'Picpic', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 4 },
      { id: 'rengorgement', name: 'Rengorgement', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 4 },
    ],
  },
  // ——— foret-d-empoigne ———
  {
    id: 'tic', name: 'Tic', dex: 599, types: ['acier'], hp: [13, 17],
    moves: [
      { id: 'gyroballe', name: 'Gyroballe', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 5 },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'affutage', name: 'Affûtage', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 4 },
    ],
  },
  {
    id: 'ponchiot', name: 'Ponchiot', dex: 506, types: ['normal'], hp: [13, 17],
    moves: [
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6 },
      { id: 'groz-yeux', name: 'Groz\'Yeux', weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'scrutella', name: 'Scrutella', dex: 574, types: ['psy'], hp: [13, 17],
    moves: [
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 6 },
      { id: 'charme', name: 'Charme', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 8 },
    ],
  },
  {
    id: 'mascaiman', name: 'Mascaïman', dex: 551, types: ['sol', 'tenebres'], hp: [13, 17],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6 },
      { id: 'tunnel', name: 'Tunnel', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 7 },
      { id: 'jet-de-sable', name: 'Jet de Sable', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'kungfouine', name: 'Kungfouine', dex: 619, types: ['combat'], hp: [13, 17],
    moves: [
      { id: 'double-pied', name: 'Double Pied', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 3, hits: 2 },
      { id: 'mach-punch', name: 'Mach Punch', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 5 },
      { id: 'detection', name: 'Détection', weight: 25, intent: 'defense', block: 9 },
    ],
  },
  // ——— tour-lavanville ———
  {
    id: 'abo', name: 'Abo', dex: 23, types: ['poison'], hp: [13, 17],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 4, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'ligotage', name: 'Ligotage', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 4, playerStatus: { status: 'ligote', stacks: 1 } },
      { id: 'grimace', name: 'Grimace', weight: 25, intent: 'handicap', playerStatus: { status: 'peur', stacks: 1 } },
    ],
  },
  {
    id: 'abra', name: 'Abra', dex: 63, types: ['psy'], hp: [13, 17],
    moves: [
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 6 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 8 },
    ],
  },
  {
    id: 'miaouss', name: 'Miaouss', dex: 52, types: ['normal'], hp: [13, 17],
    moves: [
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6 },
      { id: 'bluff', name: 'Bluff', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'psykokwak', name: 'Psykokwak', dex: 54, types: ['eau'], hp: [13, 17],
    moves: [
      { id: 'pistolet-a-o', name: 'Pistolet à O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 5 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 5 },
      { id: 'onde-folie', name: 'Onde Folie', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  // ——— mont-selenite ———
  {
    id: 'magneti', name: 'Magnéti', dex: 81, types: ['electrik', 'acier'], hp: [28, 33],
    moves: [
      { id: 'eclair', name: 'Éclair', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 8, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'gyroballe', name: 'Gyroballe', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 10 },
      { id: 'mur-lumiere', name: 'Mur Lumière', weight: 25, intent: 'defense', block: 13 },
    ],
  },
  {
    id: 'kokiyas', name: 'Kokiyas', dex: 90, types: ['eau'], hp: [28, 33],
    moves: [
      { id: 'eclats-glace', name: 'Éclats Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 3, hits: 3 },
      { id: 'pistolet-a-o', name: 'Pistolet à O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 8 },
      { id: 'repli', name: 'Repli', weight: 25, intent: 'defense', block: 14 },
    ],
  },
  {
    id: 'sabelette', name: 'Sabelette', dex: 27, types: ['sol'], hp: [28, 33],
    moves: [
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'roulade', name: 'Roulade', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 5, hits: 2 },
      { id: 'jet-de-sable', name: 'Jet de Sable', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'kadabra', name: 'Kadabra', dex: 64, types: ['psy'], hp: [28, 33],
    moves: [
      { id: 'psyko', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 11 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 8 },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 13 },
    ],
  },
  // ——— puits-ramoloss ———
  {
    id: 'maraiste', name: 'Maraiste', dex: 195, types: ['eau', 'sol'], hp: [28, 33],
    moves: [
      { id: 'coud-boue', name: 'Coud\'Boue', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 8, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'pistolet-a-o', name: 'Pistolet à O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 8 },
      { id: 'repos', name: 'Repos', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 13 },
    ],
  },
  {
    id: 'qwilfish', name: 'Qwilfish', dex: 211, types: ['eau', 'poison'], hp: [28, 33],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 6, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'aqua-jet', name: 'Aqua-Jet', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 8 },
      { id: 'boul-armure', name: 'Boul\'Armure', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 10 },
    ],
  },
  {
    id: 'teddiursa', name: 'Teddiursa', dex: 216, types: ['normal'], hp: [28, 33],
    moves: [
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'furie', name: 'Furie', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 3 },
      { id: 'charme', name: 'Charme', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'corayon', name: 'Corayon', dex: 222, types: ['eau', 'roche'], hp: [28, 33],
    moves: [
      { id: 'bulles-d-o', name: 'Bulles d\'O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 8 },
      { id: 'jet-pierres', name: 'Jet-Pierres', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 8 },
      { id: 'repli', name: 'Repli', weight: 25, intent: 'defense', block: 14 },
    ],
  },
  // ——— mont-chimnee ———
  {
    id: 'tylton', name: 'Tylton', dex: 333, types: ['normal', 'vol'], hp: [28, 33],
    moves: [
      { id: 'picpic', name: 'Picpic', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 8 },
      { id: 'berceuse', name: 'Berceuse', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
      { id: 'cotogarde', name: 'Cotogarde', weight: 25, intent: 'defense', block: 13 },
    ],
  },
  {
    id: 'mysdibule', name: 'Mysdibule', dex: 303, types: ['acier', 'fee'], hp: [28, 33],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 10 },
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 10, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'charme', name: 'Charme', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'skelenox', name: 'Skelénox', dex: 355, types: ['spectre'], hp: [28, 33],
    moves: [
      { id: 'ombre-portee', name: 'Ombre Portée', weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 8 },
      { id: 'lechouille', name: 'Léchouille', weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 6, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'abri', name: 'Abri', weight: 25, intent: 'defense', block: 14 },
    ],
  },
  {
    id: 'galekid', name: 'Galekid', dex: 304, types: ['acier', 'roche'], hp: [28, 33],
    moves: [
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 10 },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 16 },
    ],
  },
  // ——— mont-couronne ———
  {
    id: 'kirlia', name: 'Kirlia', dex: 281, types: ['psy', 'fee'], hp: [28, 33],
    moves: [
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 10 },
      { id: 'voix-enjoleuse', name: 'Voix Enjôleuse', weight: 35, intent: 'attaque', pokeType: 'fee', damage: 8 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
    ],
  },
  {
    id: 'griknot', name: 'Griknot', dex: 443, types: ['dragon', 'sol'], hp: [28, 33],
    moves: [
      { id: 'dracogriffe', name: 'Dracogriffe', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 10 },
      { id: 'tunnel', name: 'Tunnel', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 10 },
      { id: 'jet-de-sable', name: 'Jet de Sable', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 1 } },
    ],
  },
  {
    id: 'blizzi', name: 'Blizzi', dex: 459, types: ['plante', 'glace'], hp: [28, 33],
    moves: [
      { id: 'poudreuse', name: 'Poudreuse', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 8 },
      { id: 'tranch-herbe', name: 'Tranch\'Herbe', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 8 },
      { id: 'vampigraine', name: 'Vampigraine', weight: 25, intent: 'handicap', playerStatus: { status: 'vampigraine', stacks: 2 } },
    ],
  },
  {
    id: 'rozbouton', name: 'Rozbouton', dex: 406, types: ['plante', 'poison'], hp: [28, 33],
    moves: [
      { id: 'mega-sangsue', name: 'Méga-Sangsue', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 8, drain: true },
      { id: 'poudre-toxik', name: 'Poudre Toxik', weight: 25, intent: 'handicap', playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'tempete-florale', name: 'Tempête Florale', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 10 },
    ],
  },
  // ——— grotte-electrolithe ———
  {
    id: 'tutafeh', name: 'Tutafeh', dex: 562, types: ['spectre'], hp: [28, 33],
    moves: [
      { id: 'ombre-portee', name: 'Ombre Portée', weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 8 },
      { id: 'malediction', name: 'Malédiction', weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 6, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'abri', name: 'Abri', weight: 25, intent: 'defense', block: 14 },
    ],
  },
  {
    id: 'coupenotte', name: 'Coupenotte', dex: 610, types: ['dragon'], hp: [28, 33],
    moves: [
      { id: 'dracogriffe', name: 'Dracogriffe', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 10 },
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'danse-draco', name: 'Danse Draco', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'cryptero', name: 'Cryptéro', dex: 561, types: ['psy', 'vol'], hp: [28, 33],
    moves: [
      { id: 'psyko', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 10 },
      { id: 'lame-d-air', name: 'Lame d\'Air', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 8 },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 13 },
    ],
  },
  {
    id: 'solochi', name: 'Solochi', dex: 633, types: ['tenebres', 'dragon'], hp: [28, 33],
    moves: [
      { id: 'dracosouffle', name: 'Dracosouffle', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 10, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 10 },
      { id: 'grondement', name: 'Grondement', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  // ——— route-victoire ———
  {
    id: 'aeromite', name: 'Aéromite', dex: 49, types: ['insecte', 'poison'], hp: [46, 53],
    moves: [
      { id: 'rayon-signal', name: 'Rayon Signal', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 14, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'poudre-toxik', name: 'Poudre Toxik', weight: 25, intent: 'handicap', playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'vent-argente', name: 'Vent Argenté', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 12 },
    ],
  },
  {
    id: 'electrode', name: 'Électrode', dex: 101, types: ['electrik'], hp: [46, 53],
    moves: [
      { id: 'etincelle', name: 'Étincelle', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 14, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'gyroballe', name: 'Gyroballe', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 14 },
      { id: 'mur-lumiere', name: 'Mur Lumière', weight: 25, intent: 'defense', block: 21 },
    ],
  },
  {
    id: 'persian', name: 'Persian', dex: 53, types: ['normal'], hp: [46, 53],
    moves: [
      { id: 'tranche', name: 'Tranche', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 14 },
      { id: 'feinte', name: 'Feinte', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 14 },
      { id: 'machination', name: 'Machination', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'staross', name: 'Staross', dex: 121, types: ['eau', 'psy'], hp: [46, 53],
    moves: [
      { id: 'surf', name: 'Surf', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 14 },
      { id: 'psyko', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 14 },
      { id: 'recuperation', name: 'Récupération', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 18 },
    ],
  },
  // ——— mont-argente ———
  {
    id: 'granbull', name: 'Granbull', dex: 210, types: ['fee'], hp: [46, 53],
    moves: [
      { id: 'pouvoir-lunaire', name: 'Pouvoir Lunaire', weight: 35, intent: 'attaque', pokeType: 'fee', damage: 16 },
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 14 },
      { id: 'charme', name: 'Charme', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'steelix', name: 'Steelix', dex: 208, types: ['acier', 'sol'], hp: [46, 53],
    moves: [
      { id: 'queue-de-fer', name: 'Queue de Fer', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 16 },
      { id: 'seisme', name: 'Séisme', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 14 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 25 },
    ],
  },
  {
    id: 'lokhlass', name: 'Lokhlass', dex: 131, types: ['eau', 'glace'], hp: [46, 53],
    moves: [
      { id: 'laser-glace', name: 'Laser Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 14, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'surf', name: 'Surf', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 14 },
      { id: 'berceuse', name: 'Berceuse', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
    ],
  },
  {
    id: 'hypnomade', name: 'Hypnomade', dex: 97, types: ['psy'], hp: [46, 53],
    moves: [
      { id: 'psyko', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 16 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 21 },
    ],
  },
  {
    id: 'noarfang', name: 'Noarfang', dex: 164, types: ['normal', 'vol'], hp: [46, 53],
    moves: [
      { id: 'lame-d-air', name: 'Lame d\'Air', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 14 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 12 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
    ],
  },
  // ——— pilier-celeste ———
  {
    id: 'solaroc', name: 'Solaroc', dex: 338, types: ['roche', 'psy'], hp: [46, 53],
    moves: [
      { id: 'eboulement', name: 'Éboulement', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 7, hits: 2 },
      { id: 'psyko', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 14 },
      { id: 'mur-lumiere', name: 'Mur Lumière', weight: 25, intent: 'defense', block: 21 },
    ],
  },
  {
    id: 'tengalice', name: 'Tengalice', dex: 275, types: ['plante', 'tenebres'], hp: [46, 53],
    moves: [
      { id: 'tranche-nuit', name: 'Tranche-Nuit', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 14 },
      { id: 'lame-feuille', name: 'Lame-Feuille', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 14 },
      { id: 'machination', name: 'Machination', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'tropius', name: 'Tropius', dex: 357, types: ['plante', 'vol'], hp: [46, 53],
    moves: [
      { id: 'lame-d-air', name: 'Lame d\'Air', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 14 },
      { id: 'tranch-herbe', name: 'Tranch\'Herbe', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 12 },
      { id: 'synthese', name: 'Synthèse', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 18 },
    ],
  },
  {
    id: 'metang', name: 'Métang', dex: 375, types: ['acier', 'psy'], hp: [46, 53],
    moves: [
      { id: 'poing-meteor', name: 'Poing Météor', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 16 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 12 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 25 },
    ],
  },
  // ——— mont-abrupt ———
  {
    id: 'carmache', name: 'Carmache', dex: 444, types: ['dragon', 'sol'], hp: [46, 53],
    moves: [
      { id: 'dracogriffe', name: 'Dracogriffe', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 16 },
      { id: 'tunnel', name: 'Tunnel', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 14 },
      { id: 'danse-draco', name: 'Danse Draco', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'tritosor', name: 'Tritosor', dex: 423, types: ['eau', 'sol'], hp: [46, 53],
    moves: [
      { id: 'coud-boue', name: 'Coud\'Boue', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 12, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'surf', name: 'Surf', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 14 },
      { id: 'repos', name: 'Repos', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 18 },
    ],
  },
  {
    id: 'scorvol', name: 'Scorvol', dex: 472, types: ['sol', 'vol'], hp: [46, 53],
    moves: [
      { id: 'lame-d-air', name: 'Lame d\'Air', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 14 },
      { id: 'crochet-venin', name: 'Crochet Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 12, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'seisme', name: 'Séisme', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 14 },
    ],
  },
  {
    id: 'demolosse', name: 'Démolosse', dex: 229, types: ['tenebres', 'feu'], hp: [46, 53],
    moves: [
      { id: 'crocs-feu', name: 'Crocs Feu', weight: 35, intent: 'attaque', pokeType: 'feu', damage: 14, playerStatus: { status: 'brulure', stacks: 2 } },
      { id: 'machouille', name: 'Machouille', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 14 },
      { id: 'grondement', name: 'Grondement', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  // ——— tour-dragospire ———
  {
    id: 'zeblitz', name: 'Zéblitz', dex: 523, types: ['electrik'], hp: [46, 53],
    moves: [
      { id: 'etincelle', name: 'Étincelle', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 14, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'charge-foudre', name: 'Charge Foudre', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 18 },
      { id: 'hate', name: 'Hâte', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 9 },
    ],
  },
  {
    id: 'shaofouine', name: 'Shaofouine', dex: 620, types: ['combat'], hp: [46, 53],
    moves: [
      { id: 'pied-voltige', name: 'Pied Voltige', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 18 },
      { id: 'double-pied', name: 'Double Pied', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 7, hits: 2 },
      { id: 'detection', name: 'Détection', weight: 25, intent: 'defense', block: 23 },
    ],
  },
  {
    id: 'mastouffe', name: 'Mastouffe', dex: 508, types: ['normal'], hp: [46, 53],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 14 },
      { id: 'plaquage', name: 'Plaquage', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 14, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'rugissement', name: 'Rugissement', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'lakmecygne', name: 'Lakmécygne', dex: 581, types: ['eau', 'vol'], hp: [46, 53],
    moves: [
      { id: 'bulles-d-o', name: 'Bulles d\'O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 12 },
      { id: 'cru-ailes', name: 'Cru-Ailes', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 14 },
      { id: 'atterrissage', name: 'Atterrissage', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 18 },
    ],
  },
];
