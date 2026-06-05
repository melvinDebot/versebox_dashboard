import PropTypes from "prop-types";

const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  id,
  className = "",
}) => {
  const toggleId = id || `toggle-${label?.toString().replace(/\s+/g, "-")}`;

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span className="relative inline-block">
        <input
          id={toggleId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <span
          className="block h-6 w-11 rounded-pill bg-neutral-200 dark:bg-secondary-600 transition-colors duration-200 peer-checked:bg-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary-400"
          aria-hidden="true"
        />
        <span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5"
          aria-hidden="true"
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-body-md font-medium text-ink">{label}</span>
          )}
          {description && (
            <span className="text-body-sm text-ink-muted">{description}</span>
          )}
        </span>
      )}
    </label>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  description: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Toggle;
