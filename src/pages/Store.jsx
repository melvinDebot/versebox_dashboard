import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge } from "../ui";

const ProductThumb = ({ src, title }) => (
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-secondary-600">
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : null}
    </div>
    <p className="font-medium text-ink line-clamp-2">{title}</p>
  </div>
);

ProductThumb.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
};

const Store = () => {
  const { store, loading } = useFirebase();
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Boutique"
        description={`${store.length} produits disponibles`}
        action={
          <Button
            variant="primary"
            leftIcon="Plus"
            onClick={() => navigate("/create-product")}
          >
            Nouveau produit
          </Button>
        }
      />
      <Card padding="lg" radius="xl">
        <DataTable
          rows={store}
          rowKey={(row, idx) => row._id || row.id || idx}
          loading={loading}
          searchKeys="*"
          searchPlaceholder="Rechercher (titre, catégorie, description…)"
          emptyTitle="Aucun produit"
          emptyDescription="Ajoute ton premier produit à la boutique."
          emptyIcon="ShoppingBag"
          columns={[
            {
              key: "title",
              label: "Produit",
              render: (value, row) => <ProductThumb src={row.img} title={value} />,
            },
            {
              key: "category",
              label: "Catégorie",
              render: (value) =>
                value ? (
                  <Badge variant="secondary" size="md">
                    {value}
                  </Badge>
                ) : (
                  "—"
                ),
            },
            {
              key: "price",
              label: "Prix",
              render: (value) => (
                <span className="font-medium text-ink">{value}€</span>
              ),
            },
            {
              key: "subcriberPrice",
              label: "Prix abonné",
              render: (value) => (
                <span className="text-success-700 font-medium">{value}€</span>
              ),
            },
            {
              key: "id",
              label: "ID",
              render: (value) => (
                <Badge variant="secondary" size="sm">
                  #{value}
                </Badge>
              ),
            },
            {
              key: "actions",
              label: "",
              align: "right",
              render: (_, row) => (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon="Pencil"
                  onClick={() =>
                    navigate(`/update-product/${row.id || row._id}`, {
                      state: row,
                    })
                  }
                >
                  Éditer
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </DefaultLayout>
  );
};

export default Store;
