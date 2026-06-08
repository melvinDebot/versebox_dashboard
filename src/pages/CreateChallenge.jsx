import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Alert from "../components/Alert/Alert";
import { useFirebase } from "../context/FirebaseContext";
import { Card, Button, FormField, Input, Textarea, Select } from "../ui";
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_POINTS,
  CHALLENGE_LEVELS,
} from "../utils/constants";

const initialState = {
  verse: "",
  verseText: "",
  verseDescription: "",
  challenge: "",
  point: "",
  level: "",
  categories: [],
};

const CreateChallenge = () => {
  const { challengesByCategory } = useFirebase();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    const category = form.categories[0];
    if (
      !form.verse ||
      !form.verseText ||
      !form.verseDescription ||
      !form.challenge ||
      !form.point ||
      !form.level ||
      !category
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setSubmitting(true);
    const categoryList = challengesByCategory[category];
    const nextIndex = Array.isArray(categoryList) ? categoryList.length : 0;
    update(ref(db, `/dataIHM/${category}/${nextIndex}/`), {
      ...form,
      categories: category === "relationel" ? ["relationnel"] : [category],
      like: 0,
      unlike: 0,
    });
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2500);
  };

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Challenge créé"
        description="Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb
        pageName="Nouveau challenge"
        description="Crée un nouveau challenge pour une catégorie de l'application"
      />
      <Card padding="lg" radius="xl" className="max-w-3xl">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FormField label="Verset" required>
            <Input
              value={form.verse}
              onChange={(e) => setField("verse", e.target.value)}
              placeholder="Mathieu 2:11"
            />
          </FormField>
          <FormField label="Contenu du verset" required>
            <Textarea
              rows={5}
              value={form.verseText}
              onChange={(e) => setField("verseText", e.target.value)}
              placeholder="Texte intégral du verset"
            />
          </FormField>
          <FormField label="Explication" required>
            <Textarea
              rows={5}
              value={form.verseDescription}
              onChange={(e) => setField("verseDescription", e.target.value)}
              placeholder="Explication du verset"
            />
          </FormField>
          <FormField label="Challenge" required>
            <Textarea
              rows={5}
              value={form.challenge}
              onChange={(e) => setField("challenge", e.target.value)}
              placeholder="Action concrète à réaliser"
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Catégorie" required>
              <Select
                placeholder="Choisir une catégorie"
                value={form.categories[0] || ""}
                onChange={(e) => setField("categories", [e.target.value])}
                options={CHALLENGE_CATEGORIES}
              />
            </FormField>
            <FormField label="Points" required>
              <Select
                placeholder="Points"
                value={form.point}
                onChange={(e) =>
                  setField("point", parseInt(e.target.value, 10))
                }
                options={CHALLENGE_POINTS}
              />
            </FormField>
            <FormField label="Niveau" required>
              <Select
                placeholder="Niveau"
                value={form.level}
                onChange={(e) => setField("level", e.target.value)}
                options={CHALLENGE_LEVELS}
              />
            </FormField>
          </div>
          <div className="mt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon="Plus"
              loading={submitting}
            >
              {submitting ? "Création…" : "Créer le challenge"}
            </Button>
          </div>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default CreateChallenge;
