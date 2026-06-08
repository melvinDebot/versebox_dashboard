import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Alert from "../components/Alert/Alert";
import { useFirebase } from "../context/FirebaseContext";
import { Card, Button, FormField, Input, Textarea } from "../ui";
import { EMPTY_CLICKS_BY_DAY } from "../utils/constants";

const initialState = {
  title: "",
  description: "",
  link: "",
  subscriberDiscountLink: "",
  subscriberDiscountText: "",
  location: "",
  startDate: "",
  endDate: "",
  img: "",
};

const CreateEvent = () => {
  const { events } = useFirebase();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.startDate ||
      !form.endDate ||
      !form.img
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSubmitting(true);
    update(ref(db, `/Events/${events.length}`), {
      ...form,
      clicksByDay: EMPTY_CLICKS_BY_DAY,
      clicks: 0,
      id: events.length,
    });
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Événement créé"
        description="Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb
        pageName="Nouvel événement"
        description="Ajoute un événement visible côté application"
      />
      <Card padding="lg" radius="xl" className="max-w-3xl">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FormField label="Nom de l'événement" required>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Concert gospel"
            />
          </FormField>
          <FormField label="Description" required>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Décris l'événement"
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Lien" hint="URL publique">
              <Input
                value={form.link}
                onChange={(e) => setField("link", e.target.value)}
                placeholder="https://…"
                leftIcon="Link"
              />
            </FormField>
            <FormField label="Lien abonné">
              <Input
                value={form.subscriberDiscountLink}
                onChange={(e) =>
                  setField("subscriberDiscountLink", e.target.value)
                }
                placeholder="https://…"
                leftIcon="Link"
              />
            </FormField>
          </div>
          <FormField label="Texte abonné" required>
            <Input
              value={form.subscriberDiscountText}
              onChange={(e) =>
                setField("subscriberDiscountText", e.target.value)
              }
              placeholder="-20% pour les abonnés"
            />
          </FormField>
          <FormField label="Lieu" required>
            <Input
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="Paris, France"
              leftIcon="MapPin"
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Date de début" required>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </FormField>
            <FormField label="Date de fin" required>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="URL de l'image" required>
            <Input
              value={form.img}
              onChange={(e) => setField("img", e.target.value)}
              placeholder="https://…"
              leftIcon="Image"
            />
          </FormField>
          <div className="mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon="Plus"
              loading={submitting}
            >
              {submitting ? "Création…" : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default CreateEvent;
