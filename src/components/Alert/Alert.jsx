import PropTypes from "prop-types";
import Icon from "../../ui/Icon";

const TONES = {
  success: {
    icon: "CircleCheck",
    classes:
      "border-success-700 bg-success-500 text-secondary-900 dark:bg-success-500 dark:border-success-300 dark:text-secondary-900",
    iconClasses: "bg-white text-success-700",
  },
  error: {
    icon: "CircleAlert",
    classes:
      "border-error-300 bg-error-50 text-error-900 dark:bg-error-900/30 dark:border-error-700 dark:text-error-50",
    iconClasses: "bg-error-500 text-white",
  },
  warning: {
    icon: "TriangleAlert",
    classes:
      "border-warning-300 bg-warning-50 text-warning-900 dark:bg-warning-900/30 dark:border-warning-700 dark:text-warning-50",
    iconClasses: "bg-warning-500 text-white",
  },
  info: {
    icon: "Info",
    classes:
      "border-secondary-300 bg-secondary-50 text-secondary-900 dark:bg-secondary-700 dark:border-secondary-500 dark:text-white",
    iconClasses: "bg-secondary-500 text-white",
  },
};

const Alert = ({ message, type = "success", description, show = true }) => {
  if (!show) return null;
  const tone = TONES[type] || TONES.info;

  return (
    <div
      className={`fixed inset-x-0 top-6 z-50 mx-auto flex max-w-xl items-start gap-4 rounded-2xl border-2 px-6 py-5 shadow-lifted transition-all duration-300 animate-fade-in ${tone.classes}`}
      role="alert"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.iconClasses}`}
      >
        <Icon name={tone.icon} size="md" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        {message && (
          <h5 className="text-title-sm font-semibold">{message}</h5>
        )}
        {description && (
          <p className="mt-1 text-body-md opacity-90">{description}</p>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TONES)),
  description: PropTypes.string,
  show: PropTypes.bool,
};

export default Alert;
