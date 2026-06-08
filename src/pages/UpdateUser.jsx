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
  Select,
  Toggle,
  Avatar,
} from "../ui";
import { USER_CATEGORIES } from "../utils/constants";

const revertDateFormat = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split("-");
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const UpdateUser = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(location.state || {});
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.nameUser) {
      alert("Le nom est obligatoire");
      return;
    }
    setSubmitting(true);
    update(ref(db, `/users/${id}/user`), { ...form });
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const currentCategory = Array.isArray(form.category)
    ? form.category[0]
    : form.category || "";

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Utilisateur mis à jour"
        description="Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb pageName={`Édition — ${form.nameUser || "utilisateur"}`} />

      <Card padding="lg" radius="xl" className="max-w-3xl">
        <div className="mb-6 flex items-center gap-4 border-b border-neutral-200 pb-5 dark:border-secondary-500">
          <Avatar name={form.nameUser} src={form.avatarStyle} size="xl" />
          <div>
            <p className="text-title-md font-semibold text-ink">
              {form.nameUser || "Sans nom"}
            </p>
            <p className="text-body-sm text-ink-muted">{form.email || id}</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FormField label="Nom" required>
            <Input
              value={form.nameUser || ""}
              onChange={(e) => setField("nameUser", e.target.value)}
            />
          </FormField>
          <FormField label="Style d'avatar (URL)">
            <Input
              value={form.avatarStyle || ""}
              onChange={(e) => setField("avatarStyle", e.target.value)}
              leftIcon="Image"
            />
          </FormField>
          <FormField label="Date du jour">
            <Input
              type="date"
              onChange={(e) =>
                setField("dateOfTheDay", revertDateFormat(e.target.value))
              }
            />
          </FormField>
          <FormField label="Catégorie favorite">
            <Select
              value={currentCategory}
              onChange={(e) => setField("category", [e.target.value])}
              options={USER_CATEGORIES}
              placeholder="Choisir une catégorie"
            />
          </FormField>
          <Toggle
            label="Compte certifié"
            description="Affiche le badge officiel"
            checked={Boolean(form.isCertified)}
            onChange={(checked) => setField("isCertified", checked)}
          />
          <div className="mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon="Save"
              loading={submitting}
            >
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default UpdateUser;
