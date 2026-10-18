export const formatPromoDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR") : "—";

export const getPromoStatus = ({ isActive, startsAt, endsAt }) => {
  if (isActive === false) {
    return { key: "disabled", label: "Désactivé", variant: "neutral" };
  }
  const today = new Date().toLocaleDateString("sv-SE");
  if (startsAt && today < startsAt) {
    return { key: "upcoming", label: "À venir", variant: "warning" };
  }
  if (endsAt && today > endsAt) {
    return { key: "expired", label: "Expiré", variant: "neutral" };
  }
  return { key: "live", label: "Actif", variant: "success" };
};

export const countLivePromoCodes = (codes) =>
  (codes || []).filter((code) => getPromoStatus(code).key === "live").length;

export const PROMO_CODE_NAME_PATTERN = /^[A-Z0-9_-]{3,30}$/;

export const normalizePromoCodeName = (name) =>
  (name || "").trim().toUpperCase();

export const validatePromoCode = ({ points, startsAt, endsAt }) => {
  const value = Number(points);
  if (!Number.isInteger(value) || value <= 0) {
    return "Le nombre de points doit être un entier positif.";
  }
  if (!startsAt || !endsAt) return "Les deux dates sont obligatoires.";
  if (endsAt < startsAt) {
    return "La date de fin doit être après la date de début.";
  }
  return null;
};

export const validatePromoCodeName = (name, existingNames = []) => {
  const normalized = normalizePromoCodeName(name);
  if (!PROMO_CODE_NAME_PATTERN.test(normalized)) {
    return "Le nom doit contenir 3 à 30 caractères : lettres, chiffres, - ou _.";
  }
  if (existingNames.includes(normalized)) return "Ce code existe déjà.";
  return null;
};
