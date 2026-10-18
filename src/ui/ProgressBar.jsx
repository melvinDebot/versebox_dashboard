import PropTypes from "prop-types";

const TONES = {
  primary: "bg-primary-500",
  tertiary: "bg-tertiary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
};

const ProgressBar = ({ value, tone = "primary", className = "", label }) => {
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-2 w-full overflow-hidden rounded-pill bg-neutral-100 dark:bg-secondary-600 ${className}`}
    >
      <div
        className={`h-full rounded-pill transition-[width] duration-500 ${TONES[tone]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  tone: PropTypes.oneOf(Object.keys(TONES)),
  className: PropTypes.string,
  label: PropTypes.string,
};

export default ProgressBar;
