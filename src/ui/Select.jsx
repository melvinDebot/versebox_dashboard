import { forwardRef } from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";

const Select = forwardRef(
  (
    {
      options = [],
      placeholder,
      invalid = false,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "appearance-none w-full rounded-xl border bg-white text-body-md text-ink",
      "px-4 pr-10 h-11 transition-colors focus:outline-none focus:ring-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "dark:bg-secondary-700 dark:text-white",
      invalid
        ? "border-error-300 focus:border-error-500 focus:ring-error-300/30"
        : "border-neutral-200 focus:border-primary-400 focus:ring-primary-400/30 dark:border-secondary-500",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="relative">
        <select ref={ref} className={classes} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children ||
            options.map((opt) =>
              typeof opt === "string" ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ),
            )}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
          <Icon name="ChevronDown" size="sm" />
        </span>
      </div>
    );
  },
);

Select.displayName = "Select";

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        disabled: PropTypes.bool,
      }),
    ]),
  ),
  placeholder: PropTypes.string,
  invalid: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Select;
