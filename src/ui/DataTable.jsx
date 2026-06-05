import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";
import Button from "./Button";

const getCellValue = (row, key) =>
  key.split(".").reduce((acc, part) => acc?.[part], row);

const DataTable = ({
  columns,
  rows = [],
  rowKey = "id",
  searchPlaceholder = "Rechercher…",
  searchKeys,
  pageSize = 10,
  loading = false,
  emptyTitle = "Aucune donnée",
  emptyDescription,
  emptyIcon = "Inbox",
  onRowClick,
  toolbar,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const hasSearch =
    searchKeys === "*" || (Array.isArray(searchKeys) && searchKeys.length > 0);

  const filteredRows = useMemo(() => {
    if (!hasSearch || !searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase().trim();
    const matchesValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "object")
        return Object.values(value).some(matchesValue);
      return String(value).toLowerCase().includes(term);
    };
    return rows.filter((row) => {
      if (searchKeys === "*") {
        return Object.values(row).some(matchesValue);
      }
      return searchKeys.some((key) => matchesValue(getCellValue(row, key)));
    });
  }, [rows, searchTerm, searchKeys, hasSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(start, start + pageSize);

  const goTo = (next) => setPage(Math.max(1, Math.min(totalPages, next)));

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(hasSearch || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {hasSearch && (
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                <Icon name="Search" size="sm" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-pill border border-neutral-200 bg-white pl-10 pr-4 text-body-md text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-secondary-500 dark:bg-secondary-700 dark:text-white"
              />
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-secondary-500 dark:bg-secondary-700">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-neutral-50 dark:bg-secondary-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3.5 text-caption font-semibold uppercase tracking-wide text-ink-muted ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                          ? "text-center"
                          : "text-left"
                    }`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={`sk-${i}`}
                    className="border-t border-neutral-100 dark:border-secondary-600"
                  >
                    {columns.map((col, ci) => (
                      <td key={`sk-${i}-${ci}`} className="px-5 py-4">
                        <Skeleton height={14} width={ci === 0 ? "60%" : "40%"} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    <EmptyState
                      icon={emptyIcon}
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((row, idx) => {
                  const key =
                    typeof rowKey === "function"
                      ? rowKey(row, idx)
                      : getCellValue(row, rowKey) ?? idx;
                  return (
                    <tr
                      key={key}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={`border-t border-neutral-100 dark:border-secondary-600 transition-colors ${
                        onRowClick
                          ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-secondary-600"
                          : ""
                      }`}
                    >
                      {columns.map((col) => {
                        const value = getCellValue(row, col.key);
                        return (
                          <td
                            key={col.key}
                            className={`px-5 py-4 text-body-md text-ink ${
                              col.align === "right"
                                ? "text-right"
                                : col.align === "center"
                                  ? "text-center"
                                  : "text-left"
                            }`}
                          >
                            {col.render ? col.render(value, row) : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-body-sm text-ink-muted">
            {start + 1}–{Math.min(start + pageSize, filteredRows.length)} sur{" "}
            {filteredRows.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              leftIcon="ChevronLeft"
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            />
            <span className="px-3 text-body-sm font-medium text-ink">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              leftIcon="ChevronRight"
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            />
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      render: PropTypes.func,
      align: PropTypes.oneOf(["left", "center", "right"]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  rows: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  searchPlaceholder: PropTypes.string,
  searchKeys: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.oneOf(["*"]),
  ]),
  pageSize: PropTypes.number,
  loading: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyIcon: PropTypes.string,
  onRowClick: PropTypes.func,
  toolbar: PropTypes.node,
  className: PropTypes.string,
};

export default DataTable;
