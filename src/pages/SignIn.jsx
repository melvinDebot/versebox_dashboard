import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import Logo from "../images/logo/logo.svg";
import { Card, Button, FormField, Input, Badge, Icon } from "../ui";

const ALLOWED_EMAILS = ["Marvin@gmail.com"];

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError(null);

    if (!ALLOWED_EMAILS.includes(email)) {
      setError("Email non autorisé");
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        if (user) {
          const dbRef = ref(db, `users/${user.uid}/user`);
          onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) localStorage.setItem("user", JSON.stringify(data));
          });
        }
        setTimeout(() => navigate("/dashboard"), 400);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex min-h-screen items-stretch bg-neutral-50 text-ink dark:bg-secondary-900 dark:text-white">
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-secondary-900 p-12 text-white lg:flex">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-12 h-96 w-96 rounded-full bg-tertiary-500/15 blur-3xl" />
        <Link to="/" className="relative inline-flex w-fit">
          <img src={Logo} alt="Versebox" className="h-10 w-auto" />
        </Link>
        <div className="relative">
          <Badge variant="primary" className="mb-6">
            Administration
          </Badge>
          <h1 className="text-display-lg font-semibold leading-tight">
            Pilote ton univers Versebox depuis un seul endroit.
          </h1>
          <p className="mt-4 max-w-md text-body-lg text-neutral-300">
            Gère utilisateurs, challenges, événements et boutique en temps réel
            avec une expérience pensée pour aller vite.
          </p>
          <ul className="mt-8 space-y-3 text-body-md text-neutral-200">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                <Icon name="Sparkles" size="sm" />
              </span>
              Statistiques et engagement en direct
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                <Icon name="Users" size="sm" />
              </span>
              Gestion fine des utilisateurs
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                <Icon name="ShoppingBag" size="sm" />
              </span>
              Boutique & événements synchronisés
            </li>
          </ul>
        </div>
        <p className="relative text-body-sm text-neutral-400">
          © {new Date().getFullYear()} Versebox. Tous droits réservés.
        </p>
      </aside>

      <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex lg:hidden">
            <img src={Logo} alt="Versebox" className="h-10 w-auto" />
          </Link>
          <Card padding="xl" radius="xl">
            <h2 className="text-title-xl font-semibold text-ink">
              Connexion admin
            </h2>
            <p className="mt-2 text-body-md text-ink-muted">
              Accède à ton tableau de bord en toute sécurité.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-error-900 dark:bg-error-900/30 dark:text-error-100">
                <Icon name="CircleAlert" size="sm" className="mt-0.5" />
                <p className="text-body-sm">{error}</p>
              </div>
            )}

            <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
              <FormField label="Email" required>
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@versebox.com"
                  leftIcon="Mail"
                  required
                />
              </FormField>
              <FormField label="Mot de passe" required>
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon="Lock"
                  required
                />
              </FormField>
              <label className="flex items-center gap-2 text-body-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-400"
                />
                Afficher le mot de passe
              </label>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                rightIcon={isLoading ? undefined : "ArrowRight"}
              >
                {isLoading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>
          </Card>
          <p className="mt-6 text-center text-body-sm text-ink-muted">
            {"Besoin d'aide ?"}{" "}
            <a
              href="mailto:support@versebox.com"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Contacter le support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
