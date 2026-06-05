import PropTypes from "prop-types";

const VARIANTS = {
  neutral:
    "bg-neutral-100 text-ink dark:bg-secondary-600 dark:text-neutral-100",
  primary:
    "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200",
  secondary:
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-100",
  tertiary:
    "bg-tertiary-50 text-tertiary-700 dark:bg-tertiary-900/40 dark:text-tertiary-100",
  success:
    "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300",
  warning:
    "bg-warning-50 text-warning-900 dark:bg-warning-900/30 dark:text-warning-300",
  error:
    "bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300",
  solid:
    "bg-secondary-900 text-white dark:bg-neutral-50 dark:text-secondary-900",
};

const SIZES = {
  sm: "text-caption px-2 py-0.5",
  md: "text-body-sm px-2.5 py-1",
  lg: "text-body-md px-3 py-1.5",
};

const Badge = ({
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
  children,
}) => {
  const classes = [
    "inline-flex items-center gap-1.5 font-medium rounded-pill",
    VARIANTS[variant],
    SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(Object.keys(SIZES)),
  dot: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Badge;
