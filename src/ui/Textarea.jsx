import { forwardRef } from "react";
import PropTypes from "prop-types";

const Textarea = forwardRef(
  ({ rows = 5, invalid = false, className = "", ...rest }, ref) => {
    const classes = [
      "w-full rounded-xl border bg-white text-body-md text-ink placeholder:text-ink-muted",
      "px-4 py-3 transition-colors focus:outline-none focus:ring-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "dark:bg-secondary-700 dark:text-white",
      invalid
        ? "border-error-300 focus:border-error-500 focus:ring-error-300/30"
        : "border-neutral-200 focus:border-primary-400 focus:ring-primary-400/30 dark:border-secondary-500",
      "resize-y min-h-[88px]",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <textarea ref={ref} rows={rows} className={classes} {...rest} />;
  },
);

Textarea.displayName = "Textarea";

Textarea.propTypes = {
  rows: PropTypes.number,
  invalid: PropTypes.bool,
  className: PropTypes.string,
};

export default Textarea;
