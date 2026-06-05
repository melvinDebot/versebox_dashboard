import PropTypes from "prop-types";
import Icon from "./Icon";

const VARIANTS = {
  primary:
    "bg-primary-500 text-secondary-900 hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-400",
  secondary:
    "bg-secondary-900 text-white hover:bg-secondary-800 active:bg-secondary-700 dark:bg-neutral-50 dark:text-secondary-900 dark:hover:bg-neutral-100 focus-visible:ring-secondary-400",
  outline:
    "bg-transparent text-ink border border-neutral-300 hover:bg-neutral-100 dark:border-secondary-500 dark:hover:bg-secondary-700 focus-visible:ring-neutral-400",
  ghost:
    "bg-transparent text-ink hover:bg-neutral-100 dark:hover:bg-secondary-700 focus-visible:ring-neutral-400",
  danger:
    "bg-error-500 text-white hover:bg-error-700 active:bg-error-900 focus-visible:ring-error-300",
  tertiary:
    "bg-tertiary-500 text-white hover:bg-tertiary-700 focus-visible:ring-tertiary-300",
};

const SIZES = {
  xs: "h-7 px-2.5 text-caption gap-1",
  sm: "h-9 px-3.5 text-body-sm gap-1.5",
  md: "h-11 px-4 text-body-md gap-2",
  lg: "h-12 px-5 text-body-lg gap-2",
  icon: "h-10 w-10 p-0 justify-center",
  "icon-sm": "h-8 w-8 p-0 justify-center",
};

const Button = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  iconOnly,
  loading = false,
  disabled = false,
  fullWidth = false,
  as: Component = "button",
  className = "",
  children,
  type = "button",
  ...rest
}) => {
  const realSize = iconOnly ? (size === "sm" ? "icon-sm" : "icon") : size;
  const classes = [
    "inline-flex items-center justify-center font-medium rounded-pill",
    "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[realSize],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const componentProps =
    Component === "button" ? { type, disabled: disabled || loading } : {};

  return (
    <Component className={classes} {...componentProps} {...rest}>
      {loading ? (
        <Icon name="Loader2" size="sm" className="animate-spin" />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={size === "lg" ? "md" : "sm"} />
      ) : null}
      {!iconOnly && children}
      {rightIcon && !loading && (
        <Icon name={rightIcon} size={size === "lg" ? "md" : "sm"} />
      )}
    </Component>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(Object.keys(SIZES)),
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  iconOnly: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
};

export default Button;
