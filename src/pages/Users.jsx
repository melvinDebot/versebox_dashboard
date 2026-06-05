import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, remove } from "firebase/database";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useFirebase } from "../context/FirebaseContext";
import { Card, DataTable, Button, Badge, Avatar, Icon } from "../ui";

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption font-medium transition-colors ${
        copied
          ? "bg-success-50 text-success-700"
          : "bg-neutral-100 text-ink-subtle hover:bg-neutral-200 dark:bg-secondary-600 dark:text-neutral-100 dark:hover:bg-secondary-500"
      }`}
      title={value}
    >
      <Icon name={copied ? "Check" : "Copy"} size="xs" />
      {copied ? "Copié" : "Copier"}
    </button>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
};

const Users = () => {
  const { users, loading } = useFirebase();
  const navigate = useNavigate();

  const handleDelete = (uuid) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    remove(ref(db, `users/${uuid}`)).catch((err) =>
      console.error("Delete failed", err),
    );
  };

  const rows = users
    .filter((item) => item?.user)
    .map((item) => ({
      id: item.user.uuidUser || item._id,
      email: item.user.email,
      name: item.user.nameUser,
      streaks: item.user.streaks || 0,
      points: item.user.score || 0,
      uuid: item.user.uuidUser,
      raw: item.user,
    }));

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Utilisateurs"
        description={`${users.length} utilisateurs inscrits sur Versebox`}
      />
      <Card padding="lg" radius="xl">
        <DataTable
          rows={rows}
          rowKey="id"
          loading={loading}
          searchKeys="*"
          searchPlaceholder="Rechercher (email, nom, points, UUID…)"
          emptyTitle="Aucun utilisateur"
          emptyDescription="Les utilisateurs inscrits apparaîtront ici."
          emptyIcon="Users"
          columns={[
            {
              key: "email",
              label: "Utilisateur",
              render: (value, row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name || value} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{value}</p>
                    <p className="truncate text-caption text-ink-muted">
                      {row.name || "—"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "streaks",
              label: "Streaks",
              render: (value) => (
                <Badge variant="warning" size="md">
                  <Icon name="Flame" size="xs" />
                  {value}
                </Badge>
              ),
            },
            {
              key: "points",
              label: "Points",
              render: (value) => (
                <Badge variant="primary" size="md">
                  {value}
                </Badge>
              ),
            },
            {
              key: "uuid",
              label: "UUID",
              render: (value) => (value ? <CopyButton value={value} /> : "—"),
            },
            {
              key: "actions",
              label: "",
              align: "right",
              render: (_, row) => (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon="Pencil"
                    onClick={() =>
                      navigate(`/update-user/${row.uuid}`, { state: row.raw })
                    }
                  >
                    Éditer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon="Trash2"
                    aria-label="Supprimer"
                    className="text-error-500 hover:bg-error-50"
                    onClick={() => handleDelete(row.uuid)}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </DefaultLayout>
  );
};

export default Users;
