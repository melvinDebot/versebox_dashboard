import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge } from "../ui";

const Challenges = () => {
  const { challengesByCategory, loading } = useFirebase();
  const { category } = useParams();
  const navigate = useNavigate();

  const list = Array.isArray(challengesByCategory?.[category])
    ? challengesByCategory[category]
    : [];

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Challenges — ${category}`}
        description={`${list.length} challenges dans cette catégorie`}
        action={
          <Button
            variant="primary"
            leftIcon="Plus"
            onClick={() => navigate("/create-challenge")}
          >
            Nouveau challenge
          </Button>
        }
      />
      <Card padding="lg" radius="xl">
        <DataTable
          rows={list.map((item, idx) => ({ ...item, _index: idx }))}
          rowKey={(row) => row._index}
          loading={loading}
          searchKeys="*"
          searchPlaceholder="Rechercher (verset, contenu, challenge, niveau…)"
          emptyTitle="Aucun challenge"
          emptyDescription="Crée ton premier challenge pour cette catégorie."
          emptyIcon="Sparkles"
          columns={[
            {
              key: "verse",
              label: "Verset",
              render: (value, row) => (
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-ink">{value}</span>
                  {(!row.point || !row.level) && (
                    <Badge variant="tertiary" size="sm" dot>
                      À compléter
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              key: "verseText",
              label: "Contenu",
              render: (value) => (
                <p className="line-clamp-2 max-w-md text-ink-subtle">{value}</p>
              ),
            },
            {
              key: "verseDescription",
              label: "Explication",
              render: (value) => (
                <p className="line-clamp-2 max-w-md text-ink-subtle">{value}</p>
              ),
            },
            {
              key: "challenge",
              label: "Challenge",
              render: (value) => (
                <div className="inline-block max-w-md rounded-2xl bg-primary-50 px-4 py-3 text-body-sm leading-relaxed text-primary-900 dark:bg-primary-900/30 dark:text-primary-100">
                  {value}
                </div>
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
                    navigate(`/update-challenge/${row._index}`, {
                      state: { ...row, _pathCategory: category },
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

export default Challenges;
