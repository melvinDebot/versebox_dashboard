// Interrupteurs du noeud `featuresFlag`. L'app mobile ne lit que `true` :
// une cle absente vaut `false`.

export const PROMO_CODES_FLAG = "promoCodes";

// Themes saisonniers : un seul actif a la fois sur l'app.
export const THEME_FLAGS = [
  {
    key: "christmasTheme",
    label: "Noël",
    icon: "TreePine",
    description: "Neige, vitrine de Noël, salut du 25 décembre",
  },
  {
    key: "newYearTheme",
    label: "Nouvel An",
    icon: "PartyPopper",
    description: "Étoiles, feu d'artifice, salut du 1er janvier",
  },
  {
    key: "easterTheme",
    label: "Pâques",
    icon: "Egg",
    description: "Pétales, œufs et lapin, salut de Pâques",
  },
];

export const isFlagOn = (featuresFlag, key) => featuresFlag?.[key] === true;

export const activeThemeKeys = (featuresFlag) =>
  THEME_FLAGS.filter((theme) => isFlagOn(featuresFlag, theme.key)).map(
    (theme) => theme.key,
  );

// Patch a passer a `update(ref(db, "featuresFlag"), patch)` : allume `key`
// et eteint tous les autres themes (`null` les eteint tous).
export const buildThemePatch = (key) =>
  Object.fromEntries(
    THEME_FLAGS.map((theme) => [theme.key, theme.key === key]),
  );
