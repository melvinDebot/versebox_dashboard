import PropTypes from "prop-types";
import { useId } from "react";

const FormField = ({
  label,
  required = false,
  hint,
  error,
  children,
  className = "",
}) => {
  const generatedId = useId();
  const fieldId = children?.props?.id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-body-sm font-medium text-ink-subtle"
        >
          {label}
          {required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      {typeof children === "function" ? children(fieldId) : children}
      {error ? (
        <p className="text-caption text-error-700">{error}</p>
      ) : hint ? (
        <p className="text-caption text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.node,
  required: PropTypes.bool,
  hint: PropTypes.node,
  error: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default FormField;
