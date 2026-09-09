import PropTypes from "prop-types";
import Icon from "../../ui/Icon";
import defaultDeadline from "../../utils/rulesDeadline.json";

const MS_PER_DAY = 86400000;

const TONES = {
  ok: {
    icon: "CircleCheck",
    classes:
      "border-success-300 bg-success-50 text-secondary-900 dark:bg-success-900/25 dark:border-success-700 dark:text-success-50",
    iconClasses: "bg-success-500 text-white",
  },
  soon: {
    icon: "TriangleAlert",
    classes:
      "border-warning-300 bg-warning-50 text-warning-900 dark:bg-warning-900/30 dark:border-warning-700 dark:text-warning-50",
    iconClasses: "bg-warning-500 text-white",
  },
  critical: {
    icon: "CircleAlert",
    classes:
      "border-error-300 bg-error-50 text-error-900 dark:bg-error-900/30 dark:border-error-700 dark:text-error-50",
    iconClasses: "bg-error-500 text-white",
  },
};

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const plural = (count, word) => `${count} ${word}${count > 1 ? "s" : ""}`;

/**
 * Affiche l'echeance des regles de la Realtime Database.
 *
 * La date vient de src/utils/rulesDeadline.json, que le workflow
 * "Rotate Firebase rules" repousse d'un mois le 1er de chaque mois.
 * Tant que la rotation tourne, le bandeau reste vert ; s'il passe a
 * l'orange puis au rouge, c'est que l'automatisation a lache.
 */
const RulesDeadlineBanner = ({
  deadline = defaultDeadline,
  warnWithinDays = 14,
  criticalWithinDays = 3,
}) => {
  const { expiresAt, rotatedAt } = deadline;
  if (!expiresAt) return null;

  const daysLeft = Math.ceil((expiresAt - Date.now()) / MS_PER_DAY);
  const expired = daysLeft <= 0;

  let toneKey = "ok";
  if (expired || daysLeft <= criticalWithinDays) toneKey = "critical";
  else if (daysLeft <= warnWithinDays) toneKey = "soon";

  const tone = TONES[toneKey];
  const formatted = formatDate(expiresAt);

  let title;
  let description;

  if (expired) {
    title = `Les règles Firebase ont expiré le ${formatted}`;
    description =
      "La base refuse désormais toute lecture et toute écriture. Lance le workflow « Rotate Firebase rules » sur GitHub, ou corrige les règles à la main dans la console.";
  } else if (toneKey === "soon" || toneKey === "critical") {
    title = `Les règles Firebase expirent dans ${plural(daysLeft, "jour")}`;
    description = `Échéance le ${formatted}. La rotation automatique n'a visiblement pas tourné — vérifie l'onglet Actions du repo.`;
  } else {
    title = `Règles Firebase valides jusqu'au ${formatted}`;
    description = `Renouvellement automatique le 1er de chaque mois · ${plural(
      daysLeft,
      "jour"
    )} restant${daysLeft > 1 ? "s" : ""}${
      rotatedAt
        ? ` · dernière rotation le ${formatDate(Date.parse(rotatedAt))}`
        : ""
    }`;
  }

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border-2 px-5 py-4 ${tone.classes}`}
      role={expired ? "alert" : "status"}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.iconClasses}`}
      >
        <Icon name={tone.icon} size="md" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h5 className="text-title-sm font-semibold">{title}</h5>
        <p className="mt-1 text-body-md opacity-90">{description}</p>
      </div>
    </div>
  );
};

RulesDeadlineBanner.propTypes = {
  deadline: PropTypes.shape({
    expiresAt: PropTypes.number,
    rotatedAt: PropTypes.string,
  }),
  warnWithinDays: PropTypes.number,
  criticalWithinDays: PropTypes.number,
};

export default RulesDeadlineBanner;
