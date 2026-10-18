import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ref, remove, update } from "firebase/database";
import { db } from "../../../firebase";
import { Badge, Button, ConfirmDialog, Toggle } from "../../ui";
import PromoCodeForm from "../PromoCodeForm/PromoCodeForm";
import { formatPromoDate, getPromoStatus } from "../../utils/promoCodes";

const PromoCodeItem = ({ code }) => {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const codeRef = ref(db, `promoCodes/${code._id}`);
  const status = getPromoStatus(code);
  const isActive = code.isActive !== false;

  const handleSave = async ({ points, startsAt, endsAt }) => {
    await update(codeRef, { points, startsAt, endsAt });
    setEditing(false);
  };

  const closeDeleteDialog = useCallback(() => {
    setConfirmingDelete(false);
    setDeleteError(null);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await remove(codeRef);
    } catch (e) {
      setDeleteError(e.message);
      setDeleting(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-secondary-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-ink truncate">{code._id}</p>
          <p className="text-body-sm text-ink-muted">
            {formatPromoDate(code.startsAt)} → {formatPromoDate(code.endsAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary" size="sm">
            +{code.points ?? 0} pts
          </Badge>
          <Badge variant={status.variant} size="sm" dot>
            {status.label}
          </Badge>
          <Toggle
            id={`promo-active-${code._id}`}
            checked={isActive}
            onChange={(checked) => update(codeRef, { isActive: checked })}
          />
          {!editing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                leftIcon="Pencil"
                onClick={() => setEditing(true)}
              >
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon="Trash2"
                onClick={() => setConfirmingDelete(true)}
                aria-label={`Supprimer le code ${code._id}`}
                title="Supprimer"
                className="text-error-700 hover:bg-error-50 dark:text-error-300 dark:hover:bg-error-900/30"
              />
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="border-t border-neutral-200 pt-3 dark:border-secondary-600">
          <PromoCodeForm
            initialValues={{ ...code, name: code._id }}
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title={`Supprimer le code ${code._id} ?`}
        description={
          <>
            <p>
              Le code ne pourra plus être utilisé dans l&apos;application. Cette
              action est définitive.
            </p>
            {deleteError && (
              <p role="alert" className="mt-2 text-caption text-error-700">
                {deleteError}
              </p>
            )}
          </>
        }
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </li>
  );
};

PromoCodeItem.propTypes = {
  code: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
    isActive: PropTypes.bool,
  }).isRequired,
};

export default PromoCodeItem;
