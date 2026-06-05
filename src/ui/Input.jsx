import { forwardRef } from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";

const Input = forwardRef(
  (
    {
      type = "text",
      leftIcon,
      rightIcon,
      invalid = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "w-full rounded-xl border bg-white text-body-md text-ink placeholder:text-ink-muted",
      "px-4 h-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "dark:bg-secondary-700 dark:text-white",
      invalid
        ? "border-error-300 focus:border-error-500 focus:ring-error-300/30"
        : "border-neutral-200 focus:border-primary-400 focus:ring-primary-400/30 dark:border-secondary-500",
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (!leftIcon && !rightIcon) {
      return <input ref={ref} type={type} className={classes} {...rest} />;
    }

    return (
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            <Icon name={leftIcon} size="sm" />
          </span>
        )}
        <input ref={ref} type={type} className={classes} {...rest} />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
            <Icon name={rightIcon} size="sm" />
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  invalid: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
