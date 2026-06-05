import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge } from "../ui";

const EventThumb = ({ src, title }) => (
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-secondary-600">
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : null}
    </div>
    <p className="font-medium text-ink line-clamp-2">{title}</p>
  </div>
);

EventThumb.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
};

const Events = () => {
  const { events, loading } = useFirebase();
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Événements"
        description={`${events.length} événements actifs`}
        action={
          <Button
            variant="primary"
            leftIcon="Plus"
            onClick={() => navigate("/create-event")}
          >
            Nouvel événement
          </Button>
        }
      />
      <Card padding="lg" radius="xl">
        <DataTable
          rows={events}
          rowKey={(row, idx) => row._id || row.id || idx}
          loading={loading}
          searchKeys="*"
          searchPlaceholder="Rechercher (titre, lieu, description…)"
          emptyTitle="Aucun événement"
          emptyDescription="Crée ton premier événement pour le faire apparaître ici."
          emptyIcon="CalendarHeart"
          columns={[
            {
              key: "title",
              label: "Événement",
              render: (value, row) => <EventThumb src={row.img} title={value} />,
            },
            { key: "startDate", label: "Date" },
            {
              key: "pin",
              label: "Épinglé",
              render: (value) =>
                value ? (
                  <Badge variant="primary" dot>
                    Épinglé
                  </Badge>
                ) : (
                  <span className="text-ink-muted">—</span>
                ),
            },
            { key: "location", label: "Lieu" },
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
                    navigate(`/update-event/${row.id || row._id}`, { state: row })
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

export default Events;
