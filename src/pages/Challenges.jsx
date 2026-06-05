import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge, Icon } from "../ui";

const isIncomplete = (challenge) => !challenge?.point || !challenge?.level;

const Challenges = () => {
  const { challengesByCategory, loading } = useFirebase();
  const { category } = useParams();
  const navigate = useNavigate();

  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  // Réinitialise le filtre quand on change de catégorie
  useEffect(() => {
    setShowOnlyIncomplete(false);
  }, [category]);

  const list = useMemo(
    () =>
      Array.isArray(challengesByCategory?.[category])
        ? challengesByCategory[category]
        : [],
    [challengesByCategory, category],
  );

  const enrichedList = useMemo(
    () => list.map((item, idx) => ({ ...item, _index: idx })),
    [list],
  );

  const incompleteCount = useMemo(
    () => enrichedList.filter(isIncomplete).length,
    [enrichedList],
  );

  const rows = useMemo(
    () =>
      showOnlyIncomplete ? enrichedList.filter(isIncomplete) : enrichedList,
    [enrichedList, showOnlyIncomplete],
  );

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Challenges — ${category}`}
        description={`${list.length} challenges dans cette catégorie · ${incompleteCount} à compléter`}
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
          rows={rows}
          rowKey={(row) => row._index}
          loading={loading}
          searchKeys="*"
          searchPlaceholder="Rechercher (verset, contenu, challenge, niveau…)"
          emptyTitle={
            showOnlyIncomplete
              ? "Tous les challenges sont complets"
              : "Aucun challenge"
          }
          emptyDescription={
            showOnlyIncomplete
              ? "Aucun challenge à compléter dans cette catégorie. Bravo !"
              : "Crée ton premier challenge pour cette catégorie."
          }
          emptyIcon={showOnlyIncomplete ? "CircleCheck" : "Sparkles"}
          toolbar={
            <button
              type="button"
              onClick={() => setShowOnlyIncomplete((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-pill px-4 h-11 text-body-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                showOnlyIncomplete
                  ? "bg-tertiary-500 text-white hover:bg-tertiary-700"
                  : "border border-neutral-200 bg-white text-ink hover:bg-neutral-100 dark:border-secondary-500 dark:bg-secondary-700 dark:text-white dark:hover:bg-secondary-600"
              }`}
              aria-pressed={showOnlyIncomplete}
            >
              <Icon name={showOnlyIncomplete ? "FilterX" : "Filter"} size="sm" />
              À compléter
              <Badge
                variant={showOnlyIncomplete ? "solid" : "tertiary"}
                size="sm"
                className={
                  showOnlyIncomplete ? "bg-white/20 text-white" : undefined
                }
              >
                {incompleteCount}
              </Badge>
            </button>
          }
          columns={[
            {
              key: "verse",
              label: "Verset",
              render: (value, row) => (
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-ink">{value}</span>
                  {isIncomplete(row) && (
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
