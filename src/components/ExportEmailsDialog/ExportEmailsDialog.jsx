import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { Button, Icon, Skeleton } from "../../ui";
import {
  EXPORT_FORMATS,
  buildAllEmailExports,
  downloadBlob,
  exportFileName,
  extractEmails,
  formatBytes,
} from "../../utils/exportEmails";

const numberFormatter = new Intl.NumberFormat("fr-FR");

const ExportEmailsDialog = ({ open, users, onClose }) => {
  const dialogRef = useRef(null);
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const emails = useMemo(() => (open ? extractEmails(users) : []), [open, users]);
  const ignored = users.length - emails.length;

  // Génère les fichiers à l'ouverture : le poids affiché est celui du
  // fichier réellement téléchargé.
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setFiles(null);
    setError(null);
    buildAllEmailExports(emails)
      .then((result) => {
        if (!cancelled) setFiles(result);
      })
      .catch((err) => {
        console.error("Email export failed", err);
        if (!cancelled) setError("La génération des fichiers a échoué.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, emails]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = emails.length === 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-emails-title"
        aria-describedby="export-emails-description"
        className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-lifted animate-fade-in focus:outline-none dark:bg-secondary-700"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
            <Icon name="Mail" size="md" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="export-emails-title"
              className="text-title-md font-semibold text-ink"
            >
              Exporter les emails
            </h2>
            <p
              id="export-emails-description"
              className="mt-1 text-body-md text-ink-muted"
            >
              {numberFormatter.format(emails.length)} adresse
              {emails.length > 1 ? "s" : ""} email unique
              {emails.length > 1 ? "s" : ""}, triées par ordre alphabétique.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon="X"
            aria-label="Fermer"
            onClick={onClose}
          />
        </div>

        <ul className="mt-6 flex flex-col gap-2">
          {EXPORT_FORMATS.map((format) => {
            const blob = files?.[format.id];
            return (
              <li
                key={format.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 dark:border-secondary-500"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-ink dark:bg-secondary-600">
                  <Icon name={format.icon} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-md font-medium text-ink">
                    {format.label}{" "}
                    <span className="text-caption font-normal text-ink-muted">
                      .{format.extension}
                    </span>
                  </p>
                  <p className="truncate text-caption text-ink-muted">
                    {format.description}
                  </p>
                </div>
                <div className="w-16 shrink-0 text-right text-body-sm font-medium tabular-nums text-ink">
                  {blob ? (
                    formatBytes(blob.size)
                  ) : error ? (
                    "—"
                  ) : (
                    <Skeleton className="ml-auto h-4 w-12" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconOnly
                  leftIcon="Download"
                  aria-label={`Télécharger en ${format.label}`}
                  title={`Télécharger en ${format.label}`}
                  disabled={!blob || isEmpty}
                  onClick={() =>
                    downloadBlob(blob, exportFileName(format.extension))
                  }
                />
              </li>
            );
          })}
        </ul>

        {error && (
          <p className="mt-4 text-body-sm text-error-700 dark:text-error-300">
            {error}
          </p>
        )}
        <p className="mt-4 text-caption text-ink-muted">
          Poids exact du fichier généré.
          {ignored > 0 &&
            ` ${numberFormatter.format(ignored)} compte${
              ignored > 1 ? "s" : ""
            } sans email ou en doublon ${ignored > 1 ? "ne sont" : "n'est"} pas inclus.`}
        </p>
      </div>
    </div>,
    document.body,
  );
};

ExportEmailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportEmailsDialog;
