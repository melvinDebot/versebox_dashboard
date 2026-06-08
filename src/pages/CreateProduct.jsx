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
  PRODUCT_CATEGORIES,
  EMPTY_CLICKS_BY_DAY_MAP,
} from "../utils/constants";

const initialState = {
  title: "",
  description: "",
  link: "",
  subscriberDiscountLink: "",
  subscriberDiscountText: "",
  category: "",
  price: "",
  subcriberPrice: "",
  score: "",
  img: "",
};

const CreateProduct = () => {
  const { store } = useFirebase();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    const required = [
      "title",
      "description",
      "category",
      "price",
      "subcriberPrice",
      "score",
      "img",
      "link",
      "subscriberDiscountLink",
      "subscriberDiscountText",
    ];
    if (required.some((key) => !form[key])) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setSubmitting(true);
    update(ref(db, `/Store/${store.length}`), {
      ...form,
      clicksByDay: EMPTY_CLICKS_BY_DAY_MAP,
      clicks: 0,
    });
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Produit créé"
        description="Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb
        pageName="Nouveau produit"
        description="Ajoute un produit à la boutique Versebox"
      />
      <Card padding="lg" radius="xl" className="max-w-3xl">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FormField label="Titre" required>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
          </FormField>
          <FormField label="Description" required>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Lien produit" required>
              <Input
                value={form.link}
                onChange={(e) => setField("link", e.target.value)}
                leftIcon="Link"
              />
            </FormField>
            <FormField label="Lien abonné" required>
              <Input
                value={form.subscriberDiscountLink}
                onChange={(e) =>
                  setField("subscriberDiscountLink", e.target.value)
                }
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
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Prix (€)" required>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setField("price", parseFloat(e.target.value))
                }
              />
            </FormField>
            <FormField label="Prix abonné (€)" required>
              <Input
                type="number"
                step="0.01"
                value={form.subcriberPrice}
                onChange={(e) =>
                  setField("subcriberPrice", parseFloat(e.target.value))
                }
              />
            </FormField>
            <FormField label="Score utilisateur" required>
              <Input
                type="number"
                value={form.score}
                onChange={(e) =>
                  setField("score", parseInt(e.target.value, 10))
                }
              />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Catégorie" required>
              <Select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                options={PRODUCT_CATEGORIES}
                placeholder="Choisir une catégorie"
              />
            </FormField>
            <FormField label="URL de l'image" required>
              <Input
                value={form.img}
                onChange={(e) => setField("img", e.target.value)}
                leftIcon="Image"
              />
            </FormField>
          </div>
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
              {submitting ? "Création…" : "Créer le produit"}
            </Button>
          </div>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default CreateProduct;
