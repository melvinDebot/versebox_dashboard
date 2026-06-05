import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Alert from "../components/Alert/Alert";
import {
  Card,
  Button,
  FormField,
  Input,
  Textarea,
  Select,
  Badge,
  Icon,
} from "../ui";
import { CHALLENGE_POINTS, CHALLENGE_LEVELS } from "../utils/constants";

const FIELD_TO_PATH = { relationnel: "relationel" };
const PATH_TO_FIELD = { relationel: "relationnel" };

const resolveCategory = (state) => {
  const fieldCategory = state?.categories?.[0] || "";
  const pathCategory =
    state?._pathCategory || FIELD_TO_PATH[fieldCategory] || fieldCategory;
  const persistedField = PATH_TO_FIELD[pathCategory] || pathCategory;
  return { pathCategory, fieldCategory: persistedField };
};

const UpdateChallenge = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const initial = location.state || {};
  const [form, setForm] = useState(initial);
  const [showAlert, setShowAlert] = useState(false);

  const { pathCategory, fieldCategory } = resolveCategory(initial);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!pathCategory) {
      alert("Catégorie introuvable pour ce challenge");
      return;
    }
    update(ref(db, `/dataIHM/${pathCategory}/${id}/`), {
      ...form,
      categories: [fieldCategory],
      like: form.like || 0,
      unlike: form.unlike || 0,
    });
    setShowAlert(true);
    setTimeout(() => navigate(`/tables-challenges/${pathCategory}`), 1500);
  };

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Challenge mis à jour"
        description="Tu vas être redirigé vers la liste."
      />
      <Breadcrumb
        pageName={`Édition — challenge #${id}`}
        description={fieldCategory ? `Catégorie : ${fieldCategory}` : undefined}
      />

      <Card padding="lg" radius="xl" className="max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-secondary-500 dark:bg-secondary-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Icon name="FolderOpen" size="sm" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
              Catégorie
            </p>
            <p className="text-title-sm font-semibold capitalize text-ink">
              {fieldCategory || "—"}
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            <Icon name="Lock" size="xs" />
            Non modifiable
          </Badge>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <FormField label="Verset" required>
            <Input
              value={form.verse || ""}
              onChange={(e) => setField("verse", e.target.value)}
            />
          </FormField>
          <FormField label="Contenu du verset" required>
            <Textarea
              rows={5}
              value={form.verseText || ""}
              onChange={(e) => setField("verseText", e.target.value)}
            />
          </FormField>
          <FormField label="Explication" required>
            <Textarea
              rows={5}
              value={form.verseDescription || ""}
              onChange={(e) => setField("verseDescription", e.target.value)}
            />
          </FormField>
          <FormField label="Challenge" required>
            <Textarea
              rows={5}
              value={form.challenge || ""}
              onChange={(e) => setField("challenge", e.target.value)}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Points">
              <Select
                value={form.point || ""}
                onChange={(e) =>
                  setField("point", parseInt(e.target.value, 10))
                }
                options={CHALLENGE_POINTS}
                placeholder="Points"
              />
            </FormField>
            <FormField label="Niveau">
              <Select
                value={form.level || ""}
                onChange={(e) => setField("level", e.target.value)}
                options={CHALLENGE_LEVELS}
                placeholder="Niveau"
              />
            </FormField>
          </div>
          <div className="mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" leftIcon="Save">
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default UpdateChallenge;
