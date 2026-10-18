import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import Button from "./Button";
import Icon from "./Icon";

const TONES = {
  danger: {
    icon: "Trash2",
    iconClasses: "bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300",
    confirmVariant: "danger",
  },
  primary: {
    icon: "CircleHelp",
    iconClasses:
      "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200",
    confirmVariant: "primary",
  },
};

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef(null);
  const toneConfig = TONES[tone];

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm animate-fade-in"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-lifted animate-fade-in focus:outline-none dark:bg-secondary-700"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneConfig.iconClasses}`}
          >
            <Icon name={toneConfig.icon} size="md" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-title-md font-semibold text-ink"
            >
              {title}
            </h2>
            {description && (
              <div
                id="confirm-dialog-description"
                className="mt-1.5 text-body-md text-ink-muted"
              >
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={toneConfig.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  confirmLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  tone: PropTypes.oneOf(Object.keys(TONES)),
  loading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
