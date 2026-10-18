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
