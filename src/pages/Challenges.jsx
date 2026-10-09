import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge, Icon } from "../ui";

const isIncomplete = (challenge) => !challenge?.point || !challenge?.level;

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

// Les challenges anglais ne sont chargés qu'à la demande, catégorie par catégorie
const useEnglishChallenges = (category, enabled) => {
  const [state, setState] = useState({ list: [], loading: enabled });

  useEffect(() => {
    if (!enabled || !category) return undefined;
    setState({ list: [], loading: true });
    return onValue(
      ref(db, `dataIHMEn/${category}`),
      (snapshot) => {
        const value = snapshot.val();
        setState({ list: Array.isArray(value) ? value : [], loading: false });
      },
      () => setState({ list: [], loading: false }),
    );
  }, [category, enabled]);

  return state;
};

const Challenges = () => {
  const { challengesByCategory, loading } = useFirebase();
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "fr";
  const english = useEnglishChallenges(category, lang === "en");

  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  // Réinitialise le filtre quand on change de catégorie
  useEffect(() => {
    setShowOnlyIncomplete(false);
  }, [category]);

  const list = useMemo(() => {
    if (lang === "en") return english.list;
    return Array.isArray(challengesByCategory?.[category])
      ? challengesByCategory[category]
      : [];
  }, [challengesByCategory, category, lang, english.list]);

  const isLoading = lang === "en" ? english.loading : loading;

  const setLang = (next) =>
    setSearchParams(next === "en" ? { lang: "en" } : {}, { replace: true });

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
          loading={isLoading}
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
            <>
              <div
                role="radiogroup"
                aria-label="Langue des challenges"
                className="inline-flex h-11 items-center gap-1 rounded-pill border border-neutral-200 bg-white p-1 dark:border-secondary-500 dark:bg-secondary-700"
              >
                <Icon
                  name="Languages"
                  size="sm"
                  className="ml-2 mr-1 text-ink-muted"
                />
                {LANGUAGES.map((option) => {
                  const active = lang === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setLang(option.value)}
                      className={`h-full rounded-pill px-3.5 text-body-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                        active
                          ? "bg-secondary-900 text-white dark:bg-neutral-50 dark:text-secondary-900"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
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
                <Icon
                  name={showOnlyIncomplete ? "FilterX" : "Filter"}
                  size="sm"
                />
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
            </>
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
                      state: { ...row, _pathCategory: category, _lang: lang },
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
