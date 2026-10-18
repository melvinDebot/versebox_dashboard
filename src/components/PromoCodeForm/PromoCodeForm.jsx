import { useState } from "react";
import PropTypes from "prop-types";
import { Button, FormField, Input } from "../../ui";
import {
  normalizePromoCodeName,
  validatePromoCode,
  validatePromoCodeName,
} from "../../utils/promoCodes";

const PromoCodeForm = ({
  initialValues,
  nameEditable = false,
  existingNames = [],
  submitLabel = "Enregistrer",
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: initialValues.name ?? "",
    points: initialValues.points ?? "",
    startsAt: initialValues.startsAt ?? "",
    endsAt: initialValues.endsAt ?? "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError =
      (nameEditable && validatePromoCodeName(form.name, existingNames)) ||
      validatePromoCode(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: normalizePromoCodeName(form.name),
        points: Number(form.points),
        startsAt: form.startsAt,
        endsAt: form.endsAt,
      });
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FormField
          label="Nom"
          required={nameEditable}
          hint={nameEditable ? "Non modifiable après création" : "Non modifiable"}
        >
          <Input
            value={form.name}
            onChange={setField("name")}
            onBlur={() =>
              setForm((prev) => ({
                ...prev,
                name: normalizePromoCodeName(prev.name),
              }))
            }
            placeholder="WELCOME"
            maxLength={30}
            disabled={!nameEditable}
            autoFocus={nameEditable}
          />
        </FormField>
        <FormField label="Points" required>
          <Input
            type="number"
            min={1}
            value={form.points}
            onChange={setField("points")}
            autoFocus={!nameEditable}
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
            min={form.startsAt || undefined}
            value={form.endsAt}
            onChange={setField("endsAt")}
          />
        </FormField>
      </div>
      {error && (
        <p role="alert" className="text-caption text-error-700">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          leftIcon="Check"
          loading={saving}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

PromoCodeForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
  }).isRequired,
  nameEditable: PropTypes.bool,
  existingNames: PropTypes.arrayOf(PropTypes.string),
  submitLabel: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PromoCodeForm;
