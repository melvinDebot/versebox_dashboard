import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, runTransaction, update } from "firebase/database";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import { useFirebase } from "../context/FirebaseContext";
import ChallengeSearch from "../components/ChallengeSearch/ChallengeSearch";
import RulesDeadlineBanner from "../components/RulesDeadlineBanner/RulesDeadlineBanner";
import PromoCodeItem from "../components/PromoCodeItem/PromoCodeItem";
import PromoCodeForm from "../components/PromoCodeForm/PromoCodeForm";
import {
  Card,
  Button,
  Badge,
  Toggle,
  Icon,
  Skeleton,
  DonutChart,
  BarChart,
  DataTable,
  EmptyState,
  ProgressBar,
} from "../ui";
import { CHALLENGES_PER_CATEGORY_TARGET } from "../utils/constants";
import {
  countUsersByCategory,
  countGenders,
  calculateAgeRanges,
  totalChallenges,
  progressPercent,
  CATEGORY_LABELS,
  GENDER_LABELS,
  AGE_LABELS,
} from "../utils/stats";

const STAT_CARDS = [
  {
    key: "users",
    title: "Utilisateurs",
    icon: "Users",
    accent: "primary",
    pickValue: ({ users }) => users.length,
  },
  {
    key: "challenges",
    title: "Challenges",
    icon: "Sparkles",
    accent: "tertiary",
    pickValue: ({ challengesByCategory }) => totalChallenges(challengesByCategory),
    pickTarget: ({ challengesByCategory }) =>
      Object.keys(challengesByCategory || {}).length *
      CHALLENGES_PER_CATEGORY_TARGET,
  },
  {
    key: "store",
    title: "Produits",
    icon: "ShoppingBag",
    accent: "secondary",
    pickValue: ({ store }) => store.length,
  },
  {
    key: "events",
    title: "Événements",
    icon: "CalendarHeart",
    accent: "warning",
    pickValue: ({ events }) => events.length,
  },
];

const ACCENT_STYLES = {
  primary:
    "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200",
  tertiary:
    "bg-tertiary-50 text-tertiary-700 dark:bg-tertiary-900/30 dark:text-tertiary-200",
  secondary:
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-100",
  warning:
    "bg-warning-50 text-warning-900 dark:bg-warning-900/30 dark:text-warning-200",
};

const StatCard = ({ title, icon, accent, value, target, loading }) => (
  <Card padding="lg" radius="xl" className="flex flex-col gap-5">
    <div className="flex items-start justify-between">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${ACCENT_STYLES[accent]}`}
      >
        <Icon name={icon} size="md" strokeWidth={2} />
      </div>
      <Badge variant="success" dot>
        Live
      </Badge>
    </div>
    <div>
      {loading ? (
        <Skeleton width={80} height={32} />
      ) : (
        <p className="text-display-md font-semibold text-ink">{value}</p>
      )}
      <p className="mt-1 text-body-sm text-ink-muted">{title}</p>
      {target > 0 && (
        <div className="mt-4 flex flex-col gap-1.5">
          {loading ? (
            <Skeleton height={8} shape="pill" />
          ) : (
            <ProgressBar
              value={progressPercent(value, target)}
              tone={accent === "tertiary" ? "tertiary" : "primary"}
              label={`${title} : progression vers l'objectif`}
            />
          )}
          <p className="flex items-center justify-between gap-2 whitespace-nowrap text-caption text-ink-muted">
            <span>{`Objectif\u00a0${target}`}</span>
            <span className="font-semibold text-ink">
              {loading ? "—" : `${progressPercent(value, target)}\u00a0%`}
            </span>
          </p>
        </div>
      )}
    </div>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(Object.keys(ACCENT_STYLES)).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  target: PropTypes.number,
  loading: PropTypes.bool,
};

const Dashboard = () => {
  const firebase = useFirebase();
  const {
    users,
    featuresFlag,
    getListCodes,
    challengesByCategory,
    loading,
  } = firebase;
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [creatingPromo, setCreatingPromo] = useState(false);

  const createPromoCode = async ({ name, points, startsAt, endsAt }) => {
    const { committed } = await runTransaction(
      ref(db, `promoCodes/${name}`),
      (current) =>
        current === null ? { points, startsAt, endsAt, isActive: true } : undefined,
    );
    if (!committed) throw new Error("Ce code existe déjà.");
    setCreatingPromo(false);
  };

  useEffect(() => {
    if (!hash || loading) return;
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, loading]);

  const updateFeaturesFlag = (patch) => {
    update(ref(db, "featuresFlag"), patch);
  };

  const flags = [
    {
      key: "promoCodes",
      label: "Codes promo",
      description: "Saisie des codes promo",
      checked: Boolean(featuresFlag?.promoCodes),
      onChange: (checked) => updateFeaturesFlag({ promoCodes: checked }),
    },
  ];
  const activeFlags = flags.filter((flag) => flag.checked).length;

  const challengeRows = Object.entries(challengesByCategory || {}).map(
    ([category, list]) => {
      const total = Array.isArray(list) ? list.length : 0;
      return {
        category,
        total,
        progress: progressPercent(total, CHALLENGES_PER_CATEGORY_TARGET),
      };
    },
  );

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        <RulesDeadlineBanner />

        <ChallengeSearch />

        <section className="grid gap-4 lg:grid-cols-3">
          <Card
            variant="contrast"
            padding="xl"
            radius="xl"
            className="lg:col-span-2 flex flex-col justify-between gap-6 overflow-hidden relative"
          >
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="relative">
              <Badge variant="primary" className="mb-4">
                Tableau de bord
              </Badge>
              <h1 className="text-display-lg font-semibold leading-tight">
                Bienvenue sur Versebox
              </h1>
              <p className="mt-3 max-w-xl text-body-lg text-neutral-300 dark:text-neutral-600">
                {"Pilote tes challenges, événements et boutique en un coup d'œil."}
                Active ou désactive les fonctionnalités côté app mobile en temps
                réel.
              </p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Button
                variant="primary"
                leftIcon="Plus"
                onClick={() => navigate("/create-challenge")}
              >
                Créer un challenge
              </Button>
              <Button
                variant="outline"
                leftIcon="CalendarHeart"
                onClick={() => navigate("/create-event")}
                className="border-white/20 text-white hover:bg-white/10 dark:border-secondary-300 dark:text-secondary-900 dark:hover:bg-secondary-200"
              >
                Nouvel événement
              </Button>
            </div>
          </Card>

          <Card padding="lg" radius="xl" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-ink">
                Raccourcis
              </h3>
              <Icon
                name="Zap"
                size="sm"
                className="text-primary-500"
                strokeWidth={2}
              />
            </div>
            <div className="grid gap-2.5">
              {[
                { label: "Utilisateurs", icon: "Users", to: "/tables-user" },
                { label: "Boutique", icon: "ShoppingBag", to: "/tables-store" },
                { label: "Événements", icon: "CalendarHeart", to: "/tables-event" },
              ].map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-left transition-all hover:border-primary-400 hover:bg-primary-50/50 dark:border-secondary-500 dark:hover:bg-secondary-600 dark:hover:border-primary-400"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-secondary-600 dark:text-primary-300">
                      <Icon name={item.icon} size="sm" />
                    </span>
                    <span className="text-body-md font-medium text-ink">
                      {item.label}
                    </span>
                  </span>
                  <Icon
                    name="ChevronRight"
                    size="sm"
                    className="text-ink-muted"
                  />
                </button>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              accent={card.accent}
              value={card.pickValue(firebase)}
              target={card.pickTarget?.(firebase)}
              loading={loading}
            />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card padding="lg" radius="xl">
            <header className="mb-2 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-title-md font-semibold text-ink">
                  Feature flags
                </h3>
                <p className="text-body-sm text-ink-muted">
                  Active ou désactive les fonctionnalités de l&apos;application
                  mobile en temps réel
                </p>
              </div>
              <Badge variant={activeFlags > 0 ? "success" : "neutral"} dot>
                {activeFlags}/{flags.length} actifs
              </Badge>
            </header>
            <div className="mt-5 grid gap-4">
              {flags.map((flag) => (
                <Toggle
                  key={flag.key}
                  id={`feature-flag-${flag.key}`}
                  label={flag.label}
                  description={flag.description}
                  checked={flag.checked}
                  onChange={flag.onChange}
                />
              ))}
            </div>
          </Card>

          <Card
            id="promo-codes"
            padding="lg"
            radius="xl"
            className="lg:col-span-2 scroll-mt-24"
          >
            <header className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-title-md font-semibold text-ink">
                  Codes promo
                </h3>
                <p className="text-body-sm text-ink-muted">
                  Ajoute, active, modifie ou supprime un code. Le nom ne peut
                  plus être changé après création.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="primary">{getListCodes.length}</Badge>
                {!creatingPromo && (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon="Plus"
                    onClick={() => setCreatingPromo(true)}
                  >
                    Ajouter
                  </Button>
                )}
              </div>
            </header>
            {creatingPromo && (
              <div className="mb-3 rounded-xl border border-primary-200 bg-primary-50/40 p-4 dark:border-primary-900/60 dark:bg-primary-900/10">
                <p className="mb-3 text-body-md font-semibold text-ink">
                  Nouveau code promo
                </p>
                <PromoCodeForm
                  initialValues={{
                    startsAt: new Date().toLocaleDateString("sv-SE"),
                  }}
                  nameEditable
                  existingNames={getListCodes.map((code) => code._id)}
                  submitLabel="Créer le code"
                  onSubmit={createPromoCode}
                  onCancel={() => setCreatingPromo(false)}
                />
              </div>
            )}
            {!loading && getListCodes.length === 0 && !creatingPromo && (
              <EmptyState
                icon="TicketPercent"
                title="Aucun code promo"
                description="Clique sur « Ajouter » pour créer ton premier code."
              />
            )}
            <ul className="flex flex-col gap-2.5 max-h-96 overflow-y-auto scrollbar-thin pr-1">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <Skeleton width={120} height={14} />
                      <Skeleton width={48} height={14} />
                    </li>
                  ))
                : getListCodes.map((code) => (
                    <PromoCodeItem key={code._id} code={code} />
                  ))}
            </ul>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card padding="lg" radius="xl">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-ink">
                Catégories
              </h3>
              <Icon name="PieChart" size="sm" className="text-ink-muted" />
            </header>
            <DonutChart
              series={countUsersByCategory(users)}
              labels={CATEGORY_LABELS}
              loading={loading}
            />
          </Card>

          <Card padding="lg" radius="xl">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-ink">
                Répartition par genre
              </h3>
              <Icon name="UsersRound" size="sm" className="text-ink-muted" />
            </header>
            <DonutChart
              series={countGenders(users)}
              labels={GENDER_LABELS}
              colors={["#2C3E5C", "#C16A4D"]}
              loading={loading}
            />
          </Card>

          <Card padding="lg" radius="xl">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-ink">
                Âge des utilisateurs
              </h3>
              <Icon name="BarChart3" size="sm" className="text-ink-muted" />
            </header>
            <BarChart
              series={calculateAgeRanges(users)}
              categories={AGE_LABELS}
              colors={["#D39E54"]}
              height={260}
              loading={loading}
            />
          </Card>
        </section>

        <section>
          <Card padding="lg" radius="xl">
            <header className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-title-md font-semibold text-ink">
                  Challenges par catégorie
                </h3>
                <p className="text-body-sm text-ink-muted">
                  Progression vers l&apos;objectif de{" "}
                  {CHALLENGES_PER_CATEGORY_TARGET} challenges par catégorie
                </p>
              </div>
              <Button
                variant="primary"
                leftIcon="Plus"
                size="sm"
                onClick={() => navigate("/create-challenge")}
              >
                Nouveau
              </Button>
            </header>
            <DataTable
              columns={[
                {
                  key: "category",
                  label: "Catégorie",
                  render: (value) => (
                    <span className="font-medium capitalize text-ink">
                      {value}
                    </span>
                  ),
                },
                {
                  key: "total",
                  label: "Challenges",
                  render: (value) => (
                    <span className="whitespace-nowrap text-body-md text-ink">
                      <span className="font-semibold">{value}</span>
                      <span className="text-ink-muted">
                        {`\u00a0/\u00a0${CHALLENGES_PER_CATEGORY_TARGET}`}
                      </span>
                    </span>
                  ),
                },
                {
                  key: "progress",
                  label: "Progression",
                  render: (value, row) => (
                    <div className="flex min-w-40 items-center gap-3">
                      <ProgressBar
                        value={value}
                        tone={value >= 100 ? "success" : "primary"}
                        label={`Progression ${row.category}`}
                      />
                      <Badge
                        variant={value >= 100 ? "success" : "primary"}
                        size="sm"
                        className="shrink-0"
                      >
                        {`${value}\u00a0%`}
                      </Badge>
                    </div>
                  ),
                },
                {
                  key: "actions",
                  label: "",
                  align: "right",
                  render: (_, row) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon="ArrowRight"
                      onClick={() =>
                        navigate(`/tables-challenges/${row.category}`)
                      }
                    >
                      Voir
                    </Button>
                  ),
                },
              ]}
              rows={challengeRows}
              rowKey="category"
              loading={loading}
              pageSize={10}
              emptyTitle="Aucun challenge"
              emptyDescription="Crée ton premier challenge pour commencer."
              emptyIcon="Sparkles"
            />
          </Card>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
