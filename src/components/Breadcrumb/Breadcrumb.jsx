import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from "../../ui/Icon";

const Breadcrumb = ({ pageName, description, action }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav>
          <ol className="flex items-center gap-1.5 text-body-sm text-ink-muted">
            <li>
              <Link
                to="/dashboard"
                className="hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="ChevronRight" size="xs" />
            </li>
            <li className="font-medium text-ink">{pageName}</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-display-md font-semibold text-ink">
          {pageName}
        </h1>
        {description && (
          <p className="mt-1 text-body-md text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
};

Breadcrumb.propTypes = {
  pageName: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

export default Breadcrumb;
