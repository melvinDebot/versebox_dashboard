import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Alert from "../components/Alert/Alert";
import { useFirebase } from "../context/FirebaseContext";
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
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_POINTS,
  CHALLENGE_LEVELS,
} from "../utils/constants";
import {
  TRANSLATABLE_FIELDS,
  translateChallengeToEnglish,
} from "../utils/translate";

const initialState = {
  verse: "",
  verseText: "",
  verseDescription: "",
  challenge: "",
  point: "",
  level: "",
  categories: [],
};

const initialEnState = {
  verse: "",
  verseText: "",
  verseDescription: "",
  challenge: "",
};

// Champs français dont dépend chaque champ anglais
const SOURCE_FIELDS = {
  verse: ["verse"],
  verseText: ["verse", "verseText"],
  verseDescription: ["verseDescription"],
  challenge: ["challenge"],
};

const EN_FIELD_LABELS = {
  verse: "Verse",
  verseText: "Verse text",
  verseDescription: "Explanation",
  challenge: "Challenge",
};

const sourceSignature = (form, field) =>
  JSON.stringify(SOURCE_FIELDS[field].map((f) => form[f]));

const CreateChallenge = () => {
  const { challengesByCategory } = useFirebase();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [formEn, setFormEn] = useState(initialEnState);
  const [translationErrors, setTranslationErrors] = useState({});
  // Pour chaque champ anglais traduit automatiquement : le français d'origine
  const [translatedFrom, setTranslatedFrom] = useState({});
  // Champs anglais corrigés à la main depuis leur dernière traduction
  const [manualEdits, setManualEdits] = useState({});
  const [translating, setTranslating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const setFieldEn = (key, value) => {
    setFormEn((prev) => ({ ...prev, [key]: value }));
    setTranslationErrors((prev) => ({ ...prev, [key]: undefined }));
    setManualEdits((prev) => ({ ...prev, [key]: true }));
  };

  const hasFrenchText = TRANSLATABLE_FIELDS.some((f) => form[f]?.trim());
  const hasTranslated = Object.keys(translatedFrom).length > 0;
  const staleFields = TRANSLATABLE_FIELDS.filter(
    (f) =>
      translatedFrom[f] !== undefined &&
      translatedFrom[f] !== sourceSignature(form, f),
  );
  const staleAutoFields = staleFields.filter((f) => !manualEdits[f]);
  const staleManualFields = staleFields.filter((f) => manualEdits[f]);

  // Traduit les champs demandés et renvoie le formulaire anglais complété,
  // ou null si au moins un champ n'a pas pu être traduit.
  const translate = async (fields, current) => {
    setTranslating(true);
    try {
      const { values, errors } = await translateChallengeToEnglish(form, {
        fields,
        englishVerse: fields.includes("verse") ? undefined : current.verse,
      });
      const next = { ...current, ...values };
      const translatedFields = Object.keys(values);
      setFormEn(next);
      setTranslationErrors(errors);
      setTranslatedFrom((prev) => ({
        ...prev,
        ...Object.fromEntries(
          translatedFields.map((f) => [f, sourceSignature(form, f)]),
        ),
      }));
      setManualEdits((prev) => ({
        ...prev,
        ...Object.fromEntries(translatedFields.map((f) => [f, false])),
      }));
      return Object.keys(errors).length > 0 ? null : next;
    } finally {
      setTranslating(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting || translating) return;
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

    // Champs vides, ou dont le français a changé depuis la traduction
    // (sauf s'ils ont été corrigés à la main)
    const toTranslate = TRANSLATABLE_FIELDS.filter(
      (f) => !formEn[f]?.trim() || staleAutoFields.includes(f),
    );
    const english = toTranslate.length
      ? await translate(toTranslate, formEn)
      : formEn;
    if (!english) return;

    setSubmitting(true);
    const categoryList = challengesByCategory[category];
    const nextIndex = Array.isArray(categoryList) ? categoryList.length : 0;
    const shared = {
      point: form.point,
      level: form.level,
      categories: category === "relationel" ? ["relationnel"] : [category],
      like: 0,
      unlike: 0,
    };
    try {
      // Même index dans les deux langues pour garder dataIHM et dataIHMEn alignés
      await update(ref(db), {
        [`dataIHM/${category}/${nextIndex}`]: { ...form, ...shared },
        [`dataIHMEn/${category}/${nextIndex}`]: {
          ...english,
          ...shared,
        },
      });
    } catch (error) {
      setSubmitting(false);
      alert(`Erreur lors de la création : ${error.message}`);
      return;
    }
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2500);
  };

  const translationErrorCount =
    Object.values(translationErrors).filter(Boolean).length;

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Challenge créé"
        description="Versions française et anglaise enregistrées. Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb
        pageName="Nouveau challenge"
        description="Crée un nouveau challenge pour une catégorie de l'application"
      />
      <form onSubmit={submit} className="flex max-w-3xl flex-col gap-6">
        <Card padding="lg" radius="xl" className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">
              FR
            </Badge>
            <h2 className="text-title-sm font-semibold text-ink">
              Version française
            </h2>
          </div>
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
        </Card>

        <Card padding="lg" radius="xl" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="tertiary" size="md">
                  EN
                </Badge>
                <h2 className="text-title-sm font-semibold text-ink">
                  Version anglaise
                </h2>
              </div>
              <p className="mt-1.5 text-body-sm text-ink-muted">
                Remplie automatiquement à partir du français à la création. Tu
                peux la générer maintenant pour la relire et la corriger.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={hasTranslated ? "RefreshCw" : "Languages"}
              loading={translating}
              disabled={!hasFrenchText || submitting}
              onClick={() => translate(TRANSLATABLE_FIELDS, formEn)}
            >
              {translating
                ? "Traduction…"
                : hasTranslated
                  ? "Retraduire"
                  : "Traduire depuis le français"}
            </Button>
          </div>

          {staleAutoFields.length > 0 && !translating && (
            <p className="flex items-center gap-2 rounded-xl bg-secondary-50 px-4 py-2.5 text-body-sm text-secondary-900 dark:bg-secondary-800 dark:text-white">
              <Icon name="RefreshCw" size="sm" />
              Le texte français a changé : la version anglaise sera retraduite
              automatiquement à la création.
            </p>
          )}
          {staleManualFields.length > 0 && !translating && (
            <p className="flex items-start gap-2 rounded-xl bg-warning-50 px-4 py-2.5 text-body-sm text-warning-900 dark:bg-warning-900/30 dark:text-warning-300">
              <Icon
                name="TriangleAlert"
                size="sm"
                className="mt-0.5 shrink-0"
              />
              <span>
                Le français a changé, mais tu as corrigé à la main :{" "}
                {staleManualFields.map((f) => EN_FIELD_LABELS[f]).join(", ")}.
                Ces champs seront gardés tels quels ; clique sur « Retraduire »
                pour les remplacer.
              </span>
            </p>
          )}
          {translationErrorCount > 0 && (
            <p className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-2.5 text-body-sm text-error-700 dark:bg-error-900/30 dark:text-error-300">
              <Icon name="CircleAlert" size="sm" />
              Traduction automatique incomplète : complète les champs en erreur
              à la main ou réessaie.
            </p>
          )}

          <FormField label="Verse" error={translationErrors.verse}>
            <Input
              value={formEn.verse}
              onChange={(e) => setFieldEn("verse", e.target.value)}
              placeholder="Matthew 2:11"
              invalid={Boolean(translationErrors.verse)}
            />
          </FormField>
          <FormField
            label="Verse text"
            hint="Récupéré dans la World English Bible quand la référence est reconnue."
            error={translationErrors.verseText}
          >
            <Textarea
              rows={5}
              value={formEn.verseText}
              onChange={(e) => setFieldEn("verseText", e.target.value)}
              placeholder="Full verse text"
              invalid={Boolean(translationErrors.verseText)}
            />
          </FormField>
          <FormField
            label="Explanation"
            error={translationErrors.verseDescription}
          >
            <Textarea
              rows={5}
              value={formEn.verseDescription}
              onChange={(e) => setFieldEn("verseDescription", e.target.value)}
              placeholder="Verse explanation"
              invalid={Boolean(translationErrors.verseDescription)}
            />
          </FormField>
          <FormField label="Challenge" error={translationErrors.challenge}>
            <Textarea
              rows={5}
              value={formEn.challenge}
              onChange={(e) => setFieldEn("challenge", e.target.value)}
              placeholder="Concrete action to take"
              invalid={Boolean(translationErrors.challenge)}
            />
          </FormField>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon="Plus"
            loading={submitting || translating}
          >
            {submitting
              ? "Création…"
              : translating
                ? "Traduction…"
                : "Créer le challenge"}
          </Button>
        </div>
      </form>
    </DefaultLayout>
  );
};

export default CreateChallenge;
