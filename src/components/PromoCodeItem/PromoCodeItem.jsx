import { useState } from "react";
import PropTypes from "prop-types";
import { ref, update } from "firebase/database";
import { db } from "../../../firebase";
import { Badge, Button, FormField, Input, Toggle } from "../../ui";
import { formatPromoDate, getPromoStatus } from "../../utils/promoCodes";

const validate = ({ points, startsAt, endsAt }) => {
  const value = Number(points);
  if (!Number.isInteger(value) || value <= 0) {
    return "Le nombre de points doit être un entier positif.";
  }
  if (!startsAt || !endsAt) return "Les deux dates sont obligatoires.";
  if (endsAt < startsAt) {
    return "La date de fin doit être après la date de début.";
  }
  return null;
};

const PromoCodeItem = ({ code }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});

  const codeRef = ref(db, `promoCodes/${code._id}`);
  const status = getPromoStatus(code);
  const isActive = code.isActive !== false;

  const startEditing = () => {
    setForm({
      points: code.points ?? "",
      startsAt: code.startsAt ?? "",
      endsAt: code.endsAt ?? "",
    });
    setError(null);
    setEditing(true);
  };

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSave = async () => {
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      await update(codeRef, {
        points: Number(form.points),
        startsAt: form.startsAt,
        endsAt: form.endsAt,
      });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
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
            <Button
              variant="ghost"
              size="sm"
              leftIcon="Pencil"
              onClick={startEditing}
            >
              Modifier
            </Button>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-3 dark:border-secondary-600">
          <div className="grid gap-3 sm:grid-cols-4">
            <FormField label="Nom" hint="Non modifiable">
              <Input value={code._id} disabled />
            </FormField>
            <FormField label="Points" required>
              <Input
                type="number"
                min={1}
                value={form.points}
                onChange={setField("points")}
              />
            </FormField>
            <FormField label="Début" required>
              <Input
                type="date"
                value={form.startsAt}
                onChange={setField("startsAt")}
              />
            </FormField>
            <FormField label="Fin" required>
              <Input
                type="date"
                value={form.endsAt}
                onChange={setField("endsAt")}
              />
            </FormField>
          </div>
          {error && <p className="text-caption text-error-700">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon="Check"
              onClick={handleSave}
              loading={saving}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      )}
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
