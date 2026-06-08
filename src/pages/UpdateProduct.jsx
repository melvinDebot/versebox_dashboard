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
  AreaChart,
} from "../ui";
import { PRODUCT_CATEGORIES } from "../utils/constants";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const clicksToSeries = (object, fallbackName) => {
  if (!object?.clicksByDay) return [{ name: fallbackName, data: [] }];
  const data = Array.isArray(object.clicksByDay)
    ? object.clicksByDay.map((d) => d?.data ?? 0)
    : DAYS.map((day) => object.clicksByDay[day]?.data ?? 0);
  return [{ name: fallbackName || "Clics", data }];
};

const UpdateProduct = () => {
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
    if (!form.title) {
      alert("Le titre est obligatoire");
      return;
    }
    setSubmitting(true);
    update(ref(db, `/Store/${id}`), { ...form });
    setShowAlert(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <DefaultLayout>
      <Alert
        show={showAlert}
        type="success"
        message="Produit mis à jour"
        description="Tu vas être redirigé vers le dashboard."
      />
      <Breadcrumb pageName={`Édition — produit #${id}`} description={form.title} />

      <div className="grid gap-6">
        <Card padding="lg" radius="xl">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-title-md font-semibold text-ink">
                Clics par jour
              </h3>
              <p className="text-body-sm text-ink-muted">
                {form.clicks || 0} clics au total
              </p>
            </div>
          </header>
          <AreaChart
            series={clicksToSeries(form, form.title)}
            categories={DAYS}
            colors={["#D39E54"]}
            height={260}
          />
        </Card>

        <Card padding="lg" radius="xl" className="max-w-3xl">
          <form onSubmit={submit} className="flex flex-col gap-5">
            <FormField label="Titre" required>
              <Input
                value={form.title || ""}
                onChange={(e) => setField("title", e.target.value)}
              />
            </FormField>
            <FormField label="Description">
              <Textarea
                rows={5}
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
              />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Lien produit">
                <Input
                  value={form.link || ""}
                  onChange={(e) => setField("link", e.target.value)}
                  leftIcon="Link"
                />
              </FormField>
              <FormField label="Lien abonné">
                <Input
                  value={form.subscriberDiscountLink || ""}
                  onChange={(e) =>
                    setField("subscriberDiscountLink", e.target.value)
                  }
                  leftIcon="Link"
                />
              </FormField>
            </div>
            <FormField label="Texte abonné">
              <Input
                value={form.subscriberDiscountText || ""}
                onChange={(e) =>
                  setField("subscriberDiscountText", e.target.value)
                }
              />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Prix (€)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.price || ""}
                  onChange={(e) =>
                    setField("price", parseFloat(e.target.value))
                  }
                />
              </FormField>
              <FormField label="Prix abonné (€)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.subcriberPrice || ""}
                  onChange={(e) =>
                    setField("subcriberPrice", parseFloat(e.target.value))
                  }
                />
              </FormField>
              <FormField label="Score utilisateur">
                <Input
                  type="number"
                  value={form.score || ""}
                  onChange={(e) =>
                    setField("score", parseInt(e.target.value, 10))
                  }
                />
              </FormField>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Catégorie">
                <Select
                  value={form.category || ""}
                  onChange={(e) => setField("category", e.target.value)}
                  options={PRODUCT_CATEGORIES}
                  placeholder="Choisir une catégorie"
                />
              </FormField>
              <FormField label="URL de l'image">
                <Input
                  value={form.img || ""}
                  onChange={(e) => setField("img", e.target.value)}
                  leftIcon="Image"
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
                leftIcon="Save"
                loading={submitting}
              >
                {submitting ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default UpdateProduct;
