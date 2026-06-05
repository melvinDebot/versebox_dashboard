import PropTypes from "prop-types";
import Icon from "./Icon";

const EmptyState = ({
  icon = "Inbox",
  title = "Aucune donnée",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-secondary-600 dark:text-primary-300">
        <Icon name={icon} size="lg" />
      </div>
      <h3 className="text-title-md font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body-md text-ink-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
