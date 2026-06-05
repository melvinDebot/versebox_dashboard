import PropTypes from "prop-types";

const VARIANTS = {
  default:
    "bg-white dark:bg-secondary-700 border border-neutral-200 dark:border-secondary-500",
  elevated:
    "bg-white dark:bg-secondary-700 border border-neutral-200/60 dark:border-secondary-500/60 shadow-card",
  accent:
    "bg-primary-500 text-secondary-900 border border-primary-600",
  tinted:
    "bg-primary-50 dark:bg-secondary-500/40 border border-primary-100 dark:border-secondary-400/40",
  contrast:
    "bg-secondary-900 dark:bg-neutral-50 text-white dark:text-secondary-900 border border-secondary-800 dark:border-neutral-200",
  ghost:
    "bg-transparent border border-dashed border-neutral-300 dark:border-secondary-500",
};

const PADDINGS = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-7",
  xl: "p-8",
};

const RADIUS = {
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

const Card = ({
  variant = "default",
  padding = "lg",
  radius = "xl",
  interactive = false,
  as: Component = "div",
  className = "",
  children,
  ...rest
}) => {
  const classes = [
    VARIANTS[variant],
    PADDINGS[padding],
    RADIUS[radius],
    "transition-colors duration-300",
    interactive
      ? "cursor-pointer hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-lifted transition-all duration-300 ease-out-expo"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

Card.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  padding: PropTypes.oneOf(Object.keys(PADDINGS)),
  radius: PropTypes.oneOf(Object.keys(RADIUS)),
  interactive: PropTypes.bool,
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
